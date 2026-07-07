'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseAuthed'

interface PortfolioItem {
  id: string
  title: string
  image_url: string
  category: string
  placement: string | null
  created_at: string
}

export default function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState('Fine Line')
  const [placement, setPlacement] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err
      setItems(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch portfolio items')
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

    try {
      if (editingId) {
        // Edit mode
        const { error: err } = await supabase
          .from('portfolio_items')
          .update({
            title,
            image_url: imageUrl,
            category,
            placement: placement || null,
          })
          .eq('id', editingId)

        if (err) throw err
        setSuccess('Portfolio item updated successfully.')
      } else {
        // Insert mode
        const { error: err } = await supabase
          .from('portfolio_items')
          .insert([
            {
              title,
              image_url: imageUrl,
              category,
              placement: placement || null,
            },
          ])

        if (err) throw err
        setSuccess('Portfolio item added successfully.')
      }

      // Reset form
      setTitle('')
      setImageUrl('')
      setCategory('Fine Line')
      setPlacement('')
      setEditingId(null)
      fetchItems()
    } catch (err: any) {
      setError(err.message || 'Error saving portfolio item')
    }
  }

  const handleEdit = (item: PortfolioItem) => {
    setEditingId(item.id)
    setTitle(item.title)
    setImageUrl(item.image_url)
    setCategory(item.category)
    setPlacement(item.placement || '')
    setError(null)
    setSuccess(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return
    setError(null)
    setSuccess(null)

    try {
      const { error: err } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id)

      if (err) throw err
      setSuccess('Portfolio item deleted.')
      fetchItems()
    } catch (err: any) {
      setError(err.message || 'Error deleting item')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setTitle('')
    setImageUrl('')
    setCategory('Fine Line')
    setPlacement('')
    setError(null)
    setSuccess(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Area */}
      <div className="lg:col-span-5 bg-[#161616] p-6 border-2 border-[#161616] shadow-[4px_4px_0px_0px_#9E2A2B]">
        <h3 className="text-xl font-bold text-[#F5F5F5] mb-6 uppercase tracking-wider font-mono">
          {editingId ? '⚡ Edit Portfolio Item' : '⚡ Add Portfolio Item'}
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
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Geometric Mandorla"
              className="w-full bg-[#0C0C0C] border border-[#8E8E8E]/30 text-[#F5F5F5] px-3 py-2 text-sm focus:outline-none focus:border-[#9E2A2B] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8E8E8E] mb-1 font-mono">
              Image URL *
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
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
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0C0C0C] border border-[#8E8E8E]/30 text-[#F5F5F5] px-3 py-2 text-sm focus:outline-none focus:border-[#9E2A2B] transition-colors"
              >
                <option value="Fine Line">Fine Line</option>
                <option value="Blackwork">Blackwork</option>
                <option value="Illustrative">Illustrative</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8E8E8E] mb-1 font-mono">
                Placement
              </label>
              <input
                type="text"
                value={placement}
                onChange={(e) => setPlacement(e.target.value)}
                placeholder="e.g., Forearm, Collarbone"
                className="w-full bg-[#0C0C0C] border border-[#8E8E8E]/30 text-[#F5F5F5] px-3 py-2 text-sm focus:outline-none focus:border-[#9E2A2B] transition-colors"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-[#9E2A2B] text-[#F5F5F5] hover:bg-[#9E2A2B]/80 font-bold py-2 px-4 text-sm uppercase tracking-wider transition-colors duration-150 shadow-[2px_2px_0px_0px_#F5F5F5]"
            >
              {editingId ? 'Update Design' : 'Publish Design'}
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
            TOTAL ITEMS: <span className="text-[#F5F5F5] font-bold">{items.length}</span>
          </span>
          <button
            onClick={fetchItems}
            className="text-xs font-mono uppercase text-[#9E2A2B] hover:text-[#F5F5F5] transition-colors"
          >
            [ Refresh Grid ]
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#8E8E8E] font-mono">Loading portfolio items...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-[#161616] border border-[#161616] text-[#8E8E8E] font-mono">
            No items in portfolio. Add your first design on the left!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-[#161616] border border-[#8E8E8E]/10 group relative flex flex-col justify-between"
              >
                <div className="relative h-48 w-full bg-[#0C0C0C]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                  />
                  <div className="absolute top-2 left-2 bg-[#0C0C0C] border border-[#9E2A2B] text-[#9E2A2B] text-[10px] uppercase font-bold px-2 py-0.5 tracking-wider font-mono">
                    {item.category}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="text-base font-bold text-[#F5F5F5] tracking-tight">{item.title}</h4>
                  <p className="text-xs text-[#8E8E8E] font-mono">
                    Placement: {item.placement || 'Not specified'}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-[#8E8E8E]/10">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-xs font-mono text-emerald-400 hover:text-emerald-300 uppercase"
                    >
                      [ Edit ]
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs font-mono text-[#9E2A2B] hover:text-[#9E2A2B]/80 uppercase"
                    >
                      [ Delete ]
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}