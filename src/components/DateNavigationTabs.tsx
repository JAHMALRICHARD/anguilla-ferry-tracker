import React from 'react'
import { ArrowRightIcon } from 'lucide-react'
import { addDays } from 'date-fns'
import { CustomDatePicker } from './CustomDatePicker'

export function DateNavigationTabs({
  selectedDate,
  onDateChange,
  route
}: {
  selectedDate: Date
  onDateChange: (date: Date) => void
  route: { from: string; to: string }
}) {
  const today = new Date()
  const tomorrow = addDays(new Date(), 1)

  const isToday = selectedDate.toDateString() === today.toDateString()
  const isTomorrow = selectedDate.toDateString() === tomorrow.toDateString()

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Tabs */}
      <div className="flex space-x-2">
        <button
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            isToday ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'
          }`}
          onClick={() => onDateChange(today)}
        >
          Today
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            isTomorrow ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'
          }`}
          onClick={() => onDateChange(tomorrow)}
        >
          Tomorrow
        </button>
      </div>

      {/* Date Picker + Route Info */}
      <div className="flex items-center gap-4">
        <CustomDatePicker selectedDate={selectedDate} onDateChange={onDateChange} />
        <div className="flex items-center space-x-2">
          <span className="text-gray-300">{route.from}</span>
          <ArrowRightIcon className="h-4 w-4 text-gray-400" />
          <span className="text-gray-300">{route.to}</span>
        </div>
      </div>
    </div>
  )
}
