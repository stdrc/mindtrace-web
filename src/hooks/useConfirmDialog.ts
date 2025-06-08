import { useState, useCallback } from 'react';

export interface ConfirmDialogConfig {
  title: string;
  content: string;
  confirmText: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void | Promise<void>;
}

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ConfirmDialogConfig | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const showDialog = useCallback((dialogConfig: ConfirmDialogConfig) => {
    setConfig(dialogConfig);
    setIsOpen(true);
    setIsConfirming(false);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!config) return;
    
    setIsConfirming(true);
    try {
      await config.onConfirm();
      setIsOpen(false);
    } catch (error) {
      console.error('Confirm action failed:', error);
    } finally {
      setIsConfirming(false);
    }
  }, [config]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    setIsConfirming(false);
  }, []);

  const reset = useCallback(() => {
    setIsOpen(false);
    setConfig(null);
    setIsConfirming(false);
  }, []);

  return {
    isOpen,
    config,
    isConfirming,
    showDialog,
    handleConfirm,
    handleCancel,
    reset
  };
}