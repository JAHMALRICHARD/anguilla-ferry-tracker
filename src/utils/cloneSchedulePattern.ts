// utils/cloneSchedulePattern.ts
import { format, addDays } from "date-fns";
import { FerryItem } from "@/types/FerryItem";
import { supabase } from "@/utils/supabase";

export async function cloneSchedulePattern({
  baseSchedules,
  numberOfWeeks,
  daysPerWeek = 7,
}: {
  baseSchedules: FerryItem[];
  startDate: string; // e.g., "2025-06-01"
  numberOfWeeks: number;
  daysPerWeek?: number;
}) {
  const clones: FerryItem[] = [];

  for (let week = 1; week <= numberOfWeeks; week++) {
    const offsetDays = daysPerWeek * week;

    for (const s of baseSchedules) {
      const newDate = addDays(new Date(s.schedule_date), offsetDays);
      clones.push({
        ...s,
        id: crypto.randomUUID(),
        schedule_date: format(newDate, "yyyy-MM-dd"),
      });
    }
  }

  const { error } = await supabase.from("ferry_schedules").upsert(clones);
  return { success: !error, error };
}
