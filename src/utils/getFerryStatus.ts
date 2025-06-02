import { differenceInMinutes } from "date-fns";

interface GetFerryStatusOptions {
  scheduleDate: string; // format: "yyyy-MM-dd"
  departureTime: string; // format: "HH:mm"
  direction: "to-st-martin" | "to-anguilla";
  localNow: Date;
  correspondingStatus?: string; // for "to-anguilla" to check the return trip
}

export function getFerryStatus({
  scheduleDate,
  departureTime,
  direction,
  localNow,
  correspondingStatus,
}: GetFerryStatusOptions): {
  status: string;
  progressPercent: number;
} {
  const [depHour, depMin] = departureTime.split(":").map(Number);
  const [year, month, day] = scheduleDate.split("-").map(Number);
  const departure = new Date(year, month - 1, day, depHour, depMin);
  const eta = new Date(departure.getTime() + 30 * 60 * 1000);
  const afterETA10 = new Date(eta.getTime() + 10 * 60 * 1000);

  const todayStr = localNow.toISOString().split("T")[0];
  if (scheduleDate !== todayStr) {
    return { status: "SCHEDULED", progressPercent: 0 };
  }

  const now = localNow;
  const minutesSinceDeparture = differenceInMinutes(now, departure);
  const minutesToETA = differenceInMinutes(eta, now);

  // ⛴️ To Anguilla logic that depends on the other direction
  if (direction === "to-anguilla") {
    if (correspondingStatus === "SAILING") {
      return { status: "ON THE WAY", progressPercent: 50 };
    }
    if (correspondingStatus === "DOCKED") {
      return { status: "DOCKED IN AXA", progressPercent: 0 };
    }
  }

  // Shared ferry journey logic
  if (now < departure) {
    return { status: "SCHEDULED", progressPercent: 0 };
  }

  if (minutesSinceDeparture < 5) {
    return { status: "BOARDING", progressPercent: 0 };
  }

  if (minutesSinceDeparture >= 5 && now < eta) {
    return {
      status: "SAILING",
      progressPercent: Math.min(
        100,
        Math.round((minutesSinceDeparture / 30) * 100)
      ),
    };
  }

  if (minutesToETA <= 5 && now < eta) {
    return { status: "NOW ARRIVING", progressPercent: 95 };
  }

  if (now >= eta && now <= afterETA10) {
    return { status: "ARRIVED", progressPercent: 100 };
  }

  return { status: "SCHEDULED", progressPercent: 0 };
}
