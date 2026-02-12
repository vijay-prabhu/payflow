import { useState } from 'react';
import { usePayments } from '../hooks/usePayments';
import { useApiHealth } from '../hooks/useApiHealth';
import type { Payment } from '../types/payment';
import MetricCards from './MetricCards';
import PaymentTable from './PaymentTable';
import PaymentDetail from './PaymentDetail';

export default function Dashboard() {
  const { data, isLoading, error } = usePayments();
  const { data: health } = useApiHealth();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-text-secondary text-sm mt-1">Real-time payment monitoring</p>
        </div>
        {health && (
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-text-secondary">
              {health.region} &middot; {health.status}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-lg p-4 text-danger text-sm">
          Failed to load payments: {error.message}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data ? (
        <>
          <MetricCards payments={data.payments} />
          <PaymentTable payments={data.payments} onSelect={setSelectedPayment} />
        </>
      ) : null}

      {selectedPayment && (
        <PaymentDetail payment={selectedPayment} onClose={() => setSelectedPayment(null)} />
      )}
    </div>
  );
}
