import ferryData from '@/data/april_2025_schedule.json'
import FerryCard from '@/components/FerryCard'

export default function SchedulePage() {
  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold">Ferry Schedule for April 2025</h1>

      {ferryData.map((day) => (
        <div key={day.date}>
          <h2 className="text-xl font-semibold mb-3">{day.date}</h2>

          <div className="mb-4">
            <h3 className="font-semibold text-blue-400 mb-2">Morning Shift</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {day.shifts.morning.map((trip, idx) => (
                <FerryCard
                  key={`morning-${day.date}-${idx}`}
                  route=""
                  departureTime={`${day.date}T${trip.time.trim()}:00`}
                  operator={trip.ferry}
                  status="On Time"
                  documentsRequired="Passport"
                  price={{ oneWay: 30, roundTrip: 50 }}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-blue-400 mb-2">Afternoon Shift</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {day.shifts.afternoon.map((trip, idx) => (
                <FerryCard
                  key={`afternoon-${day.date}-${idx}`}
                  route=""
                  departureTime={`${day.date}T${trip.time.trim()}:00`}
                  operator={trip.ferry}
                  status="On Time"
                  documentsRequired="Passport"
                  price={{ oneWay: 30, roundTrip: 50 }}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
