export type ParsedMail = { from?: string; subject?: string; orderId?: string; text: string }

// TODO: Split header (up to the first empty line) and body, read From and Subject,
//       extract the order number from "Bestellung <id>" in the subject.
export const parseMail = (raw: string): ParsedMail => ({ text: raw })
