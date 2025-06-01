"use client";

import { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  addMonths,
  addDays,
  eachDayOfInterval,
  startOfDay,
  endOfDay,
  differenceInCalendarWeeks,
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
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";

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

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [clonedResult, setClonedResult] = useState<FerryItemPreview[] | null>(
    null
  );

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
      end: startOfDay(dateRange.to),
    });

    const generated: FerryItemPreview[] = [];

    for (const baseDate of baseDays) {
      const baseDateStr = format(baseDate, "yyyy-MM-dd");
      const baseSchedules = baseWeekSchedules.filter(
        (s) => s.schedule_date === baseDateStr
      );

      if (baseSchedules.length === 0) continue;

      let cloneDate = addDays(baseDate, 8);
      while (cloneDate <= finalDate) {
        const clonedDateStr = format(cloneDate, "yyyy-MM-dd");

        baseSchedules.forEach((s) => {
          generated.push({
            ...s,
            id: crypto.randomUUID(),
            schedule_date: clonedDateStr,
          });
        });

        cloneDate = addDays(cloneDate, 8);
      }
    }

    return generated;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-background rounded-2xl p-6 shadow-xl w-full max-w-3xl space-y-5 max-h-[90vh] overflow-y-auto border">
          <h2 className="text-2xl font-semibold text-foreground">
            Clone Ferry Schedule
          </h2>

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
            <PopoverContent className="w-auto p-0 bg-popover text-popover-foreground">
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
            <label className="font-medium block mb-1 text-foreground">
              Clone Until Date
            </label>
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
              <PopoverContent className="w-auto p-0 bg-popover text-popover-foreground">
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

          <div className="text-sm text-muted-foreground">
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

            {/* ✅ Confirm Clone Button */}
            <Button
              disabled={isCloningLoading}
              onClick={() => {
                const result = generateClonedSchedules();
                if (!result) return;
                setClonedResult(result);
                setShowConfirmDialog(true);
              }}
            >
              {isCloningLoading ? "Cloning..." : "Confirm Clone"}
            </Button>
            <ConfirmDialog
              open={showConfirmDialog}
              title="Confirm Schedule Cloning"
              description="Are you sure you want to clone the selected schedules? This action cannot be undone."
              confirmText="Yes, Clone"
              cancelText="Cancel"
              isLoading={isCloningLoading}
              onCancel={() => setShowConfirmDialog(false)}
              onConfirm={async () => {
                if (!clonedResult) return;

                setIsCloningLoading(true);

                const { success, error } = await cloneSchedulePattern({
                  baseSchedules: clonedResult,
                });

                setIsCloningLoading(false);
                setShowConfirmDialog(false);
                onClose();

                if (success) {
                  toast("✅ Schedule Cloned", {
                    description: "The ferry schedule was successfully cloned.",
                  });
                } else {
                  console.error(error);
                  toast("❌ Clone Failed", {
                    description: "Something went wrong while cloning.",
                    className: "bg-destructive text-white",
                  });
                }
              }}
            />
          </div>
        </div>
      </div>

      <PreviewModal
        isPreviewing={isPreviewing}
        onClose={() => setIsPreviewing(false)}
        previewSchedules={previewSchedules}
        onBack={() => setIsPreviewing(false)}
      />
    </>
  );
}
