export function formatTime12Hour(time24: string): string {
  const [hourStr, minuteStr] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr.padStart(2, "0");

  const suffix = hour >= 12 ? "PM" : "AM";

  // Handle edge cases for 12 AM and 12 PM correctly
  if (hour === 0) {
    hour = 12; // Midnight -> 12 AM
  } else if (hour > 12) {
    hour -= 12;
  }

  return `${hour}:${minute} ${suffix}`;
}
