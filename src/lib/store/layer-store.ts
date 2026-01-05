import { create } from 'zustand';
import { SITE_CONFIG } from '@/lib/constants/site';

export interface Layer {
    id: string;
    entityId?: string;
    name: string;
    type: 'editor-layer' | 'all-countries' | 'country' | 'all-states' | 'state' | 'all-zipcodes' | 'zipcode';
    geoJsonData: unknown;
    fillColor: string;
    fillOpacity: number;
    borderColor: string;
    borderOpacity: number;
    borderWidth: number;
    borderStyle: 'solid' | 'dashed' | 'dotted';
    visible: boolean;
    bbox?: number[];
    fillImage?: string | null;
}

interface LayerStore {
    layers: Layer[];
    selectedLayerId: string | null;
    isSidebarOpen: boolean;
    addLayer: (layer: Omit<Layer, 'id' | 'visible' | 'fillOpacity' | 'borderOpacity' | 'borderWidth' | 'borderStyle' | 'fillImage'>) => void;
    addLayers: (layers: Omit<Layer, 'id' | 'visible'>[]) => void;
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
        const layerType = (layer.type === 'editor-layer' ? 'country' : layer.type) as keyof typeof SITE_CONFIG.map.layerStyles;
        const style = SITE_CONFIG.map.layerStyles[layerType];
        const id = Math.random().toString(36).substring(7);
        const newLayer: Layer = {
            ...layer,
            ...style,
            id,
            visible: true,
        };
        return {
            layers: [...state.layers, newLayer],
            selectedLayerId: id,
            isSidebarOpen: true,
        };
    }),
    addLayers: (newLayers) => set((state) => {
        const layersWithIds = newLayers.map((layer) => {
            const layerType = (layer.type === 'editor-layer' ? 'country' : layer.type) as keyof typeof SITE_CONFIG.map.layerStyles;
            const style = SITE_CONFIG.map.layerStyles[layerType];
            return {
                ...layer,
                id: Math.random().toString(36).substring(7),
                visible: true,
                fillOpacity: layer.fillOpacity ?? style.fillOpacity,
                borderOpacity: layer.borderOpacity ?? style.borderOpacity,
                borderWidth: layer.borderWidth ?? style.borderWidth,
                borderStyle: layer.borderStyle ?? style.borderStyle,
                fillImage: layer.fillImage ?? style.fillImage,
            };
        });
        return {
            layers: [...state.layers, ...layersWithIds],
            selectedLayerId: layersWithIds.length > 0 ? layersWithIds[0].id : state.selectedLayerId,
            isSidebarOpen: true,
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
