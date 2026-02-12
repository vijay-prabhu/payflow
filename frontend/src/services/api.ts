import type { Payment, PaymentListResponse, HealthResponse } from '../types/payment';

const API_BASE = import.meta.env.VITE_API_URL;

export async function fetchPayments(status?: string, limit = 20): Promise<PaymentListResponse> {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.set('status', status);
  params.set('limit', limit.toString());

  const res = await fetch(`${API_BASE}/v1/payments?${params}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchPayment(id: string): Promise<Payment> {
  const res = await fetch(`${API_BASE}/v1/payments/${id}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function createPayment(data: {
  merchant: string;
  amount: number;
  currency: string;
  type: string;
  idempotency_key: string;
  description?: string;
}): Promise<Payment> {
  const res = await fetch(`${API_BASE}/v1/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/v1/health`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
