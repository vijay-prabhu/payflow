import { z } from 'zod';

// ─── Enums ───
export const PaymentStatus = {
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  PENDING: 'pending',
} as const;

export const PaymentType = {
  WIRE: 'wire',
  EFT: 'eft',
  INTERAC: 'interac',
  ACH: 'ach',
} as const;

export const Currency = {
  CAD: 'CAD',
  USD: 'USD',
} as const;

// ─── Zod Schemas ───
export const CreatePaymentSchema = z.object({
  merchant: z.string().min(1).max(255),
  amount: z.number().positive().max(1_000_000),
  currency: z.enum(['CAD', 'USD']),
  type: z.enum(['wire', 'eft', 'interac', 'ach']),
  idempotency_key: z.string().min(8).max(128),
  description: z.string().max(500).optional(),
});

export const ListPaymentsQuerySchema = z.object({
  status: z.enum(['processing', 'completed', 'failed', 'pending']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

// ─── TypeScript Types ───
export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>;

export interface Payment {
  id: string;
  merchant: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  idempotencyKey: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// ─── DynamoDB Item Shape ───
export interface PaymentItem {
  PK: string;
  SK: string;
  id: string;
  merchant: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  idempotencyKey: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
