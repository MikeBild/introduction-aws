import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { Logger } from '@aws-lambda-powertools/logger'
import { Metrics } from '@aws-lambda-powertools/metrics'
import type { Context } from 'aws-lambda'
import { type PlaceOrderEvent, validate } from './order.ts'

// TODO: Use the Logger with serviceName 'orders' instead of console.log
export const logger = new Logger({ serviceName: 'orders' })
// TODO: Write the metrics OrderPlaced, ItemsOrdered and OrderFailed
export const metrics = new Metrics({ namespace: 'Shop', serviceName: 'orders' })
const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))

// TODO: Span 'placeOrder' with trace.getTracer('orders') from '@opentelemetry/api'
export const placeOrder = async (event: PlaceOrderEvent) => {
  validate(event)
  await db.send(new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: { pk: `ORDER#${event.orderId}`, customerId: event.customerId, items: event.items },
  }))
  return { orderId: event.orderId, status: 'PLACED' }
}

// Starting point: text logs without context. Which line belongs to which order?
// TODO: logger.addContext, appendKeys with orderId and correlationId, logger.info/error,
//       metrics.publishStoredMetrics() in finally
export const handler = async (event: PlaceOrderEvent, _context: Context) => {
  console.log('placing order')
  try {
    return await placeOrder(event)
  } catch (error) {
    console.log('failed: ' + String(error))
    throw error
  }
}
