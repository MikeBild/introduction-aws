import { fileURLToPath } from 'node:url'
import { CfnOutput, Duration, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib'
import { HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2'
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import { AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb'
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import { StringParameter } from 'aws-cdk-lib/aws-ssm'
import type { Construct } from 'constructs'

export class OrdersStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // Übung 06/07: Bestellungen eines Kunden unter CUSTOMER#id, sortiert nach Datum.
    const table = new TableV2(this, 'Orders', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    })

    // Übung 08: Den SecureString legst du per CLI an, der Stack kennt nur den Namen.
    const apiKeyName: string = this.node.tryGetContext('apiKeyParameter') ?? '/werkstatt/payments/api-key'
    const apiKey = StringParameter.fromSecureStringParameterAttributes(this, 'PaymentApiKey', {
      parameterName: apiKeyName,
    })

    // Übung 02/03: Node.js 24 auf ARM, ESM, minifiziert.
    const fn = (id: string, file: string, environment: Record<string, string> = {}) =>
      new NodejsFunction(this, id, {
        entry: fileURLToPath(new URL(`../src/${file}`, import.meta.url)),
        runtime: Runtime.NODEJS_24_X,
        architecture: Architecture.ARM_64,
        timeout: Duration.seconds(10),
        environment: { TABLE_NAME: table.tableName, ...environment },
        bundling: { format: OutputFormat.ESM, minify: true },
      })

    // Übung 04: jede Function nur mit den Rechten, die sie braucht.
    const placeOrder = fn('PlaceOrder', 'place-order.ts', { API_KEY_PARAMETER: apiKeyName })
    table.grantWriteData(placeOrder)
    apiKey.grantRead(placeOrder)

    const listOrders = fn('ListOrders', 'list-orders.ts')
    table.grantReadData(listOrders)

    // Übung 05: HTTP API mit zwei Routen.
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

    // ---------- Teil zwei ----------
    // TODO 1 (Übung 14): EventBus ohne festen Namen. PlaceOrder bekommt EVENT_BUS_NAME
    //        und bus.grantPutEventsTo(placeOrder).
    // TODO 2 (Übung 14): StockDlq und StockQueue (visibilityTimeout 60 s, maxReceiveCount 3),
    //        Rule für source 'werkstatt.orders' / detailType 'OrderPlaced' -> SqsQueue.
    // TODO 3 (Übung 14): Function ReserveStock (reserve-stock.ts) mit grantWriteData und
    //        SqsEventSource mit reportBatchItemFailures.
    // TODO 4 (Übung 13): State Machine mit JSONata: Bezahlen (steps-charge.ts) mit Retry auf
    //        PaymentProviderTimeout und Catch PaymentDeclined -> Stornieren (steps-cancel.ts,
    //        braucht grantWriteData), danach Versenden (steps-ship.ts) und Bestaetigen.
    // TODO 5 (Übung 12): Bestaetigen (send-confirmation.ts) mit FROM_ADDRESS/TO_ADDRESS aus dem
    //        Context fromAddress/toAddress und ses:SendEmail auf beide Identity-ARNs.
    //        Keine EmailIdentity anlegen: Die Adressen verifizierst du vorher.
    // TODO 6: Zweite Rule für OrderPlaced -> SfnStateMachine mit
    //        RuleTargetInput.fromEventPath('$.detail'). Outputs StockDlqUrl und StateMachineArn.

    new CfnOutput(this, 'ApiUrl', { value: api.apiEndpoint })
    new CfnOutput(this, 'TableName', { value: table.tableName })
    new CfnOutput(this, 'PlaceOrderName', { value: placeOrder.functionName })
  }
}
