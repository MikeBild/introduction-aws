// Führt `cdk synth` für jede CDK App unter exercises/ aus – ohne AWS-Konto.
// Account und Region sind Platzhalter und kommen per Context.
// Aufruf: npm run synth            (alle Apps)
//         npm run synth -- 05      (nur Lektion 05)
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..', 'exercises')
const filter = process.argv[2] ?? ''
const apps = readdirSync(root)
  .filter((lesson) => lesson.startsWith(filter))
  .flatMap((lesson) => ['start', 'solution'].map((variant) => join(root, lesson, variant)))
  .filter((dir) => existsSync(join(dir, 'cdk.json')))

let failed = 0
for (const dir of apps) {
  const result = spawnSync(
    'npx',
    ['cdk', 'synth', '--quiet', '--no-notices', '-c', 'account=123456789012', '-c', 'region=eu-central-1'],
    { cwd: dir, encoding: 'utf8', env: { ...process.env, CDK_DISABLE_CLI_TELEMETRY: 'true' } },
  )
  const ok = result.status === 0
  if (!ok) failed++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${dir.slice(root.length + 1)}`)
  if (!ok) console.log(result.stdout, result.stderr)
}
console.log(`\n${apps.length - failed}/${apps.length} CDK Apps synthetisiert`)
process.exit(failed ? 1 : 0)
