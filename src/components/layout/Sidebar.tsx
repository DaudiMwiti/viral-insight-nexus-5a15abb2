
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, BarChart2, CheckCheck, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import PlatformSelector from '@/components/controls/PlatformSelector';

interface SidebarLinkProps {
  to: string;
  children: React.ReactNode;
}

interface SidebarProps {
  onPlatformsChange?: (platforms: string[]) => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
          "text-sidebar-foreground hover:text-sidebar-foreground/80",
          "hover:bg-sidebar-accent/10",
          isActive && "bg-sidebar-accent/15 text-sidebar-accent font-medium"
        )
      }
    >
      {children}
    </NavLink>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ onPlatformsChange }) => {
  const [selectedPlatforms, setSelectedPlatforms] = React.useState([
    'twitter', 
    'reddit', 
    'linkedin', 
    'instagram', 
    'youtube', 
    'web'
  ]);

  // When selectedPlatforms changes, call the passed callback
  React.useEffect(() => {
    if (onPlatformsChange) {
      onPlatformsChange(selectedPlatforms);
    }
  }, [selectedPlatforms, onPlatformsChange]);

  return (
    <div className="h-screen w-64 border-r border-sidebar-border bg-sidebar-background text-sidebar-foreground">
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <h1 className="text-xl font-semibold">Insight AI</h1>
      </div>
      <div className="p-4">
        <nav className="grid gap-1">
          <SidebarLink to="/">
            <BarChart3 className="h-5 w-5" />
            <span>Dashboard</span>
          </SidebarLink>
          <SidebarLink to="/comparison">
            <BarChart2 className="h-5 w-5" />
            <span>Comparison</span>
          </SidebarLink>
          <SidebarLink to="/insights">
            <CheckCheck className="h-5 w-5" />
            <span>Insights</span>
          </SidebarLink>
          <SidebarLink to="/alerts">
            <AlertCircle className="h-5 w-5" />
            <span>Alerts</span>
          </SidebarLink>
        </nav>

        <div className="mt-6">
          {onPlatformsChange && (
            <PlatformSelector 
              selectedPlatforms={selectedPlatforms} 
              onPlatformsChange={setSelectedPlatforms} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
