export function getSecondsUntilArrival(departureTime: string, duration: string, dateStr: string): number {
  try {
    const [month, day, year] = dateStr.split('-');
    const [timeStr, modifier] = departureTime.trim().split(' ');

    const [hoursStr, minutesStr] = timeStr.split(':');
    let hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    if (modifier.toLowerCase() === 'pm' && hours !== 12) hours += 12;
    if (modifier.toLowerCase() === 'am' && hours === 12) hours = 0;

    const departure = new Date(`20${year}-${month}-${day}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);
    const durationMs = parseInt(duration, 10) * 60 * 1000;

    const arrivalTime = departure.getTime() + durationMs;
    const now = Date.now();

    return Math.max(Math.floor((arrivalTime - now) / 1000), 0);
  } catch (error) {
    console.error('Error in getSecondsUntilArrival:', error);
    return 0;
  }
}
