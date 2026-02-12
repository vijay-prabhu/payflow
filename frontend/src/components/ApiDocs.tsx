const endpoints = [
  {
    method: 'POST',
    path: '/v1/payments',
    description: 'Create a new payment',
    request: {
      merchant: 'Shopify Inc.',
      amount: 250.0,
      currency: 'CAD',
      type: 'eft',
      idempotency_key: 'unique-key-001',
      description: 'Monthly subscription',
    },
    response: {
      id: 'PAY-A1B2C3D4',
      merchant: 'Shopify Inc.',
      amount: 250.0,
      currency: 'CAD',
      type: 'eft',
      status: 'processing',
      idempotency_key: 'unique-key-001',
      created_at: '2025-01-15T10:30:00.000Z',
    },
    status: 201,
  },
  {
    method: 'GET',
    path: '/v1/payments/:id',
    description: 'Retrieve a payment by ID',
    request: null,
    response: {
      id: 'PAY-A1B2C3D4',
      merchant: 'Shopify Inc.',
      amount: 250.0,
      currency: 'CAD',
      type: 'eft',
      status: 'completed',
      idempotency_key: 'unique-key-001',
      created_at: '2025-01-15T10:30:00.000Z',
      updated_at: '2025-01-15T10:30:05.000Z',
      completed_at: '2025-01-15T10:30:05.000Z',
    },
    status: 200,
  },
  {
    method: 'GET',
    path: '/v1/payments',
    description: 'List payments with optional status filter',
    request: null,
    response: {
      payments: ['...'],
      next_cursor: 'abc123',
      count: 20,
    },
    status: 200,
  },
  {
    method: 'GET',
    path: '/v1/health',
    description: 'Health check endpoint',
    request: null,
    response: {
      status: 'healthy',
      service: 'payflow-api',
      region: 'ca-central-1',
      timestamp: '2025-01-15T10:30:00.000Z',
    },
    status: 200,
  },
];

export default function ApiDocs() {
  const methodColor = (method: string) => {
    if (method === 'GET') return 'bg-success/15 text-success';
    if (method === 'POST') return 'bg-accent/15 text-accent';
    return 'bg-surface-lighter text-text-secondary';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">API Documentation</h1>
        <p className="text-text-secondary text-sm mt-1">PayFlow REST API endpoints</p>
      </div>

      <div className="space-y-4">
        {endpoints.map((ep) => (
          <div key={`${ep.method}-${ep.path}`} className="bg-surface-light rounded-xl border border-border">
            <div className="p-4 flex items-center gap-3 border-b border-border">
              <span className={`px-2.5 py-1 rounded text-xs font-bold ${methodColor(ep.method)}`}>
                {ep.method}
              </span>
              <code className="text-sm font-mono">{ep.path}</code>
              <span className="text-text-muted text-sm ml-auto">{ep.status}</span>
            </div>
            <div className="p-4">
              <p className="text-text-secondary text-sm mb-3">{ep.description}</p>

              {ep.request && (
                <div className="mb-3">
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-2">Request Body</p>
                  <pre className="bg-surface rounded-lg p-3 text-xs overflow-x-auto text-text-secondary">
                    {JSON.stringify(ep.request, null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider mb-2">Response</p>
                <pre className="bg-surface rounded-lg p-3 text-xs overflow-x-auto text-text-secondary">
                  {JSON.stringify(ep.response, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
