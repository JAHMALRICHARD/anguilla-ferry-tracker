"use client";

import { X, Pencil } from "lucide-react";
import { FerryItem } from "../FerryProps";
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
      startOfWeek(dateObj, { weekStartsOn: 1 }), // Start week on Monday
      "yyyy-MM-dd"
    );
    const dateKey = format(dateObj, "yyyy-MM-dd");

    // 🧪 Debug log (optional)
    // console.log(`📦 ${dateKey} grouped under week: ${weekStart}`);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-6xl max-h-[85vh] overflow-y-auto relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold mb-2">
          📅 Preview of Cloned Schedules
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Showing <strong>{previewSchedules.length}</strong> ferry trips.
        </p>

        {grouped.map(([weekStart, dayMap]) => (
          <div key={weekStart} className="mb-8">
            <h4 className="text-lg font-semibold mb-4">
              Week of {format(parseISO(weekStart), "MMMM d")} –{" "}
              {format(addDays(parseISO(weekStart), 6), "MMMM d")}
            </h4>

            {Array.from(dayMap.entries())
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([date, trips]) => {
                const outbound = trips.filter(isOutbound);
                const inbound = trips.filter(isReturn);

                return (
                  <div key={date} className="mb-6">
                    <h5 className="font-medium mb-2">
                      {format(parseISO(date), "EEEE, MMMM d")}
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h6 className="text-sm font-semibold mb-1 text-blue-600">
                          Outbound Trips
                        </h6>
                        <ScheduleTable trips={outbound} />
                      </div>
                      <div>
                        <h6 className="text-sm font-semibold mb-1 text-green-600">
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

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
    return <p className="text-sm italic text-gray-500">No trips scheduled</p>;

  return (
    <table className="w-full text-sm border border-gray-200 rounded">
      <thead className="bg-gray-100 text-left text-xs uppercase">
        <tr>
          <th className="px-3 py-2">Time</th>
          <th className="px-3 py-2">Operator</th>
          <th className="px-3 py-2">Vessel</th>
          <th className="px-3 py-2">Status</th>
          <th className="px-3 py-2 text-center">Edit</th>
        </tr>
      </thead>
      <tbody>
        {trips.map((item) => (
          <tr key={item.id} className="border-t">
            <td className="px-3 py-2">{item.departure_time}</td>
            <td className="px-3 py-2">{item.operator}</td>
            <td className="px-3 py-2">{item.vessel_name || "-"}</td>
            <td className="px-3 py-2">{item.status}</td>
            <td className="px-3 py-2 text-center">
              <button
                onClick={() => alert("Edit coming soon")}
                className="text-blue-500 hover:underline flex items-center justify-center gap-1 text-xs"
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
