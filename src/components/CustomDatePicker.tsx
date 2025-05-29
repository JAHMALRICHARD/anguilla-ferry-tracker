"use client";

import React, { useRef, useState } from "react";
import { CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function CustomDatePicker({
  selectedDate,
  onDateChange,
}: {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  return (
    <div
      className="flex items-center px-4 py-2 rounded-md border w-fit cursor-pointer bg-muted text-foreground border-border hover:bg-muted/80 transition"
      onClick={() => setIsOpen(true)}
    >
      <CalendarIcon className="h-5 w-5 text-muted-foreground mr-2" />
      <DatePicker
        selected={selectedDate}
        onChange={(date) => {
          if (date) {
            onDateChange(date);
            setIsOpen(false);
          }
        }}
        open={isOpen}
        onClickOutside={() => setIsOpen(false)}
        dateFormat="MMMM d, yyyy"
        readOnly
        className="bg-transparent text-sm font-medium outline-none w-36 cursor-pointer"
        calendarClassName="rounded-md border bg-popover text-popover-foreground shadow-md"
        popperPlacement="bottom-start"
        popperClassName="z-50"
        ref={ref}
      />
    </div>
  );
}
