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
        "Tranquil seas ahead. Perfect for a smooth and relaxing ferry ride.",
    };
  }
  if (windSpeedKmh <= 30) {
    return {
      state: "Moderate",
      color: "bg-yellow-500",
      icon: <WavesIcon className="h-5 w-5" />,
      description:
        "Gentle sea breeze with light waves. A touch of adventure adds to the charm.",
    };
  }
  if (windSpeedKmh <= 50) {
    return {
      state: "Choppy",
      color: "bg-orange-500",
      icon: <AlertTriangleIcon className="h-5 w-5" />,
      description:
        "Waves may be more noticeable today. Hold on and enjoy the ocean's rhythm.",
    };
  }
  return {
    state: "Strong Winds",
    color: "bg-red-500",
    icon: <AlertTriangleIcon className="h-5 w-5" />,
    description:
      "Conditions may be challenging today. Please check with your operator for updates.",
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
