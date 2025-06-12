import { useState } from 'react';
import type { ThoughtWithNumber } from '../../types/thought';
import { useThoughts } from '../../contexts/ThoughtContext';
import { useHiddenToggleContext } from '../../contexts/HiddenToggleContext';
import { useAsyncOperation } from '../../hooks/useAsyncOperation';
import ThoughtActions from './ThoughtActions';
import ThoughtEditForm from './ThoughtEditForm';
import Icon from '../UI/Icon';

interface ThoughtItemProps {
  thought: ThoughtWithNumber;
}

export default function ThoughtItem({ thought }: ThoughtItemProps) {
  const { updateThought, deleteThought, toggleThoughtHidden, moveThoughtToYesterday } = useThoughts();
  const { hideHiddenThoughts } = useHiddenToggleContext();
  
  const [isEditing, setIsEditing] = useState(false);
  
  const updateOperation = useAsyncOperation(updateThought);
  const deleteOperation = useAsyncOperation(deleteThought);
  const toggleHiddenOperation = useAsyncOperation(toggleThoughtHidden);
  const moveToYesterdayOperation = useAsyncOperation(moveThoughtToYesterday);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async (id: string, content: string) => {
    await updateOperation.execute(id, content);
    setIsEditing(false);
  };

  const handleDelete = async (id: string) => {
    await deleteOperation.execute(id);
  };

  const handleToggleHidden = async (id: string) => {
    await toggleHiddenOperation.execute(id);
  };

  const handleMoveToYesterday = async (id: string) => {
    await moveToYesterdayOperation.execute(id);
  };


  return (
    <>
      <div className="group diary-card p-3 sm:p-4 md:p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <span className="diary-text text-sm font-medium opacity-60">#{thought.number}</span>
            {thought.hidden && (
              <div title="Hidden thought">
                <Icon name="lock" className="w-3 h-3 text-subtle" />
              </div>
            )}
          </div>
          <ThoughtActions
            thought={thought}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleHidden={handleToggleHidden}
            onMoveToYesterday={handleMoveToYesterday}
            operationStates={{
              delete: deleteOperation.loading,
              toggleHidden: toggleHiddenOperation.loading,
              moveToYesterday: moveToYesterdayOperation.loading
            }}
          />
        </div>
        
        {isEditing ? (
          <ThoughtEditForm
            thought={thought}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            isLoading={updateOperation.loading}
          />
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

    </>
  );
} 