import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useHiddenToggleContext } from '../../contexts/HiddenToggleContext';
import { useThoughts } from '../../contexts/ThoughtContext';
import { useTheme } from '../../contexts/ThemeContext';
import { navigateToThoughtsAndRefresh } from '../../utils/navigationUtils';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import ExportModal from '../UI/ExportModal';
import Icon from '../UI/Icon';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { user } = useAuth();
  const { hideHiddenThoughts, toggleHiddenVisibility } = useHiddenToggleContext();
  const { refreshThoughts } = useThoughts();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isShowHiddenModalOpen, setIsShowHiddenModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

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

  const handleLogoClick = () => {
    navigateToThoughtsAndRefresh(navigate, refreshThoughts);
  };

  return (
    <>
      <header className="modern-header fixed-header">
        <div>
          <div className="flex justify-between h-16 items-center px-3 sm:px-6 md:px-8">
            <div className="flex items-center space-x-4">
              {user && (
                <button
                  onClick={onToggleSidebar}
                  className="p-2 rounded-md text-muted lg:hidden hover:bg-interactive-hover"
                  title="Toggle menu"
                >
                  <Icon name="menu" className="w-5 h-5" />
                </button>
              )}
              <button 
                onClick={handleLogoClick}
                className="flex-shrink-0 flex items-center"
              >
                <img 
                  src="/logo-transparent.svg" 
                  alt="MindTrace Logo" 
                  className="w-9 h-9 mr-2"
                />
                <h1 className="text-2xl website-title">MindTrace</h1>
              </button>
            </div>
            
            {user && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-sm font-medium transition-all duration-150 text-secondary hover:bg-interactive-hover"
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  <Icon name={theme === 'light' ? 'moon' : 'sun'} />
                </button>
                
                {!isProfilePage && (
                  <>
                    <button
                      onClick={handleEyeButtonClick}
                      className={`p-2 rounded-full text-sm font-medium transition-all duration-150 ${
                        hideHiddenThoughts
                          ? 'text-subtle hover:bg-interactive-hover'
                          : 'text-caution hover:bg-caution'
                      }`}
                      title={hideHiddenThoughts ? 'Unlock to show hidden thoughts' : 'Lock to hide hidden thoughts'}
                    >
                      <Icon name={hideHiddenThoughts ? 'lock' : 'unlock'} />
                    </button>
                    
                    <button
                      onClick={() => setIsExportModalOpen(true)}
                      className="p-2 rounded-full text-sm font-medium transition-all duration-150 text-secondary hover:bg-interactive-hover"
                      title="Export thoughts"
                    >
                      <Icon name="archive" />
                    </button>
                  </>
                )}
              </div>
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
        <p className="modern-text selectable-text">
          Are you sure you want to show hidden content?
        </p>
      </Modal>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </>
  );
} 