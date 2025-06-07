import { useState } from 'react';

export type OperationType = 'update' | 'delete' | 'toggleHidden';

export function useThoughtOperations() {
  const [operationStates, setOperationStates] = useState<Record<OperationType, boolean>>({
    update: false,
    delete: false,
    toggleHidden: false,
  });

  const setOperationLoading = (operation: OperationType, loading: boolean) => {
    setOperationStates(prev => ({
      ...prev,
      [operation]: loading,
    }));
  };

  const isAnyOperationLoading = Object.values(operationStates).some(Boolean);

  return {
    operationStates,
    setOperationLoading,
    isAnyOperationLoading,
  };
} 