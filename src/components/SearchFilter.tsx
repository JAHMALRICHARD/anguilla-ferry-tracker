import React from 'react';
import { SearchIcon, FilterIcon } from 'lucide-react';
interface SearchFilterProps {
  direction: string;
  onDirectionChange: (direction: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}
export function SearchFilter({
  direction,
  onDirectionChange,
  searchQuery,
  onSearchChange
}: SearchFilterProps) {
  return <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <FilterIcon className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-gray-700 font-medium">Direction:</span>
          </div>
          <div className="flex space-x-2">
            <button className={`px-4 py-2 rounded-md text-sm font-medium ${direction === 'to-anguilla' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => onDirectionChange('to-anguilla')}>
              To Anguilla
            </button>
            <button className={`px-4 py-2 rounded-md text-sm font-medium ${direction === 'from-anguilla' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => onDirectionChange('from-anguilla')}>
              From Anguilla
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input type="text" placeholder="Search by port or operator..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={searchQuery} onChange={e => onSearchChange(e.target.value)} />
        </div>
      </div>
    </div>;
}