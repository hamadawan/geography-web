"use client";

import { Map, Code, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

import { AddLayerModal } from "@/app/(public)/components/add-layer-modal";
import { useLayerStore } from "@/lib/store/layer-store";

import { Separator } from "@/components/ui/separator"; // Added missing import for Separator

interface HeaderProps {
  showSelectors?: boolean;
  showAddLayerButton?: boolean;
}

export default function Header({ showSelectors = true, showAddLayerButton = false }: HeaderProps) {
  const pathname = usePathname();
  const { isAddLayerModalOpen, setAddLayerModalOpen } = useLayerStore();

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4">
      <Link href="/" className="flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity">
        <Map className="h-5 w-5 text-primary" />
        <span>GeoBoundary</span>
      </Link>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex flex-1 items-center gap-3">
        {showSelectors && (
          <>
            {showAddLayerButton && (
              <>
                <Button
                  onClick={() => setAddLayerModalOpen(true)}
                  variant="default"
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Layer
                </Button>
              </>
            )}
          </>
        )}
        {!showSelectors && showAddLayerButton && (
          <Button
            onClick={() => setAddLayerModalOpen(true)}
            variant="default"
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Layer
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {pathname !== "/geojson-editor" && (
          <Link href="/geojson-editor">
            <Button variant="outline" size="sm">
              <Code className="mr-2 h-4 w-4" />
              GeoJSON Editor
            </Button>
          </Link>
        )}
      </div>
      <AddLayerModal
        open={isAddLayerModalOpen}
        onOpenChange={setAddLayerModalOpen}
      />
    </header>
  );
}
