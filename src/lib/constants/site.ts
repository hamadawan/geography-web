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
    }
};

export type SiteConfig = typeof SITE_CONFIG;
