export function convertTo24Hour(time: string): string {
  if (!time) return "00:00";

  const [timePart, modifierRaw] = time.trim().split(" ");
  const [hoursStr, minutesStr] = timePart.split(":");

  let hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  const modifier = modifierRaw?.toLowerCase();

  if (!modifier) {
    // Assume it's already 24-hour format
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  }

  if (modifier === "pm" && hours !== 12) hours += 12;
  if (modifier === "am" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}
