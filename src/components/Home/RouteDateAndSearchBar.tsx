"use client";

import { CalendarDays, RefreshCcw, Search } from "lucide-react";
import React from "react";
import { addDays } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomDatePicker } from "../CustomDatePicker";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";

interface RouteDateAndSearchBarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  route: { from: string; to: string };
  onRouteChange: (route: { from: string; to: string }) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function RouteDateAndSearchBar({
  selectedDate,
  onDateChange,
  route,
  onRouteChange,
  searchQuery,
  onSearchChange,
}: RouteDateAndSearchBarProps) {
  const today = new Date();
  const tomorrow = addDays(today, 1);

  return (
    <div className="bg-background text-foreground border rounded-xl p-4 flex flex-wrap gap-3 items-center justify-between w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 shadow-sm">
      {/* Route Selector with Flags */}
      <div className="flex gap-2 items-center">
        <Button
          variant={route.to === "To St. Martin" ? "default" : "outline"}
          onClick={() => onRouteChange({ ...route, to: "To St. Martin" })}
          className="flex items-center gap-2 px-4 py-2"
        >
          <Image
            src="/flags/sx.png"
            alt="SXM Flag"
            width={24}
            height={16}
            className="rounded-sm"
          />
          <span className="hidden sm:inline">To St. Martin</span>
        </Button>
        <Button
          variant={
            route.to === "To Anguilla - via Marigot" ? "default" : "outline"
          }
          onClick={() =>
            onRouteChange({ ...route, to: "To Anguilla - via Marigot" })
          }
          className="flex items-center gap-2 px-4 py-2"
        >
          <Image
            src="/flags/ai.png"
            alt="Anguilla Flag"
            width={24}
            height={16}
            className="rounded-sm"
          />
          <span className="hidden sm:inline">To Anguilla</span>
        </Button>
      </div>

      {/* Date Picker */}
      <div className="flex items-center gap-4 flex-wrap">
        <CustomDatePicker
          selectedDate={selectedDate}
          onDateChange={onDateChange}
        />
      </div>

      {/* Today / Tomorrow Toggle */}
      <div className="flex space-x-2 mb-1">
        <Button
          variant={
            selectedDate.toDateString() === today.toDateString()
              ? "default"
              : "secondary"
          }
          onClick={() => onDateChange(today)}
          className="flex items-center gap-2"
        >
          <CalendarDays className="w-4 h-4" />
          Today
        </Button>
        <Button
          variant={
            selectedDate.toDateString() === tomorrow.toDateString()
              ? "default"
              : "secondary"
          }
          onClick={() => onDateChange(tomorrow)}
          className="flex items-center gap-2"
        >
          <CalendarDays className="w-4 h-4" />
          Tomorrow
        </Button>
      </div>

      {/* Search Field */}
      <div className="relative flex-1 min-w-[160px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Search Ferries..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Status Filter (Static UI) */}
      <Select>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="on-time">On Time</SelectItem>
          <SelectItem value="delayed">Delayed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      {/* Refresh Button */}
      <Button variant="ghost" size="icon">
        <RefreshCcw className="w-4 h-4" />
      </Button>
    </div>
  );
}
