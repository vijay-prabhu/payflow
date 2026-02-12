import { APIGatewayProxyEvent, Context } from 'aws-lambda';

jest.mock('../../src/services/dynamodb');
jest.mock('../../src/services/sqs');

import { handler } from '../../src/handlers/createPayment';
import { getIdempotencyRecord, putPayment, putIdempotencyRecord } from '../../src/services/dynamodb';
import { enqueueWebhookEvent } from '../../src/services/sqs';

const mockContext = {} as Context;

const mockGetIdempotencyRecord = getIdempotencyRecord as jest.MockedFunction<typeof getIdempotencyRecord>;
const mockPutPayment = putPayment as jest.MockedFunction<typeof putPayment>;
const mockPutIdempotencyRecord = putIdempotencyRecord as jest.MockedFunction<typeof putIdempotencyRecord>;
const mockEnqueueWebhookEvent = enqueueWebhookEvent as jest.MockedFunction<typeof enqueueWebhookEvent>;

const validPaymentBody = {
  merchant: 'Test Corp',
  amount: 100.0,
  currency: 'CAD',
  type: 'eft',
  idempotency_key: 'test-key-001',
};

function createEvent(body: unknown): APIGatewayProxyEvent {
  return {
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '/v1/payments',
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as APIGatewayProxyEvent['requestContext'],
    resource: '',
    multiValueHeaders: {},
  };
}

describe('createPayment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetIdempotencyRecord.mockResolvedValue(null);
    mockPutPayment.mockResolvedValue(undefined);
    mockPutIdempotencyRecord.mockResolvedValue(undefined);
    mockEnqueueWebhookEvent.mockResolvedValue(undefined);
  });

  it('should create a payment and return 201', async () => {
    const event = createEvent(validPaymentBody);
    const result = await handler(event, mockContext);

    expect(result).toBeDefined();
    expect(result!.statusCode).toBe(201);

    const body = JSON.parse(result!.body);
    expect(body.id).toMatch(/^PAY-/);
    expect(body.status).toBe('processing');
    expect(body.merchant).toBe('Test Corp');
    expect(body.amount).toBe(100.0);
    expect(body.currency).toBe('CAD');

    expect(mockPutPayment).toHaveBeenCalledTimes(1);
    expect(mockPutIdempotencyRecord).toHaveBeenCalledTimes(1);
    expect(mockEnqueueWebhookEvent).toHaveBeenCalledTimes(1);
  });

  it('should return cached response for duplicate idempotency key', async () => {
    const cachedResponse = { id: 'PAY-EXISTING', status: 'processing' };
    mockGetIdempotencyRecord.mockResolvedValue({
      paymentId: 'PAY-EXISTING',
      cachedResponse,
    });

    const event = createEvent(validPaymentBody);
    const result = await handler(event, mockContext);

    expect(result!.statusCode).toBe(200);
    const body = JSON.parse(result!.body);
    expect(body.id).toBe('PAY-EXISTING');

    expect(mockPutPayment).not.toHaveBeenCalled();
    expect(mockEnqueueWebhookEvent).not.toHaveBeenCalled();
  });

  it('should return 400 for invalid input', async () => {
    const event = createEvent({
      merchant: '',
      amount: -50,
    });

    const result = await handler(event, mockContext);

    expect(result!.statusCode).toBe(400);
    const body = JSON.parse(result!.body);
    expect(body.error).toBe('Validation failed');
  });

  it('should return 400 when amount exceeds maximum', async () => {
    const event = createEvent({
      ...validPaymentBody,
      amount: 2_000_000,
    });

    const result = await handler(event, mockContext);

    expect(result!.statusCode).toBe(400);
  });

  it('should return 400 for invalid currency', async () => {
    const event = createEvent({
      ...validPaymentBody,
      currency: 'EUR',
    });

    const result = await handler(event, mockContext);

    expect(result!.statusCode).toBe(400);
  });

  it('should include description when provided', async () => {
    const event = createEvent({
      ...validPaymentBody,
      description: 'Monthly subscription',
    });

    const result = await handler(event, mockContext);

    expect(result!.statusCode).toBe(201);
    expect(mockPutPayment).toHaveBeenCalledWith(
      expect.objectContaining({ description: 'Monthly subscription' }),
    );
  });
});
