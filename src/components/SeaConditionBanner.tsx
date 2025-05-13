"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  WavesIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  WindIcon,
} from "lucide-react";

interface SeaConditionBannerProps {
  windSpeedKmh: number;
}

const getSeaCondition = (windSpeedKmh: number) => {
  if (windSpeedKmh <= 10) {
    return {
      state: "Calm",
      color: "bg-green-500",
      icon: <CheckCircleIcon className="h-5 w-5" />,
      description:
        "Smooth sailing expected. Enjoy a very pleasant ride with minimal motion.",
    };
  }
  if (windSpeedKmh <= 30) {
    return {
      state: "Moderate",
      color: "bg-yellow-500",
      icon: <WavesIcon className="h-5 w-5" />,
      description:
        "Slight waves and wind. Ride may feel breezy with some movement on the sea.",
    };
  }
  if (windSpeedKmh <= 50) {
    return {
      state: "Rough",
      color: "bg-orange-500",
      icon: <AlertTriangleIcon className="h-5 w-5" />,
      description:
        "Expect significant waves and occasional bumps. Recommended for experienced travelers.",
    };
  }
  return {
    state: "Dangerous",
    color: "bg-red-500",
    icon: <AlertTriangleIcon className="h-5 w-5" />,
    description:
      "High risk of strong waves and turbulence. Travel not recommended.",
  };
};

export function SeaConditionBanner({ windSpeedKmh }: SeaConditionBannerProps) {
  const { state, color, icon, description } = getSeaCondition(windSpeedKmh);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-lg ${color} text-white px-4 py-4 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="font-semibold text-lg">Sea Condition: {state}</p>
          <p className="text-sm text-white/90">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-1 sm:mt-0">
        <WindIcon className="h-5 w-5" />
        <span className="text-sm">{windSpeedKmh} km/h winds</span>
      </div>
    </motion.div>
  );
}
