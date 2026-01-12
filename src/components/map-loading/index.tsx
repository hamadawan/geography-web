"use client";

import { Map } from "lucide-react";

export const MapLoading = ({ text = "", showIcon = true }: { text?: string; showIcon?: boolean }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      {showIcon && (
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-primary/20 animate-ping duration-[2000ms]" />
          <Map className="h-12 w-12 text-primary duration-[3000ms]" />
        </div>
      )}
      <div className="flex flex-col items-center gap-2">
        <p className="text-lg font-semibold tracking-tight animate-pulse">{text}</p>
      </div>
    </div>
  );
};
