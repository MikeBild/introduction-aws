import { CfnOutput, Stack, type StackProps } from 'aws-cdk-lib'
import type { Construct } from 'constructs'

// Combine the solutions of exercises 02 to 08 into one stack here.
export class OrdersStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // TODO 1 (exercise 06/07): TableV2 Orders with pk/sk as String, RemovalPolicy.DESTROY
    // TODO 2 (exercise 08): Reference the SecureString by name –
    //        context apiKeyParameter, default '/werkstatt/payments/api-key'
    // TODO 3 (exercise 02/03): Helper for NodejsFunction: nodejs24.x, ARM_64, ESM, minify,
    //        environment TABLE_NAME
    // TODO 4 (exercise 04): PlaceOrder (place-order.ts) with grantWriteData and grantRead on the key,
    //        ListOrders (list-orders.ts) with grantReadData
    // TODO 5 (exercise 05): HttpApi with POST /orders and GET /orders

    // TODO 6: Output ApiUrl with api.apiEndpoint – the curl in the README reads exactly this name.
    new CfnOutput(this, 'Hinweis', { value: 'Noch leer: siehe TODOs in lib/orders-stack.ts' })
  }
}
