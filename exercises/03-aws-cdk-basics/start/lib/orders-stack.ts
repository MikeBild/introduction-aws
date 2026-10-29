import { Stack, type StackProps } from 'aws-cdk-lib'
import type { Construct } from 'constructs'

// Ausgangslage: so sieht ein leerer Stack nach `cdk init app --language typescript` aus.
export class OrdersStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // TODO: TableV2 'Orders' mit Partition Key pk (String)
    // TODO: NodejsFunction 'PlaceOrder' für src/place-order.ts,
    //       Runtime.NODEJS_24_X, Architecture.ARM_64, ESM-Bundle,
    //       Umgebungsvariable TABLE_NAME
    // TODO: Der Funktion Lese- und Schreibrechte auf die Table geben
  }
}
