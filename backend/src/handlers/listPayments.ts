import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ListPaymentsQuerySchema } from '../models/payment';
import { listPayments, listPaymentsByStatus } from '../services/dynamodb';
import { success, badRequest } from '../utils/response';
import { logger } from '../middleware/logger';

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const log = logger('listPayments');

  const parsed = ListPaymentsQuerySchema.safeParse(event.queryStringParameters || {});
  if (!parsed.success) {
    return badRequest('Invalid query parameters', parsed.error.flatten().fieldErrors);
  }

  const { status, limit, cursor } = parsed.data;

  log.info('Listing payments', { status, limit });

  const result = status
    ? await listPaymentsByStatus(status, limit, cursor)
    : await listPayments(limit, cursor);

  return success({
    payments: result.items.map((item) => ({
      id: item.id,
      merchant: item.merchant,
      amount: item.amount,
      currency: item.currency,
      type: item.type,
      status: item.status,
      idempotency_key: item.idempotencyKey,
      description: item.description,
      created_at: item.createdAt,
      updated_at: item.updatedAt,
      completed_at: item.completedAt,
    })),
    next_cursor: result.nextCursor,
    count: result.items.length,
  });
};
