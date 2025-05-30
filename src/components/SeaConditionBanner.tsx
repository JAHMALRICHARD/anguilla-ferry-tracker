"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  WavesIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  WindIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SeaConditionBannerProps {
  windSpeedKmh: number;
}

const getSeaCondition = (windSpeedKmh: number) => {
  if (windSpeedKmh <= 10) {
    return {
      state: "Calm",
      color: "bg-green-500",
      icon: <CheckCircleIcon className="h-4 w-4 text-white" />,
      description: "Tranquil seas. Smooth ride expected.",
    };
  }
  if (windSpeedKmh <= 30) {
    return {
      state: "Moderate",
      color: "bg-yellow-500",
      icon: <WavesIcon className="h-4 w-4 text-white" />,
      description: "Light waves with a gentle breeze.",
    };
  }
  if (windSpeedKmh <= 50) {
    return {
      state: "Choppy",
      color: "bg-orange-500",
      icon: <AlertTriangleIcon className="h-4 w-4 text-white" />,
      description: "More noticeable waves. Moderate conditions.",
    };
  }
  return {
    state: "Strong Winds",
    color: "bg-red-500",
    icon: <AlertTriangleIcon className="h-4 w-4 text-white" />,
    description: "Rough conditions. Check with your operator.",
  };
};

export function SeaConditionBanner({ windSpeedKmh }: SeaConditionBannerProps) {
  const { state, color, icon, description } = getSeaCondition(windSpeedKmh);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`shadow-md border-0 ${color}`}>
        <CardContent className="px-3 py-2 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            {icon}
            <div className="leading-tight">
              <p className="font-medium text-sm sm:text-base">
                Sea Condition: {state}
              </p>
              <p className="text-xs text-white/90">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm">
            <WindIcon className="h-4 w-4 text-white" />
            <span>{windSpeedKmh} km/h winds</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
