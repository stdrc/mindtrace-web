import { useState } from 'react';
import Icon from '../UI/Icon';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import ConfirmDialog from '../UI/ConfirmDialog';
import type { ThoughtWithNumber } from '../../types/thought';

interface ThoughtActionsProps {
  thought: ThoughtWithNumber;
  onEdit: () => void;
  onDelete: (id: string) => Promise<void>;
  onToggleHidden: (id: string) => Promise<void>;
  operationStates: {
    delete: boolean;
    toggleHidden: boolean;
  };
}

export default function ThoughtActions({
  thought,
  onEdit,
  onDelete,
  onToggleHidden,
  operationStates
}: ThoughtActionsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const deleteDialog = useConfirmDialog();
  const toggleHiddenDialog = useConfirmDialog();

  const handleDeleteClick = () => {
    setIsMenuOpen(false);
    deleteDialog.showDialog({
      title: "Delete Thought",
      content: "Are you sure you want to delete this thought? This action cannot be undone.",
      confirmText: "Delete",
      variant: 'danger',
      onConfirm: () => onDelete(thought.id)
    });
  };

  const handleToggleHiddenClick = () => {
    setIsMenuOpen(false);
    toggleHiddenDialog.showDialog({
      title: thought.hidden ? "Show Thought" : "Hide Thought",
      content: thought.hidden 
        ? "Are you sure you want to show this thought? It will be visible again."
        : "Are you sure you want to hide this thought? It will be hidden from the main view.",
      confirmText: thought.hidden ? "Show" : "Hide",
      variant: 'primary',
      onConfirm: () => onToggleHidden(thought.id)
    });
  };

  const handleEdit = () => {
    setIsMenuOpen(false);
    onEdit();
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-all duration-150"
          title="More options"
        >
          <Icon name="more-vertical" />
        </button>
        
        {isMenuOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute right-0 top-10 z-20 w-48 bg-white rounded-2xl shadow-lg py-2">
              <button
                onClick={handleEdit}
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
              >
                <Icon name="edit" className="w-4 h-4" />
                <span>Edit</span>
              </button>
              
              <button
                onClick={handleToggleHiddenClick}
                className={`w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors duration-150 ${
                  thought.hidden 
                    ? 'text-orange-600 hover:bg-orange-50' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                disabled={operationStates.toggleHidden}
              >
                <Icon name={thought.hidden ? 'unlock' : 'lock'} className="w-4 h-4" />
                <span>{thought.hidden ? 'Show' : 'Hide'}</span>
              </button>
              
              <button
                onClick={handleDeleteClick}
                className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors duration-150"
                disabled={operationStates.delete}
              >
                <Icon name="delete" className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.handleCancel}
        config={deleteDialog.config}
        isConfirming={deleteDialog.isConfirming || operationStates.delete}
        onConfirm={deleteDialog.handleConfirm}
      />

      <ConfirmDialog
        isOpen={toggleHiddenDialog.isOpen}
        onClose={toggleHiddenDialog.handleCancel}
        config={toggleHiddenDialog.config}
        isConfirming={toggleHiddenDialog.isConfirming || operationStates.toggleHidden}
        onConfirm={toggleHiddenDialog.handleConfirm}
      />
    </>
  );
}