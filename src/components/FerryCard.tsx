import React from 'react';
import { DollarSignIcon } from 'lucide-react';
interface FerryCardProps {
  id: number;
  operator: string;
  departurePort: string;
  arrivalPort: string;
  departureTime: string;
  arrivalTime: string;
  price: string;
  duration: string;
  vesselName: string;
  status: 'on-time' | 'delayed' | 'cancelled';
  logoUrl: string;
}
export function FerryCard({
  operator,
  departurePort,
  arrivalPort,
  departureTime,
  arrivalTime,
  price,
  duration,
  vesselName,
  status,
  logoUrl
}: FerryCardProps) {
  const statusColors = {
    'on-time': 'bg-green-100 text-green-800',
    delayed: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  const statusLabels = {
    'on-time': 'On Time',
    delayed: 'Delayed',
    cancelled: 'Cancelled'
  };
  return <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {logoUrl && <img src={logoUrl} alt={`${operator} logo`} className="h-10 w-10 mr-3 rounded-full object-contain bg-gray-50" />}
            <div>
              <h3 className="text-lg font-medium text-gray-900">{operator}</h3>
              <p className="text-sm text-gray-500">{vesselName}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {statusLabels[status]}
          </span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1">
            <p className="text-sm text-gray-500">Departure</p>
            <p className="text-lg font-medium">{departureTime}</p>
            <p className="text-sm font-medium text-gray-700">{departurePort}</p>
          </div>
          <div className="px-4">
            <div className="w-20 h-[2px] bg-gray-300 relative">
              <div className="absolute -top-1 -right-1 w-2 h-2 transform rotate-45 border-t-2 border-r-2 border-gray-300"></div>
            </div>
            <p className="text-xs text-center text-gray-500 mt-1">{duration}</p>
          </div>
          <div className="flex-1 text-right">
            <p className="text-sm text-gray-500">Arrival</p>
            <p className="text-lg font-medium">{arrivalTime}</p>
            <p className="text-sm font-medium text-gray-700">{arrivalPort}</p>
          </div>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center text-gray-700">
            <DollarSignIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">{price}</span>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </div>;
}