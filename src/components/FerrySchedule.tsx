import React from 'react';
import { FerryCard } from './FerryCard';
import { ferryData } from '../data/from-anguilla-ferry-data';
import { CalendarIcon, InfoIcon } from 'lucide-react';
interface FerryScheduleProps {
  direction: string;
  searchQuery: string;
}
export function FerrySchedule({
  direction,
  searchQuery
}: FerryScheduleProps) {
  // Filter the ferry data based on direction and search query
  const filteredFerries = ferryData.filter(ferry => {
    const matchesDirection = ferry.direction === direction;
    const matchesSearch = ferry.operator.toLowerCase().includes(searchQuery.toLowerCase()) || ferry.departurePort.toLowerCase().includes(searchQuery.toLowerCase()) || ferry.arrivalPort.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDirection && (searchQuery === '' || matchesSearch);
  });
  return <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {direction === 'to-anguilla' ? 'Ferries to Anguilla' : 'Ferries from Anguilla'}
        </h2>
        <div className="flex items-center text-sm text-gray-600">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>
            Today,{' '}
            {new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
          </span>
        </div>
      </div>
      {filteredFerries.length > 0 ? <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {filteredFerries.map(ferry => (
            <FerryCard
              key={ferry.id}
              {...ferry}
              status={ferry.status as 'on-time' | 'delayed' | 'cancelled'}
            />
          ))}
        </div> : <div className="bg-blue-50 p-6 rounded-lg text-center">
          <div className="flex justify-center mb-2">
            <InfoIcon className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No ferry schedules found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria to see available
            ferries.
          </p>
        </div>}
    </div>;
}