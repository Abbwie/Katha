'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  Calendar,
  User,
  Star,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  LogOut,
  Network,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/services', label: 'Services', icon: Package, badge: 3 },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart, badge: 3 },
  { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare, badge: 5 },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/reviews', label: 'Reviews', icon: Star },
  { href: '/dashboard/financials', label: 'Financials', icon: Wallet },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [isProvider, setIsProvider] = useState(false);

  // Load user data from localStorage
  useEffect(() => {
  const fullName = localStorage.getItem('full_name');
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  const providerStatus = localStorage.getItem('is_provider') === 'true';
  
  const name = fullName || username || email || 'User';
  setUserName(name);
  setIsProvider(providerStatus);
  
  console.log('Dashboard layout - userName:', name);
  console.log('Dashboard layout - isProvider:', providerStatus);
}, []);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300',
          collapsed ? 'w-20' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className={cn('flex items-center h-16 px-4 border-b border-sidebar-border', collapsed ? 'justify-center' : 'gap-3')}>
          <Link href="/" className="flex items-center gap-2">
            <Network className="w-8 h-8 text-sidebar-primary" />
            {!collapsed && <span className="text-xl font-bold">Katha</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden ml-auto text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative group',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground'
                )}
              >
                <item.icon className={cn('w-5 h-5 flex-shrink-0', collapsed && 'mx-auto')} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className={cn('p-4 border-t border-sidebar-border', collapsed && 'px-2')}>
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
                <AvatarFallback>{userName.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {isProvider ? 'Provider Account' : 'Member'}
                </p>
            </div>
            </div>
          ) : (
            <Avatar className="w-10 h-10 mx-auto">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
              <AvatarFallback>{userName.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Collapse Toggle - Desktop Only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-sidebar-accent border border-sidebar-border rounded-full items-center justify-center text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {isProvider ? 'Provider Dashboard' : 'My Dashboard'}
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Welcome back, {userName}
              </p>
          </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-3 border-b border-border">
                  <p className="font-medium">Notifications</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <DropdownMenuItem className="p-3 cursor-pointer">
                    <div>
                      <p className="text-sm font-medium">New order received</p>
                      <p className="text-xs text-muted-foreground">PCB Fabrication - 2 hours ago</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-3 cursor-pointer">
                    <div>
                      <p className="text-sm font-medium">Payment confirmed</p>
                      <p className="text-xs text-muted-foreground">Order #1234 - 5 hours ago</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-3 cursor-pointer">
                    <div>
                      <p className="text-sm font-medium">New review received</p>
                      <p className="text-xs text-muted-foreground">5 stars from Juan D. - 1 day ago</p>
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Divider */}
            <div className="hidden sm:block h-8 w-px bg-border" />

            {/* User Info & Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3">
                <Avatar className="w-9 h-9">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
                  <AvatarFallback>{userName.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-foreground">{userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {isProvider ? 'Professional Plan' : 'Member'}
                  </p>
                </div>
              </div>

              {/* Settings Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <User className="w-4 h-4 mr-2" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" asChild>
                    <Link href="/sign-in">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Visible Logout Button */}
              <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2" asChild>
                <Link href="/sign-in">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}