// utils/getFerriesForRoute.ts
import { FerryItem } from "@/types/FerryProps";

export function getFerriesForRoute(
  routeTo: string,
  ferries: FerryItem[],
  mode: "upcoming" | "past" = "upcoming"
): FerryItem[] {
  console.log("🛳️ Route selected:", routeTo);
  console.log("🔍 Total ferries received:", ferries.length);

  const normalize = (str: string | undefined) =>
    str?.toLowerCase().trim() || "";

  const marigotReturnTimes = [
    "08:30:00",
    "09:30:00",
    "10:30:00",
    "12:00:00",
    "13:30:00",
    "15:00:00",
    "16:30:00",
    "17:15:00",
    "18:00:00",
  ];

  if (!ferries.length) return [];

  const selectedDate = ferries[0].schedule_date;

  if (routeTo === "To Anguilla - via Marigot") {
    const realReturns = ferries.filter(
      (f) =>
        normalize(f.departure_port) === "marigot, st. martin" &&
        normalize(f.arrival_port) === "blowing point, anguilla" &&
        f.schedule_date === selectedDate
    );

    if (mode === "past") return realReturns;

    const outboundFerries = ferries.filter(
      (ferry) =>
        ferry.schedule_date === selectedDate &&
        normalize(ferry.departure_port) === "blowing point, anguilla" &&
        normalize(ferry.arrival_port) === "marigot, st. martin"
    );

    const prNow = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/Puerto_Rico" })
    );

    const filledReturns: FerryItem[] = marigotReturnTimes
      .map((returnTime, index) => {
        const [hour, minute] = returnTime.split(":").map(Number);
        const ferryDateTime = new Date(`${selectedDate}T${returnTime}`);
        ferryDateTime.setHours(hour, minute, 0, 0);

        if (ferryDateTime <= prNow) return null;

        const real = realReturns.find((f) => f.departure_time === returnTime);
        if (real) return real;

        if (outboundFerries.length === 0) return null;
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
          status: "SCHEDULED",
        };
      })
      .filter((ferry): ferry is FerryItem => ferry !== null);

    return filledReturns.sort((a, b) =>
      a.departure_time.localeCompare(b.departure_time)
    );
  }

  if (routeTo === "To St. Martin") {
    return ferries.filter(
      (ferry) =>
        ferry.schedule_date === selectedDate &&
        normalize(ferry.departure_port) === "blowing point, anguilla" &&
        normalize(ferry.arrival_port) === "marigot, st. martin"
    );
  }

  return [];
}
