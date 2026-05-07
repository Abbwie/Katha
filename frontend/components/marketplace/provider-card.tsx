'use client';

import { Provider } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, MapPin, CheckCircle2, Heart } from 'lucide-react';
import Image from 'next/image';

interface ProviderCardProps {
  provider: Provider;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onClick: () => void;
}

export function ProviderCard({
  provider,
  isFavorite = false,
  onToggleFavorite,
  onClick,
}: ProviderCardProps) {
  return (
    <Card
      onClick={onClick}
      className="overflow-hidden cursor-pointer bg-card border border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <Image
          src={provider.image}
          alt={provider.name}
          fill
          className="object-cover hover:scale-110 transition-transform duration-300"
        />
        {/* Favorite Button */}
        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background rounded-full w-8 h-8 z-10"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground'
              }`}
            />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header with Verified Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{provider.name}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {provider.location}
            </p>
          </div>
          {provider.verified && (
            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm font-medium text-foreground">{provider.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({provider.reviewCount} reviews)
          </span>
        </div>

        {/* Services Tags */}
        <div className="flex flex-wrap gap-1">
          {provider.services.slice(0, 2).map((service) => (
            <Badge
              key={service}
              variant="secondary"
              className="text-xs bg-secondary text-secondary-foreground"
            >
              {service}
            </Badge>
          ))}
          {provider.services.length > 2 && (
            <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
              +{provider.services.length - 2}
            </Badge>
          )}
        </div>

        {/* Price & Turnaround */}
        <div className="pt-2 border-t border-border space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-muted-foreground">Price Range</p>
              <p className="text-sm font-semibold text-foreground">
                ₱{provider.priceRange.min} - ₱{provider.priceRange.max}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                <Clock className="w-3 h-3" />
                Turnaround
              </p>
              <p className="text-sm font-semibold text-accent">
                {provider.turnaroundDays}d
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
