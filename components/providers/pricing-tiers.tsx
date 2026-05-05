'use client';

import { Check, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PricingTiersProps {
  onSelectPlan: () => void;
}

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for getting started',
    price: 'Free',
    priceDetail: 'No monthly fees',
    commission: '15%',
    features: [
      'List up to 5 services',
      'Basic analytics dashboard',
      'Standard customer support',
      'Payment processing',
      'Customer messaging',
    ],
    notIncluded: [
      'Priority listing',
      'Advanced analytics',
      'Dedicated account manager',
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'For growing businesses',
    price: '₱999',
    priceDetail: 'per month',
    commission: '10%',
    features: [
      'Unlimited services',
      'Advanced analytics & insights',
      'Priority customer support',
      'Payment processing',
      'Customer messaging',
      'Priority search listing',
      'Promotional badges',
      'Export reports',
    ],
    notIncluded: [
      'Dedicated account manager',
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For high-volume providers',
    price: '₱2,499',
    priceDetail: 'per month',
    commission: '7%',
    features: [
      'Everything in Professional',
      'Lowest commission rate',
      'Dedicated account manager',
      'Custom branding options',
      'API access',
      'Team member accounts',
      'Priority payouts (same day)',
      'Featured placement',
    ],
    notIncluded: [],
    cta: 'Contact Sales',
    popular: false,
  },
];

export function PricingTiers({ onSelectPlan }: PricingTiersProps) {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your business. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative p-6 lg:p-8 flex flex-col ${
                plan.popular
                  ? 'border-accent shadow-lg ring-2 ring-accent/20'
                  : 'border-border'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.priceDetail !== 'No monthly fees' && (
                    <span className="text-muted-foreground">/{plan.priceDetail.replace('per ', '')}</span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Platform commission:</span>
                  <Badge variant="secondary" className="font-semibold">{plan.commission}</Badge>
                </div>
              </div>

              <div className="flex-1 mb-6">
                <div className="text-sm font-medium text-foreground mb-3">What&apos;s included:</div>
                <ul className="space-y-2.5">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={onSelectPlan}
                variant={plan.popular ? 'default' : 'outline'}
                className={`w-full rounded-full ${
                  plan.popular
                    ? 'bg-accent hover:bg-accent/90 text-accent-foreground'
                    : ''
                }`}
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            All plans include secure payment processing, fraud protection, and 24/7 platform access.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Check className="w-4 h-4 text-accent" />
              No setup fees
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Check className="w-4 h-4 text-accent" />
              Cancel anytime
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Check className="w-4 h-4 text-accent" />
              14-day free trial on paid plans
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
