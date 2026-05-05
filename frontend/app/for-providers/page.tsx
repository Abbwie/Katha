'use client';

import { useState } from 'react';
import { Navbar } from '@/components/marketplace/navbar';
import { Footer } from '@/components/marketplace/footer';
import { ProviderHero } from '@/components/providers/provider-hero';
import { BenefitsEarnings } from '@/components/providers/benefits-earnings';
import { PricingTiers } from '@/components/providers/pricing-tiers';
import { DashboardPreview } from '@/components/providers/dashboard-preview';
import { ProviderFAQ } from '@/components/providers/provider-faq';
import { ProviderRegistrationForm } from '@/components/providers/registration-form';

export default function ForProvidersPage() {
  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <ProviderHero onGetStarted={() => setShowRegistration(true)} />
        
        {/* Benefits and Earnings */}
        <BenefitsEarnings />
        
        {/* Dashboard Preview */}
        <DashboardPreview />
        
        {/* Pricing Tiers */}
        <PricingTiers onSelectPlan={() => setShowRegistration(true)} />
        
        {/* FAQ Section */}
        <ProviderFAQ />
      </main>
      
      <Footer />
      
      {/* Registration Modal */}
      {showRegistration && (
        <ProviderRegistrationForm onClose={() => setShowRegistration(false)} />
      )}
    </div>
  );
}
