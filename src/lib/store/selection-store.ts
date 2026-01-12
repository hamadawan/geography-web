import { create } from 'zustand';

export type Option = {
    code: string;
    name: string;
    bbox?: number[];
};

export type LayerType = 'all-countries' | 'country' | 'all-states' | 'state' | 'all-zipcodes' | 'zipcode';

interface SelectionStore {
    selectedCountry: Option | null;
    selectedState: Option | null;
    selectedZip: Option | null;
    currentItems: any[];
    layerType: LayerType;

    // Data lists
    countries: Option[];
    states: Option[];
    zipcodes: Option[];
    zipcodePage: number;
    hasMoreZipcodes: boolean;

    setSelectedCountry: (country: Option | null) => void;
    setSelectedState: (state: Option | null) => void;
    setSelectedZip: (zip: Option | null) => void;
    setLayerType: (type: LayerType) => void;

    // Data actions
    setCountries: (countries: Option[]) => void;
    setStates: (states: Option[]) => void;
    setZipcodes: (zipcodes: Option[], append?: boolean) => void;
    setZipcodePage: (page: number) => void;
    setHasMoreZipcodes: (hasMore: boolean) => void;
}

export const useSelectionStore = create<SelectionStore>((set) => ({
    selectedCountry: null,
    selectedState: null,
    selectedZip: null,
    currentItems: [],
    layerType: 'country',

    countries: [],
    states: [],
    zipcodes: [],
    zipcodePage: 1,
    hasMoreZipcodes: true,

    setSelectedCountry: (country) => set({
        selectedCountry: country,
        selectedState: null,
        selectedZip: null,
        layerType: country?.code === 'all' ? 'all-countries' : 'country',
        states: [],
        zipcodes: [],
        zipcodePage: 1,
        hasMoreZipcodes: true,
    }),
    setSelectedState: (state) => set({
        selectedState: state,
        selectedZip: null,
        layerType: state?.code === 'all' ? 'all-states' : 'state',
        zipcodes: [],
        zipcodePage: 1,
        hasMoreZipcodes: true,
    }),
    setSelectedZip: (zip) => set({
        selectedZip: zip,
        layerType: zip?.code === 'all' ? 'all-zipcodes' : 'zipcode'
    }),
    setLayerType: (type) => set({ layerType: type }),

    setCountries: (countries) => set({ countries }),
    setStates: (states) => set({ states }),
    setZipcodes: (zipcodes, append = false) => set((state) => ({
        zipcodes: append ? [...state.zipcodes, ...zipcodes] : zipcodes
    })),
    setZipcodePage: (page) => set({ zipcodePage: page }),
    setHasMoreZipcodes: (hasMore) => set({ hasMoreZipcodes: hasMore }),
}));
