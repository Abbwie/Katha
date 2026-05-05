'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { categoryLabels } from '@/lib/mock-data';

interface FilterSidebarProps {
  filters: {
    categories: string[];
    priceRange: [number, number];
    minRating: number;
    turnaroundDays: number;
    verified: boolean;
  };
  onFiltersChange: (filters: FilterSidebarProps['filters']) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export function FilterSidebar({
  filters,
  onFiltersChange,
  onClose,
  isMobile = false,
}: FilterSidebarProps) {
  const handleCategoryChange = (category: string) => {
    const updatedCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: updatedCategories });
  };

  const handlePriceChange = (value: [number, number]) => {
    onFiltersChange({ ...filters, priceRange: value });
  };

  const handleRatingChange = (value: number) => {
    onFiltersChange({ ...filters, minRating: value });
  };

  const handleTurnaroundChange = (value: number) => {
    onFiltersChange({ ...filters, turnaroundDays: value });
  };

  const handleVerifiedChange = (checked: boolean) => {
    onFiltersChange({ ...filters, verified: checked });
  };

  const handleReset = () => {
    onFiltersChange({
      categories: [],
      priceRange: [0, 5000],
      minRating: 0,
      turnaroundDays: 14,
      verified: false,
    });
  };

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Service Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Service Type</Label>
        <div className="space-y-2">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <Checkbox
                id={key}
                checked={filters.categories.includes(key)}
                onCheckedChange={() => handleCategoryChange(key)}
              />
              <label
                htmlFor={key}
                className="text-sm text-foreground/80 cursor-pointer"
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Price Range</Label>
        <Slider
          min={0}
          max={5000}
          step={50}
          value={filters.priceRange}
          onValueChange={handlePriceChange}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>₱{filters.priceRange[0]}</span>
          <span>₱{filters.priceRange[1]}</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Minimum Rating</Label>
        <Slider
          min={0}
          max={5}
          step={0.5}
          value={[filters.minRating]}
          onValueChange={(value) => handleRatingChange(value[0])}
          className="w-full"
        />
        <div className="text-xs text-muted-foreground">
          {filters.minRating > 0 ? `${filters.minRating}★ and up` : 'All ratings'}
        </div>
      </div>

      {/* Turnaround Time */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Max Turnaround</Label>
        <Slider
          min={1}
          max={14}
          step={1}
          value={[filters.turnaroundDays]}
          onValueChange={(value) => handleTurnaroundChange(value[0])}
          className="w-full"
        />
        <div className="text-xs text-muted-foreground">
          {filters.turnaroundDays} {filters.turnaroundDays === 1 ? 'day' : 'days'} or less
        </div>
      </div>

      {/* Verified Only */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="verified"
          checked={filters.verified}
          onCheckedChange={handleVerifiedChange}
        />
        <label
          htmlFor="verified"
          className="text-sm text-foreground/80 cursor-pointer"
        >
          Verified Providers Only
        </label>
      </div>

      {/* Reset Button */}
      <Button
        variant="outline"
        className="w-full rounded-lg"
        onClick={handleReset}
      >
        Reset Filters
      </Button>
    </div>
  );
}
