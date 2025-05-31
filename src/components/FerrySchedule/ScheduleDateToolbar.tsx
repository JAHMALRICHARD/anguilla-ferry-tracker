"use client";

import { format, addDays } from "date-fns";
import { CalendarDays, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface Props {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function ScheduleDateToolbar({ selectedDate, onDateChange }: Props) {
  const today = new Date();
  const tomorrow = addDays(today, 1);

  return (
    <div className="mb-6 border rounded-xl p-4 flex flex-wrap gap-3 items-center justify-start shadow-sm">
      {/* Left/Right Arrows */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="size-8"
          onClick={() => onDateChange(addDays(selectedDate, -1))}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="size-8"
          onClick={() => onDateChange(addDays(selectedDate, 1))}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Calendar + Today/Tomorrow */}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[200px] justify-start text-left"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              {format(selectedDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => onDateChange(date || new Date())}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button
          variant={
            selectedDate.toDateString() === today.toDateString()
              ? "default"
              : "secondary"
          }
          onClick={() => onDateChange(today)}
        >
          Today
        </Button>

        <Button
          variant={
            selectedDate.toDateString() === tomorrow.toDateString()
              ? "default"
              : "secondary"
          }
          onClick={() => onDateChange(tomorrow)}
        >
          Tomorrow
        </Button>
      </div>
    </div>
  );
}
