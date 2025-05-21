"use client";

import React from "react";
import Image from "next/image";
import { Wifi, Utensils, Users } from "lucide-react";
import type { FerryItem } from "../components/LiveScheduleTable";

interface FerryDetailsCardProps {
  ferry: FerryItem;
}

export function FerryDetailsCard({ ferry }: FerryDetailsCardProps) {
  const {
    operator,
    departure_port,
    arrival_port,
    departure_time,
    price,
    logo_url,
    status,
  } = ferry;

  const [depHours, depMinutes] = departure_time
    .replace(/(AM|PM)/i, "")
    .split(":")
    .map(Number);

  const isPM = departure_time.toLowerCase().includes("pm");
  const totalMinutes =
    (isPM && depHours !== 12 ? depHours + 12 : depHours) * 60 + depMinutes + 30;
  let etaHours = Math.floor(totalMinutes / 60);
  const etaMinutes = totalMinutes % 60;
  if (etaHours >= 24) etaHours -= 24;

  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? "PM" : "AM";
    const hour = h % 12 === 0 ? 12 : h % 12;
    const min = m.toString().padStart(2, "0");
    return `${hour}:${min} ${period}`;
  };

  const eta = formatTime(etaHours, etaMinutes);

  return (
    <div className="w-full max-w-5xl bg-[#151923] text-white rounded-xl shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-700 pb-4">
        <div className="flex items-center gap-4">
          <Image
            src={logo_url}
            alt={`${operator} logo`}
            width={48}
            height={48}
            className="rounded-full bg-white p-1"
          />
          <h2 className="text-2xl font-semibold">{operator}</h2>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between text-gray-300">
        <div className="text-sm uppercase tracking-wide">
          {departure_port} — {arrival_port}
        </div>
        <div className="flex items-center gap-4 text-white text-xl font-bold">
          <span>{departure_time}</span>
          <span className="text-gray-500 text-lg">→</span>
          <span>{eta}</span>
          <span
            className={`text-sm font-semibold px-3 py-1 rounded ${
              status === "on-time"
                ? "bg-green-700 text-white"
                : status === "delayed"
                ? "bg-yellow-600 text-white"
                : "bg-red-700 text-white"
            }`}
          >
            {status.replace("-", " ").toUpperCase()}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <p className="uppercase text-gray-400 text-sm mb-1">Ticket Price</p>
        <p className="text-white text-lg font-semibold">{price} USD</p>
        <p className="text-gray-400 text-xs mt-1 tracking-wide">
          ONE WAY <span className="inline-block">&rarr;</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-6 text-white pt-2 text-sm">
        <div className="flex items-center gap-2">
          <Wifi size={18} />
          <span>Wi-Fi</span>
        </div>
        <div className="flex items-center gap-2">
          <Utensils size={18} />
          <span>Snack Bar</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={18} />
          <span>60 Passengers</span>
        </div>
      </div>
    </div>
  );
}
