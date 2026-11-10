import { CfnOutput, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib'
import { AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb'
import type { Construct } from 'constructs'

export class OrdersTableStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const table = new TableV2(this, 'Orders', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      globalSecondaryIndexes: [
        // Pattern 4: order by orderId
        { indexName: 'GSI1', partitionKey: { name: 'gsi1pk', type: AttributeType.STRING } },
        // Pattern 5: open orders (sparse index)
        {
          indexName: 'GSI2',
          partitionKey: { name: 'gsi2pk', type: AttributeType.STRING },
          sortKey: { name: 'gsi2sk', type: AttributeType.STRING },
        },
      ],
    })

    new CfnOutput(this, 'TableName', { value: table.tableName })
  }
}
