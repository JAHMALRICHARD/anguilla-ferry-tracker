export function convertTo24Hour(time: string): string {
  const [timePart, modifier] = time.split(' ');
  const [hoursStr, minutesStr] = timePart.split(':');
  let hours = Number(hoursStr);
  const minutes = Number(minutesStr);

   if (modifier.toLowerCase() === 'pm' && hours !== 12) hours += 12
   if (modifier.toLowerCase() === 'am' && hours === 12) hours = 0

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
