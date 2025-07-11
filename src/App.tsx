import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Dashboard } from './components/dashboard/Dashboard';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { useSequentialDataLoader } from './hooks/useSequentialDataLoader';
import { EnhancedFullPageLoader } from './components/ui/EnhancedFullPageLoader';

// Create a minimal query client with no automatic refetching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      staleTime: Infinity,
      enabled: false, // Disable all queries by default
    },
  },
});

// Single instance of the data loader to prevent multiple instances
let appInstance: React.FC | null = null;

function AppContent() {
  const { data, loadingState, refetchData } = useSequentialDataLoader();

  // Show full page loader until all data is loaded
  if (loadingState.isLoading || loadingState.error) {
    return (
      <EnhancedFullPageLoader
        progress={loadingState.progress}
        currentStep={loadingState.currentStep}
        error={loadingState.error}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <ErrorBoundary>
        <Header onRefresh={refetchData} />
        <main className="container mx-auto px-4 py-8">
          <Dashboard data={data} />
        </main>
        <Footer />
      </ErrorBoundary>
    </div>
  );
}

function App() {
  // Ensure only one instance of the app runs
  if (appInstance) {
    return appInstance({});
  }

  appInstance = () => (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );

  return appInstance({});
}

export default App;