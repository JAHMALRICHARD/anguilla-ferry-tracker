"use client";

import { X } from "lucide-react";
import { FerryItem } from "../FerryProps";

interface PreviewModalProps {
  isPreviewing: boolean;
  onClose: () => void;
  previewSchedules: FerryItem[];
}

export function PreviewModal({
  isPreviewing,
  onClose,
  previewSchedules,
}: PreviewModalProps) {
  if (!isPreviewing) return null;

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

        {/* Modal title */}
        <h3 className="text-xl font-bold mb-4">
          📅 Preview of Cloned Schedules
        </h3>

        {/* Preview List */}
        <ul className="space-y-2">
          {previewSchedules.map((ferry) => (
            <li
              key={ferry.id}
              className="border-b border-gray-200 pb-2 text-sm text-gray-700"
            >
              <strong>{ferry.schedule_date}</strong> — {ferry.departure_time} —{" "}
              {ferry.operator}
            </li>
          ))}
        </ul>

        {/* Footer actions */}
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
