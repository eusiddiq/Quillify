
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from './Dashboard';
import Auth from './Auth';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-cream-100">
        <header className="bg-white/80 backdrop-blur-sm border-b border-sage-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div>
                  <Skeleton className="h-6 w-20 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mx-auto mb-4"></div>
            <Skeleton className="h-5 w-24 mx-auto" />
          </div>
        </main>
      </div>
    );
  }

  return user ? <Dashboard /> : <Auth />;
};

export default Index;
