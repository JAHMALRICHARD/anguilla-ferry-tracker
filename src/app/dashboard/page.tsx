export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1A1E2C] p-4 rounded-lg shadow text-white">
          <h2 className="text-lg font-semibold">Total Ferries Today</h2>
          <p className="text-2xl mt-2">12</p>
        </div>
        <div className="bg-[#1A1E2C] p-4 rounded-lg shadow text-white">
          <h2 className="text-lg font-semibold">Active Operators</h2>
          <p className="text-2xl mt-2">5</p>
        </div>
        <div className="bg-[#1A1E2C] p-4 rounded-lg shadow text-white">
          <h2 className="text-lg font-semibold">Alerts Today</h2>
          <p className="text-2xl mt-2">2</p>
        </div>
      </div>
    </div>
  )
}