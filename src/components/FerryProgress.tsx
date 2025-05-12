export function FerryProgress({
  operatorName,
  progressPercent,
  eta,
  status
}: {
  operatorName: string;
  progressPercent: number;
  eta: string;
  status: 'DOCKED' | 'BOARDING' | 'SAILING' | 'NOW ARRIVING' | 'ARRIVED';
}) {
  const ferryColorMap: Record<typeof status, string> = {
    DOCKED: '#9CA3AF',         // Gray
    BOARDING: '#FACC15',       // Yellow
    SAILING: '#3B82F6',        // Blue
    'NOW ARRIVING': '#22C55E', // Emerald
    ARRIVED: '#10B981'         // Green
  }

  const statusClassMap: Record<typeof status, string> = {
    DOCKED: 'bg-gray-500/10 text-gray-300',
    BOARDING: 'bg-yellow-500/10 text-yellow-400',
    SAILING: 'bg-blue-500/10 text-blue-400',
    'NOW ARRIVING': 'bg-emerald-500/10 text-emerald-400',
    ARRIVED: 'bg-green-500/10 text-green-400'
  }

  const displayProgress = status === 'ARRIVED' ? 100 : progressPercent
  const ferryColor = ferryColorMap[status]

  return (
    <div className="relative w-full max-w-xl bg-[#1D283A] text-gray-100 px-6 py-4 rounded-2xl shadow-md border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold text-gray-400">ANGUILLA</span>
        <span
          className={`text-xs font-semibold uppercase py-1 px-4 rounded-full tracking-wide shadow-sm transition-colors duration-300 ${statusClassMap[status]}`}
        >
          {status}
        </span>
        <span className="text-lg font-semibold text-gray-400">ST. MARTIN</span>
      </div>

      <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-4">
        <div
          className="absolute top-0 left-0 h-3 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${displayProgress}%`, backgroundColor: ferryColor }}
        />
        <div
          className="absolute -top-3 -translate-x-1/2 transition-all duration-700 ease-out"
          style={{ left: `${displayProgress}%` }}
        >
         <svg width="24" height="24" fill={ferryColor} viewBox="0 0 24 24">
            <path d="M10 17l5-5-5-5v10z" />
          </svg>
        </div>
      </div>

      <div className="text-sm text-gray-400 text-center">
        {operatorName} &bull; ETA {eta}
      </div>
    </div>
  )
}
