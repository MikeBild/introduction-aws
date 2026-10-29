export type JwtParts = { header: Record<string, unknown>; payload: Record<string, unknown> }

// TODO: Zerleg das Token an den Punkten und dekodiere Header und Payload
//       (base64url, dann JSON.parse). Die Signatur prüfst du hier nicht.
export const decodeJwt = (_token: string): JwtParts => {
  throw new Error('TODO: decodeJwt implementieren')
}

// TODO: Gib token_use, sub, email, aud bzw. client_id, scope und exp (als ISO-Datum) zurück.
export const describeToken = (token: string) => {
  const { payload } = decodeJwt(token)
  return { tokenUse: payload.token_use } as Record<string, unknown>
}
