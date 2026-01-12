"use client";

import React from "react";
import { useLayerStore } from "@/lib/store/layer-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, EyeOff, Trash2, Layers, Download, Upload, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayerSidebar } from "./use-layer-sidebar";

const LayerSidebar = () => {
    const { layers, selectedLayerId, removeLayer, setSelectedLayer, toggleVisibility, isSidebarOpen, setAddLayerModalOpen } = useLayerStore();
    const { handleExport, handleImport, triggerImport, fileInputRef, canExport } = useLayerSidebar();

    return (
        <div
            className={cn(
                "border-r bg-background flex flex-col h-[calc(100vh-64px)] transition-all duration-500 ease-in-out overflow-hidden",
                isSidebarOpen ? "w-[300px] opacity-100" : "w-0 opacity-0 border-r-0"
            )}
        >
            <div className="flex-1 min-w-[300px] flex flex-col overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Layers className="h-5 w-5" />
                        <h2 className="font-semibold">Map Layers</h2>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => setAddLayerModalOpen(true)}
                            title="Add Layer"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImport}
                            accept=".json,.geojson"
                            className="hidden"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={triggerImport}
                            title="Import Layers"
                        >
                            <Upload className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleExport}
                            disabled={!canExport}
                            title="Export Layers"
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-2">
                        {layers.length === 0 ? (
                            <div className="text-center py-12 px-4 flex flex-col items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                    <Layers className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">No layers created yet</p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2 gap-2"
                                    onClick={() => setAddLayerModalOpen(true)}
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Layer
                                </Button>
                            </div>
                        ) : (
                            layers.map((layer) => (
                                <div
                                    key={layer.id}
                                    className={cn(
                                        "group flex flex-col p-3 rounded-lg border transition-colors",
                                        selectedLayerId === layer.id
                                            ? "bg-accent border-accent-foreground/20"
                                            : "hover:bg-muted/50"
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div
                                            className="flex-1 cursor-pointer overflow-hidden"
                                            onClick={() => setSelectedLayer(layer.id)}
                                        >
                                            <p className="text-sm font-medium truncate">{layer.name}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                                {layer.type.replace('-', ' ')}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() => toggleVisibility(layer.id)}
                                            >
                                                {layer.visible ? (
                                                    <Eye className="h-4 w-4" />
                                                ) : (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => removeLayer(layer.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default LayerSidebar;
