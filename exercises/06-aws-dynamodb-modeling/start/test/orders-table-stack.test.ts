// TODO: Entferne .skip, sobald deine Zugriffsmuster per Query statt Scan laufen.
import { App } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { describe, it } from 'vitest'
import { OrdersTableStack } from '../lib/orders-table-stack.ts'

describe.skip('OrdersTableStack', () => {
  it('hat pk/sk und die GSIs für Muster 4 und 5', () => {
    Template.fromStack(new OrdersTableStack(new App(), 'Test')).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      KeySchema: [{ AttributeName: 'pk', KeyType: 'HASH' }, { AttributeName: 'sk', KeyType: 'RANGE' }],
      GlobalSecondaryIndexes: Match.arrayWith([
        Match.objectLike({ IndexName: 'GSI1' }),
        Match.objectLike({ IndexName: 'GSI2' }),
      ]),
    })
  })
})
