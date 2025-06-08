import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useHiddenToggleContext } from '../../contexts/HiddenToggleContext';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import Icon from '../UI/Icon';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { user } = useAuth();
  const { hideHiddenThoughts, toggleHiddenVisibility } = useHiddenToggleContext();
  const location = useLocation();
  const [isShowHiddenModalOpen, setIsShowHiddenModalOpen] = useState(false);

  // Don't show lock button on profile page
  const isProfilePage = location.pathname === '/profile';

  const handleEyeButtonClick = () => {
    // If currently hiding hidden thoughts and user wants to show them, show confirmation modal
    if (hideHiddenThoughts) {
      setIsShowHiddenModalOpen(true);
    } else {
      // If currently showing hidden thoughts and user wants to hide them, toggle directly
      toggleHiddenVisibility();
    }
  };

  const handleConfirmShowHidden = () => {
    toggleHiddenVisibility();
    setIsShowHiddenModalOpen(false);
  };

  const handleCancelShowHidden = () => {
    setIsShowHiddenModalOpen(false);
  };

  return (
    <>
      <header className="diary-header fixed-header">
        <div className="app-container">
          <div className="flex justify-between h-16 items-center px-3 sm:px-6 md:px-8">
            <div className="flex items-center space-x-4">
              {user && (
                <button
                  onClick={onToggleSidebar}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 md:hidden"
                  title="Toggle menu"
                >
                  <Icon name="menu" className="w-5 h-5" />
                </button>
              )}
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl diary-title">MindTrace</h1>
              </div>
            </div>
            
            {user && !isProfilePage && (
              <button
                onClick={handleEyeButtonClick}
                className={`p-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  hideHiddenThoughts
                    ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                title={hideHiddenThoughts ? 'Unlock to show hidden thoughts' : 'Lock to hide hidden thoughts'}
              >
                <Icon name={hideHiddenThoughts ? 'lock' : 'unlock'} />
              </button>
            )}
          </div>
        </div>
      </header>

      <Modal
        isOpen={isShowHiddenModalOpen}
        onClose={handleCancelShowHidden}
        title="Show Hidden Content"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={handleCancelShowHidden}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmShowHidden}
            >
              Show
            </Button>
          </>
        }
      >
        <p className="diary-text selectable-text">
          Are you sure you want to show hidden content?
        </p>
      </Modal>
    </>
  );
} 