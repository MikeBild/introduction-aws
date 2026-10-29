import { fileURLToPath } from 'node:url'
import { CfnOutput, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib'
import { AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb'
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import type { Construct } from 'constructs'

export class OrdersStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const table = new TableV2(this, 'Orders', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      // Nur für Übungen: Table verschwindet mit cdk destroy.
      removalPolicy: RemovalPolicy.DESTROY,
    })

    const placeOrder = new NodejsFunction(this, 'PlaceOrder', {
      entry: fileURLToPath(new URL('../src/place-order.ts', import.meta.url)),
      runtime: Runtime.NODEJS_24_X,
      architecture: Architecture.ARM_64,
      environment: { TABLE_NAME: table.tableName },
      bundling: { format: OutputFormat.ESM, minify: true, sourceMap: true },
    })
    table.grantReadWriteData(placeOrder)

    new CfnOutput(this, 'PlaceOrderName', { value: placeOrder.functionName })
    new CfnOutput(this, 'TableName', { value: table.tableName })
  }
}
