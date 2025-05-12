'use client'

import React, { useState, useEffect } from 'react'

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

  const baseClass =
    type === 'warning'
      ? 'bg-yellow-100 text-yellow-800'
      : type === 'danger'
      ? 'bg-red-100 text-red-800'
      : 'bg-blue-100 text-blue-800'

  return (
    <div className={`rounded-md px-6 py-4 mb-6 flex justify-between items-center shadow ${baseClass}`}>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={handleDismiss} className="ml-4 text-sm font-semibold hover:underline">
        Dismiss
      </button>
    </div>
  )
}
