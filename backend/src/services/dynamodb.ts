import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { PaymentItem } from '../models/payment';
import { REGION, PAYMENTS_TABLE, IDEMPOTENCY_TABLE, IDEMPOTENCY_TTL_SECONDS } from '../utils/constants';

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

// ─── Payment Operations ───

export async function putPayment(payment: PaymentItem): Promise<void> {
  await docClient.send(new PutCommand({
    TableName: PAYMENTS_TABLE,
    Item: payment,
  }));
}

export async function getPaymentById(paymentId: string): Promise<PaymentItem | null> {
  const result = await docClient.send(new GetCommand({
    TableName: PAYMENTS_TABLE,
    Key: { PK: paymentId, SK: 'PAYMENT' },
  }));
  return (result.Item as PaymentItem) || null;
}

export async function listPayments(limit: number, cursor?: string) {
  const result = await docClient.send(new ScanCommand({
    TableName: PAYMENTS_TABLE,
    Limit: limit,
    ExclusiveStartKey: cursor ? JSON.parse(Buffer.from(cursor, 'base64').toString()) : undefined,
  }));

  return {
    items: (result.Items || []) as PaymentItem[],
    nextCursor: result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : undefined,
  };
}

export async function listPaymentsByStatus(status: string, limit: number, cursor?: string) {
  const result = await docClient.send(new QueryCommand({
    TableName: PAYMENTS_TABLE,
    IndexName: 'status-createdAt-index',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: { ':status': status },
    Limit: limit,
    ScanIndexForward: false,
    ExclusiveStartKey: cursor ? JSON.parse(Buffer.from(cursor, 'base64').toString()) : undefined,
  }));

  return {
    items: (result.Items || []) as PaymentItem[],
    nextCursor: result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : undefined,
  };
}

export async function updatePaymentStatus(
  paymentId: string,
  status: string,
  completedAt: string,
): Promise<void> {
  await docClient.send(new UpdateCommand({
    TableName: PAYMENTS_TABLE,
    Key: { PK: paymentId, SK: 'PAYMENT' },
    UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt, completedAt = :completedAt',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':status': status,
      ':updatedAt': new Date().toISOString(),
      ':completedAt': completedAt,
    },
  }));
}

// ─── Idempotency Operations ───

export async function getIdempotencyRecord(idempotencyKey: string) {
  const result = await docClient.send(new GetCommand({
    TableName: IDEMPOTENCY_TABLE,
    Key: { idempotencyKey },
  }));
  return result.Item || null;
}

export async function putIdempotencyRecord(
  idempotencyKey: string,
  paymentId: string,
  cachedResponse: unknown,
): Promise<void> {
  const ttl = Math.floor(Date.now() / 1000) + IDEMPOTENCY_TTL_SECONDS;
  await docClient.send(new PutCommand({
    TableName: IDEMPOTENCY_TABLE,
    Item: {
      idempotencyKey,
      paymentId,
      cachedResponse,
      expiresAt: ttl,
      createdAt: new Date().toISOString(),
    },
  }));
}
