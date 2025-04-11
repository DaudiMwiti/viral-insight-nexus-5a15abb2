
import React, { ReactNode, useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState(['twitter', 'reddit']);

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
        <Sidebar onPlatformsChange={setSelectedPlatforms} />
        <main className="flex-1 p-6 overflow-auto">
          {childrenWithProps}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
