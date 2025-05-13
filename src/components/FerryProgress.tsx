import React from "react";
import Image from "next/image"; // ✅ Ensure you are using Next.js

export function FerryProgress({
  operatorName,
  progressPercent,
  eta,
  status,
}: {
  operatorName: string;
  progressPercent: number;
  eta: string;
  status: "DOCKED" | "BOARDING" | "SAILING" | "NOW ARRIVING" | "ARRIVED";
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

  return (
    <div className="relative w-[340px] bg-[#1D283A] text-gray-100 px-4 py-4 rounded-xl shadow-sm border border-gray-700">
      {/* Labels and Status */}
      <div className="flex justify-between items-center mb-2 text-sm font-medium text-gray-300">
        <span>ANGUILLA</span>
        <span
          className={`text-[10px] uppercase py-1 px-2 rounded-full tracking-wider ${
            statusClassMap[status]
          } ${status === "BOARDING" ? "animate-pulse-status" : ""}`}
        >
          {status}
        </span>
        <span>ST. MARTIN</span>
      </div>

      {/* Ferry Icon Positioned Above Progress */}
      <div className="relative h-8 mb-1">
        <div
          className="absolute z-10"
          style={{
            left: `${displayProgress}%`,
            transform: "translateX(-50%)",
            top: 16,
          }}
        >
          <Image
            src="/ferry-icon.png"
            alt="Ferry Icon"
            width={36}
            height={36}
            className="drop-shadow"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
        <div
          className="absolute top-0 left-0 h-2 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${displayProgress}%`, backgroundColor: ferryColor }}
        />
      </div>

      {/* Operator & ETA */}
      <div className="text-xs text-gray-400 text-center">
        {operatorName} • ETA {eta}
      </div>
    </div>
  );
}
