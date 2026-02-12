export const REGION = process.env.AWS_REGION || 'ca-central-1';
export const PAYMENTS_TABLE = process.env.PAYMENTS_TABLE!;
export const IDEMPOTENCY_TABLE = process.env.IDEMPOTENCY_TABLE!;
export const WEBHOOK_QUEUE_URL = process.env.WEBHOOK_QUEUE_URL!;

export const IDEMPOTENCY_TTL_SECONDS = 86400; // 24 hours
export const PAYMENT_ID_PREFIX = 'PAY';
export const PAYMENT_SK = 'PAYMENT';
