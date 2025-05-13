import React from "react";
import Image from "next/image";
import { ArrowBigRightDash, ArrowBigLeftDash } from "lucide-react";

export function FerryProgress({
  operatorName,
  progressPercent,
  eta,
  status,
  direction,
}: {
  operatorName: string;
  progressPercent: number;
  eta: string;
  status: "DOCKED" | "BOARDING" | "SAILING" | "NOW ARRIVING" | "ARRIVED";
  direction: "to-anguilla" | "to-st-martin";
}) {
  const ferryColorMap: Record<typeof status, string> = {
    DOCKED: "#9CA3AF",
    BOARDING: "#FACC15",
    SAILING: "#3B82F6",
    "NOW ARRIVING": "#22C55E",
    ARRIVED: "#10B981",
  };

  const statusClassMap: Record<typeof status, string> = {
    DOCKED: "bg-gray-500/10 text-gray-300",
    BOARDING: "bg-yellow-500/10 text-yellow-400",
    SAILING: "bg-blue-500/10 text-blue-400",
    "NOW ARRIVING": "bg-emerald-500/10 text-emerald-400",
    ARRIVED: "bg-green-500/10 text-green-400",
  };

  const displayProgress = status === "ARRIVED" ? 100 : progressPercent;
  const ferryColor = ferryColorMap[status];

  const positionStyle = {
    left:
      direction === "to-st-martin"
        ? `calc(${displayProgress}% + 10px)`
        : `calc(${100 - displayProgress}% - 10px)`,
    transform: "translateX(-50%)",
    top: -5,
  };

  const isFlipped = direction === "to-anguilla";

  return (
    <div className="relative w-[340px] bg-[#1D283A] text-gray-100 px-4 py-2 rounded-xl shadow-sm border border-gray-700">
      {/* Labels and Status with Lucide Directional Arrow */}
      <div className="flex justify-between items-center mb-1 text-sm font-medium text-gray-300">
        <span>ANGUILLA</span>
        <div className="text-center">
          <span
            className={`text-[10px] uppercase py-1 px-2 rounded-full tracking-wider ${
              statusClassMap[status]
            } ${status === "BOARDING" ? "animate-pulse-status" : ""}`}
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

      {/* Ferry Icon Positioned Above Progress */}
      <div className="relative h-4">
        <div className="absolute z-10" style={positionStyle}>
          <Image
            src="/ferry-icon.png"
            alt="Ferry Icon"
            width={32}
            height={32}
            className={`drop-shadow animate-boat ${
              isFlipped ? "scale-x-[-1]" : ""
            }`}
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
        {direction === "to-st-martin" ? (
          <div
            className="absolute top-0 left-0 h-1.5 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${displayProgress}%`,
              backgroundColor: ferryColor,
            }}
          />
        ) : (
          <div
            className="absolute top-0 right-0 h-1.5 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${displayProgress}%`,
              backgroundColor: ferryColor,
            }}
          />
        )}
      </div>

      {/* Operator & ETA */}
      <div className="text-[10px] text-gray-400 text-center mt-1">
        {operatorName} • ETA {eta}
      </div>
    </div>
  );
}
