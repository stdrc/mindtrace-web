import { useState, useRef, useEffect } from 'react';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  };

  // Adjust height when component mounts and content changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [editContent]);

  useEffect(() => {
    adjustTextareaHeight();
  }, []);

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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditContent(e.target.value);
    adjustTextareaHeight();
  };

  return (
    <div className="mt-3">
      <textarea
        ref={textareaRef}
        value={editContent}
        onChange={handleChange}
        className="input diary-text resize-none overflow-y-auto"
        style={{ minHeight: '60px', maxHeight: '200px' }}
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