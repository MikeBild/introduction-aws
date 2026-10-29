import { defineConfig } from 'vitest/config'

// Die Tests laufen ohne AWS-Konto. Dummy-Werte verhindern, dass SDK-Clients
// beim Import nach Region oder Credentials suchen.
const env = {
  AWS_REGION: 'eu-central-1',
  AWS_ACCESS_KEY_ID: 'test',
  AWS_SECRET_ACCESS_KEY: 'test',
  POWERTOOLS_DEV: 'true',
  POWERTOOLS_METRICS_DISABLED: 'true',
}

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'solution',
          include: ['exercises/*/solution/**/*.test.ts'],
          exclude: ['**/node_modules/**', '**/cdk.out/**', 'legacy/**'],
          env,
        },
      },
      {
        test: {
          name: 'start',
          include: ['exercises/*/start/**/*.test.ts'],
          exclude: ['**/node_modules/**', '**/cdk.out/**', 'legacy/**'],
          env,
        },
      },
    ],
  },
})
