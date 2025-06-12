import Modal from './Modal';
import Button from './Button';
import type { ConfirmDialogConfig } from '../../hooks/useConfirmDialog';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  config: ConfirmDialogConfig | null;
  isConfirming: boolean;
  onConfirm: () => void;
}

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  config, 
  isConfirming, 
  onConfirm 
}: ConfirmDialogProps) {
  if (!config) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={config.title}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isConfirming}
          >
            Cancel
          </Button>
          <Button
            variant={config.variant || 'primary'}
            onClick={onConfirm}
            isLoading={isConfirming}
            disabled={isConfirming}
          >
            {config.confirmText}
          </Button>
        </>
      }
    >
      <p className="modern-text select-none">
        {config.content}
      </p>
    </Modal>
  );
}