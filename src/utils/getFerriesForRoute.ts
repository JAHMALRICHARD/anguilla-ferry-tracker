// utils/getFerriesForRoute.ts
import { FerryItem } from "@/components/FerryProps";

export function getFerriesForRoute(
  routeTo: string,
  ferries: FerryItem[]
): FerryItem[] {
  console.log("🛳️ Route selected:", routeTo);
  console.log("🔍 Total ferries received:", ferries.length);

  const normalize = (str: string | undefined) =>
    str?.toLowerCase().trim() || "";

  const marigotReturnTimes = [
    "08:30",
    "09:30",
    "10:30",
    "12:00",
    "13:30",
    "15:00",
    "16:30",
    "17:15",
    "18:00",
  ];

  if (!ferries.length) return [];

  // Infer selected date from ferry data
  const selectedDate = ferries[0].schedule_date;

  if (routeTo === "To Anguilla - via Marigot") {
    // Find outbound ferries (Anguilla to St. Martin) for that day
    const outboundFerries = ferries.filter((ferry) => {
      const from = normalize(ferry.departure_port);
      const to = normalize(ferry.arrival_port);
      return (
        ferry.schedule_date === selectedDate &&
        from === "blowing point, anguilla" &&
        to === "marigot, st. martin"
      );
    });

    if (outboundFerries.length === 0) {
      console.warn(
        `⚠️ No outbound ferries found on ${selectedDate} — cannot generate return trips.`
      );
      return [];
    }

    const returnFerries = marigotReturnTimes.map((returnTime, index) => {
      const existing = ferries.find((f) => {
        return (
          f.schedule_date === selectedDate &&
          normalize(f.departure_port) === "marigot, st. martin" &&
          normalize(f.arrival_port) === "blowing point, anguilla" &&
          f.departure_time === returnTime
        );
      });

      if (existing) return existing;

      const fallback = outboundFerries[index % outboundFerries.length];

      return {
        ...fallback,
        id: Number(fallback.id) + 10000 + index,
        departure_port: "Marigot, St. Martin",
        arrival_port: "Blowing Point, Anguilla",
        departure_time: returnTime,
        schedule_date: selectedDate,
        direction: "to-anguilla",
        vessel_name: fallback.vessel_name,
        operator: fallback.operator,
        status: fallback.status,
      };
    });

    console.log(`🔁 Generated ${returnFerries.length} return ferries`);
    return returnFerries;
  }

  if (routeTo === "To St. Martin") {
    return ferries.filter((ferry) => {
      const from = normalize(ferry.departure_port);
      const to = normalize(ferry.arrival_port);
      return (
        ferry.schedule_date === selectedDate &&
        from === "blowing point, anguilla" &&
        to === "marigot, st. martin"
      );
    });
  }

  return [];
}
