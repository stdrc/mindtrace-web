import { useState } from 'react';
import type { ThoughtWithNumber } from '../../types/thought';
import { useThoughts } from '../../contexts/ThoughtContext';
import { useHiddenToggleContext } from '../../contexts/HiddenToggleContext';
import { useThoughtOperations } from '../../hooks/useThoughtOperations';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import Icon from '../UI/Icon';

interface ThoughtItemProps {
  thought: ThoughtWithNumber;
}

export default function ThoughtItem({ thought }: ThoughtItemProps) {
  const { updateThought, deleteThought, toggleThoughtHidden } = useThoughts();
  const { hideHiddenThoughts } = useHiddenToggleContext();
  const { operationStates, setOperationLoading } = useThoughtOperations();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(thought.content);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isToggleHiddenModalOpen, setIsToggleHiddenModalOpen] = useState(false);

  const handleEdit = () => {
    setEditContent(thought.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(thought.content);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    
    setOperationLoading('update', true);
    try {
      await updateThought(thought.id, editContent.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update thought:', error);
    } finally {
      setOperationLoading('update', false);
    }
  };

  const handleDelete = async () => {
    setOperationLoading('delete', true);
    try {
      await deleteThought(thought.id);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete thought:', error);
    } finally {
      setOperationLoading('delete', false);
    }
  };

  const handleToggleHidden = async () => {
    setOperationLoading('toggleHidden', true);
    try {
      await toggleThoughtHidden(thought.id);
      setIsToggleHiddenModalOpen(false);
    } catch (error) {
      console.error('Failed to toggle thought visibility:', error);
    } finally {
      setOperationLoading('toggleHidden', false);
    }
  };

  const renderModal = (
    isOpen: boolean,
    onClose: () => void,
    title: string,
    content: string,
    onConfirm: () => void,
    confirmText: string,
    isLoading: boolean,
    variant: 'danger' | 'primary' = 'primary'
  ) => (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="diary-text selectable-text">{content}</p>
    </Modal>
  );

  return (
    <>
      <div className="group diary-card p-3 sm:p-4 md:p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <span className="diary-text text-sm font-medium opacity-60">#{thought.number}</span>
            {thought.hidden && (
              <div title="Hidden thought">
                <Icon name="lock" className="w-3 h-3 text-gray-400" />
              </div>
            )}
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
            <button
              onClick={() => setIsToggleHiddenModalOpen(true)}
              className={`${
                thought.hidden 
                  ? 'text-orange-500 hover:text-orange-600 hover:bg-orange-50' 
                  : 'text-gray-500 hover:text-gray-600 hover:bg-gray-50'
              } p-1 rounded-md transition-colors`}
              title={thought.hidden ? "Unlock" : "Lock"}
            >
              <Icon name={thought.hidden ? 'unlock' : 'lock'} />
            </button>
            <button
              onClick={handleEdit}
              className="text-gray-600 hover:text-gray-700 p-1 rounded-md hover:bg-gray-50 transition-colors"
              title="Edit"
            >
              <Icon name="edit" />
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-red-500 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <Icon name="delete" />
            </button>
          </div>
        </div>
        
        {isEditing ? (
          <div className="mt-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="input diary-text min-h-[80px]"
              autoFocus
            />
            <div className="flex justify-end space-x-2 mt-2 sm:mt-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancelEdit}
                disabled={operationStates.update}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                isLoading={operationStates.update}
                disabled={operationStates.update}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-1.5 sm:mt-3">
            {thought.hidden && hideHiddenThoughts ? (
              <div className="py-1">
                {/* Hidden thought - minimal placeholder */}
              </div>
            ) : (
              <p className="diary-text whitespace-pre-wrap leading-relaxed thought-content">{thought.content}</p>
            )}
          </div>
        )}
      </div>

      {renderModal(
        isDeleteModalOpen,
        () => setIsDeleteModalOpen(false),
        "Delete Thought",
        "Are you sure you want to delete this thought? This action cannot be undone.",
        handleDelete,
        "Delete",
        operationStates.delete,
        'danger'
      )}

      {renderModal(
        isToggleHiddenModalOpen,
        () => setIsToggleHiddenModalOpen(false),
        thought.hidden ? "Unlock Thought" : "Lock Thought",
        thought.hidden 
          ? "Are you sure you want to unlock this thought? It will be visible again."
          : "Are you sure you want to lock this thought? It will be hidden from the main view.",
        handleToggleHidden,
        thought.hidden ? "Unlock" : "Lock",
        operationStates.toggleHidden
      )}
    </>
  );
} 