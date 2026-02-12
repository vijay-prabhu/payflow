import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import { CreatePaymentSchema } from '../models/payment';
import { putPayment, getIdempotencyRecord, putIdempotencyRecord } from '../services/dynamodb';
import { enqueueWebhookEvent } from '../services/sqs';
import { success, created, badRequest } from '../utils/response';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../middleware/logger';
import { PAYMENT_SK } from '../utils/constants';

const createPaymentHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const log = logger('createPayment');

  const parsed = CreatePaymentSchema.safeParse(event.body);
  if (!parsed.success) {
    log.warn('Validation failed', { errors: parsed.error.flatten() });
    return badRequest('Validation failed', parsed.error.flatten().fieldErrors);
  }

  const input = parsed.data;
  log.info('Creating payment', { merchant: input.merchant, amount: input.amount });

  const existingRecord = await getIdempotencyRecord(input.idempotency_key);
  if (existingRecord) {
    log.info('Idempotent request — returning cached response', {
      idempotencyKey: input.idempotency_key,
      existingPaymentId: existingRecord.paymentId as string,
    });
    return success(existingRecord.cachedResponse);
  }

  const paymentId = `PAY-${uuidv4().substring(0, 8).toUpperCase()}`;
  const now = new Date().toISOString();

  const payment = {
    PK: paymentId,
    SK: PAYMENT_SK,
    id: paymentId,
    merchant: input.merchant,
    amount: input.amount,
    currency: input.currency,
    type: input.type,
    status: 'processing',
    idempotencyKey: input.idempotency_key,
    description: input.description,
    createdAt: now,
    updatedAt: now,
  };

  await putPayment(payment);

  const responseBody = {
    id: payment.id,
    merchant: payment.merchant,
    amount: payment.amount,
    currency: payment.currency,
    type: payment.type,
    status: payment.status,
    idempotency_key: payment.idempotencyKey,
    created_at: payment.createdAt,
  };

  await putIdempotencyRecord(input.idempotency_key, paymentId, responseBody);

  await enqueueWebhookEvent({
    eventType: 'payment.created',
    paymentId,
    timestamp: now,
  });

  log.info('Payment created successfully', { paymentId });

  return created(responseBody);
};

export const handler = middy(createPaymentHandler)
  .use(httpJsonBodyParser())
  .use(httpErrorHandler());
