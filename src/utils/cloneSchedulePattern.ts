// utils/cloneSchedulePattern.ts
import { FerryItem } from "@/types/FerryItem";
import { supabase } from "@/utils/supabase";

// 👇 Define an insert-safe version of FerryItem
type FerryItemInsert = Omit<FerryItem, "id">;

export async function cloneSchedulePattern({
  baseSchedules,
}: {
  baseSchedules: FerryItem[];
}) {
  if (!baseSchedules || baseSchedules.length === 0) {
    return { success: false, error: "No schedules to insert" };
  }

  // Strip out 'id' field for Supabase auto-generation
  const cleaned: FerryItemInsert[] = baseSchedules.map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ id, ...rest }) => rest
  );

  // Debug logs
  console.log("📤 Inserting cloned schedules:", cleaned);

  const grouped = cleaned.reduce((acc, item) => {
    const date = item.schedule_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {} as Record<string, FerryItemInsert[]>);

  console.log("🗓️ Cloned schedule breakdown by day:");
  Object.entries(grouped).forEach(([date, trips]) => {
    console.log(`- ${date}: ${trips.length} trips`);
  });

  // Insert into Supabase
  const { error } = await supabase.from("ferry_schedules").insert(cleaned);
  return { success: !error, error: error?.message };
}
