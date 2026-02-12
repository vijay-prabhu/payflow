import { SQSEvent, SQSBatchResponse, SQSBatchItemFailure } from 'aws-lambda';
import { updatePaymentStatus } from '../services/dynamodb';
import { logger } from '../middleware/logger';

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  const log = logger('webhookProcessor');
  const batchItemFailures: SQSBatchItemFailure[] = [];

  for (const record of event.Records) {
    try {
      const body = JSON.parse(record.body);
      log.info('Processing webhook event', {
        eventType: body.eventType as string,
        paymentId: body.paymentId as string,
      });

      // Simulate payment processing — 85% success rate for demo
      const isSuccess = Math.random() > 0.15;
      const newStatus = isSuccess ? 'completed' : 'failed';
      const now = new Date().toISOString();

      await updatePaymentStatus(body.paymentId, newStatus, now);

      log.info('Payment status updated', {
        paymentId: body.paymentId as string,
        status: newStatus,
      });
    } catch (error) {
      log.error('Failed to process webhook', {
        messageId: record.messageId,
        error: (error as Error).message,
      });
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }

  return { batchItemFailures };
};
