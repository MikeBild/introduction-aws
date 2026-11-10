import { App } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { describe, it } from 'vitest'
import { ShopTableStack } from '../lib/shop-table-stack.ts'

describe('ShopTableStack', () => {
  it('has an inverted index with sk as partition key and pk as sort key', () => {
    Template.fromStack(new ShopTableStack(new App(), 'Test')).hasResourceProperties('AWS::DynamoDB::GlobalTable', {
      GlobalSecondaryIndexes: Match.arrayWith([
        Match.objectLike({
          IndexName: 'GSI1',
          KeySchema: [{ AttributeName: 'sk', KeyType: 'HASH' }, { AttributeName: 'pk', KeyType: 'RANGE' }],
        }),
      ]),
    })
  })
})
