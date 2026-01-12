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
    label?: string;
    textSize?: number;
    textColor?: string;
    customLabelStyles?: Record<string, any>;
}

interface LayerStore {
    layers: Layer[];
    selectedLayerId: string | null;
    isSidebarOpen: boolean;
    isAddLayerModalOpen: boolean;
    addLayer: (layer: Omit<Layer, 'id' | 'visible' | 'fillOpacity' | 'borderOpacity' | 'borderWidth' | 'borderStyle' | 'fillImage' | 'label' | 'textSize' | 'textColor' | 'customLabelStyles'>) => void;
    addLayers: (layers: Omit<Layer, 'id' | 'visible'>[]) => void;
    fetchAndAddLayer: (type: 'country' | 'state' | 'zipcode', code: string, name: string, bbox?: number[]) => Promise<void>;
    removeLayer: (id: string) => void;
    updateLayer: (id: string, updates: Partial<Layer>) => void;
    setSelectedLayer: (id: string | null) => void;
    toggleVisibility: (id: string) => void;
    toggleSidebar: () => void;
    setAddLayerModalOpen: (open: boolean) => void;
}

export const useLayerStore = create<LayerStore>((set, get) => ({
    layers: [],
    selectedLayerId: null,
    isSidebarOpen: false,
    isAddLayerModalOpen: false,
    addLayer: (layer) => set((state) => {
        const layerType = (layer.type === 'editor-layer' ? 'country' : layer.type) as keyof typeof SITE_CONFIG.map.layerStyles;
        const style = SITE_CONFIG.map.layerStyles[layerType] || SITE_CONFIG.map.layerStyles.country;
        const id = Math.random().toString(36).substring(7);
        const newLayer: Layer = {
            ...style,
            ...layer,
            id,
            visible: true,
            label: '',
            textSize: 12,
            textColor: '#000000',
            customLabelStyles: {},
        };
        return {
            layers: [newLayer, ...state.layers],
            selectedLayerId: id,
            isSidebarOpen: true,
        };
    }),
    addLayers: (newLayers) => set((state) => {
        const layersWithIds = newLayers.map((layer) => {
            const layerType = (layer.type === 'editor-layer' ? 'country' : layer.type) as keyof typeof SITE_CONFIG.map.layerStyles;
            const style = SITE_CONFIG.map.layerStyles[layerType] || SITE_CONFIG.map.layerStyles.country;
            return {
                ...style,
                ...layer,
                id: Math.random().toString(36).substring(7),
                visible: true,
                label: layer.label ?? '',
                textSize: layer.textSize ?? 12,
                textColor: layer.textColor ?? '#000000',
                customLabelStyles: layer.customLabelStyles ?? {},
            };
        });
        return {
            layers: [...layersWithIds, ...state.layers],
            selectedLayerId: layersWithIds.length > 0 ? layersWithIds[0].id : state.selectedLayerId,
            isSidebarOpen: true,
        };
    }),
    fetchAndAddLayer: async (type, code, name, bbox) => {
        try {
            const { default: apiClient } = await import('@/lib/api-client');
            let geoJsonData = null;

            if (type === 'zipcode') {
                geoJsonData = {
                    type: 'FeatureCollection',
                    features: [{
                        type: 'Feature',
                        geometry: bbox ? {
                            type: 'Polygon',
                            coordinates: [[
                                [bbox[0], bbox[1]],
                                [bbox[2], bbox[1]],
                                [bbox[2], bbox[3]],
                                [bbox[0], bbox[3]],
                                [bbox[0], bbox[1]],
                            ]],
                        } : { type: 'Point', coordinates: [0, 0] },
                        properties: { name, code, type: 'zipcode' },
                    }],
                };
            } else {
                const endpoint = type === 'country' ? `/countries/${code}` : `/states/${code}`;
                const response = await apiClient.get(endpoint);
                const data = type === 'country' ? response.data : response.data[0];

                if (data) {
                    geoJsonData = {
                        type: 'FeatureCollection',
                        features: [{
                            type: 'Feature',
                            geometry: data.geom_simplified,
                            properties: { name: data.name, code: data.code, type },
                        }],
                    };
                }
            }

            if (geoJsonData) {
                const layerType = type as keyof typeof SITE_CONFIG.map.layerStyles;
                const style = SITE_CONFIG.map.layerStyles[layerType] || SITE_CONFIG.map.layerStyles.country;

                get().addLayer({
                    name,
                    type,
                    geoJsonData,
                    bbox,
                    entityId: `${type}:${code}`,
                    fillColor: style.fillColor,
                    borderColor: style.borderColor,
                });
            }
        } catch (error) {
            console.error('Error fetching and adding layer:', error);
            throw error;
        }
    },
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
    setAddLayerModalOpen: (open) => set({ isAddLayerModalOpen: open }),
}));
