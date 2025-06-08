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
  const deleteDialog = useConfirmDialog();
  const toggleHiddenDialog = useConfirmDialog();

  const handleDeleteClick = () => {
    deleteDialog.showDialog({
      title: "Delete Thought",
      content: "Are you sure you want to delete this thought? This action cannot be undone.",
      confirmText: "Delete",
      variant: 'danger',
      onConfirm: () => onDelete(thought.id)
    });
  };

  const handleToggleHiddenClick = () => {
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

  return (
    <>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
        <button
          onClick={handleToggleHiddenClick}
          className={`${
            thought.hidden 
              ? 'text-orange-500 hover:text-orange-600 hover:bg-orange-50' 
              : 'text-gray-500 hover:text-gray-600 hover:bg-gray-50'
          } p-1 rounded-md transition-colors`}
          title={thought.hidden ? "Show" : "Hide"}
          disabled={operationStates.toggleHidden}
        >
          <Icon name={thought.hidden ? 'unlock' : 'lock'} />
        </button>
        
        <button
          onClick={onEdit}
          className="text-gray-600 hover:text-gray-700 p-1 rounded-md hover:bg-gray-50 transition-colors"
          title="Edit"
        >
          <Icon name="edit" />
        </button>
        
        <button
          onClick={handleDeleteClick}
          className="text-red-500 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
          title="Delete"
          disabled={operationStates.delete}
        >
          <Icon name="delete" />
        </button>
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