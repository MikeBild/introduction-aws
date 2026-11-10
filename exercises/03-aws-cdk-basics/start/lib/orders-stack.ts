import { Stack, type StackProps } from 'aws-cdk-lib'
import type { Construct } from 'constructs'

// Starting point: this is what an empty stack looks like after `cdk init app --language typescript`.
export class OrdersStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // TODO: TableV2 'Orders' with partition key pk (String)
    // TODO: NodejsFunction 'PlaceOrder' for src/place-order.ts,
    //       Runtime.NODEJS_24_X, Architecture.ARM_64, ESM-Bundle,
    //       Umgebungsvariable TABLE_NAME
    // TODO: Grant the function read and write access to the table
  }
}
