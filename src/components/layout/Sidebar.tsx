
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, BarChart2, CheckCheck, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import PlatformSelector from '@/components/controls/PlatformSelector';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface SidebarLinkProps {
  to: string;
  children: React.ReactNode;
  label: string;
}

interface SidebarProps {
  onPlatformsChange?: (platforms: string[]) => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, children, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
          "text-sidebar-foreground hover:text-sidebar-foreground/80",
          "hover:bg-sidebar-accent/10",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isActive && "bg-sidebar-accent/15 text-sidebar-accent font-medium"
        )
      }
      aria-label={label}
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
    <aside className="h-screen w-64 border-r border-sidebar-border bg-sidebar-background text-sidebar-foreground" role="navigation" aria-label="Main navigation">
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
        <h1 className="text-xl font-semibold">Insight AI</h1>
        <ThemeToggle className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
      </div>
      <div className="p-4">
        <nav className="grid gap-1" aria-label="Primary navigation">
          <SidebarLink to="/" label="Dashboard">
            <BarChart3 className="h-5 w-5" aria-hidden="true" />
            <span>Dashboard</span>
          </SidebarLink>
          <SidebarLink to="/comparison" label="Comparison">
            <BarChart2 className="h-5 w-5" aria-hidden="true" />
            <span>Comparison</span>
          </SidebarLink>
          <SidebarLink to="/insights" label="Insights">
            <CheckCheck className="h-5 w-5" aria-hidden="true" />
            <span>Insights</span>
          </SidebarLink>
          <SidebarLink to="/alerts" label="Alerts">
            <AlertCircle className="h-5 w-5" aria-hidden="true" />
            <span>Alerts</span>
          </SidebarLink>
        </nav>

        <div className="mt-6">
          {onPlatformsChange && (
            <div role="region" aria-label="Platform selection">
              <PlatformSelector 
                selectedPlatforms={selectedPlatforms} 
                onPlatformsChange={setSelectedPlatforms} 
              />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
