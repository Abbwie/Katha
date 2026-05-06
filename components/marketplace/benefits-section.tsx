'use client';

import { Shield, Zap, Award, TrendingUp } from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: 'Verified Filipino Makers',
    description: 'All providers are carefully vetted tech professionals across the Philippines.',
  },
  {
    icon: Award,
    title: 'Quality Commitment',
    description: 'We stand behind the work of our trusted makers and manufacturers.',
  },
  {
    icon: Zap,
    title: 'Quick Quotes',
    description: 'Fast responses and production from experienced local providers.',
  },
  {
    icon: TrendingUp,
    title: 'Competitive Pricing',
    description: 'Fair rates from makers competing to serve your projects.',
  },
];

export function BenefitsSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30 border-b border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Why Choose Katha
          </h2>
          <p className="text-muted-foreground mt-3 text-balance">
            Connect with the Philippines&apos; best tech professionals for your projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="p-6 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-foreground/70">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
