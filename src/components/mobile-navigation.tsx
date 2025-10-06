import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowRightLeft,
  Target,
  Trophy,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transações', href: '/transactions', icon: ArrowRightLeft },
  { name: 'Metas', href: '/goals', icon: Target },
  { name: 'Desafios', href: '/challenges', icon: Trophy },
  { name: 'Perfil', href: '/profile', icon: User },
];

export function MobileNavigation() {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border lg:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end
            className={({ isActive }) =>
              cn(
                'inline-flex flex-col items-center justify-center px-5 group rounded-lg',
                isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
              )
            }
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-[10px]">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
