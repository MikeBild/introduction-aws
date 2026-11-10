import { fileURLToPath } from 'node:url'
import { CfnOutput, Duration, Expiration, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib'
import { AuthorizationType, Code, Definition, FunctionRuntime, GraphqlApi } from 'aws-cdk-lib/aws-appsync'
import { AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb'
import type { Construct } from 'constructs'

const file = (path: string) => fileURLToPath(new URL(`../${path}`, import.meta.url))

export class OrdersGraphqlStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const table = new TableV2(this, 'Orders', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    })

    const api = new GraphqlApi(this, 'OrdersApi', {
      name: 'orders',
      definition: Definition.fromFile(file('schema.graphql')),
      authorizationConfig: {
        // For development: an API key that expires after seven days.
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
          apiKeyConfig: { expires: Expiration.after(Duration.days(7)) },
        },
        // For backends: calls with an IAM signature, allowed via api.grantMutation(...).
        additionalAuthorizationModes: [{ authorizationType: AuthorizationType.IAM }],
      },
    })

    // Data source with read and write access to exactly this table.
    const orders = api.addDynamoDbDataSource('Orders', table)

    orders.createResolver('GetOrder', {
      typeName: 'Query',
      fieldName: 'order',
      runtime: FunctionRuntime.JS_1_0_0,
      code: Code.fromAsset(file('resolvers/get-order.js')),
    })
    orders.createResolver('CreateOrder', {
      typeName: 'Mutation',
      fieldName: 'createOrder',
      runtime: FunctionRuntime.JS_1_0_0,
      code: Code.fromAsset(file('resolvers/create-order.js')),
    })
    // Subscription.onOrderCreated needs no resolver: @aws_subscribe connects it to createOrder.

    new CfnOutput(this, 'GraphqlUrl', { value: api.graphqlUrl })
    // For exercises only: this puts the key in plain text into the stack outputs.
    new CfnOutput(this, 'ApiKey', { value: api.apiKey ?? '' })
  }
}
