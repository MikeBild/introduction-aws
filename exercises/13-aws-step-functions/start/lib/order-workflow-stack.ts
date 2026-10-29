import { fileURLToPath } from 'node:url'
import { CfnOutput, Duration, Stack, type StackProps } from 'aws-cdk-lib'
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import {
  DefinitionBody, QueryLanguage, StateMachine, StateMachineType,
} from 'aws-cdk-lib/aws-stepfunctions'
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks'
import type { Construct } from 'constructs'

export class OrderWorkflowStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const fn = (id: string, file: string) =>
      new NodejsFunction(this, id, {
        entry: fileURLToPath(new URL(`../src/${file}`, import.meta.url)),
        runtime: Runtime.NODEJS_24_X,
        architecture: Architecture.ARM_64,
        bundling: { format: OutputFormat.ESM, minify: true },
      })

    // Payload ist standardmäßig {% $states.input %}. Die Ausgabe ist die
    // bisherigen Daten plus das Ergebnis des Schritts.
    const step = (id: string, file: string) =>
      LambdaInvoke.jsonata(this, id, {
        lambdaFunction: fn(`${id}Fn`, file),
        outputs: '{% $merge([$states.input, $states.result.Payload]) %}',
      })

    const charge = step('Bezahlen', 'charge-payment.ts')
    const ship = step('Versenden', 'ship-order.ts')

    // Ausgangslage: Bezahlen, dann Versenden – ohne Fehlerbehandlung und ohne Lager.
    // TODO: Schritte LagerPruefen (check-stock.ts), Nachbestellen (reorder.ts), Stornieren (cancel-order.ts)
    // TODO: Retry für PaymentProviderTimeout: 2 s Intervall, Backoff 2, maximal 3 Versuche
    // TODO: Catch für PaymentDeclined -> Stornieren, Fehler per outputs an die Eingabe hängen
    // TODO: Choice.jsonata 'Verfuegbar' mit Condition.jsonata('{% $states.input.available %}')
    //       -> Versenden, sonst Nachbestellen

    const workflow = new StateMachine(this, 'OrderWorkflow', {
      stateMachineType: StateMachineType.STANDARD,
      queryLanguage: QueryLanguage.JSONATA,
      definitionBody: DefinitionBody.fromChainable(charge.next(ship)),
      timeout: Duration.minutes(5),
    })

    new CfnOutput(this, 'StateMachineArn', { value: workflow.stateMachineArn })
  }
}
