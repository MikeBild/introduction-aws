export type Order = { id: string; total: number; items: { sku: string; quantity: number }[] }
export type OrderPlaced = { orderId: string; total: number; items: Order['items'] }

// Fachlogik des Lagers. Wirft bei Artikeln, die es nicht gibt.
export const reserveStock = async (event: OrderPlaced) => {
  const unknown = event.items.filter((item) => item.sku.startsWith('UNKNOWN'))
  if (unknown.length) throw new Error(`Unbekannte Artikel: ${unknown.map((i) => i.sku).join(', ')}`)
  return { orderId: event.orderId, reserved: event.items.length }
}
