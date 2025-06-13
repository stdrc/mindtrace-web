import { useState } from 'react';
import { getTodayDateString, getYesterdayDateString, formatDateForDisplay } from '../../utils/dateUtils';
import Modal from './Modal';
import Button from './Button';

interface DateSelectorProps {
  onDateSelect: (date: string) => void;
}

export default function DateSelector({ onDateSelect }: DateSelectorProps) {
  const [selectedOption, setSelectedOption] = useState<string>('today');
  const [customDate, setCustomDate] = useState<string>(getTodayDateString());
  const [showDateModal, setShowDateModal] = useState(false);
  
  // When an option is selected
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    
    if (option === 'today') {
      onDateSelect(getTodayDateString());
    } else if (option === 'yesterday') {
      onDateSelect(getYesterdayDateString());
    } else if (option === 'custom') {
      setShowDateModal(true);
    }
  };
  
  // When custom date is selected in modal
  const handleCustomDateSelect = (date: string) => {
    setCustomDate(date);
    onDateSelect(date);
    setShowDateModal(false);
  };
  
  const getCustomButtonText = () => {
    if (selectedOption === 'custom') {
      return formatDateForDisplay(customDate);
    }
    return 'Custom';
  };
  
  return (
    <>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => handleOptionClick('today')}
          className={`w-10 h-10 min-w-10 rounded-full text-sm font-medium transition-all duration-150 flex items-center justify-center ${
            selectedOption === 'today'
              ? 'bg-interactive-selected text-interactive-selected'
              : 'bg-interactive text-muted hover:bg-interactive-hover'
          }`}
        >
          T
        </button>
        
        <button
          type="button"
          onClick={() => handleOptionClick('yesterday')}
          className={`px-4 py-2 h-10 min-w-10 rounded-full text-sm font-medium transition-all duration-150 flex items-center justify-center ${
            selectedOption === 'yesterday'
              ? 'bg-interactive-selected text-interactive-selected'
              : 'bg-interactive text-muted hover:bg-interactive-hover'
          }`}
        >
          T-1
        </button>
        
        <button
          type="button"
          onClick={() => handleOptionClick('custom')}
          className={`px-4 py-2 h-10 min-w-10 rounded-full text-sm font-medium transition-all duration-150 flex items-center justify-center ${
            selectedOption === 'custom'
              ? 'bg-interactive-selected text-interactive-selected'
              : 'bg-interactive text-muted hover:bg-interactive-hover'
          }`}
        >
          {getCustomButtonText()}
        </button>
      </div>
      
      <Modal
        isOpen={showDateModal}
        onClose={() => setShowDateModal(false)}
        title="Select Date"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowDateModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleCustomDateSelect(customDate)}
            >
              Confirm
            </Button>
          </>
        }
      >
        <input
          type="date"
          value={customDate}
          max={getTodayDateString()}
          onChange={(e) => setCustomDate(e.target.value)}
          className="input"
          autoComplete="off"
          autoFocus
        />
      </Modal>
    </>
  );
} 