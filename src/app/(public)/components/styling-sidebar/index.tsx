"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useLayerStore } from "@/lib/store/layer-store";
import { X, Paintbrush, Square, Type, MousePointer2, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { cn } from "@/lib/utils";

const StylingSidebar = () => {
    const { layers, selectedLayerId, updateLayer, setSelectedLayer, isSidebarOpen } = useLayerStore();

    const selectedLayer = layers.find(l => l.id === selectedLayerId);
    const [newStyleKey, setNewStyleKey] = useState<string>("");
    const [newStyleValue, setNewStyleValue] = useState<string>("");

    const availableStyleProperties = [
        "text-transform",
        "text-letter-spacing",
        "text-line-height",
        "text-max-width",
        "text-font",
        "text-justify",
        "text-anchor",
        "text-rotate",
        "text-halo-color",
        "text-halo-width",
        "text-halo-blur",
    ];

    const handleAddStyle = () => {
        if (selectedLayer && newStyleKey && newStyleValue) {
            const currentStyles = selectedLayer.customLabelStyles || {};
            updateLayer(selectedLayer.id, {
                customLabelStyles: {
                    ...currentStyles,
                    [newStyleKey]: newStyleValue
                }
            });
            setNewStyleKey("");
            setNewStyleValue("");
        }
    };

    const handleRemoveStyle = (key: string) => {
        if (selectedLayer && selectedLayer.customLabelStyles) {
            const newStyles = { ...selectedLayer.customLabelStyles };
            delete newStyles[key];
            updateLayer(selectedLayer.id, { customLabelStyles: newStyles });
        }
    };

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

                <div className="p-3 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                    {selectedLayer ? (
                        <div className="space-y-4">
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
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="layer-label" className="text-[11px] font-medium ml-1">Label Text</Label>
                                    <Input
                                        id="layer-label"
                                        value={selectedLayer.label || ''}
                                        onChange={(e) => updateLayer(selectedLayer.id, { label: e.target.value })}
                                        className="h-9 bg-muted/20 border-muted-foreground/20 focus:border-primary/50 transition-all text-sm"
                                        placeholder="Enter label text..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="text-size" className="text-[11px] font-medium ml-1">Size</Label>
                                        <div className="flex items-center gap-2 bg-muted/20 rounded-md border border-muted-foreground/20 px-2 h-9">
                                            <input
                                                id="text-size"
                                                type="number"
                                                min="8"
                                                max="72"
                                                step="1"
                                                value={selectedLayer.textSize || 12}
                                                onChange={(e) => updateLayer(selectedLayer.id, { textSize: parseFloat(e.target.value) })}
                                                className="bg-transparent border-none outline-none text-xs w-full font-medium"
                                            />
                                            <span className="text-[10px] text-muted-foreground font-bold">PX</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="text-color" className="text-[11px] font-medium ml-1">Color</Label>
                                        <div className="flex items-center gap-2 bg-muted/20 rounded-md border border-muted-foreground/20 p-1 h-9">
                                            <div
                                                className="w-6 h-6 rounded-sm border border-black/10 relative overflow-hidden shrink-0"
                                                style={{ backgroundColor: selectedLayer.textColor || '#000000' }}
                                            >
                                                <input
                                                    type="color"
                                                    value={selectedLayer.textColor || '#000000'}
                                                    onChange={(e) => updateLayer(selectedLayer.id, { textColor: e.target.value })}
                                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={selectedLayer.textColor || '#000000'}
                                                onChange={(e) => updateLayer(selectedLayer.id, { textColor: e.target.value })}
                                                className="bg-transparent border-none outline-none text-[11px] font-mono w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Select value={newStyleKey} onValueChange={setNewStyleKey}>
                                            <SelectTrigger className="h-8 text-xs">
                                                <SelectValue placeholder="Select property" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableStyleProperties.map(prop => (
                                                    <SelectItem key={prop} value={prop} className="text-xs">
                                                        {prop}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex-1">
                                        <Input
                                            value={newStyleValue}
                                            onChange={(e) => setNewStyleValue(e.target.value)}
                                            placeholder="Value"
                                            className="h-8 text-xs"
                                        />
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-8 w-8 shrink-0"
                                        onClick={handleAddStyle}
                                        disabled={!newStyleKey || !newStyleValue}
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                    </Button>
                                </div>

                                {selectedLayer.customLabelStyles && Object.keys(selectedLayer.customLabelStyles).length > 0 && (
                                    <div className="space-y-2 bg-muted/20 rounded-md p-2">
                                        {Object.entries(selectedLayer.customLabelStyles).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between gap-2 text-xs group">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <span className="font-medium text-muted-foreground shrink-0">{key}:</span>
                                                    <span className="truncate" title={String(value)}>{String(value)}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveStyle(key)}
                                                    className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Separator className="bg-muted-foreground/10" />

                            {/* Fill Style Section */}
                            <div className="space-y-3">
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

                            {/* Image Fill Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <ImageIcon className="h-3.5 w-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Image Fill</span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="relative group shrink-0">
                                            <div className="w-16 h-16 rounded-md border border-muted-foreground/20 bg-muted/20 overflow-hidden flex items-center justify-center">
                                                {selectedLayer.fillImage ? (
                                                    <img
                                                        src={selectedLayer.fillImage}
                                                        alt="Fill"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
                                                )}
                                            </div>
                                            {selectedLayer.fillImage && (
                                                <button
                                                    onClick={() => updateLayer(selectedLayer.id, { fillImage: null })}
                                                    className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <p className="text-[10px] text-muted-foreground leading-tight">
                                                Upload an image to use as a pattern fill for this polygon.
                                            </p>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7 text-[10px] px-2"
                                                    onClick={() => document.getElementById('fill-image-upload')?.click()}
                                                >
                                                    {selectedLayer.fillImage ? 'Change Image' : 'Upload Image'}
                                                </Button>
                                                {selectedLayer.fillImage && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 text-[10px] px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => updateLayer(selectedLayer.id, { fillImage: null })}
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>
                                            <input
                                                id="fill-image-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (event) => {
                                                            updateLayer(selectedLayer.id, { fillImage: event.target?.result as string });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-muted-foreground/10" />

                            {/* Border Style Section */}
                            <div className="space-y-3">
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
                                            onChange={(e) => updateLayer(selectedLayer.id, { borderStyle: e.target.value as 'solid' | 'dashed' | 'dotted' })}
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
