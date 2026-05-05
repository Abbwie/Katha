'use client';

import { Provider } from '@/lib/mock-data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import Image from 'next/image';

interface ProviderDetailsProps {
  provider: Provider | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestQuote: (providerId: string) => void;
}

export function ProviderDetails({
  provider,
  isOpen,
  onClose,
  onRequestQuote,
}: ProviderDetailsProps) {
  if (!provider) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        {/* Hero Image */}
        <div className="relative h-64 -m-6 mb-6">
          <Image
            src={provider.image}
            alt={provider.name}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">{provider.name}</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {provider.location}
                </p>
              </div>
              {provider.verified && (
                <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0" />
              )}
            </div>
          </div>

          {/* Rating & Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-secondary rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Rating</p>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="text-lg font-bold text-foreground">
                  {provider.rating}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {provider.reviewCount} reviews
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Response Time</p>
              <p className="text-lg font-bold text-foreground">{provider.responseTime}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Turnaround</p>
              <p className="text-lg font-bold text-accent">{provider.turnaroundDays} days</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">About</h3>
            <p className="text-sm text-foreground/80">{provider.description}</p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Services Offered</h3>
            <div className="grid grid-cols-2 gap-2">
              {provider.services.map((service) => (
                <div
                  key={service}
                  className="flex items-center gap-2 p-3 bg-secondary rounded-lg"
                >
                  <ChevronRight className="w-4 h-4 text-accent flex-shrink-0" />
                  <span className="text-sm text-foreground">{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Price Range</p>
              <p className="text-xl font-bold text-foreground">
                ₱{provider.priceRange.min} - ₱{provider.priceRange.max}
              </p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Verification Status</p>
              <Badge
                variant={provider.verified ? 'default' : 'secondary'}
                className="mt-1"
              >
                {provider.verified ? '✓ Verified' : 'Pending'}
              </Badge>
            </div>
          </div>

          {/* Reviews Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Recent Reviews</h3>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-3 bg-secondary rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className="w-3 h-3 fill-accent text-accent"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">2 weeks ago</span>
                  </div>
                  <p className="text-sm text-foreground/80">
                    Excellent quality work and fast turnaround. Highly recommended!
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              className="flex-1 rounded-lg h-10 gap-2"
              onClick={onClose}
            >
              <MessageSquare className="w-4 h-4" />
              Contact
            </Button>
            <Button
              className="flex-1 rounded-lg h-10 bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => {
                onRequestQuote(provider.id);
                onClose();
              }}
            >
              Request Quote
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
