"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Map as MapIcon, Layers } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants/site";

interface MapControlsProps {
    currentProjection: string;
    onProjectionChange: (projection: string) => void;
    currentStyle: string;
    onStyleChange: (style: string) => void;
}

export const MapControls = ({
    currentProjection,
    onProjectionChange,
    currentStyle,
    onStyleChange,
}: MapControlsProps) => {
    return (
        <div className="absolute top-1 right-4 flex flex-col gap-2 z-10">
            <div className="bg-background/90 backdrop-blur-sm rounded-md shadow-md border p-1">
                <Button
                    variant={currentProjection === "globe" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => onProjectionChange("globe")}
                    title="Globe Projection"
                    className="h-8 w-8"
                >
                    <Globe className="h-4 w-4" />
                </Button>
                <Button
                    variant={currentProjection === "mercator" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => onProjectionChange("mercator")}
                    title="Mercator Projection"
                    className="h-8 w-8"
                >
                    <MapIcon className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8"
                            title="Change Map Theme"
                        >
                            <Layers className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        {Object.entries(SITE_CONFIG.map.styles).map(([key, style]) => (
                            <DropdownMenuItem
                                key={key}
                                onClick={() => onStyleChange(style.url)}
                                className="flex items-center justify-between cursor-pointer"
                            >
                                <span>{style.label}</span>
                                {currentStyle === style.url && (
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};
