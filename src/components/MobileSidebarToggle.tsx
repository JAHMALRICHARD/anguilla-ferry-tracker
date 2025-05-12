'use client'

import { useState } from 'react'
import { Menu as MenuIcon } from 'lucide-react'
import MobileSidebarDrawer from './MobileSidebarDrawer'

export default function MobileSidebarToggle() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="p-2 hover:bg-[#1E2A3B] rounded-lg transition-colors text-gray-400"
        onClick={() => setIsOpen(true)}
        aria-label="Open sidebar"
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      {isOpen && <MobileSidebarDrawer onClose={() => setIsOpen(false)} />}
    </>
  )
}
