"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Maximize, Code, Trash2, Copy, Check, Paintbrush } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useGeoJsonEditor } from "./use-geojson-editor";

interface GeoJSONEditorProps {
    onFitBounds?: (bbox: [number, number, number, number]) => void;
}

export const GeoJSONEditor = ({ onFitBounds }: GeoJSONEditorProps) => {
    const {
        geoJsonString,
        setGeoJsonString,
        error,
        copied,
        parsedGeoJson,
        handleFormat,
        handleClear,
        handleCopy,
        handleFitBounds,
    } = useGeoJsonEditor({ onFitBounds });

    return (
        <div className="w-[450px] border-l bg-background flex flex-col overflow-hidden shadow-xl">
            <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    <h2 className="font-bold text-sm tracking-tight">GeoJSON Editor</h2>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleFormat} disabled={!parsedGeoJson} title="Format JSON">
                        <Code className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleFitBounds} disabled={!parsedGeoJson} title="Fit Bounds">
                        <Maximize className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy} disabled={!geoJsonString} title="Copy to Clipboard">
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={handleClear} title="Clear Editor">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 relative">
                    <Editor
                        height="100%"
                        defaultLanguage="json"
                        theme="light"
                        value={geoJsonString}
                        onChange={(value) => setGeoJsonString(value || "")}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 12,
                            lineNumbers: "on",
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            tabSize: 2,
                        }}
                    />
                </div>

                {error && (
                    <div className="p-4 border-t">
                        <Alert variant="destructive" className="py-2 px-3">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="text-xs">Error</AlertTitle>
                            <AlertDescription className="text-[10px] font-mono leading-tight">
                                {error}
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                {!error && parsedGeoJson && (
                    <div className="p-4 border-t bg-primary/5">
                        <div className="flex items-center gap-2 mb-1">
                            <Paintbrush className="h-3 w-3 text-primary" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Visualization</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            Your GeoJSON is being automatically rendered as &quot;Editor Layer&quot;. Use the sidebar on the left to manage it.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
