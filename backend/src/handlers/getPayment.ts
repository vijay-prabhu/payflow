import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getPaymentById } from '../services/dynamodb';
import { success, notFound } from '../utils/response';
import { logger } from '../middleware/logger';

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const log = logger('getPayment');
  const paymentId = event.pathParameters?.id;

  if (!paymentId) {
    return notFound('Payment ID is required');
  }

  log.info('Fetching payment', { paymentId });

  const payment = await getPaymentById(paymentId);

  if (!payment) {
    log.warn('Payment not found', { paymentId });
    return notFound(`Payment ${paymentId} not found`);
  }

  return success({
    id: payment.id,
    merchant: payment.merchant,
    amount: payment.amount,
    currency: payment.currency,
    type: payment.type,
    status: payment.status,
    idempotency_key: payment.idempotencyKey,
    description: payment.description,
    created_at: payment.createdAt,
    updated_at: payment.updatedAt,
    completed_at: payment.completedAt,
  });
};
