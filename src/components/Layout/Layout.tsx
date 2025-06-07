import type { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="h-full diary-page flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 flex flex-col min-h-0 main-content scrollable-content">
        <div className="w-full mx-auto px-3 py-4 sm:px-6 sm:py-6 md:px-8 flex-1 flex flex-col min-h-0 content-container">
          {children}
        </div>
      </main>
    </div>
  );
} 