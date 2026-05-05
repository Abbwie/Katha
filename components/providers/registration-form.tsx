'use client';

import { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Upload, Building2, User, Briefcase, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProviderRegistrationFormProps {
  onClose: () => void;
}

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Business Details', icon: Building2 },
  { id: 3, title: 'Services', icon: Briefcase },
  { id: 4, title: 'Payment', icon: CreditCard },
];

const serviceCategories = [
  { id: 'printing', label: '3D Printing' },
  { id: 'pcb', label: 'PCB Fabrication' },
  { id: 'cad', label: 'CAD Design' },
  { id: 'laser', label: 'Laser Services' },
  { id: 'machining', label: 'CNC Machining' },
  { id: 'assembly', label: 'Electronics Assembly' },
];

export function ProviderRegistrationForm({ onClose }: ProviderRegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    location: '',
    description: '',
    services: [] as string[],
    paymentMethod: '',
    accountNumber: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleService = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((s) => s !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    // In a real app, this would submit the form data
    alert('Registration submitted! Our team will review your application within 2-3 business days.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Become a Provider</h2>
            <p className="text-sm text-muted-foreground">Step {currentStep} of 4</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    currentStep >= step.id
                      ? 'bg-accent border-accent text-accent-foreground'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden sm:block w-16 lg:w-24 h-0.5 mx-2 ${
                      currentStep > step.id ? 'bg-accent' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="hidden sm:flex justify-between mt-2">
            {steps.map((step) => (
              <span
                key={step.id}
                className={`text-xs ${
                  currentStep >= step.id ? 'text-foreground font-medium' : 'text-muted-foreground'
                }`}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 280px)' }}>
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    First Name *
                  </label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Juan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Last Name *
                  </label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Dela Cruz"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Email Address *
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="juan@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Phone Number *
                </label>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+63 917 123 4567"
                />
              </div>
            </div>
          )}

          {/* Step 2: Business Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Business Details</h3>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Business Name *
                </label>
                <Input
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Your Business or Shop Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Business Type *
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                >
                  <option value="">Select type...</option>
                  <option value="sole">Sole Proprietorship (DTI)</option>
                  <option value="partnership">Partnership</option>
                  <option value="corporation">Corporation (SEC)</option>
                  <option value="individual">Individual/Freelancer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Location *
                </label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Province"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Business Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground resize-none"
                  placeholder="Tell us about your business, experience, and what makes you unique..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Upload Business Documents
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    DTI/SEC registration, valid ID (PDF, JPG, PNG)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Services */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-2">Service Categories</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select the services you offer. You can add more details later.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {serviceCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleService(category.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      formData.services.includes(category.id)
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <span className="font-medium text-foreground">{category.label}</span>
                    {formData.services.includes(category.id) && (
                      <Check className="w-5 h-5 text-accent" />
                    )}
                  </button>
                ))}
              </div>
              {formData.services.length > 0 && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-2">Selected services:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.services.map((serviceId) => {
                      const service = serviceCategories.find((c) => c.id === serviceId);
                      return (
                        <Badge key={serviceId} variant="secondary">
                          {service?.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="mt-6">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Upload Portfolio (Optional)
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Add photos of your work
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Up to 10 images (JPG, PNG)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-2">Payment Information</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Set up how you&apos;ll receive payments from customers.
              </p>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Preferred Payment Method *
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                >
                  <option value="">Select method...</option>
                  <option value="gcash">GCash</option>
                  <option value="maya">Maya / PayMaya</option>
                  <option value="bank">Bank Transfer (BDO, BPI, etc.)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Account Number / Phone Number *
                </label>
                <Input
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your account or phone number"
                />
              </div>
              <div className="bg-muted/50 rounded-lg p-4 mt-6">
                <h4 className="font-medium text-foreground mb-2">Payment Terms</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>- Payouts are processed daily, Monday to Friday</li>
                  <li>- Minimum payout amount is ₱500</li>
                  <li>- Funds are released 48 hours after customer confirms delivery</li>
                  <li>- Commission rates depend on your chosen plan</li>
                </ul>
              </div>
              <div className="flex items-start gap-3 mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 rounded border-input"
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the{' '}
                  <a href="#" className="text-accent hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-accent hover:underline">
                    Provider Agreement
                  </a>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          {currentStep < 4 ? (
            <Button onClick={nextStep} className="bg-accent hover:bg-accent/90 gap-2">
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-accent hover:bg-accent/90 gap-2">
              Submit Application
              <Check className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
