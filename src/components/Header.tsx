'use client'

import { useState } from 'react'
import Image from 'next/image'
import MobileSidebarToggle from '@/components/MobileSidebarToggle'
import {
  SearchIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon
} from 'lucide-react'

export function Header() {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  return (
    <header className="bg-[#151923] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Left section - Menu and Search */}
        <div className="flex items-center gap-4 flex-1">
          <MobileSidebarToggle />

          <div className={`relative flex-1 max-w-md ${isSearchFocused ? 'flex-grow' : ''}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-[#1E2A3B] text-gray-300 pl-10 pr-4 py-2 rounded-lg border border-transparent focus:border-blue-500 focus:outline-none transition-all"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </div>

        {/* Right section - Notifications, Theme, Profile */}
        <div className="flex items-center gap-2">
          {/* Notification Button */}
          <button className="p-2 hover:bg-[#1E2A3B] rounded-lg relative transition-colors group">
            <BellIcon className="h-5 w-5 text-gray-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-full opacity-25 group-hover:animate-ping"></span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            className="p-2 hover:bg-[#1E2A3B] rounded-lg transition-colors"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? (
              <SunIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>

          {/* Profile Section */}
          <div className="flex items-center gap-2 pl-2">
            <button className="flex items-center gap-2 hover:bg-[#1E2A3B] rounded-lg py-1 px-2 transition-colors">
              <div className="w-8 h-8 bg-blue-500 rounded-full overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  width={40}
                  height={40}
                  className="object-cover rounded-full"
                  priority
                />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-200">John Doe</p>
                <p className="text-xs text-gray-400">Admin</p>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
