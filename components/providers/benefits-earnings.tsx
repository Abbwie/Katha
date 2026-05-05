'use client';

import { 
  Wallet, 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  Star, 
  Zap,
  Clock,
  Globe
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const benefits = [
  {
    icon: Wallet,
    title: 'Competitive Earnings',
    description: 'Set your own rates and keep up to 85% of every transaction. No hidden fees.',
    highlight: '85% earnings',
  },
  {
    icon: Calendar,
    title: 'Flexible Schedule',
    description: 'Work when you want. Accept orders that fit your availability and capacity.',
    highlight: 'Your terms',
  },
  {
    icon: BarChart3,
    title: 'Business Analytics',
    description: 'Track performance, revenue trends, and customer insights with our dashboard.',
    highlight: 'Data-driven',
  },
  {
    icon: MessageSquare,
    title: 'Direct Communication',
    description: 'Chat directly with customers to discuss requirements and build relationships.',
    highlight: 'Real-time chat',
  },
  {
    icon: Star,
    title: 'Build Reputation',
    description: 'Earn reviews and ratings that showcase your expertise to new customers.',
    highlight: 'Verified reviews',
  },
  {
    icon: Zap,
    title: 'Fast Payments',
    description: 'Get paid within 24-48 hours after project completion via GCash or bank transfer.',
    highlight: '24-48hr payout',
  },
];

const earningsData = [
  { category: '3D Printing', avgMonthly: '₱45,000 - ₱120,000', topEarners: '₱200,000+' },
  { category: 'PCB Fabrication', avgMonthly: '₱60,000 - ₱150,000', topEarners: '₱250,000+' },
  { category: 'CAD Design', avgMonthly: '₱50,000 - ₱130,000', topEarners: '₱220,000+' },
  { category: 'Laser Services', avgMonthly: '₱35,000 - ₱90,000', topEarners: '₱150,000+' },
  { category: 'CNC Machining', avgMonthly: '₱70,000 - ₱180,000', topEarners: '₱300,000+' },
  { category: 'Assembly', avgMonthly: '₱40,000 - ₱100,000', topEarners: '₱180,000+' },
];

export function BenefitsEarnings() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Providers Choose Katha
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to grow your tech services business in one platform
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {benefits.map((benefit, index) => (
            <Card key={index} className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-accent/10">
                  <benefit.icon className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                      {benefit.highlight}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Earnings Section */}
        <div className="bg-secondary/30 rounded-3xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                <Wallet className="w-4 h-4" />
                Earning Potential
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                See What You Could Earn
              </h3>
              <p className="text-muted-foreground mb-6">
                Our top providers earn significant income working on their own terms. Earnings vary based on your service category, experience, and availability.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background rounded-xl p-4 border border-border">
                  <Clock className="w-5 h-5 text-accent mb-2" />
                  <div className="text-2xl font-bold text-foreground">15 hrs</div>
                  <div className="text-sm text-muted-foreground">Avg. weekly hours</div>
                </div>
                <div className="bg-background rounded-xl p-4 border border-border">
                  <Globe className="w-5 h-5 text-accent mb-2" />
                  <div className="text-2xl font-bold text-foreground">81</div>
                  <div className="text-sm text-muted-foreground">Provinces covered</div>
                </div>
              </div>
            </div>

            {/* Earnings Table */}
            <div className="bg-background rounded-2xl border border-border overflow-hidden">
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 border-b border-border text-sm font-medium text-foreground">
                <div>Service Category</div>
                <div>Avg. Monthly</div>
                <div>Top Earners</div>
              </div>
              <div className="divide-y divide-border">
                {earningsData.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 p-4 text-sm hover:bg-muted/30 transition-colors">
                    <div className="font-medium text-foreground">{item.category}</div>
                    <div className="text-muted-foreground">{item.avgMonthly}</div>
                    <div className="text-accent font-medium">{item.topEarners}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
