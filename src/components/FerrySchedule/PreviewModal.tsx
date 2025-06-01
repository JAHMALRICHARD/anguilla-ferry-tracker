"use client";

import { X, Pencil } from "lucide-react";
import { FerryItem } from "../FerryProps";
import { parseISO, format, startOfWeek } from "date-fns";

interface PreviewModalProps {
  isPreviewing: boolean;
  onClose: () => void;
  previewSchedules: FerryItem[];
  onBack?: () => void; // Optional back handler
}

function groupByWeek(schedules: FerryItem[]) {
  const weekMap = new Map<string, FerryItem[]>();

  schedules.forEach((item) => {
    const date = parseISO(item.schedule_date);
    const weekStart = format(
      startOfWeek(date, { weekStartsOn: 0 }),
      "yyyy-MM-dd"
    );

    if (!weekMap.has(weekStart)) {
      weekMap.set(weekStart, []);
    }

    weekMap.get(weekStart)!.push(item);
  });

  for (const [, items] of weekMap) {
    items.sort((a, b) => {
      const aTime = a.departure_time ?? "00:00";
      const bTime = b.departure_time ?? "00:00";
      return aTime.localeCompare(bTime);
    });
  }

  return Array.from(weekMap.entries()).sort(([a], [b]) => a.localeCompare(b));
}

function exportToCSV(schedules: FerryItem[]) {
  const headers = [
    "Date",
    "Departure Time",
    "Operator",
    "Departure Port",
    "Arrival Port",
    "Vessel Name",
    "Status",
  ];

  const rows = schedules.map((s) => [
    s.schedule_date,
    s.departure_time,
    s.operator,
    s.departure_port,
    s.arrival_port,
    s.vessel_name,
    s.status,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((field) => `"${field}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "cloned_schedules_preview.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function PreviewModal({
  isPreviewing,
  onClose,
  previewSchedules,
  onBack,
}: PreviewModalProps) {
  if (!isPreviewing) return null;

  const grouped = groupByWeek(previewSchedules);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
        {/* Close button */}
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
          Showing <strong>{previewSchedules.length}</strong> ferry trips in
          total.
        </p>

        {/* Export & Back */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => exportToCSV(previewSchedules)}
            className="text-blue-600 hover:underline text-sm"
          >
            📁 Export to CSV
          </button>

          {onBack && (
            <button
              onClick={onBack}
              className="text-sm text-gray-600 hover:text-black"
            >
              ← Back to Date Selection
            </button>
          )}
        </div>

        {/* Grouped Preview */}
        {grouped.map(([weekStart, items]) => (
          <div
            key={weekStart}
            className="mb-6 p-4 rounded-md border border-gray-200 bg-gray-50"
          >
            <h4 className="font-semibold text-lg mb-2">
              Week of {format(parseISO(weekStart), "MMMM d")}
            </h4>
            <ul className="space-y-1 pl-4 border-l border-gray-200">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="text-sm text-gray-700 flex justify-between"
                >
                  <div>
                    <strong>
                      {format(parseISO(item.schedule_date), "EEE, MMM d")}
                    </strong>{" "}
                    — {item.departure_time} — {item.operator} —{" "}
                    <span className="italic">
                      {item.departure_port} → {item.arrival_port}
                    </span>
                  </div>
                  <button
                    className="text-blue-500 hover:underline text-xs flex items-center gap-1"
                    onClick={() => alert("Edit coming soon")}
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Footer */}
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
