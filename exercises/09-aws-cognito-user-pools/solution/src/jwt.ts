export type JwtParts = { header: Record<string, unknown>; payload: Record<string, unknown> }

const decodePart = (part: string | undefined) => {
  if (!part) throw new Error('Kein JWT: Übergib ein Token im Format header.payload.signature.')
  return JSON.parse(Buffer.from(part, 'base64url').toString('utf8')) as Record<string, unknown>
}

// Decodes a JWT without verifying the signature. Verification is the job of the authorizer (lesson 10).
export const decodeJwt = (token: string): JwtParts => {
  const [header, payload] = token.split('.')
  return { header: decodePart(header), payload: decodePart(payload) }
}

// Summarizes the claims that show the difference between ID and access token.
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
