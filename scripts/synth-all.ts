// Führt `cdk synth` für jede CDK App unter exercises/ aus – ohne AWS-Konto.
// Account und Region sind Platzhalter und kommen per Context.
// Aufruf: npm run synth            (alle Apps)
//         npm run synth -- 05      (nur Übung 05)
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..', 'exercises')
const filter = process.argv[2] ?? ''
const apps = readdirSync(root)
  .filter((lesson) => lesson.startsWith(filter))
  .flatMap((lesson) => ['start', 'solution'].map((variant) => join(root, lesson, variant)))
  .filter((dir) => existsSync(join(dir, 'cdk.json')))

// Keine Credentials, kein Profil, kein Instance Metadata Service: synth muss offline gehen.
const { AWS_PROFILE, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN, ...env } = process.env
const offlineEnv = {
  ...env,
  AWS_CONFIG_FILE: '/dev/null',
  AWS_SHARED_CREDENTIALS_FILE: '/dev/null',
  AWS_EC2_METADATA_DISABLED: 'true',
  CDK_DISABLE_CLI_TELEMETRY: 'true',
}

let failed = 0
for (const dir of apps) {
  const result = spawnSync(
    'npx',
    ['cdk', 'synth', '--quiet', '--no-notices', '-c', 'account=123456789012', '-c', 'region=eu-central-1'],
    { cwd: dir, encoding: 'utf8', env: offlineEnv },
  )
  const ok = result.status === 0
  if (!ok) failed++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${dir.slice(root.length + 1)}`)
  if (!ok) console.log(result.stdout, result.stderr)
}
console.log(`\n${apps.length - failed}/${apps.length} CDK-Apps synthetisiert`)
process.exit(failed ? 1 : 0)
