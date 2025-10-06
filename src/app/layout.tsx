import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/sidebar';
import { MobileNavigation } from '@/components/mobile-navigation';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import { useGlobalHotkeys } from '@/hooks/use-global-hotkeys';
import CelebrationQueue from '@/components/celebrations/celebration-queue';
import { useProfileStore } from '@/store/profile';
import FamilyCelebrationQueue from '@/components/family/family-celebration-queue';
import { useAuth } from '@/providers/auth-provider';

export default function RootLayout() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  useGlobalHotkeys();
  const equippedBg = useProfileStore(s => s.equipped.background);

  const backgroundClass = {
    'bg-sakura': 'bg-pink-500/10',
  }[equippedBg || ''] || 'bg-background';

  return (
    <TooltipProvider>
       <Toaster richColors position="top-right" />
       <CelebrationQueue />
       <FamilyCelebrationQueue />
      <div className={cn("min-h-screen text-foreground", backgroundClass)}>
        <Sidebar isCollapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <MobileNavigation />
        <main className={cn(
          "transition-all duration-300 ease-in-out",
          user ? (isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64') : '',
          user ? 'pb-20 lg:pb-0' : ''
        )}>
          <div className={cn(user && "p-4 sm:p-6 lg:p-8")}>
            <AnimatePresence mode="wait">
              <Outlet key={location.pathname} />
            </AnimatePresence>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
