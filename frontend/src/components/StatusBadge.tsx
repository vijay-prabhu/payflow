interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  completed: { bg: 'bg-success/15', text: 'text-success', label: 'Completed' },
  processing: { bg: 'bg-processing/15', text: 'text-processing', label: 'Processing' },
  failed: { bg: 'bg-danger/15', text: 'text-danger', label: 'Failed' },
  pending: { bg: 'bg-warning/15', text: 'text-warning', label: 'Pending' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || { bg: 'bg-surface-lighter', text: 'text-text-secondary', label: status };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.text} bg-current`} />
      {config.label}
    </span>
  );
}
