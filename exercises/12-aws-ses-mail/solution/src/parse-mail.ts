export type ParsedMail = { from?: string; subject?: string; orderId?: string; text: string }

// Minimaler Parser für einfache Text-Mails (RFC 5322): Header, Leerzeile, Body.
// Für MIME-Multipart, Anhänge und Encodings nimmst du in echt eine Bibliothek wie mailparser.
export const parseMail = (raw: string): ParsedMail => {
  const normalized = raw.replace(/\r\n/g, '\n')
  const split = normalized.indexOf('\n\n')
  const head = split === -1 ? normalized : normalized.slice(0, split)
  const text = split === -1 ? '' : normalized.slice(split + 2).trim()
  // Gefaltete Header-Zeilen (beginnen mit Leerzeichen) gehören zur vorherigen Zeile.
  const headers = new Map<string, string>()
  for (const line of head.replace(/\n[ \t]+/g, ' ').split('\n')) {
    const colon = line.indexOf(':')
    if (colon > 0) headers.set(line.slice(0, colon).trim().toLowerCase(), line.slice(colon + 1).trim())
  }
  const subject = headers.get('subject')
  return { from: headers.get('from'), subject, orderId: subject?.match(/Bestellung\s+([\w-]+)/)?.[1], text }
}
