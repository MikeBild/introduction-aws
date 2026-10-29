import { fileURLToPath } from 'node:url'
import { CfnOutput, Duration, Stack, type StackProps } from 'aws-cdk-lib'
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import {
  Choice, Condition, DefinitionBody, QueryLanguage, StateMachine, StateMachineType, Succeed,
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
    const checkStock = step('LagerPruefen', 'check-stock.ts')
    const ship = step('Versenden', 'ship-order.ts')
    const reorder = step('Nachbestellen', 'reorder.ts')
    const cancel = step('Stornieren', 'cancel-order.ts')

    // Vorübergehende Fehler: bis zu drei weitere Versuche mit Backoff 2 s, 4 s, 8 s.
    charge.addRetry({
      errors: ['PaymentProviderTimeout'],
      interval: Duration.seconds(2),
      backoffRate: 2,
      maxAttempts: 3,
    })
    // Fachlicher Fehler: kein Retry, sondern Kompensation.
    charge.addCatch(cancel, {
      errors: ['PaymentDeclined'],
      outputs: '{% $merge([$states.input, { "error": $states.errorOutput }]) %}',
    })

    const available = Choice.jsonata(this, 'Verfuegbar')
      .when(Condition.jsonata('{% $states.input.available %}'), ship)
      .otherwise(reorder)

    const done = new Succeed(this, 'Fertig')
    ship.next(done)
    reorder.next(done)

    const workflow = new StateMachine(this, 'OrderWorkflow', {
      stateMachineType: StateMachineType.STANDARD,
      queryLanguage: QueryLanguage.JSONATA,
      definitionBody: DefinitionBody.fromChainable(charge.next(checkStock).next(available)),
      timeout: Duration.minutes(5),
    })

    new CfnOutput(this, 'StateMachineArn', { value: workflow.stateMachineArn })
  }
}
