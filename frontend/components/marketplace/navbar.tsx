'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Add this import
import Image from 'next/image';
import { Menu, X, Moon, Sun, Sparkles, User, LogOut, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { KathaAIModal } from './katha-ai-modal';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProvider, setIsProvider] = useState(false);
  const [userName, setUserName] = useState('');
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // Check login status whenever the page changes or component mounts
 useEffect(() => {
  // Read from localStorage
  const userId = localStorage.getItem('user_id');
  const providerStatus = localStorage.getItem('is_provider') === 'true';
  const fullName = localStorage.getItem('full_name');
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  
  // Use full_name first, then username, then email
  const name = fullName || username || email || 'User';
  
  console.log('=== NAVBAR READING STORAGE ===');
  console.log('full_name from storage:', fullName);
  console.log('username from storage:', username);
  console.log('Final name to display:', name);
  console.log('isProvider:', providerStatus);
  
  setIsLoggedIn(!!userId);
  setIsProvider(providerStatus);
  setUserName(name);
}, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // Determine where the user should go
  const dashboardUrl = isProvider ? '/dashboard/provider' : '/dashboard/user';

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/katha-logo.png"
              alt="Katha Logo"
              width={160}
              height={160}
              className="object-contain"
            />
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

            {/* Auth Section - Changes based on login status */}
            {isLoggedIn ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link href={dashboardUrl}>
                  <Button variant="ghost" size="sm" className="gap-2 rounded-full">
                    {isProvider ? <Briefcase className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    <span className="hidden lg:inline">{userName}</span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="rounded-full gap-2"
                >
                  <LogOut className="w-4 h-4" />
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
            
            {/* Mobile Auth Section */}
            {isLoggedIn ? (
              <>
                <Link href={dashboardUrl} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full rounded-full gap-2">
                    {isProvider ? <Briefcase className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full rounded-full gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
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
