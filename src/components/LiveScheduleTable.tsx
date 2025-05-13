'use client'

import React, { useEffect, useState } from 'react'
import { ArrowRightIcon } from 'lucide-react'
import Image from 'next/image'
import 'react-datepicker/dist/react-datepicker.css'
import { getSecondsUntilArrival } from '../helpers/getSecondsUntilArrival'

import { ferryData } from '../data/from-anguilla-ferry-data'
import { convertTo24Hour } from '../helpers/convertTo24Hour'
import { FerryProgress } from './FerryProgress'
import { CustomDatePicker } from './CustomDatePicker' // adjust path if needed
import { FerryDetailsCard } from './FerryDetailsCard'
import { addDays } from 'date-fns'

interface FerryItem {
  id: number
  operator: string
  departurePort: string
  arrivalPort: string
  departureTime: string
  arrivalTime: string
  price: string
  duration: string
  vesselName: string
  status: string
  direction: string
  date: string
  logoUrl: string
}

interface LiveScheduleTableProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  route: { from: string; to: string }
  onRouteChange: (route: { from: string; to: string }) => void
}

function useCountdown(targetTime: string | null) {
  const [timeLeft, setTimeLeft] = useState(600)

  useEffect(() => {
    if (!targetTime) {
      setTimeLeft(0)
      return
    }

    const departure = new Date()
    const [hours, minutes] = convertTo24Hour(targetTime).split(':').map(Number)
    departure.setHours(hours)
    departure.setMinutes(minutes)
    departure.setSeconds(0)

    const updateCountdown = () => {
      const now = new Date()
      const diff = Math.floor((departure.getTime() - now.getTime()) / 1000)
      setTimeLeft(diff > 0 ? diff : 0)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [targetTime])

  return timeLeft
}

export function LiveScheduleTable({
  selectedDate,
  onDateChange,
  route,
  onRouteChange
}: LiveScheduleTableProps) {
  const [upcomingFerries, setUpcomingFerries] = useState<FerryItem[]>([])
  const [pastFerries, setPastFerries] = useState<FerryItem[]>([])
  const [sailingFerry, setSailingFerry] = useState<FerryItem | null>(null)

  const nextDeparture = upcomingFerries[0]
  const timeLeft = useCountdown(nextDeparture?.departureTime || null)

  const getArrivalTime = (departureTime: string, duration: string) => {
    const [hours, minutes] = convertTo24Hour(departureTime).split(':').map(Number)
    const departure = new Date()
    departure.setHours(hours)
    departure.setMinutes(minutes)
    departure.setSeconds(0)

    const durationMinutes = parseInt(duration)
    departure.setMinutes(departure.getMinutes() + durationMinutes)

    return departure.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  useEffect(() => {
    const now = new Date()
    const localNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Puerto_Rico' }))

    const filteredUpcoming = ferryData.filter(ferry => {
      const [month, day, year] = ferry.date.split('-')
      const ferryDateTime = new Date(`20${year}-${month}-${day}T${convertTo24Hour(ferry.departureTime)}`)
      return (
        ferry.direction === (route.to === 'Anguilla' ? 'to-anguilla' : 'from-anguilla') &&
        ferryDateTime.toDateString() === selectedDate.toDateString() &&
        ferryDateTime >= localNow
      )
    }).sort((a, b) => {
      const [monthA, dayA, yearA] = a.date.split('-')
      const [monthB, dayB, yearB] = b.date.split('-')
      const dateA = new Date(`20${yearA}-${monthA}-${dayA}T${convertTo24Hour(a.departureTime)}`)
      const dateB = new Date(`20${yearB}-${monthB}-${dayB}T${convertTo24Hour(b.departureTime)}`)
      return dateA.getTime() - dateB.getTime()
    })

    const filteredPast = ferryData.filter(ferry => {
      const [month, day, year] = ferry.date.split('-')
      const ferryDateTime = new Date(`20${year}-${month}-${day}T${convertTo24Hour(ferry.departureTime)}`)
      return (
        ferry.direction === (route.to === 'Anguilla' ? 'to-anguilla' : 'from-anguilla') &&
        ferryDateTime.toDateString() === selectedDate.toDateString() &&
        ferryDateTime < localNow
      )
    }).sort((a, b) => {
      const [monthA, dayA, yearA] = a.date.split('-')
      const [monthB, dayB, yearB] = b.date.split('-')
      const dateA = new Date(`20${yearA}-${monthA}-${dayA}T${convertTo24Hour(a.departureTime)}`)
      const dateB = new Date(`20${yearB}-${monthB}-${dayB}T${convertTo24Hour(b.departureTime)}`)
      return dateB.getTime() - dateA.getTime()
    })

    setUpcomingFerries(filteredUpcoming)
    setPastFerries(filteredPast)
  }, [route.to, selectedDate.toDateString()])

  useEffect(() => {
    const now = new Date().getTime()
    const live = pastFerries.find(ferry => {
      const [hours, minutes] = convertTo24Hour(ferry.departureTime).split(':').map(Number)
      const departure = new Date()
      departure.setHours(hours)
      departure.setMinutes(minutes)
      departure.setSeconds(0)
      const durationMs = parseInt(ferry.duration) * 60 * 1000
      const arrivalTime = departure.getTime() + durationMs
      return now >= departure.getTime() && now < arrivalTime + 180000
    })
    if (live) {
  console.log('🛳️ Sailing Ferry Found:', {
    id: live.id,
    operator: live.operator,
    departureTime: live.departureTime,
    duration: live.duration,
    date: live.date
  });
} else {
  console.log('🚫 No Sailing Ferry Found');
}
setSailingFerry(live || null);
  }, [pastFerries])

  const showFerryProgress = !!sailingFerry || (!!nextDeparture && timeLeft <= 1800)

let ferryStatus: 'DOCKED' | 'BOARDING' | 'SAILING' | 'NOW ARRIVING' | 'ARRIVED' = 'DOCKED';

const now = new Date();
const localNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Puerto_Rico' }));

if (sailingFerry) {
  const [hours, minutes] = convertTo24Hour(sailingFerry.departureTime).split(':').map(Number);
  const ferryDeparture = new Date(localNow);
  ferryDeparture.setHours(hours);
  ferryDeparture.setMinutes(minutes);
  ferryDeparture.setSeconds(0);

  const arrival = new Date(ferryDeparture.getTime() + parseInt(sailingFerry.duration) * 60000);
  const fiveMinutesAfterArrival = new Date(arrival.getTime() + 5 * 60000);

  if (
  localNow >= ferryDeparture &&
  localNow < new Date(ferryDeparture.getTime() + 5 * 60000)
) {
  ferryStatus = 'BOARDING'
} else if (
  localNow >= new Date(ferryDeparture.getTime() + 5 * 60000) &&
  localNow < arrival
) {
  ferryStatus = 'SAILING'
} else if (
  localNow >= new Date(arrival.getTime() - 5 * 60000) &&
  localNow < arrival
) {
  ferryStatus = 'NOW ARRIVING'
} else if (localNow >= arrival && localNow <= fiveMinutesAfterArrival) {
  ferryStatus = 'ARRIVED'
} else {
  ferryStatus = 'DOCKED'
}
} else if (nextDeparture) {
  const [hours, minutes] = convertTo24Hour(nextDeparture.departureTime).split(':').map(Number);
  const nextDep = new Date(localNow);
  nextDep.setHours(hours);
  nextDep.setMinutes(minutes);
  nextDep.setSeconds(0);

  const timeDiff = localNow.getTime() - nextDep.getTime();
  const minutesDiff = timeDiff / 60000;


  if (timeDiff < 0) {
    ferryStatus = 'DOCKED';
    console.log('🟤 Status = DOCKED');
  } else if (minutesDiff >= 0 && minutesDiff <= 5) {
    ferryStatus = 'BOARDING';
    console.log('🟡 Status = BOARDING');
  }
}

  let currentFerry: FerryItem | null = null;

if (sailingFerry) {
  // Ferry that recently departed and hasn't arrived yet
  currentFerry = sailingFerry;
} else if (pastFerries.length > 0) {
  const candidate = pastFerries[0]; // most recent one
  const [hours, minutes] = convertTo24Hour(candidate.departureTime).split(':').map(Number);
  const departure = new Date(localNow);
  departure.setHours(hours);
  departure.setMinutes(minutes);
  departure.setSeconds(0);

  const durationMins = parseInt(candidate.duration);
  const arrival = new Date(departure.getTime() + durationMins * 60000);

  const stillInProgress = localNow >= departure && localNow < new Date(arrival.getTime() + 5 * 60000);

  if (stillInProgress) {
    currentFerry = candidate;
  }
}

if (!currentFerry) {
  currentFerry = nextDeparture ?? null;
}
const eta = currentFerry ? getArrivalTime(currentFerry.departureTime, currentFerry.duration) : ''
  const sailingProgress = sailingFerry
    ? ((parseInt(sailingFerry.duration) * 60 - getSecondsUntilArrival(sailingFerry.departureTime, sailingFerry.duration, sailingFerry.date)) / (parseInt(sailingFerry.duration) * 60)) * 100
    : 0

  const departureProgress = nextDeparture
  ? (() => {
      const [hours, minutes] = convertTo24Hour(nextDeparture.departureTime).split(':').map(Number);
      const departureTime = new Date();
      departureTime.setHours(hours);
      departureTime.setMinutes(minutes);
      departureTime.setSeconds(0);

      const now = new Date();
      const totalTime = departureTime.getTime() - now.getTime();
      const totalTimeInSeconds = totalTime / 1000;

      const maxProgressTime = 60 * 60; // let's track for 1 hour window (3600 seconds)

      const progress = 1 - totalTimeInSeconds / maxProgressTime;
      return Math.min(Math.max(progress * 100, 0), 100);
    })()
  : 0;

  const progress = sailingFerry ? sailingProgress : departureProgress

  const radius = 30
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - departureProgress / 100)

 const ringColor = (() => {
  const secondsLeft = timeLeft // Always based on next departure, not arrival

  if (secondsLeft <= 300) return '#22c55e'     // green
  if (secondsLeft <= 600) return '#f97316'     // orange
  if (secondsLeft <= 1200) return '#facc15'    // yellow
  return '#3B82F6'                              // blue
})()

const [selectedFerry, setSelectedFerry] = useState<FerryItem | null>(null)

  
return (
  <div className="bg-[#151923] rounded-xl p-6 mb-16">
    <div className="flex flex-col space-y-6">
      {/* Route Selector Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => onRouteChange({ from: 'St. Martin', to: 'Anguilla' })}
          className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors ${
            route.to === 'Anguilla' ? 'bg-blue-500 text-white' : 'bg-[#1E2A3B] text-gray-300 hover:bg-[#252F3F]'
          }`}
        >
          🇦🇮 To Anguilla
        </button>
        <button
          onClick={() => onRouteChange({ from: 'Anguilla', to: 'St. Martin' })}
          className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors ${
            route.to === 'St. Martin' ? 'bg-blue-500 text-white' : 'bg-[#1E2A3B] text-gray-300 hover:bg-[#252F3F]'
          }`}
        >
          🇸🇽 To St. Martin
        </button>
      </div>

      {/* Live Ferry Schedule + Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
          <h2 className="text-2xl font-bold text-white">Live Ferry Schedule</h2>

          {showFerryProgress && (
            <div className="flex justify-center sm:justify-end w-full sm:w-auto">
              <FerryProgress
                operatorName={currentFerry?.operator || ''}
                progressPercent={ferryStatus === 'DOCKED' ? 0 : progress}
                eta={eta}
                status={ferryStatus}
              />
            </div>
          )}
        </div>

        {nextDeparture && (
          <div className="flex flex-row items-center justify-between gap-6">
            <div className="flex items-center justify-center min-w-[200px]">
              <svg width="200" height="100" viewBox="0 0 200 100">
                <defs>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur
                      in="SourceGraphic"
                      stdDeviation={(() => {
                        if (timeLeft <= 300) return 4.5
                        if (timeLeft <= 600) return 3.5
                        if (timeLeft <= 1200) return 2.5
                        return 1.5
                      })()}
                      result="coloredBlur"
                    />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <circle
                  stroke="rgb(37, 47, 63)"
                  strokeOpacity={0.3}
                  fill="transparent"
                  r={radius}
                  cx="100"
                  cy="40"
                  strokeWidth="6"
                />
                <circle
                  stroke={ringColor}
                  filter="url(#glow)"
                  fill="transparent"
                  r={radius}
                  cx="100"
                  cy="40"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  transform="rotate(-90 100 40)"
                  style={{
                    transition: 'stroke-dashoffset 1s linear',
                    animation: (() => {
                      if (timeLeft <= 300) return 'pulse-calm 2s infinite'
                      if (timeLeft <= 600) return 'pulse-fast 0.6s infinite'
                      return undefined
                    })()
                  }}
                />
                <text
                  x="100"
                  y="47"
                  textAnchor="middle"
                  fill="white"
                  fontSize="24"
                  fontWeight="bold"
                >
                  {Math.floor(timeLeft / 60)}m
                </text>
                <text
                  x="100"
                  y="90"
                  textAnchor="middle"
                  fontSize="12"
                  fill="white"
                  fontWeight="bold"
                >
                  {timeLeft > 1200
                    ? 'UNTIL NEXT DEPARTURE'
                    : timeLeft <= 120
                    ? 'NOW BOARDING'
                    : timeLeft <= 300
                    ? 'UNTIL BOARDING BEGINS'
                    : 'UNTIL CUT OFF TIME ENDS'}
                </text>
              </svg>
            </div>

            <div className="flex flex-col items-center justify-center space-y-1 text-center min-h-[58px]">
              <span className="text-xs text-gray-400 tracking-wide uppercase">Next Departure</span>
              <span className="text-3xl font-bold text-white leading-tight">
                {nextDeparture.departureTime}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center space-y-1 text-center">
              <span className="text-xs text-blue-400 tracking-wide uppercase">
                {nextDeparture.operator}
              </span>
              <span
                className={`text-xs py-1 px-2 rounded-sm leading-none font-semibold uppercase ${
                  nextDeparture.status === 'on-time'
                    ? 'bg-green-500/10 text-green-400'
                    : nextDeparture.status === 'delayed'
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                {nextDeparture.status.replace('-', ' ')}
              </span>
            </div>
          </div>
        )}
      </div>

     {/* Date Tabs + Date Picker + Route Info */}
        <div className="flex flex-col gap-2">
          {/* Tabs Above Date Picker */}
          <div className="flex space-x-2 mb-1">
            <button
              onClick={() => onDateChange(new Date())}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedDate.toDateString() === new Date().toDateString()
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#1E2A3B] text-gray-300 hover:bg-[#252F3F]'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => onDateChange(addDays(new Date(), 1))}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedDate.toDateString() === addDays(new Date(), 1).toDateString()
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#1E2A3B] text-gray-300 hover:bg-[#252F3F]'
              }`}
            >
              Tomorrow
            </button>
          </div>

          {/* Calendar Picker + Route */}
          <div className="flex flex-wrap items-center gap-4">
            <CustomDatePicker selectedDate={selectedDate} onDateChange={onDateChange} />
            <div className="flex items-center space-x-2">
              <span className="text-gray-300">{route.from}</span>
              <ArrowRightIcon className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">{route.to}</span>
            </div>
          </div>
        </div>

      {/* Ferry Table */}
      <div className="overflow-x-auto">
        {upcomingFerries.length > 0 ? (
          <table className="w-full">
            <thead className="border-b border-gray-800">
              <tr className="text-gray-400">
                <th className="text-left pb-4">DEPARTS</th>
                <th className="text-left pb-4">PORT</th>
                <th className="text-left pb-4">OPERATOR</th>
                <th className="text-left pb-4">DURATION</th>
                <th className="text-left pb-4">ARRIVES</th>
                <th className="text-left pb-4">ARRIVAL PORT</th>
                <th className="text-left pb-4">STATUS</th>
                <th className="text-left pb-4">DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {upcomingFerries.map(ferry => (
                <tr key={ferry.id} className="hover:bg-[#1E2A3B] transition-colors">
                  <td className="py-4">{ferry.departureTime}</td>
                  <td className="py-4">{ferry.departurePort.split(',')[0]}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={ferry.logoUrl}
                        alt={`${ferry.operator} logo`}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                      <p className="font-medium">{ferry.operator}</p>
                    </div>
                  </td>
                  <td className="py-4">{ferry.duration}</td>
                  <td className="py-4">
                    {getArrivalTime(ferry.departureTime, ferry.duration)}
                  </td>
                  <td className="py-4">{ferry.arrivalPort.split(',')[0]}</td>
                  <td className="py-4">
                    <span className={`text-xs py-1 px-2 rounded-sm leading-none font-semibold uppercase ${
                      ferry.status === 'on-time'
                        ? 'bg-green-500/10 text-green-400'
                        : ferry.status === 'delayed'
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {ferry.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => setSelectedFerry(ferry)}
                      className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded text-sm transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400 text-sm mt-4">No ferries scheduled for this day.</p>
        )}
      </div>

      {pastFerries.length > 0 && (
  <div className="bg-[#1E2A3B] border border-gray-700 rounded-xl p-6 mt-8 shadow-md">
    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
      <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m0-5l-4-4-4 4" />
      </svg>
      Previously Sailed Ferries
    </h3>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-gray-800">
          <tr className="text-gray-400 text-sm">
            <th className="text-left pb-4">DEPARTED</th>
            <th className="text-left pb-4">PORT</th>
            <th className="text-left pb-4">OPERATOR</th>
            <th className="text-left pb-4">DURATION</th>
            <th className="text-left pb-4">ARRIVED</th>
            <th className="text-left pb-4">STATUS</th>
            <th className="text-left pb-4">PROGRESS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {pastFerries.map((ferry) => {
            const [hours, minutes] = convertTo24Hour(ferry.departureTime).split(':').map(Number)
            const departure = new Date(localNow)
            departure.setHours(hours)
            departure.setMinutes(minutes)
            departure.setSeconds(0)
            const durationMins = parseInt(ferry.duration)
            const arrival = new Date(departure.getTime() + durationMins * 60000)
            const fiveAfter = new Date(arrival.getTime() + 5 * 60000)
            const isSailing = localNow >= new Date(departure.getTime() + 5 * 60000) && localNow < arrival
            const isArrived = localNow >= arrival && localNow < fiveAfter
            const status = isSailing
              ? 'SAILING'
              : isArrived
              ? 'ARRIVED'
              : 'SAILED'
            const progressPercent = isSailing
              ? Math.min(100, ((localNow.getTime() - departure.getTime()) / (arrival.getTime() - departure.getTime())) * 100)
              : 100

            return (
              <tr key={`past-${ferry.id}`} className="bg-[#1E2A3B]/30 text-gray-500">
                <td className="py-4">{ferry.departureTime}</td>
                <td className="py-4">{ferry.departurePort.split(',')[0]}</td>
                <td className="py-4 flex items-center gap-3">
                  <Image
                    src={ferry.logoUrl}
                    alt={`${ferry.operator} logo`}
                    width={28}
                    height={28}
                    className="rounded-full object-cover"
                  />
                  <span>{ferry.operator}</span>
                </td>
                <td className="py-4">{ferry.duration}</td>
                <td className="py-4">{getArrivalTime(ferry.departureTime, ferry.duration)}</td>
                <td className="py-4">
                  <span className={`text-xs py-1 px-2 rounded-sm leading-none font-semibold uppercase ${
                    status === 'SAILING'
                      ? 'bg-blue-500/10 text-blue-400'
                      : status === 'ARRIVED'
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-gray-300 text-gray-800'
                  }`}>
                    {status}
                  </span>
                </td>
               <td className="py-4">
                  {(status === 'SAILING' || status === 'ARRIVED' || status === 'SAILED') && (
                    <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          status === 'SAILING'
                            ? 'bg-blue-500'
                            : status === 'ARRIVED'
                            ? 'bg-green-500'
                            : 'bg-gray-400'
                        }`}
                        style={{ width: `${progressPercent.toFixed(0)}%` }}
                      />
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  </div>
)}

{selectedFerry && (
  <div
    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
    onClick={() => setSelectedFerry(null)} // Close on backdrop click
  >
    <div
      className="bg-[#1E2A3B] rounded-xl p-6 w-full max-w-3xl relative shadow-lg border border-gray-700"
      onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
    >
      <button
        onClick={() => setSelectedFerry(null)}
        className="absolute top-4 right-4 text-white hover:text-gray-300 text-xl"
      >
        ×
      </button>
      <FerryDetailsCard ferry={selectedFerry} />
    </div>
  </div>
)}
      
    </div>
  </div>
)
}


