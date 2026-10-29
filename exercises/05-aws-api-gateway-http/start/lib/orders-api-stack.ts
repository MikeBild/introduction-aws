import { fileURLToPath } from 'node:url'
import { RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib'
import { AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb'
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import type { Construct } from 'constructs'

export class OrdersApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const table = new TableV2(this, 'Orders', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    })

    const fn = (id: string, file: string) =>
      new NodejsFunction(this, id, {
        entry: fileURLToPath(new URL(`../src/${file}`, import.meta.url)),
        runtime: Runtime.NODEJS_24_X,
        architecture: Architecture.ARM_64,
        environment: { TABLE_NAME: table.tableName },
        bundling: { format: OutputFormat.ESM, minify: true },
      })

    const listOrders = fn('ListOrders', 'list-orders.ts')
    table.grantReadData(listOrders)
    const placeOrder = fn('PlaceOrder', 'place-order.ts')
    table.grantWriteData(placeOrder)

    // TODO: HttpApi 'OrdersApi' mit CORS für https://app.example.com (GET, POST)
    // TODO: Route GET /orders  -> HttpLambdaIntegration mit listOrders
    // TODO: Route POST /orders -> HttpLambdaIntegration mit placeOrder
    // TODO: CfnOutput 'ApiUrl' mit api.apiEndpoint
  }
}
