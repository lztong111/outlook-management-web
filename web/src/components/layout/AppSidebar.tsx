import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Globe, Mail, X, LogOut, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: '仪表盘' },
  { to: '/accounts', icon: Users, label: '邮箱管理' },
  // { to: '/proxy', icon: Globe, label: '代理设置' },  // 暂时隐藏
];

interface Props {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function AppSidebar({ open, onClose, onLogout }: Props) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />
      )}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-60 flex-col border-r border-border bg-card transition-transform duration-200 md:static md:translate-x-0 md:flex",
        open ? "flex translate-x-0" : "hidden -translate-x-full md:flex md:translate-x-0"
      )}>
        <div className="flex h-14 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Mail className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Outlook 管理器</span>
          </div>
          <button onClick={onClose} className="md:hidden p-1 rounded-md hover:bg-secondary transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary border-l-2 border-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground border-l-2 border-transparent'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        {/* User info & logout */}
        <div className="p-3 border-t border-border space-y-2">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-secondary/50">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20">
              <Shield className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">管理员</p>
              <p className="text-[10px] text-muted-foreground">已登录</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (confirm('确定要退出登录吗？')) onLogout();
            }}
            className="flex w-full items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            退出登录
          </button>
          <p className="text-[10px] text-muted-foreground text-center">v1.0.0</p>
        </div>
      </aside>
    </>
  );
}
