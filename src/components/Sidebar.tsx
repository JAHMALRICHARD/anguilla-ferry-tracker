'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils' // optional helper for conditional classes

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: 'ri-dashboard-line' },
  { label: 'Schedule', href: '/schedule', icon: 'ri-calendar-line' },
  { label: 'Travel Info', href: '/travel-info', icon: 'ri-map-pin-line' },
  { label: 'Operators', href: '/operators', icon: 'ri-ship-line' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#1A1E2C] border-r border-gray-800 min-h-screen p-4 hidden md:block">
      <div className="text-xl font-bold mb-10 text-white">🚢 Ferry Admin</div>

      <nav className="space-y-2">
        {navItems.map(({ label, href, icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 text-sm px-4 py-2 rounded-md transition hover:bg-blue-600 hover:text-white',
              pathname === href ? 'bg-blue-700 text-white' : 'text-gray-300'
            )}
          >
            <i className={icon}></i>
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
