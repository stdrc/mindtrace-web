import { useState, useRef, useEffect } from 'react';
import { useThoughts } from '../../contexts/ThoughtContext';
import DateSelector from '../UI/DateSelector';
import { getTodayDateString } from '../../utils/dateUtils';
import Icon from '../UI/Icon';

export default function ThoughtInput() {
  const { addThought } = useThoughts();
  const [content, setContent] = useState('');
  const [date, setDate] = useState(getTodayDateString());
  const [isHidden, setIsHidden] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus the input when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Auto-resize textarea based on content
  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!content.trim()) return;
    
    await addThought(content.trim(), date, isHidden);
    setContent('');
    
    // Reset textarea height after clearing content
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
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
          className={`w-8 h-8 min-w-8 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center border ${
            isHidden
              ? 'bg-gray-900 text-white shadow-md border-gray-900'
              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
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
          className="input diary-text resize-none overflow-hidden"
          style={{ minHeight: '60px', maxHeight: '200px' }}
          placeholder="What's in your mind now?"
          autoComplete="off"
          rows={1}
        />
      </form>
    </div>
  );
} 