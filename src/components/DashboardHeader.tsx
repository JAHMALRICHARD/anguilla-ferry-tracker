'use client'

import Link from 'next/link'
import Image from 'next/image'
import Flag from 'react-world-flags'


export default function DashboardHeader() {
  return (
    <nav className="main-header border-b border-gray-800 bg-[#1A1E2C] text-white">
  <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
    {/* Left: Sidebar Toggle */}
    <div className="flex items-center gap-4">
      <button
        type="button"
        aria-label="Toggle Navigation"
        className="text-xl hover:text-blue-400"
      >
        <i className="ri-arrow-right-circle-line"></i>
      </button>

      <Link href="/dashboard" className="text-lg font-bold">
        <Image src="/logo-dark.png" alt="Logo" width={140} height={40} className="hidden dark:block" />
        <Image src="/logo-light.png" alt="Logo" width={140} height={40} className="dark:hidden" />
      </Link>
    </div>

    {/* Right Controls */}
    <div className="flex items-center gap-4">
      <button className="hover:text-blue-400" aria-label="Language">
            <Flag
        code="us"
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '4px',
          objectFit: 'cover'
        }}
        alt="US Flag"
      />
      </button>
      <button className="hover:text-blue-400 text-xl" aria-label="Search">
        <i className="ri-search-2-line"></i>
      </button>
      <button className="hover:text-blue-400 text-xl" aria-label="Toggle Theme">
        <i className="ri-moon-line dark:hidden"></i>
        <i className="ri-sun-line hidden dark:inline"></i>
      </button>
      <button className="relative hover:text-blue-400 text-xl" aria-label="Notifications">
        <i className="ri-notification-2-line animate-bell"></i>
        <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1">4</span>
      </button>
      <div className="relative">
        <button className="h-8 w-8 rounded-full ring-2 ring-white overflow-hidden">
          <img src="/users/user.jpg" alt="User" className="h-full w-full object-cover" />
        </button>
      </div>
    </div>
  </div>
</nav>

  )
}
