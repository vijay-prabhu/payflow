jest.mock('../../src/services/dynamodb');

import { getIdempotencyRecord, putIdempotencyRecord } from '../../src/services/dynamodb';

const mockGetIdempotencyRecord = getIdempotencyRecord as jest.MockedFunction<typeof getIdempotencyRecord>;
const mockPutIdempotencyRecord = putIdempotencyRecord as jest.MockedFunction<typeof putIdempotencyRecord>;

describe('idempotency', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null for new idempotency key', async () => {
    mockGetIdempotencyRecord.mockResolvedValue(null);

    const result = await getIdempotencyRecord('new-key-12345678');
    expect(result).toBeNull();
    expect(mockGetIdempotencyRecord).toHaveBeenCalledWith('new-key-12345678');
  });

  it('should return cached record for existing idempotency key', async () => {
    const cachedRecord = {
      idempotencyKey: 'existing-key-001',
      paymentId: 'PAY-ABCD1234',
      cachedResponse: { id: 'PAY-ABCD1234', status: 'processing' },
      expiresAt: Math.floor(Date.now() / 1000) + 86400,
      createdAt: '2025-01-01T00:00:00.000Z',
    };
    mockGetIdempotencyRecord.mockResolvedValue(cachedRecord);

    const result = await getIdempotencyRecord('existing-key-001');
    expect(result).toEqual(cachedRecord);
    expect(result!.paymentId).toBe('PAY-ABCD1234');
  });

  it('should store idempotency record with TTL', async () => {
    mockPutIdempotencyRecord.mockResolvedValue(undefined);

    const response = { id: 'PAY-NEWID123', status: 'processing' };
    await putIdempotencyRecord('new-key-12345678', 'PAY-NEWID123', response);

    expect(mockPutIdempotencyRecord).toHaveBeenCalledWith(
      'new-key-12345678',
      'PAY-NEWID123',
      response,
    );
  });
});
