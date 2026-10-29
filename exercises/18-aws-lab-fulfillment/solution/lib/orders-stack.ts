import { fileURLToPath } from 'node:url'
import { CfnOutput, Duration, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib'
import { HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2'
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import { AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb'
import { EventBus, Rule, RuleTargetInput } from 'aws-cdk-lib/aws-events'
import { SfnStateMachine, SqsQueue } from 'aws-cdk-lib/aws-events-targets'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda'
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources'
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Queue } from 'aws-cdk-lib/aws-sqs'
import { StringParameter } from 'aws-cdk-lib/aws-ssm'
import { DefinitionBody, QueryLanguage, StateMachine, StateMachineType, Succeed } from 'aws-cdk-lib/aws-stepfunctions'
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks'
import type { Construct } from 'constructs'

export class OrdersStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // ---------- Teil eins: unverändert aus Übung 17 ----------

    const table = new TableV2(this, 'Orders', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    })

    const apiKeyName: string = this.node.tryGetContext('apiKeyParameter') ?? '/werkstatt/payments/api-key'
    const apiKey = StringParameter.fromSecureStringParameterAttributes(this, 'PaymentApiKey', {
      parameterName: apiKeyName,
    })

    const fn = (id: string, file: string, environment: Record<string, string> = {}) =>
      new NodejsFunction(this, id, {
        entry: fileURLToPath(new URL(`../src/${file}`, import.meta.url)),
        runtime: Runtime.NODEJS_24_X,
        architecture: Architecture.ARM_64,
        timeout: Duration.seconds(10),
        environment: { TABLE_NAME: table.tableName, ...environment },
        bundling: { format: OutputFormat.ESM, minify: true },
      })

    // ---------- Teil zwei: OrderPlaced auf einem eigenen Event Bus (Übung 14) ----------

    // Ohne festen Namen: kollidiert nicht mit dem Bus aus Übung 14.
    const bus = new EventBus(this, 'Events')

    const placeOrder = fn('PlaceOrder', 'place-order.ts', {
      API_KEY_PARAMETER: apiKeyName,
      EVENT_BUS_NAME: bus.eventBusName,
    })
    table.grantWriteData(placeOrder)
    apiKey.grantRead(placeOrder)
    bus.grantPutEventsTo(placeOrder)

    const listOrders = fn('ListOrders', 'list-orders.ts')
    table.grantReadData(listOrders)

    const api = new HttpApi(this, 'OrdersApi')
    api.addRoutes({
      path: '/orders',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration('PlaceOrder', placeOrder),
    })
    api.addRoutes({
      path: '/orders',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration('ListOrders', listOrders),
    })

    const orderPlaced = { source: ['werkstatt.orders'], detailType: ['OrderPlaced'] }

    // Lager: Queue mit Dead Letter Queue, idempotent per Conditional Write.
    const stockDlq = new Queue(this, 'StockDlq', { retentionPeriod: Duration.days(14) })
    const stockQueue = new Queue(this, 'StockQueue', {
      // Mindestens sechsmal so lang wie der Timeout der Function.
      visibilityTimeout: Duration.seconds(60),
      deadLetterQueue: { queue: stockDlq, maxReceiveCount: 3 },
    })
    new Rule(this, 'OrderPlacedToStock', {
      eventBus: bus,
      eventPattern: orderPlaced,
      targets: [new SqsQueue(stockQueue)],
    })
    const reserveStock = fn('ReserveStock', 'reserve-stock.ts')
    table.grantWriteData(reserveStock)
    reserveStock.addEventSource(new SqsEventSource(stockQueue, { batchSize: 10, reportBatchItemFailures: true }))

    // ---------- Bezahlen, Versand, Bestätigung als State Machine (Übungen 13 und 12) ----------

    const fromAddress: string = this.node.tryGetContext('fromAddress') ?? 'shop@example.com'
    const toAddress: string = this.node.tryGetContext('toAddress') ?? fromAddress

    const step = (id: string, file: string, environment?: Record<string, string>) => {
      const lambdaFunction = fn(`${id}Fn`, file, environment)
      const task = LambdaInvoke.jsonata(this, id, {
        lambdaFunction,
        outputs: '{% $merge([$states.input, $states.result.Payload]) %}',
      })
      return { task, lambdaFunction }
    }

    const charge = step('Bezahlen', 'steps-charge.ts')
    const ship = step('Versenden', 'steps-ship.ts')
    const cancel = step('Stornieren', 'steps-cancel.ts')
    table.grantWriteData(cancel.lambdaFunction)

    const confirm = step('Bestaetigen', 'send-confirmation.ts', { FROM_ADDRESS: fromAddress, TO_ADDRESS: toAddress })
    // Die Adressen verifizierst du vorher in SES (Übung 12 oder per CLI). Der Stack legt keine Identity an.
    confirm.lambdaFunction.addToRolePolicy(new PolicyStatement({
      actions: ['ses:SendEmail'],
      resources: [...new Set([fromAddress, toAddress])].map((address) =>
        this.formatArn({ service: 'ses', resource: 'identity', resourceName: address })),
    }))

    // Vorübergehende Fehler: Retry mit Backoff. Fachlicher Fehler: Kompensation.
    charge.task.addRetry({ errors: ['PaymentProviderTimeout'], interval: Duration.seconds(2), backoffRate: 2, maxAttempts: 3 })
    charge.task.addCatch(cancel.task, {
      errors: ['PaymentDeclined'],
      outputs: '{% $merge([$states.input, { "error": $states.errorOutput }]) %}',
    })
    cancel.task.next(new Succeed(this, 'Storniert'))

    const workflow = new StateMachine(this, 'Fulfillment', {
      stateMachineType: StateMachineType.STANDARD,
      queryLanguage: QueryLanguage.JSONATA,
      definitionBody: DefinitionBody.fromChainable(
        charge.task.next(ship.task).next(confirm.task).next(new Succeed(this, 'Fertig')),
      ),
      timeout: Duration.minutes(5),
    })

    // Pro Bestellung eine Ausführung. Die State Machine bekommt nur detail, nicht das ganze Event.
    new Rule(this, 'OrderPlacedToFulfillment', {
      eventBus: bus,
      eventPattern: orderPlaced,
      targets: [new SfnStateMachine(workflow, { input: RuleTargetInput.fromEventPath('$.detail') })],
    })

    new CfnOutput(this, 'ApiUrl', { value: api.apiEndpoint })
    new CfnOutput(this, 'TableName', { value: table.tableName })
    new CfnOutput(this, 'PlaceOrderName', { value: placeOrder.functionName })
    new CfnOutput(this, 'StockDlqUrl', { value: stockDlq.queueUrl })
    new CfnOutput(this, 'StateMachineArn', { value: workflow.stateMachineArn })
  }
}
