"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { CheckIcon, XIcon, UndoIcon } from "lucide-react";
import { format, isBefore } from "date-fns";

interface FerrySchedule {
  id: number;
  schedule_date: string;
  departure_time: string;
  operator: string;
  status: string;
  direction: string;
}

const statuses = ["on-time", "delayed", "cancelled"];
const directions = ["from-anguilla", "to-anguilla"];

export default function EditSchedulePage() {
  const [schedules, setSchedules] = useState<FerrySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<
    Record<number, Partial<FerrySchedule>>
  >({});
  const [originals, setOriginals] = useState<Record<number, FerrySchedule>>({});
  const [toast, setToast] = useState("");
  const [directionFilter, setDirectionFilter] = useState("");
  const [editDate, setEditDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [operators, setOperators] = useState<string[]>([]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    const fetchOperators = async () => {
      const { data, error } = await supabase
        .from("ferry_schedules")
        .select("operator");

      if (data && !error) {
        const unique = [...new Set(data.map((item) => item.operator))];
        setOperators(unique);
      }
    };
    fetchOperators();
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("ferry_schedules")
        .select("*")
        .eq("schedule_date", editDate)
        .order("departure_time", { ascending: true });

      if (data && !error) {
        setSchedules(data);
        const originalMap: Record<number, FerrySchedule> = {};
        data.forEach((d) => (originalMap[d.id] = { ...d }));
        setOriginals(originalMap);
      }

      if (error) console.error("❌ Error fetching schedule:", error.message);
      setLoading(false);
    };

    fetchSchedules();
  }, [editDate]);

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
      showToast("✅ Schedule updated!");
    } else {
      console.error("Update failed", error);
      showToast("❌ Update failed.");
    }
  };

  const handleCancel = (id: number) => {
    setEditing((prev) => {
      const newEdits = { ...prev };
      delete newEdits[id];
      return newEdits;
    });
  };

  const handleUndo = (id: number) => {
    const original = originals[id];
    if (!original) return;
    setEditing((prev) => ({
      ...prev,
      [id]: { ...original },
    }));
  };

  const filteredSchedules = directionFilter
    ? schedules.filter((s) => s.direction === directionFilter)
    : schedules;

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Ferry Schedule</h1>
        <div className="text-sm text-gray-300">
          Total ferries: <strong>{filteredSchedules.length}</strong>
        </div>
      </div>

      {toast && (
        <div className="mb-4 bg-green-700 text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div>
          <label className="mr-2 text-sm">Filter by direction:</label>
          <select
            value={directionFilter}
            onChange={(e) => setDirectionFilter(e.target.value)}
            className="bg-[#151923] border border-gray-600 text-white px-2 py-1 rounded"
          >
            <option value="">All</option>
            {directions.map((dir) => (
              <option key={dir} value={dir}>
                {dir}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2 text-sm">Edit date:</label>
          <input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            className="bg-[#151923] border border-gray-600 text-white px-2 py-1 rounded"
          />
        </div>
      </div>

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
            {filteredSchedules.map((ferry) => {
              const currentTime = new Date();
              const ferryTime = new Date(
                `${ferry.schedule_date}T${ferry.departure_time}`
              );
              const isPast = isBefore(ferryTime, currentTime);

              const overlapping = schedules.some(
                (s) =>
                  s.id !== ferry.id &&
                  s.schedule_date === ferry.schedule_date &&
                  s.departure_time === ferry.departure_time &&
                  s.direction === ferry.direction
              );

              return (
                <tr
                  key={ferry.id}
                  className={`border-t border-gray-700 ${
                    isPast ? "text-gray-500" : "text-white"
                  } ${overlapping ? "bg-red-900" : ""}`}
                >
                  <td className="p-3">{ferry.schedule_date}</td>
                  <td className="p-3">
                    <input
                      type="time"
                      value={
                        editing[ferry.id]?.departure_time ||
                        ferry.departure_time
                      }
                      onChange={(e) =>
                        handleEditChange(
                          ferry.id,
                          "departure_time",
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
                      className="text-green-400"
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCancel(ferry.id)}
                      className="text-red-400"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleUndo(ferry.id)}
                      className="text-yellow-400"
                    >
                      <UndoIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
