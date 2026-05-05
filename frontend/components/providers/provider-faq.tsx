'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How do I become a provider on Katha?',
    answer: 'Getting started is easy! Click the "Get Started" button, fill out our registration form with your business details, upload your portfolio, and submit for verification. Our team typically reviews applications within 2-3 business days. Once approved, you can start listing your services immediately.',
  },
  {
    question: 'What are the requirements to join?',
    answer: 'To become a Katha provider, you need: a valid Philippine ID, proof of business registration (DTI/SEC), photos of your equipment/workspace, sample work portfolio, and a verified bank account or GCash for payments. For certain categories like PCB fabrication, additional certifications may be required.',
  },
  {
    question: 'How does payment work?',
    answer: 'Customers pay upfront when placing an order. The payment is held securely by Katha until you complete the work. Once the customer confirms delivery or after the automatic release period (48 hours after marked complete), the funds are transferred to your account minus the platform commission. Payouts are processed daily via GCash or bank transfer.',
  },
  {
    question: 'What is the commission structure?',
    answer: 'Our commission depends on your plan: Starter (free) has 15% commission, Professional (₱999/month) has 10% commission, and Enterprise (₱2,499/month) has just 7% commission. The commission is automatically deducted from each transaction. There are no hidden fees.',
  },
  {
    question: 'Can I set my own prices and schedule?',
    answer: 'Absolutely! You have full control over your pricing, service offerings, turnaround times, and availability. You can pause accepting new orders anytime, set vacation mode, or adjust your capacity based on your workload. We believe in giving providers flexibility to run their business their way.',
  },
  {
    question: 'How do I handle disputes with customers?',
    answer: 'If a dispute arises, our dedicated support team will mediate between you and the customer. We review all evidence including chat history, uploaded files, and delivery proofs. Our goal is fair resolution for both parties. Providers with good track records are given benefit of the doubt in ambiguous cases.',
  },
  {
    question: 'What support does Katha provide to providers?',
    answer: 'We offer: 24/7 platform access, email and chat support (priority for Pro/Enterprise), educational resources and webinars, marketing tips to grow your profile, and a dedicated account manager for Enterprise plans. We also run promotional campaigns that feature top providers.',
  },
  {
    question: 'How can I increase my visibility on the platform?',
    answer: 'To rank higher: maintain a quick response time (under 2 hours), complete orders on time, earn positive reviews, keep your profile and portfolio updated, and consider upgrading to Professional or Enterprise for priority listing. Featured providers can earn 3-5x more orders than standard listings.',
  },
];

export function ProviderFAQ() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about becoming a Katha provider
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-background border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Still have questions? We&apos;re here to help.
          </p>
          <Button variant="outline" className="rounded-full">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
}
