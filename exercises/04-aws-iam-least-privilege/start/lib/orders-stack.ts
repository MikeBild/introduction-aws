import { fileURLToPath } from 'node:url'
import { RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib'
import { AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import type { Construct } from 'constructs'

export class OrdersStack extends Stack {
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

    // Ausgangslage: beide Functions dürfen alles mit jeder Table.
    // TODO: ListOrders nur Lesezugriff, PlaceOrder nur Schreibzugriff –
    //       mit grant-Methoden statt eigener Policy Statements.
    const tooBroad = new PolicyStatement({ actions: ['dynamodb:*'], resources: ['*'] })

    const listOrders = fn('ListOrders', 'list-orders.ts')
    listOrders.addToRolePolicy(tooBroad)

    const placeOrder = fn('PlaceOrder', 'place-order.ts')
    placeOrder.addToRolePolicy(tooBroad)
  }
}
