"use client";

import { Map } from "lucide-react";

import { CountrySelect } from "../country-select";
import { StateSelect } from "../state-select";
import { ZipcodeSelect } from "../zipcode-select";

import { useSelectionStore } from "@/lib/store/selection-store";
import { Separator } from "@/components/ui/separator"; // Added missing import for Separator

export default function Header() {
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
      {/* Logo */}
      <div className="flex items-center gap-2 font-semibold">
        <Map className="h-5 w-5 text-primary" />
        <span>GeoBoundary</span>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Selectors */}
      <div className="flex flex-1 items-center gap-3">
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
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={!selectedCountry}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button> */}
      </div>
    </header>
  );
}
