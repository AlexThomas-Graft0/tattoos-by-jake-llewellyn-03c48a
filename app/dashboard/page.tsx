'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseAuthed'

// Component Imports
import PortfolioManager from '@/components/dashboard/PortfolioManager'
import FlashManager from '@/components/dashboard/FlashManager'
import BookingInquiriesManager from '@/components/dashboard/BookingInquiriesManager'
import ContactMessagesManager from '@/components/dashboard/ContactMessagesManager'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'flash' | 'bookings' | 'messages'>('bookings')

  // Stats
  const [portfolioCount, setPortfolioCount] = useState(0)
  const [flashCount, setFlashCount] = useState(0)
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0)
  const [messagesCount, setMessagesCount] = useState(0)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Portfolio Count
      const { count: portCount } = await supabase
        .from('portfolio_items')
        .select('*', { count: 'exact', head: true })
      setPortfolioCount(portCount || 0)

      // Flash Count
      const { count: flCount } = await supabase
        .from('flash_designs')
        .select('*', { count: 'exact', head: true })
      setFlashCount(flCount || 0)

      // Pending Bookings Count
      const { count: bkCount } = await supabase
        .from('booking_inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending_review')
      setPendingBookingsCount(bkCount || 0)

      // Messages Count
      const { count: msgCount } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
      setMessagesCount(msgCount || 0)
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
    }
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#F5F5F5] flex flex-col">
      {/* Top Navigation */}
      <header className="border-b-2 border-[#161616] bg-[#0C0C0C] sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#F5F5F5] font-mono flex items-center gap-2">
              <span className="text-[#9E2A2B]">●</span> JAKE LLEWELLYN STUDIO
            </h1>
            <p className="text-xs text-[#8E8E8E] uppercase tracking-widest font-mono">
              Owner Administration Panel
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-mono uppercase tracking-wider text-[#8E8E8E] hover:text-[#F5F5F5] border border-[#8E8E8E]/30 px-3 py-1.5 transition-colors"
            >
              ← Back to Main Site
            </Link>
            <button
              onClick={fetchStats}
              className="text-xs font-mono uppercase bg-[#161616] hover:bg-[#161616]/80 text-[#F5F5F5] px-3 py-1.5 border border-[#8E8E8E]/20"
            >
              Refresh Stats
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        {/* Summary Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#161616] p-4 border-l-4 border-[#9E2A2B] shadow-[2px_2px_0px_0px_rgba(22,22,22,1)]">
            <span className="block text-xs uppercase tracking-wider text-[#8E8E8E] font-mono">
              Pending Inquiries
            </span>
            <span className="text-3xl font-extrabold text-[#F5F5F5] mt-1 block font-mono">
              {pendingBookingsCount}
            </span>
            <span className="text-[10px] text-[#8E8E8E] font-mono block mt-1">
              Needs review
            </span>
          </div>

          <div className="bg-[#161616] p-4 border-l-4 border-[#8E8E8E] shadow-[2px_2px_0px_0px_rgba(22,22,22,1)]">
            <span className="block text-xs uppercase tracking-wider text-[#8E8E8E] font-mono">
              Total Flash
            </span>
            <span className="text-3xl font-extrabold text-[#F5F5F5] mt-1 block font-mono">
              {flashCount}
            </span>
            <span className="text-[10px] text-[#8E8E8E] font-mono block mt-1">
              Active designs in catalog
            </span>
          </div>

          <div className="bg-[#161616] p-4 border-l-4 border-emerald-600 shadow-[2px_2px_0px_0px_rgba(22,22,22,1)]">
            <span className="block text-xs uppercase tracking-wider text-[#8E8E8E] font-mono">
              Portfolio Items
            </span>
            <span className="text-3xl font-extrabold text-[#F5F5F5] mt-1 block font-mono">
              {portfolioCount}
            </span>
            <span className="text-[10px] text-[#8E8E8E] font-mono block mt-1">
              Visible works online
            </span>
          </div>

          <div className="bg-[#161616] p-4 border-l-4 border-[#8E8E8E] shadow-[2px_2px_0px_0px_rgba(22,22,22,1)]">
            <span className="block text-xs uppercase tracking-wider text-[#8E8E8E] font-mono">
              General Messages
            </span>
            <span className="text-3xl font-extrabold text-[#F5F5F5] mt-1 block font-mono">
              {messagesCount}
            </span>
            <span className="text-[10px] text-[#8E8E8E] font-mono block mt-1">
              Collaborations & Questions
            </span>
          </div>
        </div>

        {/* Neo-brutalist Navigation Tabs */}
        <div className="border-b-2 border-[#161616] flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-3 text-sm font-bold uppercase tracking-wider font-mono border-t-2 border-x-2 transition-all ${
              activeTab === 'bookings'
                ? 'bg-[#161616] text-[#F5F5F5] border-[#161616]'
                : 'bg-transparent text-[#8E8E8E] border-transparent hover:text-[#F5F5F5]'
            }`}
          >
            [ Bookings & Inquiries ({pendingBookingsCount}) ]
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-5 py-3 text-sm font-bold uppercase tracking-wider font-mono border-t-2 border-x-2 transition-all ${
              activeTab === 'portfolio'
                ? 'bg-[#161616] text-[#F5F5F5] border-[#161616]'
                : 'bg-transparent text-[#8E8E8E] border-transparent hover:text-[#F5F5F5]'
            }`}
          >
            [ Portfolio Catalog ({portfolioCount}) ]
          </button>

          <button
            onClick={() => setActiveTab('flash')}
            className={`px-5 py-3 text-sm font-bold uppercase tracking-wider font-mono border-t-2 border-x-2 transition-all ${
              activeTab === 'flash'
                ? 'bg-[#161616] text-[#F5F5F5] border-[#161616]'
                : 'bg-transparent text-[#8E8E8E] border-transparent hover:text-[#F5F5F5]'
            }`}
          >
            [ Flash Designs ({flashCount}) ]
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-5 py-3 text-sm font-bold uppercase tracking-wider font-mono border-t-2 border-x-2 transition-all ${
              activeTab === 'messages'
                ? 'bg-[#161616] text-[#F5F5F5] border-[#161616]'
                : 'bg-transparent text-[#8E8E8E] border-transparent hover:text-[#F5F5F5]'
            }`}
          >
            [ General Messages ({messagesCount}) ]
          </button>
        </div>

        {/* Dynamic Manager Content */}
        <div className="py-2">
          {activeTab === 'bookings' && <BookingInquiriesManager />}
          {activeTab === 'portfolio' && <PortfolioManager />}
          {activeTab === 'flash' && <FlashManager />}
          {activeTab === 'messages' && <ContactMessagesManager />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#161616] bg-[#0C0C0C] py-6 text-center text-xs text-[#8E8E8E] font-mono mt-auto">
        Tattoos by Jake Llewellyn • Secure Owner Terminal • 2025
      </footer>
    </div>
  )
}