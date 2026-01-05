"use client";

import { Map, Code } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

import { CountrySelect } from "../country-select";
import { StateSelect } from "../state-select";
import { ZipcodeSelect } from "../zipcode-select";

import { useSelectionStore } from "@/lib/store/selection-store";
import { Separator } from "@/components/ui/separator"; // Added missing import for Separator

interface HeaderProps {
  showSelectors?: boolean;
}

export default function Header({ showSelectors = true }: HeaderProps) {
  const pathname = usePathname();
  const {
    selectedCountry,
    selectedState,
    selectedZip,
    setSelectedCountry,
    setSelectedState,
    setSelectedZip,
  } = useSelectionStore();

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
            <CountrySelect
              value={selectedCountry ?? undefined}
              onChange={setSelectedCountry}
            />

            <StateSelect
              countryCode={selectedCountry?.code}
              value={selectedState ?? undefined}
              onChange={setSelectedState}
            />

            <ZipcodeSelect
              stateCode={selectedState?.code}
              value={selectedZip ?? undefined}
              onChange={setSelectedZip}
            />
          </>
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
    </header>
  );
}
