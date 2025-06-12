import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close on escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);
  
  // Close on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);
  
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-30 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="diary-card max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl"
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-medium">
          <h2 className="diary-title text-lg select-none">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted rounded-full p-1 transition-colors hover:bg-interactive-hover"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
        
        {footer && (
          <div className="px-6 py-4 border-t border-medium flex justify-end space-x-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
} 