import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowRightLeft,
  Target,
  Trophy,
  BrainCircuit,
  Users,
  Sparkles,
  ChevronLeft,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { UserAvatar } from './user-avatar';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { hasFeature, PlanId } from '@/lib/plan';
import UpgradeCTACompact from './billing/upgrade-cta-compact';
import { useAuth } from '@/providers/auth-provider';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, plan: 'all' },
  { name: 'Transações', href: '/transactions', icon: ArrowRightLeft, plan: 'all' },
  { name: 'Metas', href: '/goals', icon: Target, plan: 'all' },
  { name: 'Desafios', href: '/challenges', icon: Trophy, plan: 'all' },
  { name: 'Assistente IA', href: '/ai-assistant', icon: BrainCircuit, plan: 'all' },
  { name: 'Família', href: '/family', icon: Users, plan: 'family' },
];

const NavItem = ({ item, isCollapsed }: { item: typeof navigationItems[0], isCollapsed: boolean }) => {
  const content = (
    <NavLink
      to={item.href}
      end
      className={({ isActive }) =>
        cn(
          'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
          isCollapsed ? 'justify-center' : '',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-sidebar-foreground/70 hover:bg-accent hover:text-accent-foreground'
        )
      }
    >
      <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} aria-hidden="true" />
      <span className={cn(isCollapsed && 'sr-only')}>{item.name}</span>
    </NavLink>
  );

  return isCollapsed ? (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">{item.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    content
  );
};

interface SidebarProps {
  isCollapsed: boolean;
  setCollapsed: (isCollapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, setCollapsed }: SidebarProps) {
  const { user, profile, signOut } = useAuth();
  const plan = (profile?.plan ?? "free") as PlanId;
  const showUpgrade = !hasFeature(plan, 'ai_insights');
  
  const visibleNavigation = navigationItems.filter(item => {
    if (item.plan === 'family') {
      return plan === 'family';
    }
    return true;
  });

  return (
    <aside className={cn(
      "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
      isCollapsed ? 'lg:w-20' : 'lg:w-64'
    )}>
      <div className="flex grow flex-col gap-y-5 overflow-y-auto px-4 pb-4">
        <div className={cn("flex h-16 shrink-0 items-center", isCollapsed ? 'justify-center' : 'justify-between')}>
          <div className="flex items-center gap-x-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className={cn("font-bold text-xl text-foreground", isCollapsed && "sr-only")}>FinPatch</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!isCollapsed)} className={cn(isCollapsed && 'absolute -right-12 top-4 bg-card border')}>
            <ChevronLeft className={cn("h-5 w-5 transition-transform", isCollapsed && "rotate-180")} />
          </Button>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {visibleNavigation.map((item) => (
                  <li key={item.name}>
                    <NavItem item={item} isCollapsed={isCollapsed} />
                  </li>
                ))}
              </ul>
            </li>
            <li className="mt-auto space-y-4">
               {showUpgrade && !isCollapsed && (
                <UpgradeCTACompact className="mx-2" buttonText="Upgrade" />
               )}
               <Separator />
               <div className="flex items-center justify-between p-2 group">
                  <NavLink to="/profile" className="flex items-center gap-x-3 flex-grow">
                      <UserAvatar />
                      <div className={cn("text-sm", isCollapsed && "sr-only")}>
                          <p className="font-semibold text-foreground">{profile?.display_name || user?.email?.split('@')[0] || "Usuário"}</p>
                          <p className="text-xs text-muted-foreground">Ver perfil</p>
                      </div>
                  </NavLink>
                  <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={signOut} className={cn(isCollapsed && 'w-full')}>
                                <LogOut className="h-5 w-5 text-muted-foreground" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side={isCollapsed ? "right" : "top"}>Sair</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
               </div>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
