export const SITE_CONFIG = {
    name: "GeoCanvas",
    description: "Explore and visualize geographic boundaries - countries, states, and postal codes with custom styling and boundary merging capabilities.",
    tagline: "Paint Your World with Boundaries",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

    // SEO
    keywords: [
        "geographic boundaries",
        "country boundaries",
        "state boundaries",
        "postal code boundaries",
        "zip code boundaries",
        "custom map styling",
        "boundary visualization",
        "geospatial data"
    ],

    // Social
    social: {
        twitter: "@geocanvas",
        github: "https://github.com/yourusername/geocanvas",
    },

    // Features
    features: {
        countries: {
            title: "Countries",
            description: "Explore country boundaries worldwide"
        },
        states: {
            title: "States",
            description: "Dive into state and province boundaries"
        },
        postalCodes: {
            title: "Postal Codes",
            description: "View detailed postal code boundaries"
        },
        customStyling: {
            title: "Custom Styling",
            description: "Apply multiple styles to boundaries (Coming Soon)"
        },
        boundaryMerging: {
            title: "Boundary Merging",
            description: "Merge multiple boundaries into custom regions (Coming Soon)"
        }
    },

    // UI Text
    ui: {
        selectCountry: "Select a country to view on the map.",
        selectState: "Select a state to view on the map.",
        selectPostalCode: "Select a postal code to view on the map.",
        showLayers: "Show Map Layers",
        hideLayers: "Hide Map Layers",
        breadcrumbs: {
            countries: "Countries"
        }
    },

    // Map Defaults
    map: {
        defaultZoom: 2,
        defaultCenter: [-97.6, 38.3] as [number, number],
        layerStyles: {
            'all-countries': {
                fillColor: "#3b82f6",
                fillOpacity: 0.3,
                borderColor: "#000000",
                borderOpacity: 1,
                borderWidth: 1,
                borderStyle: 'solid' as const,
                fillImage: null as string | null,
            },
            'country': {
                fillColor: "#3b82f6",
                fillOpacity: 0.3,
                borderColor: "#000000",
                borderOpacity: 1,
                borderWidth: 1,
                borderStyle: 'solid' as const,
                fillImage: null as string | null,
            },
            'all-states': {
                fillColor: "#10b981",
                fillOpacity: 0.3,
                borderColor: "#000000",
                borderOpacity: 1,
                borderWidth: 1,
                borderStyle: 'solid' as const,
                fillImage: null as string | null,
            },
            'state': {
                fillColor: "#10b981",
                fillOpacity: 0.3,
                borderColor: "#000000",
                borderOpacity: 1,
                borderWidth: 1,
                borderStyle: 'solid' as const,
                fillImage: null as string | null,
            },
            'all-zipcodes': {
                fillColor: "#f59e0b",
                fillOpacity: 0.3,
                borderColor: "#000000",
                borderOpacity: 1,
                borderWidth: 1,
                borderStyle: 'solid' as const,
                fillImage: null as string | null,
            },
            'zipcode': {
                fillColor: "#f59e0b",
                fillOpacity: 0.3,
                borderColor: "#000000",
                borderOpacity: 1,
                borderWidth: 1,
                borderStyle: 'solid' as const,
                fillImage: null as string | null,
            },
        },
        preview: {
            fillOpacity: 0.2,
            borderOpacity: 0.5,
            borderWidth: 1,
            borderColor: "#000000",
        },
        styles: {
            standard: {
                label: "Standard",
                url: "https://tiles.openfreemap.org/styles/liberty",
            },
            light: {
                label: "Light",
                url: "https://tiles.openfreemap.org/styles/positron",
            },
            dark: {
                label: "Dark",
                url: "https://tiles.openfreemap.org/styles/dark",
            },
            outdoor: {
                label: "Outdoor",
                url: "https://tiles.openfreemap.org/styles/bright",
            },
            satellite: {
                label: "Satellite",
                url: "https://api.maptiler.com/maps/hybrid/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL", // Placeholder/Demo key
            }
        },
        projections: {
            globe: "globe",
            mercator: "mercator",
        }
    }
};

export type SiteConfig = typeof SITE_CONFIG;
