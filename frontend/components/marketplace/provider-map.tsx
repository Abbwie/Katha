'use client';

import { useState, useMemo } from 'react';
import { Provider, categoryLabels } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface ProviderMapProps {
  providers: Provider[];
  favorites: string[];
  onToggleFavorite: (providerId: string) => void;
  onProviderClick: (provider: Provider) => void;
}

export function ProviderMap({
  providers,
  favorites,
  onToggleFavorite,
  onProviderClick,
}: ProviderMapProps) {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [hoveredProvider, setHoveredProvider] = useState<string | null>(null);

  // Calculate center and bounds based on providers
  const mapBounds = useMemo(() => {
    if (providers.length === 0) {
      return { minLat: 5, maxLat: 20, minLng: 116, maxLng: 128 };
    }
    const lats = providers.map((p) => p.coordinates.lat);
    const lngs = providers.map((p) => p.coordinates.lng);
    const padding = 2;
    return {
      minLat: Math.min(...lats) - padding,
      maxLat: Math.max(...lats) + padding,
      minLng: Math.min(...lngs) - padding,
      maxLng: Math.max(...lngs) + padding,
    };
  }, [providers]);

  // Convert lat/lng to pixel position
  const getPosition = (lat: number, lng: number) => {
    const x =
      ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
    const y =
      ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return { x, y };
  };

  // Group providers by approximate location to handle overlapping markers
  const groupedProviders = useMemo(() => {
    const groups: { [key: string]: Provider[] } = {};
    providers.forEach((provider) => {
      const key = `${Math.round(provider.coordinates.lat * 10)}_${Math.round(
        provider.coordinates.lng * 10
      )}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(provider);
    });
    return groups;
  }, [providers]);

  const handleMarkerClick = (provider: Provider) => {
    setSelectedProvider(provider);
  };

  const navigateProviders = (direction: 'prev' | 'next') => {
    if (!selectedProvider) return;
    const currentIndex = providers.findIndex((p) => p.id === selectedProvider.id);
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : providers.length - 1;
    } else {
      newIndex = currentIndex < providers.length - 1 ? currentIndex + 1 : 0;
    }
    setSelectedProvider(providers[newIndex]);
  };

  return (
    <div className="relative w-full h-full bg-secondary overflow-hidden">
      {/* Map Background - Simple Philippines outline visualization */}
      <div className="absolute inset-0">
        {/* Water background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#cce7f5] to-[#b8dff0]" />

        {/* Simple land masses representation */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Luzon (approximate) */}
          <ellipse
            cx="55"
            cy="25"
            rx="15"
            ry="20"
            fill="#e8f1e8"
            stroke="#c5d5c5"
            strokeWidth="0.5"
          />
          {/* Visayas (approximate) */}
          <ellipse
            cx="50"
            cy="55"
            rx="18"
            ry="8"
            fill="#e8f1e8"
            stroke="#c5d5c5"
            strokeWidth="0.5"
          />
          {/* Mindanao (approximate) */}
          <ellipse
            cx="55"
            cy="78"
            rx="16"
            ry="14"
            fill="#e8f1e8"
            stroke="#c5d5c5"
            strokeWidth="0.5"
          />
        </svg>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)',
            backgroundSize: '10% 10%',
          }}
        />
      </div>

      {/* Provider Markers */}
      {providers.map((provider) => {
        const pos = getPosition(provider.coordinates.lat, provider.coordinates.lng);
        const isSelected = selectedProvider?.id === provider.id;
        const isHovered = hoveredProvider === provider.id;
        const isFavorite = favorites.includes(provider.id);

        return (
          <button
            key={provider.id}
            className={`absolute z-10 transform -translate-x-1/2 -translate-y-full transition-all duration-200 cursor-pointer ${
              isSelected || isHovered ? 'z-20 scale-125' : 'hover:scale-110'
            }`}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            onClick={() => handleMarkerClick(provider)}
            onMouseEnter={() => setHoveredProvider(provider.id)}
            onMouseLeave={() => setHoveredProvider(null)}
          >
            {/* Marker Pin */}
            <div className="relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                  isSelected
                    ? 'bg-accent text-accent-foreground'
                    : isFavorite
                    ? 'bg-destructive text-destructive-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                <MapPin className="w-4 h-4" />
              </div>
              {/* Pin tail */}
              <div
                className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent ${
                  isSelected
                    ? 'border-t-accent'
                    : isFavorite
                    ? 'border-t-destructive'
                    : 'border-t-primary'
                }`}
              />

              {/* Hover tooltip */}
              {isHovered && !isSelected && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-card border border-border rounded-lg shadow-lg whitespace-nowrap">
                  <p className="text-sm font-medium text-foreground">
                    {provider.name}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 fill-accent text-accent" />
                    {provider.rating}
                  </div>
                </div>
              )}
            </div>
          </button>
        );
      })}

      {/* Selected Provider Card */}
      {selectedProvider && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-30">
          <Card className="overflow-hidden bg-card border border-border shadow-xl">
            {/* Navigation */}
            {providers.length > 1 && (
              <div className="absolute top-2 left-2 right-2 flex justify-between z-10">
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateProviders('prev');
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateProviders('next');
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedProvider(null)}
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Image */}
            <div className="relative h-32 overflow-hidden bg-muted">
              <Image
                src={selectedProvider.image}
                alt={selectedProvider.name}
                fill
                className="object-cover"
              />
              {/* Favorite Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background rounded-full w-8 h-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(selectedProvider.id);
                }}
              >
                <Heart
                  className={`w-4 h-4 ${
                    favorites.includes(selectedProvider.id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-muted-foreground'
                  }`}
                />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-foreground">
                  {selectedProvider.name}
                </h3>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="font-medium">{selectedProvider.rating}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                <MapPin className="w-3 h-3" />
                {selectedProvider.location}
              </p>

              <Badge
                variant="secondary"
                className="text-xs mb-3 bg-secondary text-secondary-foreground"
              >
                {categoryLabels[selectedProvider.category]}
              </Badge>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="text-sm font-semibold text-foreground">
                    ₱{selectedProvider.priceRange.min}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => onProviderClick(selectedProvider)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <h4 className="text-xs font-semibold text-foreground mb-2">Legend</h4>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Provider</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Favorite</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span>Selected</span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t border-border">
          {providers.length} providers shown
        </p>
      </div>
    </div>
  );
}
