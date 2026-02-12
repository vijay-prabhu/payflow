import type { Payment } from '../types/payment';
import StatusBadge from './StatusBadge';

interface PaymentDetailProps {
  payment: Payment;
  onClose: () => void;
}

export default function PaymentDetail({ payment, onClose }: PaymentDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface-light border-l border-border h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Payment Details</h2>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary text-xl leading-none"
            >
              &times;
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Payment ID</p>
              <p className="font-mono text-accent">{payment.id}</p>
            </div>

            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Status</p>
              <StatusBadge status={payment.status} />
            </div>

            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Merchant</p>
              <p>{payment.merchant}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Amount</p>
                <p className="font-mono">${payment.amount.toLocaleString('en-CA', { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Currency</p>
                <p>{payment.currency}</p>
              </div>
            </div>

            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Type</p>
              <p className="uppercase">{payment.type}</p>
            </div>

            {payment.description && (
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Description</p>
                <p className="text-text-secondary">{payment.description}</p>
              </div>
            )}

            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Idempotency Key</p>
              <p className="font-mono text-xs break-all text-text-secondary">{payment.idempotency_key}</p>
            </div>

            <hr className="border-border" />

            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Created</p>
              <p className="text-sm">{new Date(payment.created_at).toLocaleString()}</p>
            </div>

            {payment.updated_at && (
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Updated</p>
                <p className="text-sm">{new Date(payment.updated_at).toLocaleString()}</p>
              </div>
            )}

            {payment.completed_at && (
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Completed</p>
                <p className="text-sm">{new Date(payment.completed_at).toLocaleString()}</p>
              </div>
            )}

            <hr className="border-border" />

            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-2">API Response</p>
              <pre className="bg-surface rounded-lg p-3 text-xs overflow-x-auto text-text-secondary">
                {JSON.stringify(payment, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
