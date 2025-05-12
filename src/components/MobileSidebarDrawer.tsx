'use client'

import { X as CloseIcon } from 'lucide-react'
import Link from 'next/link'

export default function MobileSidebarDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      {/* Drawer */}
      <aside className="relative w-64 bg-[#1A1E2C] text-white p-6 z-50">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <nav className="mt-10 space-y-4">
          <Link href="/dashboard" className="block hover:text-blue-400">Dashboard</Link>
          <Link href="/schedule" className="block hover:text-blue-400">Schedule</Link>
          <Link href="/travel-info" className="block hover:text-blue-400">Travel Info</Link>
          <Link href="/operators" className="block hover:text-blue-400">Operators</Link>
        </nav>
      </aside>
    </div>
  )
}
