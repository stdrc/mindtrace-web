import { useState } from 'react';
import Icon from '../UI/Icon';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import ConfirmDialog from '../UI/ConfirmDialog';
import { getTodayDateString } from '../../utils/dateUtils';
import type { ThoughtWithNumber } from '../../types/thought';

interface ThoughtActionsProps {
  thought: ThoughtWithNumber;
  onEdit: () => void;
  onDelete: (id: string) => Promise<void>;
  onToggleHidden: (id: string) => Promise<void>;
  onMoveToYesterday: (id: string) => Promise<void>;
  operationStates: {
    delete: boolean;
    toggleHidden: boolean;
    moveToYesterday: boolean;
  };
}

export default function ThoughtActions({
  thought,
  onEdit,
  onDelete,
  onToggleHidden,
  onMoveToYesterday,
  operationStates
}: ThoughtActionsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const deleteDialog = useConfirmDialog();
  const toggleHiddenDialog = useConfirmDialog();
  const moveToYesterdayDialog = useConfirmDialog();
  
  // Check if this thought is from today
  const isToday = thought.date === getTodayDateString();

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

  const handleMoveToYesterdayClick = () => {
    setIsMenuOpen(false);
    moveToYesterdayDialog.showDialog({
      title: "Move to Yesterday",
      content: "Are you sure you want to move this thought to yesterday's date?",
      confirmText: "Move",
      variant: 'primary',
      onConfirm: () => onMoveToYesterday(thought.id)
    });
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-subtle hover:text-muted p-2 rounded-full hover:bg-interactive-hover transition-all duration-150"
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
            <div className="absolute right-0 top-10 z-20 w-48 bg-white rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={handleEdit}
                className="w-full px-4 py-3 text-left text-secondary hover:bg-interactive-hover flex items-center space-x-2 transition-colors duration-150 text-sm first:rounded-t-xl"
              >
                <Icon name="edit" className="w-4 h-4" />
                <span>Edit</span>
              </button>
              
              {isToday && (
                <button
                  onClick={handleMoveToYesterdayClick}
                  className="w-full px-4 py-3 text-left text-secondary hover:bg-interactive-hover flex items-center space-x-2 transition-colors duration-150 text-sm"
                  disabled={operationStates.moveToYesterday}
                >
                  <Icon name="calendar" className="w-4 h-4" />
                  <span>Move to Yesterday</span>
                </button>
              )}
              
              <button
                onClick={handleToggleHiddenClick}
                className={`w-full px-4 py-3 text-left flex items-center space-x-2 transition-colors duration-150 text-sm ${
                  thought.hidden 
                    ? 'text-caution hover:bg-caution' 
                    : 'text-secondary hover:bg-interactive-hover'
                } ${!isToday ? 'last:rounded-b-xl' : ''}`}
                disabled={operationStates.toggleHidden}
              >
                <Icon name={thought.hidden ? 'unlock' : 'lock'} className="w-4 h-4" />
                <span>{thought.hidden ? 'Show' : 'Hide'}</span>
              </button>
              
              <button
                onClick={handleDeleteClick}
                className="w-full px-4 py-3 text-left text-danger hover:bg-danger flex items-center space-x-2 transition-colors duration-150 text-sm last:rounded-b-xl"
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

      <ConfirmDialog
        isOpen={moveToYesterdayDialog.isOpen}
        onClose={moveToYesterdayDialog.handleCancel}
        config={moveToYesterdayDialog.config}
        isConfirming={moveToYesterdayDialog.isConfirming || operationStates.moveToYesterday}
        onConfirm={moveToYesterdayDialog.handleConfirm}
      />
    </>
  );
}