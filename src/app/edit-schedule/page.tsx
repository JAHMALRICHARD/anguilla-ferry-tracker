"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { CheckIcon, XIcon, PlusIcon } from "lucide-react";

interface FerrySchedule {
  id: number;
  date: string;
  departureTime: string;
  operator: string;
  status: string;
  direction: string;
}

// export const metadata = {
//   title: "Edit Ferry Schedule",
// };

const operators = ["Lady Maria", "Diamond", "Excellence II", "Cheers II"];
const statuses = ["on-time", "delayed", "cancelled"];

export default function EditSchedulePage() {
  const [schedules, setSchedules] = useState<FerrySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<
    Record<number, Partial<FerrySchedule>>
  >({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSchedules = async () => {
      const { data, error } = await supabase
        .from("ferry_schedules")
        .select("*")
        .order("schedule_date", { ascending: true });

      if (data) setSchedules(data);
      if (error) console.error("❌ Error fetching schedule", error);
      setLoading(false);
    };

    fetchSchedules();
  }, []);

  const handleEditChange = (
    id: number,
    field: keyof FerrySchedule,
    value: string
  ) => {
    setEditing((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (id: number) => {
    const updated = editing[id];
    if (!updated) return;

    const { error } = await supabase
      .from("ferry_schedules")
      .update(updated)
      .eq("id", id);

    if (!error) {
      setSchedules((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
      );
      setEditing((prev) => {
        const newEdits = { ...prev };
        delete newEdits[id];
        return newEdits;
      });
      setMessage("✅ Schedule updated successfully!");
    } else {
      console.error("Update failed", error);
      setMessage("❌ Failed to update schedule.");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  const handleCancel = (id: number) => {
    setEditing((prev) => {
      const newEdits = { ...prev };
      delete newEdits[id];
      return newEdits;
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Edit Ferry Schedule</h1>

      {message && <div className="mb-4 text-green-400">{message}</div>}

      {loading ? (
        <p>Loading schedule...</p>
      ) : (
        <table className="w-full border border-gray-700 text-sm bg-[#1E2A3B]">
          <thead className="bg-[#151923] text-gray-300">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Operator</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Direction</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((ferry) => {
              return (
                <tr key={ferry.id} className="border-t border-gray-700">
                  <td className="p-3">{ferry.date}</td>
                  <td className="p-3">
                    <input
                      type="time"
                      value={
                        editing[ferry.id]?.departureTime || ferry.departureTime
                      }
                      onChange={(e) =>
                        handleEditChange(
                          ferry.id,
                          "departureTime",
                          e.target.value
                        )
                      }
                      className="bg-[#151923] border border-gray-600 rounded px-2 py-1 text-white"
                    />
                  </td>
                  <td className="p-3">
                    <select
                      value={editing[ferry.id]?.operator || ferry.operator}
                      onChange={(e) =>
                        handleEditChange(ferry.id, "operator", e.target.value)
                      }
                      className="bg-[#151923] border border-gray-600 rounded px-2 py-1 text-white"
                    >
                      {operators.map((op) => (
                        <option key={op} value={op}>
                          {op}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <select
                      value={editing[ferry.id]?.status || ferry.status}
                      onChange={(e) =>
                        handleEditChange(ferry.id, "status", e.target.value)
                      }
                      className="bg-[#151923] border border-gray-600 rounded px-2 py-1 text-white"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">{ferry.direction}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleSave(ferry.id)}
                      className="text-green-400 hover:text-green-300"
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCancel(ferry.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="mt-6">
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm">
          <PlusIcon className="w-4 h-4" />
          Add Next Month Schedule
        </button>
      </div>
    </div>
  );
}
