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
      const existing = ferries.find((f) => {
        return (
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
        departure_port: fallback.arrival_port, // Marigot
        arrival_port: fallback.departure_port, // Blowing Point
        departure_time: returnTime,
        direction: "to-anguilla",
        status: fallback.status, // 🛠 Use the real-time status
        vessel_name: fallback.vessel_name,
        operator: fallback.operator,
      };
    });

    return returnFerries;
  }

  if (routeTo === "To St. Martin") {
    return ferries.filter((ferry) => {
      const from = normalize(ferry.departure_port);
      const to = normalize(ferry.arrival_port);
      return from === "blowing point, anguilla" && to === "marigot, st. martin";
    });
  }

  return [];
}
