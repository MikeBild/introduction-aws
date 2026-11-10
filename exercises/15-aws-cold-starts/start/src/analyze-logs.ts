// Read REPORT lines from stdin and summarize them:
//   aws logs filter-log-events --log-group-name /aws/lambda/<Name> --filter-pattern REPORT \
//     --query 'events[].message' --output text | node src/analyze-logs.ts
import { text } from 'node:stream/consumers'
import { summarize } from './report.ts'

const input = await text(process.stdin)
console.table(summarize(input.split(/\r?\n|\t/)))
