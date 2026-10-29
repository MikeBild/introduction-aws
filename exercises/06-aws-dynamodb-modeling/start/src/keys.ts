// TODO: Leg hier die Key-Formate fest, die du aus ZUGRIFFSMUSTER.md ableitest.
export const customerPk = (customerId: string) => `CUSTOMER#${customerId}`
export const PROFILE_SK = 'PROFILE'
export const orderSk = (createdAt: string, orderId: string) => `ORDER#${createdAt}#${orderId}`
export const orderGsi1pk = (orderId: string) => `ORDER#${orderId}`
export const statusGsi2pk = (status: string) => `STATUS#${status}`
