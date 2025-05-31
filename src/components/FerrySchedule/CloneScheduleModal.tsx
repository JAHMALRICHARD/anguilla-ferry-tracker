"use client";

import { useState } from "react";
import { format, startOfMonth, addMonths, addDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FerryItem } from "@/types/FerryItem";
import { cloneSchedulePattern } from "@/utils/cloneSchedulePattern";
import { PreviewModal } from "@/components/FerrySchedule/PreviewModal";

interface CloneScheduleModalProps {
  isCloning: boolean;
  onClose: () => void;
  schedules: FerryItem[];
  setIsCloningLoading: (value: boolean) => void;
  isCloningLoading: boolean;
}

// Local type for preview with flexible ID
type FerryItemPreview = FerryItem & { id: number | string };

// Default range: next month 1st to 8th
const nextMonthStart = startOfMonth(addMonths(new Date(), 1));
const defaultRange: DateRange = {
  from: nextMonthStart,
  to: addDays(nextMonthStart, 7),
};

export function CloneScheduleModal({
  isCloning,
  onClose,
  schedules,
  setIsCloningLoading,
  isCloningLoading,
}: CloneScheduleModalProps) {
  const [cloneWeeks, setCloneWeeks] = useState(3);
  const [dateRange, setDateRange] = useState<DateRange>(defaultRange);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewSchedules, setPreviewSchedules] = useState<FerryItemPreview[]>(
    []
  );

  if (!isCloning) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-3xl space-y-4 max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold">Clone Ferry Schedule</h2>
          <p>Clone this week&apos;s schedule to how many future weeks?</p>

          <input
            type="number"
            value={cloneWeeks}
            onChange={(e) => setCloneWeeks(Number(e.target.value))}
            className="w-full border rounded p-2"
            min={1}
            max={12}
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from && dateRange.to
                  ? `${format(dateRange.from, "MMM d")} – ${format(
                      dateRange.to,
                      "MMM d"
                    )}`
                  : "Select base week"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) =>
                  setDateRange(range ?? { from: undefined, to: undefined })
                }
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <div className="flex justify-end gap-4">
            <Button
              variant="ghost"
              onClick={() => {
                if (!dateRange.from || !dateRange.to) {
                  alert("Please select a base week first.");
                  return;
                }

                const baseWeekSchedules = schedules.filter((s) => {
                  const d = new Date(s.schedule_date);
                  return d >= dateRange.from! && d <= dateRange.to!;
                });

                const newSchedules: FerryItemPreview[] = [];

                for (let i = 1; i <= cloneWeeks; i++) {
                  baseWeekSchedules.forEach((s) => {
                    const originalDate = new Date(s.schedule_date);
                    const clonedDate = new Date(originalDate);
                    clonedDate.setDate(originalDate.getDate() + 7 * i);

                    newSchedules.push({
                      ...s,
                      id: crypto.randomUUID(),
                      schedule_date: format(clonedDate, "yyyy-MM-dd"),
                    });
                  });
                }

                setPreviewSchedules(newSchedules);
                setIsPreviewing(true);
              }}
            >
              🔍 Preview
            </Button>

            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button
              disabled={isCloningLoading}
              onClick={async () => {
                if (!dateRange?.from || !dateRange?.to) {
                  alert("Please select a base week first.");
                  return;
                }

                setIsCloningLoading(true);

                const baseSchedules = schedules.filter((s) => {
                  const d = new Date(s.schedule_date);
                  return d >= dateRange.from! && d <= dateRange.to!;
                });

                const { success, error } = await cloneSchedulePattern({
                  baseSchedules,
                  startDate: format(dateRange.from, "yyyy-MM-dd"),
                  numberOfWeeks: cloneWeeks,
                });

                setIsCloningLoading(false);
                onClose();

                if (success) {
                  alert("✅ Schedule cloned successfully!");
                } else {
                  console.error(error);
                  alert("❌ Failed to clone schedules.");
                }
              }}
            >
              {isCloningLoading ? "Cloning..." : "Confirm Clone"}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isPreviewing={isPreviewing}
        onClose={() => setIsPreviewing(false)}
        previewSchedules={previewSchedules}
      />
    </>
  );
}
