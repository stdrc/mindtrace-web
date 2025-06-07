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
          className={`w-8 h-8 min-w-8 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center border ${
            selectedOption === 'today'
              ? 'bg-gray-900 text-white shadow-md border-gray-900'
              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          }`}
        >
          T
        </button>
        
        <button
          type="button"
          onClick={() => handleOptionClick('yesterday')}
          className={`px-3 py-2 h-8 min-w-8 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center border ${
            selectedOption === 'yesterday'
              ? 'bg-gray-900 text-white shadow-md border-gray-900'
              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          }`}
        >
          T-1
        </button>
        
        <button
          type="button"
          onClick={() => handleOptionClick('custom')}
          className={`px-3 py-2 h-8 min-w-8 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center border ${
            selectedOption === 'custom'
              ? 'bg-gray-900 text-white shadow-md border-gray-900'
              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
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