import { CfnOutput, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib'
import { AttributeType, ProjectionType, TableV2 } from 'aws-cdk-lib/aws-dynamodb'
import type { Construct } from 'constructs'

export class ShopTableStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // Eine Table für Kunden, Bestellungen, Positionen und Produkte.
    const table = new TableV2(this, 'Shop', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      globalSecondaryIndexes: [
        {
          // Inverted Index: sk wird Partition Key, pk wird Sort Key.
          indexName: 'GSI1',
          partitionKey: { name: 'sk', type: AttributeType.STRING },
          sortKey: { name: 'pk', type: AttributeType.STRING },
          projectionType: ProjectionType.INCLUDE,
          nonKeyAttributes: ['type', 'quantity'],
        },
      ],
    })

    new CfnOutput(this, 'TableName', { value: table.tableName })
  }
}
