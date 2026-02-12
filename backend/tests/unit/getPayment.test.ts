import { APIGatewayProxyEvent } from 'aws-lambda';

jest.mock('../../src/services/dynamodb');

import { handler } from '../../src/handlers/getPayment';
import { getPaymentById } from '../../src/services/dynamodb';

const mockGetPaymentById = getPaymentById as jest.MockedFunction<typeof getPaymentById>;

function createEvent(pathParameters: Record<string, string> | null): APIGatewayProxyEvent {
  return {
    body: null,
    headers: {},
    httpMethod: 'GET',
    isBase64Encoded: false,
    path: '/v1/payments/PAY-12345678',
    pathParameters,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as APIGatewayProxyEvent['requestContext'],
    resource: '',
    multiValueHeaders: {},
  };
}

describe('getPayment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 with payment data', async () => {
    mockGetPaymentById.mockResolvedValue({
      PK: 'PAY-12345678',
      SK: 'PAYMENT',
      id: 'PAY-12345678',
      merchant: 'Test Corp',
      amount: 100,
      currency: 'CAD',
      type: 'eft',
      status: 'completed',
      idempotencyKey: 'key-001',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:01:00.000Z',
      completedAt: '2025-01-01T00:01:00.000Z',
    });

    const result = await handler(createEvent({ id: 'PAY-12345678' }));

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.id).toBe('PAY-12345678');
    expect(body.merchant).toBe('Test Corp');
    expect(body.status).toBe('completed');
    expect(body.idempotency_key).toBe('key-001');
  });

  it('should return 404 when payment not found', async () => {
    mockGetPaymentById.mockResolvedValue(null);

    const result = await handler(createEvent({ id: 'PAY-NOTFOUND' }));

    expect(result.statusCode).toBe(404);
    const body = JSON.parse(result.body);
    expect(body.error).toContain('not found');
  });

  it('should return 404 when no path parameter', async () => {
    const result = await handler(createEvent(null));

    expect(result.statusCode).toBe(404);
    const body = JSON.parse(result.body);
    expect(body.error).toBe('Payment ID is required');
  });
});
