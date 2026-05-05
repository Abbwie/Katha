'use client';

import { Briefcase, Users, Target } from 'lucide-react';

const stats = [
  {
    icon: Briefcase,
    value: '150+',
    label: 'Filipino Makers & Pros',
  },
  {
    icon: Users,
    value: '2K+',
    label: 'Active Users',
  },
  {
    icon: Target,
    value: '₱50M+',
    label: 'Projects Facilitated',
  },
];

export function ImpactSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-background border-b border-border">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Supporting the Filipino Tech Community
          </h2>
          <p className="text-muted-foreground text-lg text-balance">
            Katha empowers Filipino makers, engineers, and manufacturers by connecting them 
            with projects and opportunities to grow their businesses.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                  <Icon className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <p className="text-3xl sm:text-4xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message */}
        <div className="p-8 bg-secondary rounded-lg border border-border text-center space-y-4">
          <h3 className="text-xl font-semibold text-foreground">
            Building the Philippines&apos; Tech Ecosystem
          </h3>
          <p className="text-foreground/80 max-w-2xl mx-auto text-balance">
            Katha connects Filipino makers, engineers, and manufacturers with businesses that need 
            their expertise. By supporting our tech community with fair compensation and consistent 
            work, we&apos;re strengthening the Philippines&apos; position as a leader in tech innovation 
            and manufacturing.
          </p>
          <p className="text-sm text-muted-foreground pt-2">
            Every project on Katha supports Filipino tech entrepreneurs and creators.
          </p>
        </div>
      </div>
    </section>
  );
}
