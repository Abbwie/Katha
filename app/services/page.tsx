'use client';

import { useState, useMemo, useCallback } from 'react';
import { Navbar } from '@/components/marketplace/navbar';
import { ProviderCard } from '@/components/marketplace/provider-card';
import { ProviderListItem } from '@/components/marketplace/provider-list-item';
import { FilterSidebar } from '@/components/marketplace/filter-sidebar';
import { ProviderDetails } from '@/components/marketplace/provider-details';
import { FileUploadModal } from '@/components/marketplace/file-upload-modal';
import { OrderTracker } from '@/components/marketplace/order-tracker';
import { ProviderMap } from '@/components/marketplace/provider-map';
import { Footer } from '@/components/marketplace/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockProviders, mockOrders, Provider } from '@/lib/mock-data';
import {
  Menu,
  X,
  Package,
  Grid3X3,
  List,
  Map,
  Search,
  Heart,
  ArrowUpDown,
} from 'lucide-react';

type ViewMode = 'grid' | 'list' | 'map';
type SortOption = 'rating' | 'price-low' | 'price-high' | 'turnaround' | 'newest';

export default function BrowseServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 5000] as [number, number],
    minRating: 0,
    turnaroundDays: 14,
    verified: false,
  });
  const [orders, setOrders] = useState(mockOrders);

  // Toggle favorite
  const toggleFavorite = useCallback((providerId: string) => {
    setFavorites((prev) =>
      prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId]
    );
  }, []);

  // Filter, sort, and search providers
  const filteredProviders = useMemo(() => {
    let result = mockProviders.filter((provider) => {
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

      // Favorites filter
      const matchesFavorites = !showFavoritesOnly || favorites.includes(provider.id);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesRating &&
        matchesTurnaround &&
        matchesVerified &&
        matchesFavorites
      );
    });

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        result.sort((a, b) => a.priceRange.min - b.priceRange.min);
        break;
      case 'price-high':
        result.sort((a, b) => b.priceRange.min - a.priceRange.min);
        break;
      case 'turnaround':
        result.sort((a, b) => a.turnaroundDays - b.turnaroundDays);
        break;
      case 'newest':
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return result;
  }, [searchQuery, filters, sortBy, showFavoritesOnly, favorites]);

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
    if (!selectedProvider) return;
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

  const handleProviderClick = (provider: Provider) => {
    setSelectedProvider(provider);
    setDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page Header */}
      <div className="bg-primary pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">
            Browse Services
          </h1>
          <p className="text-primary-foreground/80">
            Find the perfect tech service provider for your project
          </p>
        </div>
      </div>

      {/* Search & Controls Bar */}
      <div className="sticky top-16 z-30 bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search services, providers, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Sort */}
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[160px] bg-input border-border">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="turnaround">Fastest Turnaround</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex items-center rounded-lg border border-border overflow-hidden bg-input">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-none px-3 ${
                    viewMode === 'grid'
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-secondary'
                  }`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-none px-3 border-x border-border ${
                    viewMode === 'list'
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-secondary'
                  }`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-none px-3 ${
                    viewMode === 'map'
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-secondary'
                  }`}
                  onClick={() => setViewMode('map')}
                >
                  <Map className="w-4 h-4" />
                </Button>
              </div>

              {/* Favorites Toggle */}
              <Button
                variant={showFavoritesOnly ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              >
                <Heart
                  className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`}
                />
                <span className="hidden sm:inline">
                  Favorites ({favorites.length})
                </span>
              </Button>

              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden gap-2"
                onClick={() => setFilterSidebarOpen(true)}
              >
                <Menu className="w-4 h-4" />
                Filters
              </Button>

              {/* Orders Button */}
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-accent"
                onClick={() => setOrdersOpen(true)}
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Orders ({orders.length})</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-40">
              <FilterSidebar filters={filters} onFiltersChange={setFilters} />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing{' '}
                <span className="font-semibold text-foreground">
                  {filteredProviders.length}
                </span>{' '}
                {filteredProviders.length === 1 ? 'service' : 'services'}
                {showFavoritesOnly && ' in favorites'}
              </p>
            </div>

            {/* Content Views */}
            {viewMode === 'map' ? (
              <div className="h-[600px] rounded-xl overflow-hidden border border-border">
                <ProviderMap
                  providers={filteredProviders}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onProviderClick={handleProviderClick}
                />
              </div>
            ) : filteredProviders.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProviders.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      isFavorite={favorites.includes(provider.id)}
                      onToggleFavorite={() => toggleFavorite(provider.id)}
                      onClick={() => handleProviderClick(provider)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProviders.map((provider) => (
                    <ProviderListItem
                      key={provider.id}
                      provider={provider}
                      isFavorite={favorites.includes(provider.id)}
                      onToggleFavorite={() => toggleFavorite(provider.id)}
                      onClick={() => handleProviderClick(provider)}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Services Found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {showFavoritesOnly
                    ? "You haven't added any favorites yet"
                    : 'Try adjusting your filters or search terms'}
                </p>
                {showFavoritesOnly && (
                  <Button
                    variant="outline"
                    onClick={() => setShowFavoritesOnly(false)}
                  >
                    Browse All Services
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {selectedProvider && (
        <>
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
            providerName={selectedProvider.name}
          />
        </>
      )}

      <OrderTracker
        orders={orders}
        isOpen={ordersOpen}
        onClose={() => setOrdersOpen(false)}
      />

      {/* Mobile Filter Sidebar */}
      {filterSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setFilterSidebarOpen(false)}
          />
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
