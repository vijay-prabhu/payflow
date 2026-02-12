import type { Payment } from '../types/payment';

interface MetricCardsProps {
  payments: Payment[];
}

export default function MetricCards({ payments }: MetricCardsProps) {
  const totalVolume = payments.reduce((sum, p) => sum + p.amount, 0);
  const completedCount = payments.filter((p) => p.status === 'completed').length;
  const failedCount = payments.filter((p) => p.status === 'failed').length;
  const successRate = payments.length > 0 ? (completedCount / payments.length) * 100 : 0;

  const metrics = [
    {
      label: 'Total Volume',
      value: `$${totalVolume.toLocaleString('en-CA', { minimumFractionDigits: 2 })}`,
      sub: `${payments.length} payments`,
      color: 'text-accent',
    },
    {
      label: 'Success Rate',
      value: `${successRate.toFixed(1)}%`,
      sub: `${completedCount} completed`,
      color: 'text-success',
    },
    {
      label: 'Avg Amount',
      value: payments.length > 0
        ? `$${(totalVolume / payments.length).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
        : '$0.00',
      sub: 'per payment',
      color: 'text-processing',
    },
    {
      label: 'Failed',
      value: failedCount.toString(),
      sub: 'payments',
      color: failedCount > 0 ? 'text-danger' : 'text-success',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div key={m.label} className="bg-surface-light rounded-xl border border-border p-5">
          <p className="text-text-muted text-sm">{m.label}</p>
          <p className={`text-2xl font-bold mt-1 ${m.color}`}>{m.value}</p>
          <p className="text-text-secondary text-xs mt-1">{m.sub}</p>
        </div>
      ))}
    </div>
  );
}
