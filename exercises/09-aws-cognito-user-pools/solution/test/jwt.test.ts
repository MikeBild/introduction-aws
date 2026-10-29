import { describe, expect, it } from 'vitest'
import { decodeJwt, describeToken } from '../src/jwt.ts'

const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url')
const fakeToken = (payload: object) => `${encode({ alg: 'RS256', kid: 'k1' })}.${encode(payload)}.signatur`

describe('decodeJwt', () => {
  it('liest Header und Payload', () => {
    expect(decodeJwt(fakeToken({ sub: 'u-1' }))).toEqual({ header: { alg: 'RS256', kid: 'k1' }, payload: { sub: 'u-1' } })
  })

  it('lehnt Werte ohne Punkte ab', () => {
    expect(() => decodeJwt('kein-token')).toThrow()
  })
})

describe('describeToken', () => {
  it('erkennt das ID Token an token_use und aud', () => {
    const id = describeToken(fakeToken({ token_use: 'id', sub: 'u-1', email: 'ada@example.com', aud: 'client-1', exp: 0 }))
    expect(id).toMatchObject({ tokenUse: 'id', email: 'ada@example.com', audience: 'client-1', expiresAt: '1970-01-01T00:00:00.000Z' })
  })

  it('erkennt das Access Token an token_use, client_id und scope', () => {
    const access = describeToken(fakeToken({ token_use: 'access', sub: 'u-1', client_id: 'client-1', scope: 'aws.cognito.signin.user.admin' }))
    expect(access).toMatchObject({ tokenUse: 'access', audience: 'client-1', scope: 'aws.cognito.signin.user.admin', email: undefined })
  })
})
