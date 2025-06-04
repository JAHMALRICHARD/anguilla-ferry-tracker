'use client'

import React, { useState, useEffect } from 'react'
import { AlertCircle, Info, XCircle } from 'lucide-react'

interface TravelAlertBannerProps {
  message: string
  type?: 'warning' | 'info' | 'danger'
  storageKey?: string
}

export const TravelAlertBanner: React.FC<TravelAlertBannerProps> = ({
  message,
  type = 'warning',
  storageKey = 'travel-alert-dismissed'
}) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const dismissed = sessionStorage.getItem(storageKey)
    if (dismissed === 'true') setVisible(false)
  }, [storageKey])

  const handleDismiss = () => {
    setVisible(false)
    sessionStorage.setItem(storageKey, 'true')
  }

  if (!visible) return null

  const typeStyles = {
    warning: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      icon: <AlertCircle className="h-5 w-5 text-yellow-600" />
    },
    info: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      icon: <Info className="h-5 w-5 text-blue-600" />
    },
    danger: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      icon: <XCircle className="h-5 w-5 text-red-600" />
    }
  }

  const { bg, text, icon } = typeStyles[type]

  return (
    <div
      className={`rounded-lg px-6 py-4 mb-6 flex items-center justify-between shadow-sm transition-all duration-300 ${bg} ${text}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={handleDismiss}
        className={`text-sm font-semibold opacity-70 hover:opacity-100 hover:underline transition`}
      >
        Dismiss
      </button>
    </div>
  )
}
