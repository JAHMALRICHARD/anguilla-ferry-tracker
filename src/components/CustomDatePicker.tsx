'use client'

import React, { useState, useRef } from 'react'
import { CalendarIcon } from 'lucide-react'
import DatePicker from 'react-datepicker'

export function CustomDatePicker({
  selectedDate,
  onDateChange
}: {
  selectedDate: Date
  onDateChange: (date: Date) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  return (
    <div
      className="flex items-center bg-[#1E2A3B] px-4 py-2 rounded-lg border border-gray-700 w-fit cursor-pointer"
      onClick={() => setIsOpen(true)}
    >
      <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
      <DatePicker
        selected={selectedDate}
        onChange={(date) => {
          if (date) {
            onDateChange(date)
            setIsOpen(false)
          }
        }}
        open={isOpen}
        onClickOutside={() => setIsOpen(false)}
        dateFormat="MMMM d, yyyy"
        readOnly
        className="bg-transparent text-white outline-none w-36"
        calendarClassName="bg-[#1E2A3B] text-white rounded-lg shadow-md border border-gray-700 w-auto"
        popperPlacement="bottom-start"
        popperClassName="z-50"
        ref={ref}
      />
    </div>
  )
}
