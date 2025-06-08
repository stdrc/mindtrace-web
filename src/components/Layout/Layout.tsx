import type { ReactNode } from 'react';
import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="h-full diary-page flex flex-col overflow-hidden">
      <Header onToggleSidebar={toggleSidebar} />
      <main className="flex-1 flex flex-col min-h-0 main-content scrollable-content overflow-y-auto">
        <div className="flex-1 flex justify-center min-h-0 w-full py-4 sm:py-6">
          <div className="flex min-h-0 w-full max-w-4xl">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <div className="flex-1 flex flex-col min-h-0">
              <div className="px-3 sm:px-6 md:px-8 flex-1 flex flex-col min-h-0 content-container">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 