import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../UI/Icon';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'thoughts',
      label: 'Thoughts',
      icon: 'home',
      path: '/',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'user',
      path: '/profile',
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 md:z-auto
        w-64 md:w-56 bg-white md:bg-transparent
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        transition-transform duration-300 ease-in-out
        md:transition-none md:transform-none
        border-r border-gray-200 md:border-r-0
        md:flex-shrink-0
      `}>
        <div className="h-full flex flex-col">
                    {/* Mobile header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 active:bg-gray-100"
            >
              <Icon name="x" className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 px-4 py-4 md:px-0 md:py-0 md:pr-6">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigate(item.path)}
                      className={`
                        w-full flex items-center px-3 py-2 text-sm font-medium rounded-md
                        transition-colors duration-200
                        ${isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 active:bg-gray-100'
                        }
                      `}
                    >
                      <Icon name={item.icon} className="w-5 h-5 mr-3" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}