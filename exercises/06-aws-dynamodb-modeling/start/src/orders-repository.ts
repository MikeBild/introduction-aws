import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const tableName = () => process.env.TABLE_NAME

// Ausgangslage: jede Frage liest die ganze Table und filtert danach.
// TODO: Ersetze jeden Scan durch GetItem oder Query auf Table, GSI1 oder GSI2.
const scanAll = async () => (await db.send(new ScanCommand({ TableName: tableName() }))).Items ?? []

export const getCustomerProfile = async (customerId: string) =>
  (await scanAll()).find((i) => i.pk === `CUSTOMER#${customerId}` && i.sk === 'PROFILE')

export const listOrdersOfCustomer = async (customerId: string, limit = 20) =>
  (await scanAll())
    .filter((i) => i.pk === `CUSTOMER#${customerId}` && String(i.sk).startsWith('ORDER#'))
    .sort((a, b) => String(b.sk).localeCompare(String(a.sk)))
    .slice(0, limit)

export const listOrdersInRange = async (customerId: string, from: string, to: string) =>
  (await listOrdersOfCustomer(customerId, 1000)).filter((i) => i.createdAt >= from && i.createdAt <= `${to}~`)

export const getOrder = async (orderId: string) => (await scanAll()).find((i) => i.orderId === orderId)

export const listOpenOrders = async (limit = 50) =>
  (await scanAll()).filter((i) => i.status === 'OPEN').slice(0, limit)
