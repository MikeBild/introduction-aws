export type JwtParts = { header: Record<string, unknown>; payload: Record<string, unknown> }

const decodePart = (part: string | undefined) => {
  if (!part) throw new Error('Kein JWT: erwartet header.payload.signature')
  return JSON.parse(Buffer.from(part, 'base64url').toString('utf8')) as Record<string, unknown>
}

// Dekodiert ein JWT, ohne die Signatur zu prüfen. Prüfen übernimmt der Authorizer (Lektion 10).
export const decodeJwt = (token: string): JwtParts => {
  const [header, payload] = token.split('.')
  return { header: decodePart(header), payload: decodePart(payload) }
}

// Fasst die Claims zusammen, die den Unterschied zwischen ID und Access Token zeigen.
export const describeToken = (token: string) => {
  const { payload } = decodeJwt(token)
  return {
    tokenUse: payload.token_use,
    sub: payload.sub,
    email: payload.email,
    audience: payload.aud ?? payload.client_id,
    scope: payload.scope,
    expiresAt: typeof payload.exp === 'number' ? new Date(payload.exp * 1000).toISOString() : undefined,
  }
}
