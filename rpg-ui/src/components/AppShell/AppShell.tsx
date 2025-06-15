import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Menu,
  User,
  LogIn,
  LogOut,
  Home,
  Package,
  Map,
  BookOpen,
  Info,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then system preference, default to dark
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches || true;
  });
  const location = useLocation();
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  // Apply theme on mount and when isDark changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Assets", href: "/assets", icon: Package },
    { name: "Adventures", href: "/adventures", icon: Map },
    { name: "Rules", href: "/rules", icon: BookOpen },
    { name: "About", href: "/about", icon: Info },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Compact sidebar for desktop */}
      <div className="hidden md:flex md:w-16 md:flex-col">
        <div className="flex flex-col flex-grow border-r border-border bg-card">
          {/* Logo - just icon */}
          <div className="flex items-center justify-center h-16 border-b border-border">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                R
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="group relative">
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-md transition-colors",
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                    title={item.name}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>

                  {/* Tooltip */}
                  <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Bottom section - Theme toggle */}
          <div className="p-2 border-t border-border">
            <div className="group relative">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-12 h-12 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* Tooltip */}
              <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {isDark ? "Light mode" : "Dark mode"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed top-0 left-0 right-0 bg-card border-b border-border shadow-lg transform transition-transform duration-300 ease-in-out">
            {/* Header with logo and close */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-border">
              <h1 className="text-xl font-bold text-foreground">RPG Core</h1>
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

              {/* Theme toggle and auth in mobile menu */}
              <div className="pt-4 border-t border-border mt-4">
                <button
                  onClick={toggleTheme}
                  className="flex items-center px-3 py-3 text-base font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full"
                >
                  {isDark ? (
                    <Sun className="mr-3 h-5 w-5" />
                  ) : (
                    <Moon className="mr-3 h-5 w-5" />
                  )}
                  {isDark ? "Light Mode" : "Dark Mode"}
                </button>

                {/* Auth buttons */}
                {!isLoading && (
                  <>
                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center px-3 py-3 text-base font-medium rounded-md text-muted-foreground">
                          <User className="mr-3 h-5 w-5" />
                          {user?.name}
                        </div>
                        <button
                          onClick={logout}
                          className="flex items-center px-3 py-3 text-base font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full mt-2"
                        >
                          <LogOut className="mr-3 h-5 w-5" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={login}
                        className="flex items-center px-3 py-3 text-base font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full mt-2"
                      >
                        <LogIn className="mr-3 h-5 w-5" />
                        Sign In
                      </button>
                    )}
                  </>
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

          {/* Desktop: App name */}
          <div className="hidden md:block">
            <h1 className="text-lg font-bold text-foreground">RPG Core</h1>
          </div>

          {/* Mobile: logo */}
          <h1 className="text-lg font-bold text-foreground md:hidden">
            RPG Core
          </h1>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-6 h-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="hidden sm:block">
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:block">Sign In</span>
              </button>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-background flex flex-col">
          <div className="flex-1">{children}</div>
          <footer className="border-t border-border bg-card mt-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="md:col-span-2">
                  <h3 className="font-bold text-lg mb-2">RPG Core</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Making it easier than ever to get into tabletop gaming.
                    Built by the community, for the community.
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Built with Simple D6 RPG System
                  </p>
                </div>

                {/* Links */}
                <div>
                  <h4 className="font-semibold mb-3">Product</h4>
                  <div className="space-y-2 text-sm">
                    <Link
                      to="/adventures"
                      className="block text-muted-foreground hover:text-foreground"
                    >
                      Adventures
                    </Link>
                    <Link
                      to="/assets"
                      className="block text-muted-foreground hover:text-foreground"
                    >
                      Assets
                    </Link>
                    <Link
                      to="/rules"
                      className="block text-muted-foreground hover:text-foreground"
                    >
                      Rules
                    </Link>
                  </div>
                </div>

                {/* Legal */}
                <div>
                  <h4 className="font-semibold mb-3">Legal</h4>
                  <div className="space-y-2 text-sm">
                    <a
                      href="#"
                      className="block text-muted-foreground hover:text-foreground"
                    >
                      Privacy Policy
                    </a>
                    <a
                      href="#"
                      className="block text-muted-foreground hover:text-foreground"
                    >
                      Terms of Service
                    </a>
                    <Link
                      to="/about"
                      className="block text-muted-foreground hover:text-foreground"
                    >
                      About
                    </Link>
                    <Link
                      to="/faq"
                      className="block text-muted-foreground hover:text-foreground"
                    >
                      FAQ
                    </Link>
                  </div>
                </div>
              </div>

              {/* Copyright */}
              <div className="border-t border-border pt-6 mt-6 text-center text-sm text-muted-foreground">
                © 2025 RPG Core. All rights reserved.
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
