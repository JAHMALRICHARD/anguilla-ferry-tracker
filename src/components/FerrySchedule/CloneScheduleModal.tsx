"use client";

import { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  addMonths,
  addDays,
  eachDayOfInterval,
  startOfDay,
  differenceInCalendarWeeks,
  endOfDay,
} from "date-fns";
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
import { supabase } from "@/utils/supabase";

interface CloneScheduleModalProps {
  isCloning: boolean;
  onClose: () => void;
  setIsCloningLoading: (value: boolean) => void;
  isCloningLoading: boolean;
}

type FerryItemPreview = FerryItem & { id: number | string };

const nextMonthStart = startOfMonth(addMonths(new Date(), 1));
const defaultRange: DateRange = {
  from: nextMonthStart,
  to: addDays(nextMonthStart, 7),
};

export function CloneScheduleModal({
  isCloning,
  onClose,
  setIsCloningLoading,
  isCloningLoading,
}: CloneScheduleModalProps) {
  const [dateRange, setDateRange] = useState<DateRange>(defaultRange);
  const [finalDate, setFinalDate] = useState<Date | undefined>(
    new Date("2025-07-02")
  );
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewSchedules, setPreviewSchedules] = useState<FerryItemPreview[]>(
    []
  );
  const [baseWeekSchedules, setBaseWeekSchedules] = useState<FerryItem[]>([]);

  useEffect(() => {
    const fetchBaseWeekSchedules = async () => {
      if (!dateRange.from || !dateRange.to) return;

      const fromDate = format(startOfDay(dateRange.from), "yyyy-MM-dd");
      const toDate = format(endOfDay(dateRange.to), "yyyy-MM-dd");

      const { data, error } = await supabase
        .from("ferry_schedules")
        .select("*")
        .gte("schedule_date", fromDate)
        .lte("schedule_date", toDate);

      if (error) {
        console.error("❌ Error fetching base week schedules:", error.message);
      } else {
        setBaseWeekSchedules(data || []);
      }
    };

    fetchBaseWeekSchedules();
  }, [dateRange]);

  if (!isCloning) return null;

  const generateClonedSchedules = (): FerryItemPreview[] | null => {
    if (!dateRange.from || !dateRange.to || !finalDate) {
      alert("Please select both a base week and a final clone date.");
      return null;
    }

    const baseDays = eachDayOfInterval({
      start: startOfDay(dateRange.from),
      end: endOfDay(dateRange.to), // ✅ this includes June 8
    });

    const baseDateMap = new Map<string, FerryItem[]>();
    baseDays.forEach((d) => {
      const dateStr = format(d, "yyyy-MM-dd");
      const matches = baseWeekSchedules.filter(
        (s) => s.schedule_date === dateStr
      );

      baseDateMap.set(dateStr, matches);
    });

    const missingDays = baseDays.filter(
      (d) => (baseDateMap.get(format(d, "yyyy-MM-dd"))?.length ?? 0) === 0
    );

    if (missingDays.length > 0) {
      alert(
        `⚠️ Some days in the base week are missing schedule data:\n${missingDays
          .map((d) => format(d, "MMM d"))
          .join(", ")}`
      );
      return null;
    }

    const generated: FerryItemPreview[] = [];

    for (let i = 0; ; i++) {
      let allPastFinal = true;

      for (const baseDate of baseDays) {
        const clonedDate = addDays(baseDate, i * 7);
        if (clonedDate > finalDate) continue;

        allPastFinal = false;

        const baseDateStr = format(baseDate, "yyyy-MM-dd");
        const clonedDateStr = format(clonedDate, "yyyy-MM-dd");

        const schedulesForDay = baseDateMap.get(baseDateStr) || [];

        for (const s of schedulesForDay) {
          generated.push({
            ...s,
            id: crypto.randomUUID(),
            schedule_date: clonedDateStr,
          });
        }
      }

      if (allPastFinal) break;
    }

    return generated;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-3xl space-y-4 max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold">Clone Ferry Schedule</h2>

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

          <div>
            <label className="font-medium block mb-1">Clone Until Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {finalDate ? format(finalDate, "PPP") : "Pick end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={finalDate}
                  onSelect={(date) => setFinalDate(date ?? undefined)}
                  fromDate={addDays(new Date(), 1)}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="text-sm text-gray-600">
            This will generate{" "}
            <strong>
              {finalDate && dateRange.from
                ? differenceInCalendarWeeks(finalDate, dateRange.from)
                : 0}{" "}
              weeks
            </strong>{" "}
            of cloned schedules.
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="ghost"
              onClick={() => {
                const result = generateClonedSchedules();
                if (result) {
                  setPreviewSchedules(result);
                  setIsPreviewing(true);
                }
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
                const result = generateClonedSchedules();
                if (!result) return;

                setIsCloningLoading(true);

                const { success, error } = await cloneSchedulePattern({
                  baseSchedules: result,
                  startDate: format(dateRange.from!, "yyyy-MM-dd"),
                  numberOfWeeks: 0,
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

      <PreviewModal
        isPreviewing={isPreviewing}
        onClose={() => setIsPreviewing(false)}
        previewSchedules={previewSchedules}
        onBack={() => {
          setIsPreviewing(false);
        }}
      />
    </>
  );
}
