import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { REGION, WEBHOOK_QUEUE_URL } from '../utils/constants';

const client = new SQSClient({ region: REGION });

interface WebhookEvent {
  eventType: string;
  paymentId: string;
  timestamp: string;
}

export async function enqueueWebhookEvent(event: WebhookEvent): Promise<void> {
  await client.send(new SendMessageCommand({
    QueueUrl: WEBHOOK_QUEUE_URL,
    MessageBody: JSON.stringify(event),
  }));
}
