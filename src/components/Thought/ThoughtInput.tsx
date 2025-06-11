import { useState, useRef, useEffect, useCallback } from 'react';
import { useThoughts } from '../../contexts/ThoughtContext';
import DateSelector from '../UI/DateSelector';
import { getTodayDateString } from '../../utils/dateUtils';
import Icon from '../UI/Icon';

export default function ThoughtInput() {
  const { addThought } = useThoughts();
  const [content, setContent] = useState('');
  const [date, setDate] = useState(getTodayDateString());
  const [isHidden, setIsHidden] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);


  // Auto-resize textarea based on content
  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  };

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!content.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await addThought(content.trim(), date, isHidden);
      setContent('');
      
      // Reset textarea height after clearing content
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.style.height = 'auto';
        }
      }, 0);
    } finally {
      setIsSubmitting(false);
    }
  }, [content, date, isHidden, isSubmitting, addThought]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift), but not during composition (Chinese input)
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    adjustTextareaHeight();
  };

  // Adjust height when content changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [content]);

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <DateSelector onDateSelect={setDate} />
        
        <button
          type="button"
          onClick={() => setIsHidden(!isHidden)}
          className={`w-10 h-10 min-w-10 rounded-full text-sm font-medium transition-all duration-150 flex items-center justify-center ${
            isHidden
              ? 'bg-gray-900 text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
          title={isHidden ? 'This thought will be hidden' : 'This thought will be visible'}
        >
          <Icon name={isHidden ? 'lock' : 'unlock'} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          disabled={isSubmitting}
          className={`input diary-text resize-none overflow-y-auto ${
            isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          style={{ minHeight: '60px', maxHeight: '200px' }}
          placeholder={isSubmitting ? "Saving..." : "What's in your mind now?"}
          autoComplete="off"
          rows={1}
        />
      </form>
    </div>
  );
} 