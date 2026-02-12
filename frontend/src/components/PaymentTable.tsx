import { useState } from 'react';
import type { Payment } from '../types/payment';
import StatusBadge from './StatusBadge';

interface PaymentTableProps {
  payments: Payment[];
  onSelect: (payment: Payment) => void;
}

const statusFilters = ['all', 'completed', 'processing', 'failed'] as const;

export default function PaymentTable({ payments, onSelect }: PaymentTableProps) {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = payments.filter((p) => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (search && !p.merchant.toLowerCase().includes(search.toLowerCase()) && !p.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-surface-light rounded-xl border border-border">
      <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filter === s
                  ? 'bg-accent text-white'
                  : 'bg-surface-lighter text-text-secondary hover:text-text-primary'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search merchant or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-surface px-3 py-1.5 text-sm rounded-lg border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent w-full sm:w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-text-muted text-xs uppercase tracking-wider">
              <th className="text-left p-4 font-medium">ID</th>
              <th className="text-left p-4 font-medium">Merchant</th>
              <th className="text-right p-4 font-medium">Amount</th>
              <th className="text-left p-4 font-medium">Type</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((payment) => (
              <tr
                key={payment.id}
                onClick={() => onSelect(payment)}
                className="border-t border-border hover:bg-surface-lighter/50 cursor-pointer transition-colors"
              >
                <td className="p-4 text-sm font-mono text-accent">{payment.id}</td>
                <td className="p-4 text-sm">{payment.merchant}</td>
                <td className="p-4 text-sm text-right font-mono">
                  ${payment.amount.toLocaleString('en-CA', { minimumFractionDigits: 2 })} {payment.currency}
                </td>
                <td className="p-4 text-sm text-text-secondary uppercase">{payment.type}</td>
                <td className="p-4"><StatusBadge status={payment.status} /></td>
                <td className="p-4 text-sm text-text-secondary">
                  {new Date(payment.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-text-muted">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
