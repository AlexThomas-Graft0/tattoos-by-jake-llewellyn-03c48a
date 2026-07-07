'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseAuthed'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  created_at: string
}

export default function ContactMessagesManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err
      setMessages(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch contact messages')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    setError(null)
    setSuccess(null)

    try {
      const { error: err } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)

      if (err) throw err
      setSuccess('Contact message deleted successfully.')
      setSelectedMessage(null)
      fetchMessages()
    } catch (err: any) {
      setError(err.message || 'Error deleting message')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* List Panel */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-[#161616] p-4 border border-[#161616] flex justify-between items-center">
          <span className="text-sm font-mono text-[#8E8E8E]">
            MESSAGES: <span className="text-[#F5F5F5] font-bold">{messages.length}</span>
          </span>
          <button
            onClick={fetchMessages}
            className="text-xs font-mono uppercase text-[#9E2A2B] hover:text-[#F5F5F5]"
          >
            [ Refresh ]
          </button>
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
          <div className="text-center py-12 text-[#8E8E8E] font-mono">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 bg-[#161616] border border-[#161616] text-[#8E8E8E] font-mono">
            No general contact messages found.
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {messages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id

              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 bg-[#161616] border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#9E2A2B] shadow-[2px_2px_0px_0px_#9E2A2B]'
                      : 'border-[#8E8E8E]/10 hover:border-[#8E8E8E]/40'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-[#F5F5F5] text-sm tracking-tight block">
                      {msg.name}
                    </span>
                    <span className="text-[10px] text-[#8E8E8E] font-mono">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-[#9E2A2B] font-mono truncate">
                    Subject: {msg.subject || 'No Subject'}
                  </p>

                  <p className="text-xs text-[#8E8E8E] line-clamp-2 mt-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail Panel */}
      <div className="lg:col-span-7">
        {selectedMessage ? (
          <div className="bg-[#161616] p-6 border-2 border-[#161616] shadow-[4px_4px_0px_0px_#9E2A2B] space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-[#8E8E8E]/20">
              <div>
                <span className="text-xs text-[#8E8E8E] uppercase tracking-wider font-mono block mb-1">
                  General Inquiry
                </span>
                <h3 className="text-2xl font-bold text-[#F5F5F5]">{selectedMessage.name}</h3>
                <p className="text-sm font-mono text-[#8E8E8E] mt-1">
                  Email: <a href={`mailto:${selectedMessage.email}`} className="text-[#9E2A2B] underline">{selectedMessage.email}</a>
                </p>
              </div>

              <div>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="bg-[#9E2A2B] text-[#F5F5F5] hover:bg-[#9E2A2B]/80 font-mono text-xs uppercase px-4 py-2 transition-colors"
                >
                  Delete Message
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#8E8E8E] font-mono mb-1">Subject</h4>
              <p className="text-lg font-bold text-[#F5F5F5]">{selectedMessage.subject || 'No Subject'}</p>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#8E8E8E] font-mono mb-2">Message Body</h4>
              <div className="bg-[#0C0C0C] p-5 border border-[#8E8E8E]/10 text-sm text-[#F5F5F5] leading-relaxed whitespace-pre-wrap font-mono min-h-[180px]">
                {selectedMessage.message}
              </div>
            </div>

            <div className="pt-4 text-xs text-[#8E8E8E] font-mono">
              Received at: {new Date(selectedMessage.created_at).toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="bg-[#161616] p-12 border border-[#161616] text-center text-[#8E8E8E] font-mono">
            Select a general inquiry from the left panel to read the full body message.
          </div>
        )}
      </div>
    </div>
  )
}