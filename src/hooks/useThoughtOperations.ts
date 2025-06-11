import { useState } from 'react';

export type OperationType = 'update' | 'delete' | 'toggleHidden' | 'moveToYesterday';

export function useThoughtOperations() {
  const [operationStates, setOperationStates] = useState<Record<OperationType, boolean>>({
    update: false,
    delete: false,
    toggleHidden: false,
    moveToYesterday: false,
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