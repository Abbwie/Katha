'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Users, TrendingUp, Shield } from 'lucide-react';

interface ProviderHeroProps {
  onGetStarted: () => void;
}

export function ProviderHero({ onGetStarted }: ProviderHeroProps) {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background Pattern - Dark mode friendly */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary to-accent/90 dark:from-primary/80 dark:via-primary/90 dark:to-accent/80" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <span className="text-sm text-white/90">Join 500+ Filipino Tech Professionals</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-balance">
              Grow Your Business with Katha
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0 text-pretty">
              Connect with customers across the Philippines. Set your own rates, manage your schedule, and build your reputation on the leading tech services marketplace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 text-base font-semibold"
              >
                Start Earning Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border bg-background text-foreground hover:bg-muted rounded-full px-8 text-base"
              >
                Watch How It Works
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Right Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center dark:bg-white/5">
              <Users className="w-10 h-10 text-white/80 mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">10K+</div>
              <div className="text-sm text-white/70">Active Customers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center dark:bg-white/5">
              <TrendingUp className="w-10 h-10 text-white/80 mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">₱2.5M+</div>
              <div className="text-sm text-white/70">Monthly Transactions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center dark:bg-white/5">
              <Shield className="w-10 h-10 text-white/80 mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">98%</div>
              <div className="text-sm text-white/70">Payment Success</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}