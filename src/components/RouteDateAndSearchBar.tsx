"use client";

import { CalendarDays, RefreshCcw, Search } from "lucide-react";
import React from "react";
import { addDays } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomDatePicker } from "./CustomDatePicker";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface RouteDateAndSearchBarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  route: { from: string; to: string };
  onRouteChange: (route: { from: string; to: string }) => void;
}

export default function RouteDateAndSearchBar({
  selectedDate,
  onDateChange,
  route,
  onRouteChange,
}: RouteDateAndSearchBarProps) {
  const today = new Date();
  const tomorrow = addDays(today, 1);

  return (
    <div className="bg-background text-foreground border rounded-xl p-4 flex flex-wrap gap-3 items-center justify-between w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 shadow-sm">
      {/* Route Selector (Preserves original logic) */}
      <Select
        value={route.to}
        onValueChange={(value) => onRouteChange({ ...route, to: value })}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Select Route" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="To St. Martin">To St. Martin</SelectItem>
          <SelectItem value="To Anguilla - via Marigot">
            To Anguilla - via Marigot
          </SelectItem>
        </SelectContent>
      </Select>

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
        <Input type="text" placeholder="Search Ferries..." className="pl-10" />
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
