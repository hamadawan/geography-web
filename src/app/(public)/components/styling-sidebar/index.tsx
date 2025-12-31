"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useLayerStore } from "@/lib/store/layer-store";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

const StylingSidebar = () => {
    const { layers, selectedLayerId, updateLayer, setSelectedLayer, isSidebarOpen } = useLayerStore();

    const selectedLayer = layers.find(l => l.id === selectedLayerId);

    return (
        <div
            className={cn(
                "border-r bg-background flex flex-col h-[calc(100vh-64px)] transition-all duration-500 ease-in-out overflow-hidden",
                (selectedLayerId && isSidebarOpen) ? "w-[300px] opacity-100" : "w-0 opacity-0 border-r-0"
            )}
        >
            <div className="flex-1 min-w-[300px] flex flex-col overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="font-semibold">Layer Styling</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelectedLayer(null)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="p-4 space-y-6 overflow-y-auto flex-1">
                    {selectedLayer ? (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="layer-name">Layer Name</Label>
                                <Input
                                    id="layer-name"
                                    value={selectedLayer.name}
                                    onChange={(e) => updateLayer(selectedLayer.id, { name: e.target.value })}
                                    className="mt-1"
                                />
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="fill-color">Fill Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="fill-color"
                                            type="color"
                                            value={selectedLayer.fillColor}
                                            onChange={(e) => updateLayer(selectedLayer.id, { fillColor: e.target.value })}
                                            className="w-12 h-10 p-1 cursor-pointer"
                                        />
                                        <Input
                                            type="text"
                                            value={selectedLayer.fillColor}
                                            onChange={(e) => updateLayer(selectedLayer.id, { fillColor: e.target.value })}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="border-color">Border Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="border-color"
                                            type="color"
                                            value={selectedLayer.borderColor}
                                            onChange={(e) => updateLayer(selectedLayer.id, { borderColor: e.target.value })}
                                            className="w-12 h-10 p-1 cursor-pointer"
                                        />
                                        <Input
                                            type="text"
                                            value={selectedLayer.borderColor}
                                            onChange={(e) => updateLayer(selectedLayer.id, { borderColor: e.target.value })}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="opacity">Fill Opacity</Label>
                                    <Input
                                        id="opacity"
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={selectedLayer.opacity}
                                        onChange={(e) => updateLayer(selectedLayer.id, { opacity: parseFloat(e.target.value) })}
                                        className="cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] text-muted-foreground">
                                        <span>0%</span>
                                        <span>{Math.round(selectedLayer.opacity * 100)}%</span>
                                        <span>100%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <p className="text-sm">Select a layer to style.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StylingSidebar;
