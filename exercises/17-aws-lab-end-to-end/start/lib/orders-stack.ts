import { CfnOutput, Stack, type StackProps } from 'aws-cdk-lib'
import type { Construct } from 'constructs'

// Führ hier die Lösungen aus den Übungen 02 bis 08 zu einem Stack zusammen.
export class OrdersStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // TODO 1 (Übung 06/07): TableV2 Orders mit pk/sk als String, RemovalPolicy.DESTROY
    // TODO 2 (Übung 08): SecureString per Namen referenzieren –
    //        Context apiKeyParameter, Standard '/werkstatt/payments/api-key'
    // TODO 3 (Übung 02/03): Helfer für NodejsFunction: nodejs24.x, ARM_64, ESM, minify,
    //        Umgebung TABLE_NAME
    // TODO 4 (Übung 04): PlaceOrder (place-order.ts) mit grantWriteData und grantRead auf den Key,
    //        ListOrders (list-orders.ts) mit grantReadData
    // TODO 5 (Übung 05): HttpApi mit POST /orders und GET /orders

    // TODO 6: Output ApiUrl mit api.apiEndpoint – das curl im README liest genau diesen Namen.
    new CfnOutput(this, 'Hinweis', { value: 'Noch leer: siehe TODOs in lib/orders-stack.ts' })
  }
}
