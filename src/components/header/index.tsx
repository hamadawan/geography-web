"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Map } from "lucide-react";

import { CountrySelect } from "../country-select";
import { StateSelect } from "../state-select";
import { ZipcodeSelect } from "../zipcode-select";

type Option = {
  code: string;
  name: string;
};

interface HeaderProps {
  selectedCountry?: Option | null;
  selectedState?: Option | null;
  selectedZip?: Option | null;

  onCountryChange: (country: Option | null) => void;
  onStateChange: (state: Option | null) => void;
  onZipChange: (zip: Option | null) => void;

  onExport?: () => void;
}

export default function Header({
  selectedCountry,
  selectedState,
  selectedZip,
  onCountryChange,
  onStateChange,
  onZipChange,
  onExport,
}: HeaderProps) {
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
          onChange={(country) => {
            onCountryChange(country);
            onStateChange(null);
            onZipChange(null);
          }}
        />

        <StateSelect
          countryCode={selectedCountry?.code}
          value={selectedState ?? undefined}
          onChange={(state) => {
            onStateChange(state);
            onZipChange(null);
          }}
        />

        <ZipcodeSelect
          stateCode={selectedState?.code}
          value={selectedZip ?? undefined}
          onChange={onZipChange}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={!selectedCountry}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </header>
  );
}
