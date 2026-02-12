interface LogEntry {
  id: string;
  method: string;
  endpoint: string;
  status: number;
  latency: number;
  timestamp: string;
}

// Simulated API logs — in production these would come from CloudWatch
const sampleLogs: LogEntry[] = [
  { id: '1', method: 'POST', endpoint: '/v1/payments', status: 201, latency: 142, timestamp: new Date().toISOString() },
  { id: '2', method: 'GET', endpoint: '/v1/payments', status: 200, latency: 38, timestamp: new Date(Date.now() - 5000).toISOString() },
  { id: '3', method: 'GET', endpoint: '/v1/payments/PAY-6E8B4A0B', status: 200, latency: 24, timestamp: new Date(Date.now() - 12000).toISOString() },
  { id: '4', method: 'GET', endpoint: '/v1/health', status: 200, latency: 8, timestamp: new Date(Date.now() - 30000).toISOString() },
  { id: '5', method: 'POST', endpoint: '/v1/payments', status: 400, latency: 12, timestamp: new Date(Date.now() - 45000).toISOString() },
  { id: '6', method: 'GET', endpoint: '/v1/payments/PAY-NOTFOUND', status: 404, latency: 18, timestamp: new Date(Date.now() - 60000).toISOString() },
  { id: '7', method: 'POST', endpoint: '/v1/payments', status: 200, latency: 15, timestamp: new Date(Date.now() - 90000).toISOString() },
];

export default function ApiLogs() {
  const logs = sampleLogs;

  const methodColor = (method: string) => {
    if (method === 'GET') return 'text-success';
    if (method === 'POST') return 'text-accent';
    return 'text-text-secondary';
  };

  const statusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-success';
    if (status >= 400 && status < 500) return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">API Logs</h1>
        <p className="text-text-secondary text-sm mt-1">Recent API request activity</p>
      </div>

      <div className="bg-surface-light rounded-xl border border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-text-muted text-xs uppercase tracking-wider">
              <th className="text-left p-4 font-medium">Time</th>
              <th className="text-left p-4 font-medium">Method</th>
              <th className="text-left p-4 font-medium">Endpoint</th>
              <th className="text-right p-4 font-medium">Status</th>
              <th className="text-right p-4 font-medium">Latency</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t border-border">
                <td className="p-4 text-sm text-text-secondary font-mono">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </td>
                <td className={`p-4 text-sm font-mono font-bold ${methodColor(log.method)}`}>
                  {log.method}
                </td>
                <td className="p-4 text-sm font-mono">{log.endpoint}</td>
                <td className={`p-4 text-sm text-right font-mono ${statusColor(log.status)}`}>
                  {log.status}
                </td>
                <td className="p-4 text-sm text-right font-mono text-text-secondary">
                  {log.latency}ms
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
