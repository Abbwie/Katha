'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, Moon, Sun, Sparkles, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { KathaAIModal } from './katha-ai-modal';

interface UserData {
  email: string;
  name: string;
  isLoggedIn: boolean;
}

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Check for logged in user on mount
    const storedUser = localStorage.getItem('kathaUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('kathaUser');
    setUser(null);
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/katha-logo.png"
              alt="Katha Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold text-foreground">Katha</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/services" className="text-sm text-foreground/70 hover:text-foreground transition">
              Browse Services
            </Link>
            <a href="#how-it-works" className="text-sm text-foreground/70 hover:text-foreground transition">
              How It Works
            </a>
            <Link href="/for-providers" className="text-sm text-foreground/70 hover:text-foreground transition">
              For Providers
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAIModal(true)}
              className="rounded-full border-accent/50 text-accent hover:bg-accent/10 hover:text-accent"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              KathaAI
            </Button>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* User Info or Sign In Button */}
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{user.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-full gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/sign-in" className="hidden sm:inline-flex">
                <Button variant="outline" className="rounded-full">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-full"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            <Link
              href="/services"
              className="block text-sm text-foreground/70 hover:text-foreground py-2 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Services
            </Link>
            <a href="#how-it-works" className="block text-sm text-foreground/70 hover:text-foreground py-2 transition">
              How It Works
            </a>
            <Link
              href="/for-providers"
              className="block text-sm text-foreground/70 hover:text-foreground py-2 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Providers
            </Link>
            <Button
              variant="outline"
              className="w-full rounded-full border-accent/50 text-accent hover:bg-accent/10"
              onClick={() => {
                setShowAIModal(true);
                setMobileMenuOpen(false);
              }}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              KathaAI Assistant
            </Button>
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 py-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{user.name}</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-full gap-1.5"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full rounded-full">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* KathaAI Modal */}
      <KathaAIModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} />
    </nav>
  );
}
