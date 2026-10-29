import { fileURLToPath } from 'node:url'
import { CfnOutput, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib'
import { AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb'
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import type { Construct } from 'constructs'

export class ColdStartsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const table = new TableV2(this, 'Orders', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    })

    // Startwert für den Vergleich. Power Tuning probiert danach 512, 1024 und 1769 MB.
    const memorySize = Number(this.node.tryGetContext('memorySize') ?? 1024)
    const common = {
      runtime: Runtime.NODEJS_24_X,
      architecture: Architecture.ARM_64,
      memorySize,
      environment: { TABLE_NAME: table.tableName },
    }

    // Vorher: alle SDK-Clients und zod im Bundle, nicht minifiziert, mit Inline-Sourcemap.
    const heavy = new NodejsFunction(this, 'Heavy', {
      ...common,
      entry: fileURLToPath(new URL('../src/heavy.ts', import.meta.url)),
      bundling: {
        format: OutputFormat.ESM,
        externalModules: [],
        // Das gebündelte SDK enthält CommonJS mit require(). Im ESM-Bundle braucht es dafür diesen Shim.
        banner: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);",
        sourceMap: true,
        sourcesContent: true,
      },
    })

    // TODO: Function 'Lean' für src/lean.ts mit gleichem Memory:
    //       externalModules ['@aws-sdk/*'] (SDK aus der Runtime), minify: true, sourceMap: false
    // TODO: Leserechte auf die Table und CfnOutput 'LeanArn'

    table.grantReadData(heavy)

    new CfnOutput(this, 'HeavyArn', { value: heavy.functionArn })
  }
}
