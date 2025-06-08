import { useState } from 'react';
import Button from '../UI/Button';
import type { ThoughtWithNumber } from '../../types/thought';

interface ThoughtEditFormProps {
  thought: ThoughtWithNumber;
  onSave: (id: string, content: string) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function ThoughtEditForm({
  thought,
  onSave,
  onCancel,
  isLoading
}: ThoughtEditFormProps) {
  const [editContent, setEditContent] = useState(thought.content);

  const handleSave = async () => {
    if (editContent.trim() === thought.content.trim()) {
      onCancel();
      return;
    }
    
    await onSave(thought.id, editContent.trim());
  };

  const handleCancel = () => {
    setEditContent(thought.content);
    onCancel();
  };

  return (
    <div className="mt-3">
      <textarea
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        className="input diary-text min-h-[80px]"
        autoFocus
        disabled={isLoading}
      />
      <div className="flex justify-end space-x-2 mt-2 sm:mt-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          isLoading={isLoading}
          disabled={isLoading || !editContent.trim()}
        >
          Save
        </Button>
      </div>
    </div>
  );
}