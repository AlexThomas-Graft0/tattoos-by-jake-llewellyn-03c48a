'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseAuthed'

interface BookingInquiry {
  id: string
  client_name: string
  client_email: string
  client_phone: string | null
  inquiry_type: 'custom' | 'flash'
  flash_design_id: string | null
  placement: string | null
  approximate_size: string | null
  description: string | null
  reference_image_urls: string[]
  budget_range: string | null
  preferred_days: string[]
  status: 'pending_review' | 'approved' | 'declined' | 'archived'
  created_at: string
}

export default function BookingInquiriesManager() {
  const [inquiries, setInquiries] = useState<BookingInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedInquiry, setSelectedInquiry] = useState<BookingInquiry | null>(null)

  // Filtering states
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('booking_inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err
      setInquiries(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch booking inquiries')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: 'pending_review' | 'approved' | 'declined' | 'archived') => {
    setError(null)
    setSuccess(null)
    try {
      const { error: err } = await supabase
        .from('booking_inquiries')
        .update({ status: newStatus })
        .eq('id', id)

      if (err) throw err
      setSuccess(`Inquiry status updated to ${newStatus}.`)

      // Update local state
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      )

      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update status')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this booking inquiry?')) return
    setError(null)
    setSuccess(null)

    try {
      const { error: err } = await supabase
        .from('booking_inquiries')
        .delete()
        .eq('id', id)

      if (err) throw err
      setSuccess('Inquiry deleted successfully.')
      setSelectedInquiry(null)
      fetchInquiries()
    } catch (err: any) {
      setError(err.message || 'Error deleting inquiry')
    }
  }

  const filteredInquiries = inquiries.filter((inquiry) => {
    if (statusFilter === 'all') return true
    return inquiry.status === statusFilter
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* List Panel */}
      <div className="lg:col-span-5 space-y-4">
        {/* Filters and Controls */}
        <div className="bg-[#161616] p-4 border border-[#161616] space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-mono text-[#8E8E8E]">
              FILTER BY STATUS:
            </span>
            <button
              onClick={fetchInquiries}
              className="text-xs font-mono uppercase text-[#9E2A2B] hover:text-[#F5F5F5]"
            >
              [ Reload ]
            </button>
          </div>

          <div className="flex flex-wrap gap-1">
            {['all', 'pending_review', 'approved', 'declined', 'archived'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 text-xs uppercase tracking-wider font-mono border transition-all ${
                  statusFilter === status
                    ? 'bg-[#9E2A2B] text-[#F5F5F5] border-[#9E2A2B]'
                    : 'bg-[#0C0C0C] text-[#8E8E8E] border-[#8E8E8E]/20 hover:text-[#F5F5F5]'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-[#9E2A2B]/10 border border-[#9E2A2B] text-[#F5F5F5] p-3 text-sm font-mono">
            [ERROR] {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-950/20 border border-emerald-500 text-[#F5F5F5] p-3 text-sm font-mono">
            [SUCCESS] {success}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-[#8E8E8E] font-mono">Loading inquiries...</div>
        ) : filteredInquiries.length === 0 ? (
          <div className="text-center py-12 bg-[#161616] border border-[#161616] text-[#8E8E8E] font-mono">
            No inquiries matching the selected filter.
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredInquiries.map((inquiry) => {
              const isSelected = selectedInquiry?.id === inquiry.id
              let statusLabelColor = 'text-amber-500 border-amber-500/30'
              if (inquiry.status === 'approved') statusLabelColor = 'text-emerald-500 border-emerald-500/30'
              if (inquiry.status === 'declined') statusLabelColor = 'text-red-500 border-red-500/30'
              if (inquiry.status === 'archived') statusLabelColor = 'text-[#8E8E8E] border-[#8E8E8E]/30'

              return (
                <div
                  key={inquiry.id}
                  onClick={() => setSelectedInquiry(inquiry)}
                  className={`p-4 bg-[#161616] border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#9E2A2B] shadow-[2px_2px_0px_0px_#9E2A2B]'
                      : 'border-[#8E8E8E]/10 hover:border-[#8E8E8E]/40'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-[#F5F5F5] text-sm tracking-tight block">
                      {inquiry.client_name}
                    </span>
                    <span className={`text-[10px] uppercase font-mono border px-1.5 py-0.5 ${statusLabelColor}`}>
                      {inquiry.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-[#8E8E8E] font-mono space-y-1">
                    <div>Type: {inquiry.inquiry_type}</div>
                    <div>Placement: {inquiry.placement || 'N/A'}</div>
                    <div className="text-[10px] text-[#8E8E8E]/60">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail Panel */}
      <div className="lg:col-span-7">
        {selectedInquiry ? (
          <div className="bg-[#161616] p-6 border-2 border-[#161616] shadow-[4px_4px_0px_0px_#9E2A2B] space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-[#8E8E8E]/20">
              <div>
                <span className="text-xs text-[#8E8E8E] uppercase tracking-wider font-mono block mb-1">
                  Client Request
                </span>
                <h3 className="text-2xl font-bold text-[#F5F5F5]">{selectedInquiry.client_name}</h3>
                <p className="text-sm font-mono text-[#8E8E8E] mt-1">
                  {selectedInquiry.client_email} {selectedInquiry.client_phone && `• ${selectedInquiry.client_phone}`}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedInquiry.id, 'approved')}
                  className="bg-emerald-700 hover:bg-emerald-600 text-[#F5F5F5] font-mono text-xs uppercase px-3 py-1.5 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedInquiry.id, 'declined')}
                  className="bg-red-950/40 border border-red-500 hover:bg-red-900 text-[#F5F5F5] font-mono text-xs uppercase px-3 py-1.5 transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedInquiry.id, 'archived')}
                  className="bg-neutral-800 hover:bg-neutral-700 text-[#F5F5F5] font-mono text-xs uppercase px-3 py-1.5 transition-colors"
                >
                  Archive
                </button>
                <button
                  onClick={() => handleDelete(selectedInquiry.id)}
                  className="bg-[#9E2A2B] text-[#F5F5F5] font-mono text-xs uppercase px-3 py-1.5 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#8E8E8E] font-mono mb-1">Project Type</h4>
                  <p className="text-[#F5F5F5] font-bold uppercase tracking-wide">
                    {selectedInquiry.inquiry_type} Design
                  </p>
                  {selectedInquiry.flash_design_id && (
                    <p className="text-xs text-[#9E2A2B] font-mono mt-1">
                      Flash ID: {selectedInquiry.flash_design_id}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#8E8E8E] font-mono mb-1">Placement & Size</h4>
                  <p className="text-[#F5F5F5]">
                    {selectedInquiry.placement || 'Not specified'} • {selectedInquiry.approximate_size || 'N/A'}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#8E8E8E] font-mono mb-1">Budget & Days</h4>
                  <p className="text-[#F5F5F5]">
                    Budget: <span className="text-[#9E2A2B] font-bold">{selectedInquiry.budget_range || 'Not specified'}</span>
                  </p>
                  {selectedInquiry.preferred_days && selectedInquiry.preferred_days.length > 0 && (
                    <p className="text-xs text-[#8E8E8E] font-mono mt-1">
                      Available: {selectedInquiry.preferred_days.join(', ')}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#8E8E8E] font-mono mb-1">Description / Concept</h4>
                <div className="bg-[#0C0C0C] p-4 border border-[#8E8E8E]/10 text-xs text-[#F5F5F5] leading-relaxed whitespace-pre-wrap font-mono min-h-[120px]">
                  {selectedInquiry.description || 'No description provided.'}
                </div>
              </div>
            </div>

            {/* Reference Images */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#8E8E8E] font-mono mb-2">Reference Images</h4>
              {!selectedInquiry.reference_image_urls || selectedInquiry.reference_image_urls.length === 0 ? (
                <p className="text-xs text-[#8E8E8E] font-mono italic">No reference images provided.</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {selectedInquiry.reference_image_urls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative h-32 w-full block bg-[#0C0C0C] border border-[#8E8E8E]/20 overflow-hidden hover:border-[#9E2A2B]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Reference ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-[#161616] p-12 border border-[#161616] text-center text-[#8E8E8E] font-mono">
            Select a booking inquiry from the left panel to inspect details and update client status.
          </div>
        )}
      </div>
    </div>
  )
}