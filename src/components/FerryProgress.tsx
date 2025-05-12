export function FerryProgress({
  operatorName,
  progressPercent,
  eta,
  status
}: {
  operatorName: string;
  progressPercent: number;
  eta: string;
  status: 'BOARDING' | 'SAILING' | 'NOW ARRIVING' | 'ARRIVED';
}) {
  const ferryColor = '#3B82F6'

  return (
    <div
      className="relative w-full max-w-xl bg-[#1D283A] text-gray-100 px-6 py-4 rounded-2xl shadow-md border border-gray-700"
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold text-gray-400">ANGUILLA</span>
        <span
          className={`text-xs font-semibold uppercase py-1 px-4 rounded-full tracking-wide shadow-sm transition-colors duration-300 ${
            status === 'BOARDING'
              ? 'bg-yellow-500/10 text-yellow-400'
              : status === 'SAILING'
              ? 'bg-blue-500/10 text-blue-400'
              : status === 'NOW ARRIVING'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-green-500/10 text-green-400'
          }`}
        >
          {status}
        </span>
        <span className="text-lg font-semibold text-gray-400">ST. MARTIN</span>
      </div>

      <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-4">
        <div
          className="absolute top-0 left-0 h-3 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progressPercent}%`, backgroundColor: ferryColor }}
        />
        <div
          className="absolute -top-3 -translate-x-1/2 transition-all duration-700 ease-out"
          style={{ left: `${progressPercent}%` }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill={ferryColor}>
            <path d="M3 16l1-2h16l1 2H3zM5 10h14v4H5v-4zm1-4h12v2H6V6z" />
          </svg>
        </div>
      </div>

      <div className="text-sm text-gray-400 text-center">
        {operatorName} &bull; ETA {eta}
      </div>
    </div>
  )
}
