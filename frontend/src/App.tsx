import { BrowserRouter, Routes, Route, NavLink } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './components/Dashboard';
import ApiLogs from './components/ApiLogs';
import ApiDocs from './components/ApiDocs';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5_000,
      retry: 2,
    },
  },
});

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <nav className="border-b border-border bg-surface-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <span className="text-lg font-bold text-accent">PayFlow</span>
              <div className="flex gap-1">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      isActive ? 'bg-accent/15 text-accent' : 'text-text-secondary hover:text-text-primary'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/logs"
                  className={({ isActive }) =>
                    `px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      isActive ? 'bg-accent/15 text-accent' : 'text-text-secondary hover:text-text-primary'
                    }`
                  }
                >
                  API Logs
                </NavLink>
                <NavLink
                  to="/docs"
                  className={({ isActive }) =>
                    `px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      isActive ? 'bg-accent/15 text-accent' : 'text-text-secondary hover:text-text-primary'
                    }`
                  }
                >
                  API Docs
                </NavLink>
              </div>
            </div>
            <span className="text-text-muted text-xs">ca-central-1</span>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/logs" element={<ApiLogs />} />
            <Route path="/docs" element={<ApiDocs />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
