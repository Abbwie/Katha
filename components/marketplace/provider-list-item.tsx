'use client';

import { Provider } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, MapPin, CheckCircle2, Heart } from 'lucide-react';
import Image from 'next/image';

interface ProviderListItemProps {
  provider: Provider;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onClick: () => void;
}

export function ProviderListItem({
  provider,
  isFavorite = false,
  onToggleFavorite,
  onClick,
}: ProviderListItemProps) {
  return (
    <Card
      className="overflow-hidden cursor-pointer bg-card border border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0 overflow-hidden bg-muted">
          <Image
            src={provider.image}
            alt={provider.name}
            fill
            className="object-cover"
          />
          {/* Favorite Button */}
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background rounded-full w-8 h-8"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                }`}
              />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground text-lg truncate">
                    {provider.name}
                  </h3>
                  {provider.verified && (
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {provider.location}
                </p>
              </div>

              {/* Rating - Desktop */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="text-sm font-medium text-foreground">
                  {provider.rating}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({provider.reviewCount})
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {provider.description}
            </p>

            {/* Services Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {provider.services.slice(0, 4).map((service) => (
                <Badge
                  key={service}
                  variant="secondary"
                  className="text-xs bg-secondary text-secondary-foreground"
                >
                  {service}
                </Badge>
              ))}
              {provider.services.length > 4 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-secondary text-secondary-foreground"
                >
                  +{provider.services.length - 4}
                </Badge>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-4">
              {/* Rating - Mobile */}
              <div className="flex sm:hidden items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="text-sm font-medium text-foreground">
                  {provider.rating}
                </span>
              </div>

              {/* Price */}
              <div>
                <p className="text-xs text-muted-foreground">Starting at</p>
                <p className="text-sm font-semibold text-foreground">
                  ₱{provider.priceRange.min}
                </p>
              </div>

              {/* Turnaround */}
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Turnaround
                </p>
                <p className="text-sm font-semibold text-accent">
                  {provider.turnaroundDays} days
                </p>
              </div>

              {/* Response Time */}
              <div className="hidden md:block">
                <p className="text-xs text-muted-foreground">Response</p>
                <p className="text-sm font-medium text-foreground">
                  {provider.responseTime}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
