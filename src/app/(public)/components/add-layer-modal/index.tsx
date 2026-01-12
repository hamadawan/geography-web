'use client';

import { useEffect, useRef, useState } from 'react';
import { useAddLayer } from './use-add-layer';
import { BreadcrumbNav } from './breadcrumb-nav';
import { RegionCard } from './region-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { useLayerStore } from '@/lib/store/layer-store';
import { MapLoading } from '@/components/map-loading';
import { RegionCardSkeleton } from './region-card-skeleton';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

interface AddLayerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


export const AddLayerModal = ({ open, onOpenChange }: AddLayerModalProps) => {
  const {
    currentLevel,
    breadcrumbs,
    navigateToBreadcrumb,
    selectedCountry,
    selectedState,
    selectedZipcode,
    currentSelection,
    handleSelectItem,
    currentItems,
    searchQuery,
    setSearchQuery,
    isLoading,
    isCountriesLoading,
    hasMoreZipcodes,
    fetchNextZipcodes,
    resetModal,
  } = useAddLayer();

  const { fetchAndAddLayer } = useLayerStore();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isAddingLayer, setIsAddingLayer] = useState(false);

  const observerTarget = useIntersectionObserver({
    onIntersect: fetchNextZipcodes,
    enabled: hasMoreZipcodes && !isLoading && currentLevel === 'state',
  });

  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [open, currentLevel]);

  const handleClose = () => {
    resetModal();
    onOpenChange(false);
  };

  const handleAddLayer = async () => {
    if (!selectedCountry) {
      alert('Please select a country');
      return;
    }

    setIsAddingLayer(true);

    try {
      let layerType: 'country' | 'state' | 'zipcode' = 'country';
      let regionCode = selectedCountry.code;
      let regionName = selectedCountry.name;
      let bbox = selectedCountry.bbox;

      if (selectedZipcode) {
        layerType = 'zipcode';
        regionCode = selectedZipcode.code;
        regionName = selectedZipcode.code;
        bbox = selectedZipcode.bbox;
      } else if (selectedState) {
        layerType = 'state';
        regionCode = selectedState.code;
        regionName = selectedState.name;
        bbox = selectedState.bbox;
      }

      await fetchAndAddLayer(layerType, regionCode, regionName, bbox);
      handleClose();
    } catch (error) {
      console.error('Error adding layer:', error);
      alert('Failed to add layer. Please try again.');
    } finally {
      setIsAddingLayer(false);
    }
  };

  const canAddLayer = !!selectedCountry;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={handleClose}
      />

      <div className="relative flex flex-col bg-background border border-border rounded-2xl shadow-2xl h-[85vh] w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-8 py-4 flex items-center justify-between border-b border-border/50">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Add Geographic Layer</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Select a region to add it as a new layer on your map.</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
          >
            ✕
          </button>
        </div>

        {/* Breadcrumbs / Navigation */}
        {selectedCountry && (
          <div className="p-2 bg-muted border-b border-border/50">
            <BreadcrumbNav
              items={breadcrumbs}
              onNavigate={navigateToBreadcrumb}
              currentLevel={currentLevel}
            />
          </div>
        )}

        {/* Search Bar */}
        <div className="px-8 py-4 flex items-center gap-4 bg-muted/50 border-b border-border/50">
          <div className="relative flex-1 max-w-md">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder={`Search ${currentLevel === 'world'
                ? 'countries'
                : currentLevel === 'country'
                  ? 'states'
                  : 'zipcodes'
                }...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 h-11 bg-background border-border focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl"
            />
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>
                {currentLevel === 'country'
                  ? 'Loading states...'
                  : currentLevel === 'state'
                    ? 'Loading zipcodes...'
                    : 'Loading...'}
              </span>
            </div>
          )}
        </div>

        {/* Grid View */}
        <div className="flex-1 overflow-auto px-8 py-6">
          {(isLoading || isCountriesLoading) && currentItems.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <RegionCardSkeleton key={i} />
              ))}
            </div>
          ) : currentItems.length === 0 && !isLoading && !isCountriesLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MapLoading
                showIcon={false}
                text={
                  searchQuery.trim()
                    ? "No results found"
                    : currentLevel === 'country'
                      ? "No states found"
                      : currentLevel === 'state'
                        ? "No zip codes found"
                        : "No regions found"
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentItems.map((item) => (
                <RegionCard
                  key={item.code}
                  item={item}
                  isSelected={currentSelection?.code === item.code}
                  onClick={handleSelectItem}
                />
              ))}

              {/* Infinite Scroll Sentinel */}
              {currentLevel === 'state' && (
                <div ref={observerTarget} className="col-span-full py-2 flex flex-col items-center justify-center w-full gap-4">
                  {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <RegionCardSkeleton key={`more-loading-${i}`} />
                      ))}
                    </div>
                  )}
                  {!hasMoreZipcodes && currentItems.length > 0 && (
                    <div className="py-8 text-center text-muted-foreground border-t border-border/50 w-full">
                      <p className="text-sm font-medium">No more zip codes available</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 flex items-center justify-between gap-4 border-t border-border bg-muted/50">
          <Button
            variant="ghost"
            onClick={() => {
              if (currentLevel !== 'world') {
                navigateToBreadcrumb(
                  currentLevel === 'state'
                    ? 'country'
                    : currentLevel === 'country'
                      ? 'world'
                      : 'world'
                );
              } else {
                handleClose();
              }
            }}
            className="gap-2 rounded-xl h-11 px-6 hover:bg-muted"
            disabled={isAddingLayer}
          >
            <ArrowLeft className="h-4 w-4" />
            {currentLevel === 'world' ? 'Cancel' : 'Back'}
          </Button>

          <div className="flex items-center gap-3">
            {currentSelection && (
              <div className="hidden md:block text-right mr-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Selected</p>
                <p className="text-sm font-medium truncate max-w-[200px]">{currentSelection.name}</p>
              </div>
            )}
            <Button
              onClick={handleAddLayer}
              disabled={!canAddLayer || isAddingLayer}
              className="gap-2 rounded-xl h-11 px-8 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isAddingLayer ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding Layer...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add {selectedZipcode ? 'Zipcode' : selectedState ? 'State' : 'Country'} Layer
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
