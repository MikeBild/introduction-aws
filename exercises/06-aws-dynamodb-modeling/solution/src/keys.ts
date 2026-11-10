// One place for all key formats. Typos in prefixes show up in the tests this way.
export const customerPk = (customerId: string) => `CUSTOMER#${customerId}`
export const PROFILE_SK = 'PROFILE'
export const orderSk = (createdAt: string, orderId: string) => `ORDER#${createdAt}#${orderId}`
export const orderGsi1pk = (orderId: string) => `ORDER#${orderId}`
export const statusGsi2pk = (status: string) => `STATUS#${status}`
