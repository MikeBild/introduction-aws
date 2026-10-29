export type ParsedMail = { from?: string; subject?: string; orderId?: string; text: string }

// TODO: Header (bis zur ersten Leerzeile) und Body trennen, From und Subject lesen,
//       die Bestellnummer aus "Bestellung <id>" im Betreff ziehen.
export const parseMail = (raw: string): ParsedMail => ({ text: raw })
