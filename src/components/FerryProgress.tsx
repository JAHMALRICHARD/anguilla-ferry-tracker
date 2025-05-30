"use client";

import React from "react";
import Image from "next/image";
import { ArrowBigRightDash, ArrowBigLeftDash, UsersRound } from "lucide-react";

interface FerryProgressProps {
  operatorName: string;
  progressPercent: number;
  eta: string;
  status: "DOCKED" | "BOARDING" | "SAILING" | "NOW ARRIVING" | "ARRIVED";
  direction: "to-anguilla" | "to-st-martin";
}

export function FerryProgress({
  operatorName,
  progressPercent,
  eta,
  status: originalStatus,
  direction,
}: FerryProgressProps) {
  const isBeforeReturnTrip =
    direction === "to-anguilla" && originalStatus === "DOCKED";
  const status = isBeforeReturnTrip ? "ON THE WAY" : originalStatus;

  const ferryColorMap: Record<string, string> = {
    DOCKED: "#9CA3AF",
    BOARDING: "#FACC15",
    SAILING: "#3B82F6",
    "NOW ARRIVING": "#22C55E",
    ARRIVED: "#10B981",
    "ON THE WAY": "#6B7280",
  };

  const statusClassMap: Record<string, string> = {
    DOCKED: "bg-gray-500/10 text-gray-300",
    BOARDING: "bg-yellow-500/10 text-yellow-400",
    SAILING: "bg-blue-500/10 text-blue-400",
    "NOW ARRIVING": "bg-emerald-500/10 text-emerald-400",
    ARRIVED: "bg-green-500/10 text-green-400",
    "ON THE WAY": "bg-gray-600/10 text-gray-400 italic animate-pulse-status",
  };

  const displayProgress = status === "ARRIVED" ? 100 : progressPercent;
  const ferryColor = ferryColorMap[status];
  const isFlipped = direction === "to-anguilla";

  const shouldShowIcon = !(
    status === "ON THE WAY" ||
    (status === "DOCKED" && direction === "to-anguilla")
  );

  const ferryIconStyle: React.CSSProperties = {
    left:
      direction === "to-st-martin"
        ? `calc(${displayProgress}% + 10px)`
        : `calc(${100 - displayProgress}% - 10px)`,
    transform: "translateX(-50%)",
    top: -5,
  };

  return (
    <div className="relative w-[340px] bg-card text-card-foreground px-4 py-3 rounded-xl shadow-sm border border-border">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 text-sm font-medium text-foreground">
        <span>ANGUILLA</span>

        <div className="text-center">
          <span
            className={`text-[10px] uppercase py-1 px-2 rounded-full tracking-wider ${
              statusClassMap[status]
            } ${status === "BOARDING" ? "animate-pulse-status" : ""}`}
            title={
              status === "ON THE WAY"
                ? "The ferry is currently heading to St. Martin to begin boarding for Anguilla."
                : undefined
            }
          >
            {status}
          </span>

          <div className="mt-1 flex justify-center">
            {direction === "to-st-martin" ? (
              <ArrowBigRightDash size={20} className="text-blue-400" />
            ) : (
              <ArrowBigLeftDash size={20} className="text-blue-400" />
            )}
          </div>
        </div>

        <span>ST. MARTIN</span>
      </div>

      {/* Ferry Icon Position */}
      <div className="relative h-4">
        {shouldShowIcon && (
          <div className="absolute z-10" style={ferryIconStyle}>
            {status === "BOARDING" || status === "ARRIVED" ? (
              <UsersRound
                size={16}
                className="drop-shadow animate-pulse-status"
                color={ferryColor}
              />
            ) : (
              <Image
                src="/ferry-icon.png"
                alt="Ferry"
                width={32}
                height={32}
                className={`drop-shadow animate-boat ${
                  isFlipped ? "scale-x-[-1]" : ""
                }`}
              />
            )}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 ${
            direction === "to-st-martin" ? "left-0" : "right-0"
          } h-1.5 rounded-full transition-all duration-700 ease-out`}
          style={{
            width: `${displayProgress}%`,
            backgroundColor: ferryColor,
          }}
        />
      </div>

      {/* Footer Info */}
      <div className="text-[10px] text-gray-400 text-center mt-2">
        {operatorName} • ETA {eta}
      </div>
    </div>
  );
}
