import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { Logger } from '@aws-lambda-powertools/logger'
import { Metrics } from '@aws-lambda-powertools/metrics'
import type { Context } from 'aws-lambda'
import { type PlaceOrderEvent, validate } from './order.ts'

// TODO: Logger mit serviceName 'orders' nutzen statt console.log
export const logger = new Logger({ serviceName: 'orders' })
// TODO: Metriken OrderPlaced, ItemsOrdered und OrderFailed schreiben
export const metrics = new Metrics({ namespace: 'Shop', serviceName: 'orders' })
const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))

// TODO: Span 'placeOrder' mit trace.getTracer('orders') aus '@opentelemetry/api'
export const placeOrder = async (event: PlaceOrderEvent) => {
  validate(event)
  await db.send(new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: { pk: `ORDER#${event.orderId}`, customerId: event.customerId, items: event.items },
  }))
  return { orderId: event.orderId, status: 'PLACED' }
}

// Ausgangslage: Textlogs ohne Kontext. Welche Zeile gehört zu welcher Bestellung?
// TODO: logger.addContext, appendKeys mit orderId und correlationId, logger.info/error,
//       metrics.publishStoredMetrics() im finally
export const handler = async (event: PlaceOrderEvent, _context: Context) => {
  console.log('placing order')
  try {
    return await placeOrder(event)
  } catch (error) {
    console.log('failed: ' + String(error))
    throw error
  }
}
