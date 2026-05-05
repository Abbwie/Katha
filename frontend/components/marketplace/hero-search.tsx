'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeroSearchProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function HeroSearch({ onSearch, searchQuery }: HeroSearchProps) {
  return (
    <div className="relative bg-gradient-to-br from-primary/5 via-background to-background py-16 px-4 sm:px-6 lg:px-8 border-b border-border">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
            Connect with Filipino Tech
            <span className="block text-accent"> Professionals & Makers</span>
          </h1>
          <p className="text-lg text-muted-foreground text-balance">
            Katha connects you with verified tech makers across the Philippines for 3D printing, PCB fabrication, CAD design, laser cutting, and more.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search providers by name or service..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-12 h-12 rounded-lg bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button
              size="lg"
              className="px-8 h-12 rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="text-sm text-muted-foreground">Popular searches:</span>
          <Link
            href="/services"
            className="text-sm px-3 py-1 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition"
          >
            Browse All
          </Link>
          <button className="text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition">
            3D Printing
          </button>
          <button className="text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition">
            PCB Fabrication
          </button>
          <button className="text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition">
            CAD Design
          </button>
          <button className="text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition">
            Laser Services
          </button>
        </div>
      </div>
    </div>
  );
}
