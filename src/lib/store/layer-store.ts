import { create } from 'zustand';

export interface Layer {
    id: string;
    entityId?: string;
    name: string;
    type: 'all-countries' | 'country' | 'all-states' | 'state' | 'all-zipcodes' | 'zipcode';
    geoJsonData: unknown;
    fillColor: string;
    borderColor: string;
    visible: boolean;
    opacity: number;
}

interface LayerStore {
    layers: Layer[];
    selectedLayerId: string | null;
    isSidebarOpen: boolean;
    addLayer: (layer: Omit<Layer, 'id' | 'visible' | 'opacity'>) => void;
    removeLayer: (id: string) => void;
    updateLayer: (id: string, updates: Partial<Layer>) => void;
    setSelectedLayer: (id: string | null) => void;
    toggleVisibility: (id: string) => void;
    toggleSidebar: () => void;
}

export const useLayerStore = create<LayerStore>((set) => ({
    layers: [],
    selectedLayerId: null,
    isSidebarOpen: false,
    addLayer: (layer) => set((state) => {
        const id = Math.random().toString(36).substring(7);
        const newLayer: Layer = {
            ...layer,
            id,
            visible: true,
            opacity: 0.3,
        };
        return {
            layers: [...state.layers, newLayer],
            selectedLayerId: id,
            isSidebarOpen: true, // Open sidebar when a layer is added
        };
    }),
    removeLayer: (id) => set((state) => ({
        layers: state.layers.filter((l) => l.id !== id),
        selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId,
    })),
    updateLayer: (id, updates) => set((state) => ({
        layers: state.layers.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    })),
    setSelectedLayer: (id) => set({ selectedLayerId: id }),
    toggleVisibility: (id) => set((state) => ({
        layers: state.layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)),
    })),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
