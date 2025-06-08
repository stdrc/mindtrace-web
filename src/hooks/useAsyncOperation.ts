import { useState, useCallback } from 'react';

export interface AsyncOperationState {
  loading: boolean;
  error: string | null;
}

export function useAsyncOperation<T extends unknown[], R>(
  operation: (...args: T) => Promise<R>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: T): Promise<R | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await operation(...args);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMessage);
      console.error('Async operation failed:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [operation]);

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return { 
    execute, 
    loading, 
    error, 
    reset,
    isIdle: !loading && !error
  };
}