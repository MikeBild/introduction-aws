export type JwtParts = { header: Record<string, unknown>; payload: Record<string, unknown> }

// TODO: Split the token at the dots and decode header and payload
//       (base64url, then JSON.parse). You do not verify the signature here.
export const decodeJwt = (_token: string): JwtParts => {
  throw new Error('TODO: decodeJwt implementieren')
}

// TODO: Return token_use, sub, email, aud or client_id, scope and exp (as ISO date).
export const describeToken = (token: string) => {
  const { payload } = decodeJwt(token)
  return { tokenUse: payload.token_use } as Record<string, unknown>
}
