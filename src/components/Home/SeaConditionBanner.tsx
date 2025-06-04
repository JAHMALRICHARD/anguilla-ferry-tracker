"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  WavesIcon,
  CheckCircleIcon,
  WindIcon,
  CloudSunIcon,
  CloudLightningIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SeaConditionBannerProps {
  windSpeedKmh: number;
}

const getSeaCondition = (windSpeedKmh: number) => {
  if (windSpeedKmh <= 10) {
    return {
      state: "Calm",
      bg: "bg-[color:var(--tropic-calm)] dark:bg-[color:var(--tropic-calm-dark)]",
      icon: <CheckCircleIcon className="h-6 w-6 text-white" />,
      description: "Tranquil seas. Smooth ride expected.",
    };
  }
  if (windSpeedKmh <= 30) {
    return {
      state: "Moderate",
      bg: "bg-[color:var(--tropic-moderate)] dark:bg-[color:var(--tropic-moderate-dark)]",
      icon: <CloudSunIcon className="h-6 w-6 text-white" />,
      description: "Light waves with a gentle breeze.",
    };
  }
  if (windSpeedKmh <= 50) {
    return {
      state: "Choppy",
      bg: "bg-[color:var(--tropic-choppy)] dark:bg-[color:var(--tropic-choppy-dark)]",
      icon: <WavesIcon className="h-6 w-6 text-white" />,
      description: "More noticeable waves. Moderate conditions.",
    };
  }
  return {
    state: "Strong Winds",
    bg: "bg-[color:var(--tropic-danger)] dark:bg-[color:var(--tropic-danger-dark)]",
    icon: <CloudLightningIcon className="h-6 w-6 text-white" />,
    description: "Rough conditions. Check with your operator.",
  };
};

export function SeaConditionBanner({ windSpeedKmh }: SeaConditionBannerProps) {
  const { state, bg, icon, description } = getSeaCondition(windSpeedKmh);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={`rounded-xl shadow-md border-0 text-white ${bg}`}>
        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-4">
          <div className="flex items-start gap-4">
            {icon}
            <div className="space-y-1">
              <p className="text-base sm:text-lg font-semibold leading-tight">
                Sea Condition: {state}
              </p>
              <p className="text-sm sm:text-base opacity-90">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <WindIcon className="h-5 w-5" />
            <span>{windSpeedKmh} km/h winds</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
