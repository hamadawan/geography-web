import { create } from 'zustand';

export type Option = {
    code: string;
    name: string;
    bbox?: number[];
};

interface SelectionStore {
    selectedCountry: Option | null;
    selectedState: Option | null;
    selectedZip: Option | null;
    setSelectedCountry: (country: Option | null) => void;
    setSelectedState: (state: Option | null) => void;
    setSelectedZip: (zip: Option | null) => void;
}

export const useSelectionStore = create<SelectionStore>((set) => ({
    selectedCountry: null,
    selectedState: null,
    selectedZip: null,
    setSelectedCountry: (country) => set({
        selectedCountry: country,
        selectedState: null,
        selectedZip: null
    }),
    setSelectedState: (state) => set({
        selectedState: state,
        selectedZip: null
    }),
    setSelectedZip: (zip) => set({
        selectedZip: zip
    }),
}));
