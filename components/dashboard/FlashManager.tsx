'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseAuthed'

interface FlashDesign {
  id: string
  title: string
  image_url: string
  price_estimate: number | null
  recommended_size: string | null
  status: 'available' | 'reserved' | 'sold'
  created_at: string
}

export default function FlashManager() {
  const [designs, setDesigns] = useState<FlashDesign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [priceEstimate, setPriceEstimate] = useState<string>('')
  const [recommendedSize, setRecommendedSize] = useState('')
  const [status, setStatus] = useState<'available' | 'reserved' | 'sold'>('available')
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchDesigns()
  }, [])

  const fetchDesigns = async () => {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('flash_designs')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err
      setDesigns(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch flash designs')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!title || !imageUrl) {
      setError('Title and Image URL are required.')
      return
    }

    const priceNum = priceEstimate ? parseFloat(priceEstimate) : null

    try {
      if (editingId) {
        // Edit mode
        const { error: err } = await supabase
          .from('flash_designs')
          .update({
            title,
            image_url: imageUrl,
            price_estimate: priceNum,
            recommended_size: recommendedSize || null,
            status,
          })
          .eq('id', editingId)

        if (err) throw err
        setSuccess('Flash design updated successfully.')
      } else {
        // Insert mode
        const { error: err } = await supabase
          .from('flash_designs')
          .insert([
            {
              title,
              image_url: imageUrl,
              price_estimate: priceNum,
              recommended_size: recommendedSize || null,
              status,
            },
          ])

        if (err) throw err
        setSuccess('Flash design added successfully.')
      }

      // Reset form
      setTitle('')
      setImageUrl('')
      setPriceEstimate('')
      setRecommendedSize('')
      setStatus('available')
      setEditingId(null)
      fetchDesigns()
    } catch (err: any) {
      setError(err.message || 'Error saving flash design')
    }
  }

  const handleEdit = (design: FlashDesign) => {
    setEditingId(design.id)
    setTitle(design.title)
    setImageUrl(design.image_url)
    setPriceEstimate(design.price_estimate ? design.price_estimate.toString() : '')
    setRecommendedSize(design.recommended_size || '')
    setStatus(design.status)
    setError(null)
    setSuccess(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this flash design?')) return
    setError(null)
    setSuccess(null)

    try {
      const { error: err } = await supabase
        .from('flash_designs')
        .delete()
        .eq('id', id)

      if (err) throw err
      setSuccess('Flash design deleted.')
      fetchDesigns()
    } catch (err: any) {
      setError(err.message || 'Error deleting flash design')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setTitle('')
    setImageUrl('')
    setPriceEstimate('')
    setRecommendedSize('')
    setStatus('available')
    setError(null)
    setSuccess(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Area */}
      <div className="lg:col-span-5 bg-[#161616] p-6 border-2 border-[#161616] shadow-[4px_4px_0px_0px_#9E2A2B]">
        <h3 className="text-xl font-bold text-[#F5F5F5] mb-6 uppercase tracking-wider font-mono">
          {editingId ? '⚡ Edit Flash Design' : '⚡ Add Flash Design'}
        </h3>

        {error && (
          <div className="bg-[#9E2A2B]/10 border border-[#9E2A2B] text-[#F5F5F5] p-3 text-sm mb-4 font-mono">
            [ERROR] {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-950/20 border border-emerald-500 text-[#F5F5F5] p-3 text-sm mb-4 font-mono">
            [SUCCESS] {success}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8E8E8E] mb-1 font-mono">
              Design Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Stargazer Moth"
              className="w-full bg-[#0C0C0C] border border-[#8E8E8E]/30 text-[#F5F5F5] px-3 py-2 text-sm focus:outline-none focus:border-[#9E2A2B] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8E8E8E] mb-1 font-mono">
              Line Art Image URL *
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-[#0C0C0C] border border-[#8E8E8E]/30 text-[#F5F5F5] px-3 py-2 text-sm focus:outline-none focus:border-[#9E2A2B] transition-colors"
              required
            />
            {imageUrl && (
              <div className="mt-2 relative h-32 w-full overflow-hidden border border-[#8E8E8E]/20 bg-[#0C0C0C]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLElement).style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8E8E8E] mb-1 font-mono">
                Flat-Rate Price ($)
              </label>
              <input
                type="number"
                value={priceEstimate}
                onChange={(e) => setPriceEstimate(e.target.value)}
                placeholder="e.g., 350"
                className="w-full bg-[#0C0C0C] border border-[#8E8E8E]/30 text-[#F5F5F5] px-3 py-2 text-sm focus:outline-none focus:border-[#9E2A2B] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8E8E8E] mb-1 font-mono">
                Recommended Size
              </label>
              <input
                type="text"
                value={recommendedSize}
                onChange={(e) => setRecommendedSize(e.target.value)}
                placeholder="e.g., 5&quot; x 3&quot;"
                className="w-full bg-[#0C0C0C] border border-[#8E8E8E]/30 text-[#F5F5F5] px-3 py-2 text-sm focus:outline-none focus:border-[#9E2A2B] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8E8E8E] mb-1 font-mono">
              Availability Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['available', 'reserved', 'sold'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`py-2 px-1 text-xs uppercase tracking-wider font-mono border transition-all ${
                    status === s
                      ? 'bg-[#9E2A2B] text-[#F5F5F5] border-[#9E2A2B]'
                      : 'bg-[#0C0C0C] text-[#8E8E8E] border-[#8E8E8E]/20 hover:text-[#F5F5F5]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-[#9E2A2B] text-[#F5F5F5] hover:bg-[#9E2A2B]/80 font-bold py-2 px-4 text-sm uppercase tracking-wider transition-colors duration-150 shadow-[2px_2px_0px_0px_#F5F5F5]"
            >
              {editingId ? 'Update Flash' : 'Add Flash'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-[#161616] text-[#8E8E8E] border border-[#8E8E8E]/30 hover:text-[#F5F5F5] py-2 px-4 text-sm uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Area */}
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-[#161616] p-4 border border-[#161616] flex justify-between items-center">
          <span className="text-sm font-mono text-[#8E8E8E]">
            TOTAL FLASH DESIGNS: <span className="text-[#F5F5F5] font-bold">{designs.length}</span>
          </span>
          <button
            onClick={fetchDesigns}
            className="text-xs font-mono uppercase text-[#9E2A2B] hover:text-[#F5F5F5] transition-colors"
          >
            [ Refresh Grid ]
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#8E8E8E] font-mono">Loading flash designs...</div>
        ) : designs.length === 0 ? (
          <div className="text-center py-12 bg-[#161616] border border-[#161616] text-[#8E8E8E] font-mono">
            No pre-drawn flash items found. Use the panel on the left to add your first!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {designs.map((design) => {
              // Status Badge Styles
              let badgeColor = 'border-[#9E2A2B] text-[#9E2A2B]'
              if (design.status === 'reserved') badgeColor = 'border-[#8E8E8E] text-[#8E8E8E]'
              if (design.status === 'sold') badgeColor = 'border-[#8E8E8E]/30 text-[#8E8E8E]/50 line-through'

              return (
                <div
                  key={design.id}
                  className="bg-[#161616] border border-[#8E8E8E]/10 group relative flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full bg-[#0C0C0C] flex items-center justify-center p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={design.image_url}
                      alt={design.title}
                      className="max-h-full max-w-full object-contain transition-opacity duration-300 group-hover:opacity-80"
                    />
                    <div className={`absolute top-2 left-2 bg-[#0C0C0C] border text-[10px] uppercase font-bold px-2 py-0.5 tracking-wider font-mono ${badgeColor}`}>
                      ● {design.status}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="text-base font-bold text-[#F5F5F5] tracking-tight">{design.title}</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-[#8E8E8E] font-mono">
                      <div>Size: {design.recommended_size || 'N/A'}</div>
                      <div>Price: {design.price_estimate ? `$${design.price_estimate}` : 'Variable'}</div>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-[#8E8E8E]/10">
                      <button
                        onClick={() => handleEdit(design)}
                        className="text-xs font-mono text-emerald-400 hover:text-emerald-300 uppercase"
                      >
                        [ Edit ]
                      </button>
                      <button
                        onClick={() => handleDelete(design.id)}
                        className="text-xs font-mono text-[#9E2A2B] hover:text-[#9E2A2B]/80 uppercase"
                      >
                        [ Delete ]
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}