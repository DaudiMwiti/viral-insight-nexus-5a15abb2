
import React, { ReactNode, useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from './Sidebar';
import { VisuallyHidden } from '@/components/ui/visually-hidden';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([
    'twitter', 
    'reddit', 
    'linkedin', 
    'instagram', 
    'youtube', 
    'web'
  ]);

  // Pass selected platforms to the child components
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, { 
        selectedPlatforms 
      });
    }
    return child;
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Skip to content link - only visible when focused */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:top-2 focus:left-2 focus:rounded"
        >
          Skip to main content
        </a>
        
        <Sidebar onPlatformsChange={setSelectedPlatforms} />
        
        <main id="main-content" className="flex-1 p-6 overflow-auto" tabIndex={-1}>
          {childrenWithProps}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
