import { fileURLToPath } from 'node:url'
import { CfnOutput, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib'
import { HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2'
import { HttpUserPoolAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers'
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import { UserPool } from 'aws-cdk-lib/aws-cognito'
import { AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb'
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import type { Construct } from 'constructs'

export class SecureOrdersStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const userPool = new UserPool(this, 'Users', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: { minLength: 12 },
      removalPolicy: RemovalPolicy.DESTROY,
    })
    const webClient = userPool.addClient('Web', {
      authFlows: { userSrp: true, userPassword: true },
      generateSecret: false,
    })

    const table = new TableV2(this, 'Orders', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
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
    const getOrder = fn('GetOrder', 'get-order.ts')
    table.grantReadData(getOrder)
    const placeOrder = fn('PlaceOrder', 'place-order.ts')
    table.grantWriteData(placeOrder)

    // Prüft Signatur, Ablauf und Client des Tokens, bevor die Function läuft.
    const authorizer = new HttpUserPoolAuthorizer('Users', userPool, {
      userPoolClients: [webClient],
    })

    const api = new HttpApi(this, 'OrdersApi', { defaultAuthorizer: authorizer })
    api.addRoutes({
      path: '/orders/{orderId}',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration('GetOrder', getOrder),
      authorizer,
    })
    api.addRoutes({
      path: '/orders',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration('PlaceOrder', placeOrder),
    })

    new CfnOutput(this, 'ApiUrl', { value: api.apiEndpoint })
    new CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId })
    new CfnOutput(this, 'ClientId', { value: webClient.userPoolClientId })
  }
}
