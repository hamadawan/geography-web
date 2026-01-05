"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useLayerStore } from "@/lib/store/layer-store";
import { X, Paintbrush, Square, Type, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const StylingSidebar = () => {
    const { layers, selectedLayerId, updateLayer, setSelectedLayer, isSidebarOpen } = useLayerStore();

    const selectedLayer = layers.find(l => l.id === selectedLayerId);

    return (
        <div
            className={cn(
                "border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col h-[calc(100vh-64px)] transition-all duration-500 ease-in-out overflow-hidden shadow-xl",
                (selectedLayerId && isSidebarOpen) ? "w-[320px] opacity-100" : "w-0 opacity-0 border-r-0"
            )}
        >
            <div className="flex-1 min-w-[320px] flex flex-col overflow-hidden">
                <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Paintbrush className="h-4 w-4 text-primary" />
                        <h2 className="font-bold text-sm tracking-tight">Layer Styling</h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                        onClick={() => setSelectedLayer(null)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="p-4 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                    {selectedLayer ? (
                        <div className="space-y-6">
                            {/* Layer Name Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Type className="h-3.5 w-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">General</span>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="layer-name" className="text-[11px] font-medium ml-1">Layer Name</Label>
                                    <Input
                                        id="layer-name"
                                        value={selectedLayer.name}
                                        onChange={(e) => updateLayer(selectedLayer.id, { name: e.target.value })}
                                        className="h-9 bg-muted/20 border-muted-foreground/20 focus:border-primary/50 transition-all text-sm"
                                        placeholder="Enter layer name..."
                                    />
                                </div>
                            </div>

                            <Separator className="bg-muted-foreground/10" />

                            {/* Fill Style Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Paintbrush className="h-3.5 w-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Fill Style</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="fill-color" className="text-[11px] font-medium ml-1">Color</Label>
                                        <div className="flex items-center gap-2 bg-muted/20 rounded-md border border-muted-foreground/20 p-1 h-9">
                                            <div
                                                className="w-6 h-6 rounded-sm border border-black/10 relative overflow-hidden shrink-0"
                                                style={{ backgroundColor: selectedLayer.fillColor }}
                                            >
                                                <input
                                                    type="color"
                                                    value={selectedLayer.fillColor}
                                                    onChange={(e) => updateLayer(selectedLayer.id, { fillColor: e.target.value })}
                                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={selectedLayer.fillColor}
                                                onChange={(e) => updateLayer(selectedLayer.id, { fillColor: e.target.value })}
                                                className="bg-transparent border-none outline-none text-[11px] font-mono w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="fill-opacity" className="text-[11px] font-medium ml-1">Opacity</Label>
                                        <div className="flex flex-col justify-center h-9 px-1">
                                            <input
                                                id="fill-opacity"
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.05"
                                                value={selectedLayer.fillOpacity}
                                                onChange={(e) => updateLayer(selectedLayer.id, { fillOpacity: parseFloat(e.target.value) })}
                                                className="w-full accent-primary h-1.5 rounded-full cursor-pointer appearance-none bg-muted-foreground/20"
                                            />
                                            <div className="flex justify-between mt-1">
                                                <span className="text-[9px] text-muted-foreground font-medium">{Math.round(selectedLayer.fillOpacity * 100)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-muted-foreground/10" />

                            {/* Border Style Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Square className="h-3.5 w-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Border Style</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="border-color" className="text-[11px] font-medium ml-1">Color</Label>
                                        <div className="flex items-center gap-2 bg-muted/20 rounded-md border border-muted-foreground/20 p-1 h-9">
                                            <div
                                                className="w-6 h-6 rounded-sm border border-black/10 relative overflow-hidden shrink-0"
                                                style={{ backgroundColor: selectedLayer.borderColor }}
                                            >
                                                <input
                                                    type="color"
                                                    value={selectedLayer.borderColor}
                                                    onChange={(e) => updateLayer(selectedLayer.id, { borderColor: e.target.value })}
                                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={selectedLayer.borderColor}
                                                onChange={(e) => updateLayer(selectedLayer.id, { borderColor: e.target.value })}
                                                className="bg-transparent border-none outline-none text-[11px] font-mono w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="border-opacity" className="text-[11px] font-medium ml-1">Opacity</Label>
                                        <div className="flex flex-col justify-center h-9 px-1">
                                            <input
                                                id="border-opacity"
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.05"
                                                value={selectedLayer.borderOpacity}
                                                onChange={(e) => updateLayer(selectedLayer.id, { borderOpacity: parseFloat(e.target.value) })}
                                                className="w-full accent-primary h-1.5 rounded-full cursor-pointer appearance-none bg-muted-foreground/20"
                                            />
                                            <div className="flex justify-between mt-1">
                                                <span className="text-[9px] text-muted-foreground font-medium">{Math.round(selectedLayer.borderOpacity * 100)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="border-width" className="text-[11px] font-medium ml-1">Width</Label>
                                        <div className="flex items-center gap-2 bg-muted/20 rounded-md border border-muted-foreground/20 px-2 h-9">
                                            <input
                                                id="border-width"
                                                type="number"
                                                min="0"
                                                max="10"
                                                step="0.5"
                                                value={selectedLayer.borderWidth}
                                                onChange={(e) => updateLayer(selectedLayer.id, { borderWidth: parseFloat(e.target.value) })}
                                                className="bg-transparent border-none outline-none text-xs w-full font-medium"
                                            />
                                            <span className="text-[10px] text-muted-foreground font-bold">PX</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="border-style" className="text-[11px] font-medium ml-1">Style</Label>
                                        <select
                                            id="border-style"
                                            value={selectedLayer.borderStyle}
                                            onChange={(e) => updateLayer(selectedLayer.id, { borderStyle: e.target.value as any })}
                                            className="flex h-9 w-full rounded-md border border-muted-foreground/20 bg-muted/20 px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary transition-all cursor-pointer font-medium"
                                        >
                                            <option value="solid">Solid</option>
                                            <option value="dashed">Dashed</option>
                                            <option value="dotted">Dotted</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                                <MousePointer2 className="h-8 w-8 text-muted-foreground/40" />
                            </div>
                            <div className="space-y-1 px-6">
                                <p className="text-sm font-semibold">No Layer Selected</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Select a layer from the map or sidebar to customize its appearance.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StylingSidebar;
