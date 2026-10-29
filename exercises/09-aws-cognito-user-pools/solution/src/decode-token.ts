// Aufruf: node src/decode-token.ts <token>
import { decodeJwt, describeToken } from './jwt.ts'

const token = process.argv[2]
if (!token) {
  console.error('Aufruf: node src/decode-token.ts <token>')
  process.exit(1)
}
console.log(JSON.stringify(decodeJwt(token), null, 2))
console.table(describeToken(token))
