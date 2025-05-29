import React from "react";
import { DollarSignIcon } from "lucide-react";

interface FerryCardProps {
  id: number;
  operator: string;
  departure_port: string;
  arrival_port: string;
  departure_time: string;
  arrival_time: string;
  price: string;
  duration: string;
  vessel_name: string;
  status: "on-time" | "delayed" | "cancelled";
  logo_url: string;
}

export function FerryCard({
  operator,
  departure_port,
  arrival_port,
  departure_time,
  arrival_time,
  price,
  duration,
  vessel_name,
  status,
  logo_url,
}: FerryCardProps) {
  const statusColors = {
    "on-time": "bg-green-100 text-green-800",
    delayed: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    "on-time": "On Time",
    delayed: "Delayed",
    cancelled: "Cancelled",
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800">{operator}</h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
          >
            {statusLabels[status]}
          </span>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          <div>
            <strong>From:</strong> {departure_port}
          </div>
          <div>
            <strong>To:</strong> {arrival_port}
          </div>
          <div>
            <strong>Departure:</strong> {departure_time}
          </div>
          <div>
            <strong>Arrival:</strong> {arrival_time}
          </div>
          <div>
            <strong>Vessel:</strong> {vessel_name || "—"}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <DollarSignIcon className="w-4 h-4" />
            <span>{price}</span>
          </div>
          <div>{duration}</div>
        </div>
      </div>
      {logo_url && (
        <div className="bg-gray-100 p-2 flex justify-center">
          <img src={logo_url} alt={`${operator} logo`} className="h-6" />
        </div>
      )}
    </div>
  );
}
