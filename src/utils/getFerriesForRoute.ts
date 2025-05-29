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

  if (routeTo === "To Anguilla - via Marigot") {
    // Generate virtual return trips (Marigot → Blowing Point)
    const outboundFerries = ferries.filter((ferry) => {
      const from = normalize(ferry.departure_port);
      const to = normalize(ferry.arrival_port);
      return from === "blowing point, anguilla" && to === "marigot, st. martin";
    });

    if (outboundFerries.length === 0) {
      console.warn(
        "⚠️ No outbound ferries found — cannot generate return trips."
      );
      return [];
    }

    const returnFerries = marigotReturnTimes.map((returnTime, index) => {
      const original = outboundFerries[index % outboundFerries.length];
      return {
        ...original,
        id: original.id + 10000 + index,
        departure_port: original.arrival_port, // Marigot
        arrival_port: original.departure_port, // Blowing Point
        departure_time: returnTime,
        direction: "to-anguilla",
        status: "scheduled",
        vessel_name: original.vessel_name,
        operator: original.operator,
      };
    });

    return returnFerries;
  }

  if (routeTo === "To St. Martin") {
    // Show only actual ferries from Blowing Point → Marigot
    return ferries.filter((ferry) => {
      const from = normalize(ferry.departure_port);
      const to = normalize(ferry.arrival_port);
      return from === "blowing point, anguilla" && to === "marigot, st. martin";
    });
  }

  // Default fallback
  return [];
}
