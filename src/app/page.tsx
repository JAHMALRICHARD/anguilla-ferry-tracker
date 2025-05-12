'use client'

import React, { useState } from 'react'
import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { TravelAlertBanner } from '@/components/TravelAlertBanner'
import { LiveScheduleTable } from '@/components/LiveScheduleTable'
import { InfoCards } from '@/components/InfoCards'
import { OperatorsSection } from '@/components/OperatorsSection'
import { TestimonialsSection } from '@/components/TestimonialsSection'

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [route, setRoute] = useState({
    from: 'Anguilla',
    to: 'St. Martin'
  })

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroSection />

        {/* 🚨 Travel Alert Banner */}
        <TravelAlertBanner
          message="Please Note: The Public Ferry ticketing counter accepts cash only. Kindly prepare exact change in advance to avoid delays."
          type="info"
        />


        <LiveScheduleTable
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          route={route}
          onRouteChange={setRoute}
        />
        <InfoCards />
        <OperatorsSection />
        <TestimonialsSection />
      </div>
    </div>
  )
}
