import { CreatePaymentSchema, ListPaymentsQuerySchema } from '../../src/models/payment';

describe('CreatePaymentSchema', () => {
  const validInput = {
    merchant: 'Test Corp',
    amount: 100.0,
    currency: 'CAD',
    type: 'eft',
    idempotency_key: 'test-key-001',
  };

  it('should accept valid payment input', () => {
    const result = CreatePaymentSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('should accept payment with optional description', () => {
    const result = CreatePaymentSchema.safeParse({
      ...validInput,
      description: 'Monthly payment',
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty merchant', () => {
    const result = CreatePaymentSchema.safeParse({ ...validInput, merchant: '' });
    expect(result.success).toBe(false);
  });

  it('should reject negative amount', () => {
    const result = CreatePaymentSchema.safeParse({ ...validInput, amount: -50 });
    expect(result.success).toBe(false);
  });

  it('should reject zero amount', () => {
    const result = CreatePaymentSchema.safeParse({ ...validInput, amount: 0 });
    expect(result.success).toBe(false);
  });

  it('should reject amount over 1,000,000', () => {
    const result = CreatePaymentSchema.safeParse({ ...validInput, amount: 1_000_001 });
    expect(result.success).toBe(false);
  });

  it('should reject invalid currency', () => {
    const result = CreatePaymentSchema.safeParse({ ...validInput, currency: 'EUR' });
    expect(result.success).toBe(false);
  });

  it('should accept CAD and USD currencies', () => {
    expect(CreatePaymentSchema.safeParse({ ...validInput, currency: 'CAD' }).success).toBe(true);
    expect(CreatePaymentSchema.safeParse({ ...validInput, currency: 'USD' }).success).toBe(true);
  });

  it('should reject invalid payment type', () => {
    const result = CreatePaymentSchema.safeParse({ ...validInput, type: 'crypto' });
    expect(result.success).toBe(false);
  });

  it('should accept all valid payment types', () => {
    for (const type of ['wire', 'eft', 'interac', 'ach']) {
      expect(CreatePaymentSchema.safeParse({ ...validInput, type }).success).toBe(true);
    }
  });

  it('should reject short idempotency key (< 8 chars)', () => {
    const result = CreatePaymentSchema.safeParse({ ...validInput, idempotency_key: 'short' });
    expect(result.success).toBe(false);
  });

  it('should reject description over 500 chars', () => {
    const result = CreatePaymentSchema.safeParse({
      ...validInput,
      description: 'x'.repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing required fields', () => {
    expect(CreatePaymentSchema.safeParse({}).success).toBe(false);
    expect(CreatePaymentSchema.safeParse({ merchant: 'Test' }).success).toBe(false);
  });
});

describe('ListPaymentsQuerySchema', () => {
  it('should accept empty query (all defaults)', () => {
    const result = ListPaymentsQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    expect(result.data?.limit).toBe(20);
  });

  it('should accept valid status filter', () => {
    const result = ListPaymentsQuerySchema.safeParse({ status: 'completed' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid status', () => {
    const result = ListPaymentsQuerySchema.safeParse({ status: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('should coerce string limit to number', () => {
    const result = ListPaymentsQuerySchema.safeParse({ limit: '50' });
    expect(result.success).toBe(true);
    expect(result.data?.limit).toBe(50);
  });

  it('should reject limit over 100', () => {
    const result = ListPaymentsQuerySchema.safeParse({ limit: '200' });
    expect(result.success).toBe(false);
  });

  it('should reject limit under 1', () => {
    const result = ListPaymentsQuerySchema.safeParse({ limit: '0' });
    expect(result.success).toBe(false);
  });
});
