import { supabase } from "@/utils/supabase";
import { FerryItem } from "@/types/FerryItem";

export async function fetchSchedulesInRange(
  startDate: string,
  endDate: string
): Promise<FerryItem[]> {
  const { data, error } = await supabase
    .from("ferry_schedules")
    .select("*")
    .gte("schedule_date", startDate)
    .lte("schedule_date", endDate)
    .order("schedule_date", { ascending: true });

  if (error) {
    console.error("❌ Error fetching schedule range:", error);
    return [];
  }

  return data ?? [];
}
