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

    // Exercise 06/07: orders of a customer under CUSTOMER#id, sorted by date.
    const table = new TableV2(this, 'Orders', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    })

    // Exercise 08: you create the SecureString via the CLI, the stack only knows the name.
    const apiKeyName: string = this.node.tryGetContext('apiKeyParameter') ?? '/werkstatt/payments/api-key'
    const apiKey = StringParameter.fromSecureStringParameterAttributes(this, 'PaymentApiKey', {
      parameterName: apiKeyName,
    })

    // Exercise 02/03: Node.js 24 on ARM, ESM, minified.
    const fn = (id: string, file: string, environment: Record<string, string> = {}) =>
      new NodejsFunction(this, id, {
        entry: fileURLToPath(new URL(`../src/${file}`, import.meta.url)),
        runtime: Runtime.NODEJS_24_X,
        architecture: Architecture.ARM_64,
        timeout: Duration.seconds(10),
        environment: { TABLE_NAME: table.tableName, ...environment },
        bundling: { format: OutputFormat.ESM, minify: true },
      })

    // Exercise 04: each function only with the permissions it needs.
    const placeOrder = fn('PlaceOrder', 'place-order.ts', { API_KEY_PARAMETER: apiKeyName })
    table.grantWriteData(placeOrder)
    apiKey.grantRead(placeOrder)

    const listOrders = fn('ListOrders', 'list-orders.ts')
    table.grantReadData(listOrders)

    // Exercise 05: HTTP API with two routes.
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

    new CfnOutput(this, 'ApiUrl', { value: api.apiEndpoint })
    new CfnOutput(this, 'TableName', { value: table.tableName })
    new CfnOutput(this, 'PlaceOrderName', { value: placeOrder.functionName })
  }
}
