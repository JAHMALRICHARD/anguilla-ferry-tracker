"use client";

import { X, Pencil } from "lucide-react";
import { FerryItem } from "../../types/FerryProps";
import { parseISO, format, startOfWeek, addDays } from "date-fns";

interface PreviewModalProps {
  isPreviewing: boolean;
  onClose: () => void;
  previewSchedules: FerryItem[];
  onBack?: () => void;
}

function groupByWeekAndDate(schedules: FerryItem[]) {
  const weekMap = new Map<string, Map<string, FerryItem[]>>();

  schedules.forEach((item) => {
    const dateObj = parseISO(item.schedule_date);

    const weekStart = format(
      startOfWeek(dateObj, { weekStartsOn: 1 }),
      "yyyy-MM-dd"
    );
    const dateKey = format(dateObj, "yyyy-MM-dd");

    if (!weekMap.has(weekStart)) weekMap.set(weekStart, new Map());
    const dayMap = weekMap.get(weekStart)!;
    if (!dayMap.has(dateKey)) dayMap.set(dateKey, []);
    dayMap.get(dateKey)!.push(item);
  });

  for (const [, dayMap] of weekMap) {
    for (const [, trips] of dayMap) {
      trips.sort((a, b) =>
        (a.departure_time ?? "00:00").localeCompare(b.departure_time ?? "00:00")
      );
    }
  }

  return Array.from(weekMap.entries()).sort(([a], [b]) => a.localeCompare(b));
}

export function PreviewModal({
  isPreviewing,
  onClose,
  previewSchedules,
}: PreviewModalProps) {
  if (!isPreviewing) return null;

  const grouped = groupByWeekAndDate(previewSchedules);

  function isOutbound(item: FerryItem) {
    return (
      item.departure_port.includes("Blowing Point") &&
      item.arrival_port.includes("Marigot")
    );
  }

  function isReturn(item: FerryItem) {
    return (
      item.departure_port.includes("Marigot") &&
      item.arrival_port.includes("Blowing Point")
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-background text-foreground rounded-2xl p-6 shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border space-y-6">
        <button
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h3 className="text-2xl font-semibold">
            📅 Preview of Cloned Schedules
          </h3>
          <p className="text-sm text-muted-foreground">
            Showing <strong>{previewSchedules.length}</strong> ferry trips.
          </p>
        </div>

        {grouped.map(([weekStart, dayMap]) => (
          <div key={weekStart} className="space-y-4">
            <h4 className="text-lg font-medium">
              Week of {format(parseISO(weekStart), "MMMM d")} –{" "}
              {format(addDays(parseISO(weekStart), 6), "MMMM d")}
            </h4>

            {Array.from(dayMap.entries())
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([date, trips]) => {
                const outbound = trips.filter(isOutbound);
                const inbound = trips.filter(isReturn);

                return (
                  <div key={date} className="space-y-2">
                    <h5 className="font-medium text-muted-foreground">
                      {format(parseISO(date), "EEEE, MMMM d")}
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h6 className="text-sm font-semibold mb-2 text-primary">
                          Outbound Trips
                        </h6>
                        <ScheduleTable trips={outbound} />
                      </div>
                      <div>
                        <h6 className="text-sm font-semibold mb-2 text-green-600">
                          Return Trips
                        </h6>
                        <ScheduleTable trips={inbound} />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ))}

        <div className="pt-4 text-right">
          <button
            onClick={onClose}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ScheduleTable({ trips }: { trips: FerryItem[] }) {
  if (trips.length === 0)
    return (
      <p className="text-sm italic text-muted-foreground">No trips scheduled</p>
    );

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-muted text-muted-foreground text-xs uppercase">
          <tr>
            <th className="px-3 py-2">Time</th>
            <th className="px-3 py-2">Operator</th>
            <th className="px-3 py-2">Departure</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2 text-center">Edit</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((item) => (
            <tr key={item.id} className="border-t border-border">
              <td className="px-3 py-2 whitespace-nowrap">
                {item.departure_time}
              </td>
              <td className="px-3 py-2 whitespace-nowrap">{item.operator}</td>
              <td className="px-3 py-2 whitespace-nowrap">
                {item.departure_port || "-"}
              </td>
              <td className="px-3 py-2 whitespace-nowrap">{item.status}</td>
              <td className="px-3 py-2 text-center">
                <button
                  onClick={() => alert("Edit coming soon")}
                  className="text-primary hover:underline flex items-center justify-center gap-1 text-xs"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
