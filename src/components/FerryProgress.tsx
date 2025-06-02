"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, UsersRound } from "lucide-react";

export interface FerryProgressProps {
  operatorName: string;
  progressPercent: number;
  eta: string;
  status:
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
  const ferryColorMap: Record<FerryProgressProps["status"], string> = {
    DOCKED: "#9CA3AF",
    "DOCKED IN AXA": "#6B7280",
    BOARDING: "#FACC15",
    SAILING: "#3B82F6",
    "NOW ARRIVING": "#22C55E",
    ARRIVED: "#10B981",
    "ON THE WAY": "#6B7280",
  };

  const statusClassMap: Record<FerryProgressProps["status"], string> = {
    DOCKED: "bg-gray-500/10 text-gray-400",
    "DOCKED IN AXA": "bg-gray-500/10 text-gray-400",
    BOARDING: "bg-yellow-500/10 text-yellow-500",
    SAILING: "bg-blue-500/10 text-blue-400",
    "NOW ARRIVING": "bg-emerald-500/10 text-emerald-400",
    ARRIVED: "bg-green-500/10 text-green-500",
    "ON THE WAY": "bg-muted text-muted-foreground italic animate-pulse-status",
  };

  const displayProgress = status === "ARRIVED" ? 100 : progressPercent;
  const adjustedProgress =
    status === "BOARDING" && displayProgress < 5 ? 5 : displayProgress;

  const ferryColor = ferryColorMap[status];
  const isFlipped = direction === "to-anguilla";

  const shouldShowIcon =
    status !== "ON THE WAY" &&
    status !== "DOCKED IN AXA" &&
    !(status === "DOCKED" && direction === "to-anguilla");

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
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium tracking-wide ${statusClassMap[status]}`}
          title={
            status === "ON THE WAY"
              ? "The ferry is heading to AXA before its return trip."
              : undefined
          }
        >
          {status}
        </span>
      </div>

      {/* Direction Labels */}
      <div className="flex justify-between items-center text-lg font-bold mb-2">
        <span className="text-2xl tracking-wide">AXA</span>
        <div className="flex items-center justify-center w-10">
          <ArrowRight
            className={`w-6 h-6 text-muted-foreground transition-transform ${
              isFlipped ? "rotate-180" : ""
            }`}
          />
        </div>
        <span className="text-2xl tracking-wide">SXM</span>
      </div>

      {/* Ferry Icon Progress Trail */}
      <div className="relative h-5">
        {shouldShowIcon && (
          <div className="absolute z-10" style={ferryIconStyle}>
            <div className="relative">
              {status === "BOARDING" || status === "ARRIVED" ? (
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
