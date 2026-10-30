// Werkstatt-Shop: Geld immer als ganze Cent, nie als Kommazahl.
export type OrderItem = { productId: string; quantity: number; priceCents: number }
export type Order = { customerId: string; items: OrderItem[] }

// TODO: Body prüfen und eine Bestellung oder undefined liefern.
//       - kaputtes JSON -> undefined (nicht werfen)
//       - customerId: nicht leerer String
//       - items: mindestens eine Position
//       - productId nicht leer, quantity ganzzahlig >= 1, priceCents ganzzahlig >= 0
export const parseOrder = (_body: string | undefined): Order | undefined => {
  throw new Error('TODO: parseOrder implementieren')
}

// TODO: Pure Function ohne Event und ohne AWS: Σ quantity × priceCents.
export const totalCents = (_order: Order): number => {
  throw new Error('TODO: totalCents implementieren')
}
