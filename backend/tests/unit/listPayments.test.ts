import { APIGatewayProxyEvent } from 'aws-lambda';

jest.mock('../../src/services/dynamodb');

import { handler } from '../../src/handlers/listPayments';
import { listPayments, listPaymentsByStatus } from '../../src/services/dynamodb';

const mockListPayments = listPayments as jest.MockedFunction<typeof listPayments>;
const mockListPaymentsByStatus = listPaymentsByStatus as jest.MockedFunction<typeof listPaymentsByStatus>;

const samplePayment = {
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
};

function createEvent(queryStringParameters: Record<string, string> | null): APIGatewayProxyEvent {
  return {
    body: null,
    headers: {},
    httpMethod: 'GET',
    isBase64Encoded: false,
    path: '/v1/payments',
    pathParameters: null,
    queryStringParameters,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as APIGatewayProxyEvent['requestContext'],
    resource: '',
    multiValueHeaders: {},
  };
}

describe('listPayments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list all payments with default limit', async () => {
    mockListPayments.mockResolvedValue({
      items: [samplePayment],
      nextCursor: undefined,
    });

    const result = await handler(createEvent(null));

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.payments).toHaveLength(1);
    expect(body.count).toBe(1);
    expect(body.payments[0].id).toBe('PAY-12345678');
    expect(mockListPayments).toHaveBeenCalledWith(20, undefined);
  });

  it('should filter by status when provided', async () => {
    mockListPaymentsByStatus.mockResolvedValue({
      items: [samplePayment],
      nextCursor: undefined,
    });

    const result = await handler(createEvent({ status: 'completed' }));

    expect(result.statusCode).toBe(200);
    expect(mockListPaymentsByStatus).toHaveBeenCalledWith('completed', 20, undefined);
    expect(mockListPayments).not.toHaveBeenCalled();
  });

  it('should respect custom limit', async () => {
    mockListPayments.mockResolvedValue({
      items: [],
      nextCursor: undefined,
    });

    const result = await handler(createEvent({ limit: '5' }));

    expect(result.statusCode).toBe(200);
    expect(mockListPayments).toHaveBeenCalledWith(5, undefined);
  });

  it('should return 400 for invalid status', async () => {
    const result = await handler(createEvent({ status: 'invalid' }));

    expect(result.statusCode).toBe(400);
  });

  it('should include next_cursor when more results exist', async () => {
    mockListPayments.mockResolvedValue({
      items: [samplePayment],
      nextCursor: 'abc123',
    });

    const result = await handler(createEvent(null));

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.next_cursor).toBe('abc123');
  });
});
