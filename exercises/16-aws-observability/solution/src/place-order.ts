import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { Logger } from '@aws-lambda-powertools/logger'
import { Metrics, MetricUnit } from '@aws-lambda-powertools/metrics'
import { SpanStatusCode, trace } from '@opentelemetry/api'
import type { Context } from 'aws-lambda'
import { type PlaceOrderEvent, validate } from './order.ts'

export const logger = new Logger({ serviceName: 'orders' })
export const metrics = new Metrics({ namespace: 'Shop', serviceName: 'orders' })
// Ohne OpenTelemetry-Layer ist der Tracer ein No-op. Mit Layer landen die Spans in X-Ray.
const tracer = trace.getTracer('orders')
const db = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const placeOrder = async (event: PlaceOrderEvent) =>
  tracer.startActiveSpan('placeOrder', async (span) => {
    span.setAttributes({ 'order.id': event.orderId, 'order.items': event.items?.length ?? 0 })
    try {
      const quantity = validate(event)
      await db.send(new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: { pk: `ORDER#${event.orderId}`, customerId: event.customerId, items: event.items },
      }))
      metrics.addMetric('OrderPlaced', MetricUnit.Count, 1)
      metrics.addMetric('ItemsOrdered', MetricUnit.Count, quantity)
      return { orderId: event.orderId, status: 'PLACED' }
    } catch (error) {
      span.recordException(error as Error)
      span.setStatus({ code: SpanStatusCode.ERROR })
      throw error
    } finally {
      span.end()
    }
  })

export const handler = async (event: PlaceOrderEvent, context: Context) => {
  logger.addContext(context)
  // Eine ID für alle Logs dieser Bestellung – auch in nachgelagerten Functions.
  logger.appendKeys({ orderId: event.orderId, correlationId: event.correlationId ?? context.awsRequestId })
  metrics.captureColdStartMetric(context.functionName)
  try {
    logger.info('placing order', { items: event.items?.length ?? 0 })
    const result = await placeOrder(event)
    logger.info('order placed')
    return result
  } catch (error) {
    logger.error('order failed', error as Error)
    metrics.addMetric('OrderFailed', MetricUnit.Count, 1)
    throw error
  } finally {
    metrics.publishStoredMetrics()
    logger.resetKeys()
  }
}
