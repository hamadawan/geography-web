/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useList as useCountryList } from '@/lib/api-client/country';
import { useList as useStateList } from '@/lib/api-client/state';
import { useList as usePostalCodeList } from '@/lib/api-client/postal-code';
import { useSelectionStore, Option } from '@/lib/store/selection-store';

export type NavigationLevel = 'country' | 'state' | 'zipcode';

export interface BreadcrumbItem {
  level: NavigationLevel | 'world';
  label: string;
  data?: Option;
}

export const useAddLayer = () => {
  const {
    countries,
    states,
    zipcodes,
    zipcodePage,
    hasMoreZipcodes,
    setStates,
    setZipcodes,
    setZipcodePage,
    setHasMoreZipcodes,
    selectedCountry: storeSelectedCountry,
    selectedState: storeSelectedState,
    selectedZip: storeSelectedZip,
    setSelectedCountry,
    setSelectedState,
    setSelectedZip,
  } = useSelectionStore();

  const [currentLevel, setCurrentLevel] = useState<NavigationLevel | 'world'>('world');
  const [searchQuery, setSearchQuery] = useState('');

  const { isLoading: isCountriesLoading } = useCountryList({
    paginate: false,
  });

  const { data: statesData, isLoading: isStatesLoading } = useStateList({
    country: storeSelectedCountry?.code,
    paginate: false,
  });

  useEffect(() => {
    if (statesData?.states) {
      setStates(statesData.states);
    }
  }, [statesData, setStates]);

  const { data: zipcodesData, isLoading: isZipcodesLoading } = usePostalCodeList({
    state: storeSelectedState?.code,
    page: zipcodePage,
    limit: 50,
    paginate: true,
    search: searchQuery,
  });

  useEffect(() => {
    if (zipcodesData?.postalCodes) {
      const isFirstPage = zipcodePage === 1;
      setZipcodes(zipcodesData.postalCodes, !isFirstPage);

      const currentTotal = (zipcodePage - 1) * 50 + zipcodesData.postalCodes.length;
      setHasMoreZipcodes(currentTotal < zipcodesData.total);
    }
  }, [zipcodesData, zipcodePage, setZipcodes, setHasMoreZipcodes]);

  const fetchNextZipcodes = useCallback(() => {
    if (hasMoreZipcodes && !isZipcodesLoading) {
      setZipcodePage(zipcodePage + 1);
    }
  }, [hasMoreZipcodes, isZipcodesLoading, zipcodePage, setZipcodePage]);

  // Get current items and filter by search
  const currentItems = useMemo(() => {
    let items: Option[] = [];

    switch (currentLevel) {
      case 'world':
        items = countries || [];
        break;
      case 'country':
        items = states || [];
        break;
      case 'state':
        items = zipcodes || [];
        break;
    }

    if (!searchQuery.trim() || currentLevel === 'state') {
      return items;
    }

    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query)
    );
  }, [currentLevel, countries, states, zipcodes, searchQuery]);

  // Build breadcrumb path
  const breadcrumbs = useMemo((): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [{ level: 'world', label: 'World' }];

    if (storeSelectedCountry) {
      items.push({
        level: 'country',
        label: storeSelectedCountry.name,
        data: storeSelectedCountry,
      });
    }

    if (storeSelectedState) {
      items.push({
        level: 'state',
        label: storeSelectedState.name,
        data: storeSelectedState,
      });
    }

    return items;
  }, [storeSelectedCountry, storeSelectedState]);

  // Navigate to level by clicking breadcrumb
  const navigateToBreadcrumb = useCallback(
    (level: NavigationLevel | 'world') => {
      setSearchQuery('');

      switch (level) {
        case 'world':
          setCurrentLevel('world');
          setSelectedCountry(null);
          break;
        case 'country':
          setCurrentLevel('country');
          setSelectedState(null);
          break;
        case 'state':
          setCurrentLevel('state');
          setSelectedZip(null);
          break;
      }
    },
    [setSelectedCountry, setSelectedState, setSelectedZip]
  );

  // Handle item selection and drill down
  const handleSelectItem = useCallback((item: Option) => {
    setSearchQuery('');

    switch (currentLevel) {
      case 'world':
        setSelectedCountry(item);
        setCurrentLevel('country');
        break;
      case 'country':
        setSelectedState(item);
        setCurrentLevel('state');
        break;
      case 'state':
        setSelectedZip(item);
        break;
    }
  }, [currentLevel, setSelectedCountry, setSelectedState, setSelectedZip]);

  // Get currently selected item for the current level
  const currentSelection = useMemo(() => {
    switch (currentLevel) {
      case 'world':
        return storeSelectedCountry;
      case 'country':
        return storeSelectedState;
      case 'state':
        return storeSelectedZip;
    }
  }, [currentLevel, storeSelectedCountry, storeSelectedState, storeSelectedZip]);

  // Generate layer name based on current selection
  const generateLayerName = useCallback((): string => {
    const parts: string[] = [];

    if (storeSelectedCountry) {
      parts.push(storeSelectedCountry.name);
    }

    if (storeSelectedState) {
      parts.push(storeSelectedState.name);
    }

    if (storeSelectedZip) {
      parts.push(storeSelectedZip.name);
    }

    return parts.length > 0 ? parts.join(' – ') : 'New Layer';
  }, [storeSelectedCountry, storeSelectedState, storeSelectedZip]);

  // Reset modal state
  const resetModal = useCallback(() => {
    setCurrentLevel('world');
    setSelectedCountry(null);
    setSearchQuery('');
  }, [setSelectedCountry]);

  return {
    // Navigation
    currentLevel,
    breadcrumbs,
    navigateToBreadcrumb,

    // Selection
    selectedCountry: storeSelectedCountry,
    selectedState: storeSelectedState,
    selectedZipcode: storeSelectedZip,
    currentSelection,
    handleSelectItem,

    // Display
    currentItems,
    searchQuery,
    setSearchQuery,
    isLoading: isCountriesLoading || isStatesLoading || isZipcodesLoading,
    isCountriesLoading,

    // Actions
    generateLayerName,
    fetchNextZipcodes,
    hasMoreZipcodes,
    resetModal,
  };
};
