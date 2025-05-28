"use client";

import { CalendarDays, RefreshCcw, Search } from "lucide-react";
import React from "react";
import { addDays } from "date-fns";
import { CustomDatePicker } from "./CustomDatePicker";

interface RouteDateAndSearchBarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  route: { from: string; to: string };
  onRouteChange: (route: { from: string; to: string }) => void; // <-- Add this
}

export default function RouteDateAndSearchBar({
  selectedDate,
  onDateChange,
}: RouteDateAndSearchBarProps) {
  return (
    <div className="bg-[#0f172a] text-white rounded-xl p-4 flex flex-wrap gap-3 items-center justify-between w-full max-w-7xl mx-auto">
      {/* Route Selector */}
      <select className="bg-[#1e293b] text-white rounded-md px-4 py-2 text-sm outline-none">
        <option>To St. Martin</option>
        <option>To St. Maarten</option>
        <option>To Anguilla - via Marigot</option>
        <option>To Anguilla - via PJIA</option>
      </select>

      {/* Calendar Picker + Route Info */}
      <div className="flex items-center gap-4 flex-wrap">
        <CustomDatePicker
          selectedDate={selectedDate}
          onDateChange={onDateChange}
        />
      </div>

      {/* Today / Tomorrow Toggle */}
      <div className="flex space-x-2 mb-1">
        <button
          onClick={() => onDateChange(new Date())}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            selectedDate.toDateString() === new Date().toDateString()
              ? "bg-blue-600 text-white"
              : "bg-[#1e293b] text-gray-300 hover:bg-[#334155]"
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          Today
        </button>
        <button
          onClick={() => onDateChange(addDays(new Date(), 1))}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            selectedDate.toDateString() ===
            addDays(new Date(), 1).toDateString()
              ? "bg-blue-600 text-white"
              : "bg-[#1e293b] text-gray-300 hover:bg-[#334155]"
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          Tomorrow
        </button>
      </div>

      {/* Search Field */}
      <div className="relative flex-1 min-w-[160px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search Ferries..."
          className="w-full bg-[#1e293b] text-white rounded-md pl-10 pr-4 py-2 text-sm outline-none"
        />
      </div>

      {/* Status Filter */}
      <select className="bg-[#1e293b] text-white rounded-md px-4 py-2 text-sm outline-none">
        <option>Status</option>
        <option>On Time</option>
        <option>Delayed</option>
        <option>Cancelled</option>
      </select>

      {/* Refresh Icon */}
      <button className="bg-[#1e293b] p-2 rounded-md hover:bg-[#334155] transition">
        <RefreshCcw className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}
