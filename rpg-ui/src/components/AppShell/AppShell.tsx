import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, User, LogIn, Home, Package, Map, BookOpen, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Mock auth state - will replace with real auth context later
  const isAuthenticated = false;
  
  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Assets', href: '/assets', icon: Package },
    { name: 'Adventures', href: '/adventures', icon: Map },
    { name: 'Rules', href: '/rules', icon: BookOpen },
    { name: 'About', href: '/about', icon: Info },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow border-r border-border bg-card">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-border">
            <h1 className="text-xl font-bold text-foreground">RPG Manager</h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* Bottom section - only show Dashboard when authenticated */}
          {isAuthenticated && (
            <div className="p-4 border-t border-border">
              <Link
                to="/dashboard"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <User className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)} />
          <div className="fixed top-0 left-0 right-0 bg-card border-b border-border shadow-lg transform transition-transform duration-300 ease-in-out">
            {/* Header with logo and close */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-border">
              <h1 className="text-xl font-bold text-foreground">RPG Manager</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            
            {/* Navigation */}
            <nav className="px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors",
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
              
              {/* Auth section in mobile menu */}
              <div className="pt-4 border-t border-border mt-4">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center px-3 py-3 text-base font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <User className="mr-3 h-5 w-5" />
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center px-3 py-3 text-base font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <LogIn className="mr-3 h-5 w-5" />
                    Sign In
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between h-16 px-4 border-b border-border bg-card md:px-6">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          {/* Desktop: empty space for logo is in sidebar */}
          <div className="hidden md:block" />
          
          {/* Mobile: logo */}
          <h1 className="text-lg font-bold text-foreground md:hidden">RPG Manager</h1>
          
          {/* User menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <User className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm font-medium hidden sm:block">Username</span>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:block">Sign In</span>
              </Link>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}