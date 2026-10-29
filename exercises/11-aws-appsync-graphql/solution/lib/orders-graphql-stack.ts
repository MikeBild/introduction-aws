import { fileURLToPath } from 'node:url'
import { CfnOutput, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib'
import { AuthorizationType, Code, Definition, FunctionRuntime, GraphqlApi } from 'aws-cdk-lib/aws-appsync'
import { UserPool } from 'aws-cdk-lib/aws-cognito'
import { AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb'
import type { Construct } from 'constructs'

const file = (path: string) => fileURLToPath(new URL(`../${path}`, import.meta.url))

export class OrdersGraphqlStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const userPool = new UserPool(this, 'Users', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      removalPolicy: RemovalPolicy.DESTROY,
    })
    const webClient = userPool.addClient('Web', {
      authFlows: { userSrp: true, userPassword: true },
      generateSecret: false,
    })

    const table = new TableV2(this, 'Orders', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    })

    const api = new GraphqlApi(this, 'OrdersApi', {
      name: 'orders',
      definition: Definition.fromFile(file('schema.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: { userPool },
        },
      },
    })

    // Data Source mit Lese- und Schreibrechten auf genau diese Table.
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
    // Subscription.onOrderCreated braucht keinen Resolver: @aws_subscribe verbindet sie mit createOrder.

    new CfnOutput(this, 'GraphqlUrl', { value: api.graphqlUrl })
    new CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId })
    new CfnOutput(this, 'ClientId', { value: webClient.userPoolClientId })
  }
}
