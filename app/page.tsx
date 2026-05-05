'use client';

import { useState, useMemo } from 'react';
import { Navbar } from '@/components/marketplace/navbar';
import { HeroSearch } from '@/components/marketplace/hero-search';
import { ProviderCard } from '@/components/marketplace/provider-card';
import { FilterSidebar } from '@/components/marketplace/filter-sidebar';
import { ProviderDetails } from '@/components/marketplace/provider-details';
import { FileUploadModal } from '@/components/marketplace/file-upload-modal';
import { OrderTracker } from '@/components/marketplace/order-tracker';
import { BenefitsSection } from '@/components/marketplace/benefits-section';
import { ImpactSection } from '@/components/marketplace/impact-section';
import { Footer } from '@/components/marketplace/footer';
import { Button } from '@/components/ui/button';
import { mockProviders, mockOrders } from '@/lib/mock-data';
import { Menu, X, Package } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(mockProviders[0]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 5000] as [number, number],
    minRating: 0,
    turnaroundDays: 14,
    verified: false,
  });
  const [orders, setOrders] = useState(mockOrders);

  // Filter and search providers
  const filteredProviders = useMemo(() => {
    return mockProviders.filter((provider) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        provider.name.toLowerCase().includes(searchLower) ||
        provider.services.some((s) => s.toLowerCase().includes(searchLower)) ||
        provider.location.toLowerCase().includes(searchLower);

      // Category filter
      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(provider.category);

      // Price filter
      const matchesPrice =
        provider.priceRange.min >= filters.priceRange[0] &&
        provider.priceRange.min <= filters.priceRange[1];

      // Rating filter
      const matchesRating = provider.rating >= filters.minRating;

      // Turnaround filter
      const matchesTurnaround = provider.turnaroundDays <= filters.turnaroundDays;

      // Verified filter
      const matchesVerified = !filters.verified || provider.verified;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesRating &&
        matchesTurnaround &&
        matchesVerified
      );
    });
  }, [searchQuery, filters]);

  const handleRequestQuote = (providerId: string) => {
    const provider = mockProviders.find((p) => p.id === providerId);
    if (provider) {
      setSelectedProvider(provider);
      setUploadOpen(true);
    }
  };

  const handleSubmitQuote = (data: {
    files: string[];
    specifications: string;
    budget?: number;
    turnaroundRequest?: number;
  }) => {
    const newOrder = {
      id: `order-${Date.now()}`,
      providerId: selectedProvider.id,
      status: 'quote-requested' as const,
      files: data.files,
      specifications: data.specifications,
      budget: data.budget,
      turnaroundRequest: data.turnaroundRequest,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrders([...orders, newOrder]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero & Search */}
      <HeroSearch searchQuery={searchQuery} onSearch={setSearchQuery} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          </div>

          {/* Main Grid */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <Button
                variant="outline"
                className="w-full rounded-lg gap-2"
                onClick={() => setFilterSidebarOpen(true)}
              >
                <Menu className="w-4 h-4" />
                Filters
              </Button>
            </div>

            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {filteredProviders.length} Services Found
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-accent"
                onClick={() => setOrdersOpen(true)}
              >
                <Package className="w-4 h-4" />
                Orders ({orders.length})
              </Button>
            </div>

            {/* Provider Grid */}
            {filteredProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    onClick={() => {
                      setSelectedProvider(provider);
                      setDetailsOpen(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Services Found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Benefits & Impact Sections */}
      <BenefitsSection />
      <ImpactSection />

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ProviderDetails
        provider={selectedProvider}
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onRequestQuote={handleRequestQuote}
      />

      <FileUploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSubmit={handleSubmitQuote}
        providerName={selectedProvider?.name}
      />

      <OrderTracker
        orders={orders}
        isOpen={ordersOpen}
        onClose={() => setOrdersOpen(false)}
      />

      {/* Mobile Filter Sidebar */}
      {filterSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setFilterSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-background border-r border-border overflow-y-auto">
            <div className="p-4 flex justify-between items-center border-b border-border">
              <h3 className="font-semibold text-foreground">Filters</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFilterSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4">
              <FilterSidebar
                filters={filters}
                onFiltersChange={setFilters}
                onClose={() => setFilterSidebarOpen(false)}
                isMobile
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
