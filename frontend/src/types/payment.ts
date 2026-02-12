export interface Payment {
  id: string;
  merchant: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  idempotency_key: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
}

export interface PaymentListResponse {
  payments: Payment[];
  next_cursor?: string;
  count: number;
}

export interface HealthResponse {
  status: string;
  service: string;
  region: string;
  timestamp: string;
}
