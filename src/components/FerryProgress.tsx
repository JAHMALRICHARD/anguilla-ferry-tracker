"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, UsersRound } from "lucide-react";

export interface FerryProgressProps {
  operatorName: string;
  progressPercent: number;
  eta: string;
  status:
    | "SCHEDULED"
    | "DOCKED"
    | "BOARDING"
    | "SAILING"
    | "NOW ARRIVING"
    | "ARRIVED"
    | "ON THE WAY"
    | "DOCKED IN AXA";
  direction: "to-anguilla" | "to-st-martin";
}

export function FerryProgress({
  operatorName,
  progressPercent,
  eta,
  status,
  direction,
}: FerryProgressProps) {
  const displayStatus =
    status === "SCHEDULED" && direction !== "to-anguilla" ? "DOCKED" : status;

  const ferryColorMap: Record<FerryProgressProps["status"], string> = {
    SCHEDULED: "#9CA3AF",
    DOCKED: "#9CA3AF",
    "DOCKED IN AXA": "#6B7280",
    BOARDING: "#FACC15",
    SAILING: "#3B82F6",
    "NOW ARRIVING": "#22C55E",
    ARRIVED: "#10B981",
    "ON THE WAY": "#6B7280",
  };

  const displayProgress = displayStatus === "ARRIVED" ? 100 : progressPercent;
  const adjustedProgress =
    displayStatus === "BOARDING" && displayProgress < 5 ? 5 : displayProgress;

  const ferryColor = ferryColorMap[displayStatus];
  const isFlipped = direction === "to-anguilla";

  const shouldShowIcon =
    displayStatus !== "ON THE WAY" &&
    displayStatus !== "DOCKED IN AXA" &&
    !(displayStatus === "DOCKED" && direction === "to-anguilla");

  const ferryIconStyle: React.CSSProperties = {
    left:
      direction === "to-st-martin"
        ? `calc(${adjustedProgress}% + 5px)`
        : `calc(${100 - adjustedProgress}% - 5px)`,
    transform: "translateX(-50%)",
    top: 0,
  };

  return (
    <div className="w-full max-w-sm bg-card text-card-foreground rounded-xl shadow-sm">
      {/* Status Badge */}
      <div className="flex justify-center mb-1">
        <div
          className={`inline-flex items-center gap-2 text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide w-fit border ${
            displayStatus === "SAILING"
              ? "text-blue-500 border-blue-500"
              : displayStatus === "BOARDING"
              ? "text-yellow-500 border-yellow-500"
              : displayStatus === "NOW ARRIVING"
              ? "text-emerald-500 border-emerald-500"
              : displayStatus === "ARRIVED"
              ? "text-green-500 border-green-500"
              : displayStatus === "DOCKED IN AXA"
              ? "text-gray-400 border-gray-400"
              : displayStatus === "ON THE WAY"
              ? "text-muted-foreground border-muted-foreground italic animate-pulse-status"
              : "text-gray-400 border-gray-400"
          }`}
          title={
            displayStatus === "ON THE WAY"
              ? "The ferry is heading to AXA before its return trip."
              : undefined
          }
        >
          {displayStatus === "SAILING" && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
            </span>
          )}
          {displayStatus}
        </div>
      </div>

      {/* Route Badges + Port Names */}
      <div className="flex justify-between items-end mb-2 px-1">
        {/* AXA side */}
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold px-3 py-1 rounded-full bg-muted text-muted-foreground tracking-wide shadow-sm">
            AXA
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            {direction === "to-st-martin" ? "Blowing Point" : "Marigot"}
          </span>
        </div>

        {/* Arrow */}
        <ArrowRight
          className={`w-5 h-5 text-muted-foreground transition-transform ${
            isFlipped ? "rotate-180" : ""
          }`}
        />

        {/* SXM side */}
        <div className="flex flex-col items-end">
          <span className="text-sm font-bold px-3 py-1 rounded-full bg-muted text-muted-foreground tracking-wide shadow-sm">
            SXM
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            {direction === "to-st-martin" ? "Marigot" : "Blowing Point"}
          </span>
        </div>
      </div>

      {/* Ferry Icon Progress Trail */}
      <div className="relative h-5">
        {shouldShowIcon && (
          <div className="absolute z-10" style={ferryIconStyle}>
            <div className="relative">
              {displayStatus === "BOARDING" || displayStatus === "ARRIVED" ? (
                <UsersRound
                  size={18}
                  className="drop-shadow animate-pulse-status"
                  color={ferryColor}
                />
              ) : (
                <Image
                  src="/ferry-icon.png"
                  alt="Ferry"
                  width={28}
                  height={28}
                  className={`drop-shadow animate-boat ${
                    isFlipped ? "scale-x-[-1]" : ""
                  }`}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div
        className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden"
        title={`${adjustedProgress}% complete`}
      >
        <div
          className={`absolute top-0 h-full rounded-full transition-all duration-700 ease-out ${
            isFlipped ? "right-0" : "left-0"
          }`}
          style={{
            width: `${adjustedProgress}%`,
            backgroundColor: ferryColor,
            transformOrigin: isFlipped ? "right center" : "left center",
          }}
        />
      </div>

      {/* Footer Info */}
      <div className="text-sm text-muted-foreground text-center font-medium pt-1">
        {operatorName} • ETA {eta}
      </div>
    </div>
  );
}
