'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface PortfolioItem {
  id: string;
  image_url: string;
  title: string;
  category: string;
  placement: string;
  created_at?: string;
}

const FALLBACK_ITEMS: PortfolioItem[] = [
  {
    id: '1',
    title: 'Geometric Mandorla',
    category: 'Blackwork',
    placement: 'Forearm',
    image_url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: '2',
    title: 'Botanical Olive Branch',
    category: 'Fine Line',
    placement: 'Collarbone',
    image_url: 'https://images.unsplash.com/photo-1611501275019-9b5cdae81d62?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: '3',
    title: 'The Hermit Tarot',
    category: 'Illustrative',
    placement: 'Calf',
    image_url: 'https://images.unsplash.com/photo-1560707303-4e980c87f846?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: '4',
    title: 'Micro-Cosmos',
    category: 'Fine Line',
    placement: 'Wrist',
    image_url: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: '5',
    title: 'The Serpent Guide',
    category: 'Blackwork',
    placement: 'Forearm',
    image_url: 'https://images.unsplash.com/photo-1605646190059-fbd76dadca1a?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: '6',
    title: 'Sacred Alignment',
    category: 'Illustrative',
    placement: 'Upper Arm',
    image_url: 'https://images.unsplash.com/photo-1590246814883-5775170b947b?auto=format&fit=crop&q=80&w=1200',
  }
];

const DESCRIPTIONS: Record<string, string> = {
  'Geometric Mandorla': 'Heavy, saturated blacks contrasted with microscopic dotwork and crisp outer borders.',
  'Botanical Olive Branch': 'Single-needle precision designed to flow naturally with the collarbone\'s anatomy.',
  'The Hermit Tarot': 'Etching-style linework inspired by medieval woodcuts, utilizing gray-wash tones.',
  'Micro-Cosmos': 'Minimalist planetary alignment utilizing ultra-fine dots and hair-thin lines.',
  'The Serpent Guide': 'Bold blackwork snake winding down a forearm, featuring heavy contrast shading.',
  'Sacred Alignment': 'Geometric patterns and heavy ink packing for an everlasting sharp finish.'
};

const CATEGORIES = ['All Works', 'Fine Line', 'Blackwork', 'Illustrative'];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 16 }
  }
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 20 }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15 }
  }
};

export function PortfolioGallery() {
  const [items, setItems] = useState<PortfolioItem[]>(FALLBACK_ITEMS);
  const [activeFilter, setActiveFilter] = useState('All Works');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        const { data, error } = await supabase
          .from('portfolio_items')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        console.error('Error fetching portfolio items:', err);
      }
    }
    fetchItems();
  }, []);

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'All Works') return true;
    return item.category.toLowerCase() === activeFilter.toLowerCase();
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSelectedItem(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <section 
      id="portfolio-gallery" 
      className="relative bg-[#0C0C0C] text-[#F5F5F5] py-24 px-4 sm:px-6 lg:px-8 border-b border-[#161616] overflow-hidden"
    >
      {/* Background Subtle Geometrics */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#9E2A2B_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#161616]">
          <div className="max-w-2xl">
            <span className="text-xs font-mono tracking-widest text-[#9E2A2B] uppercase block mb-3">
              // curated works
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#F5F5F5] uppercase mb-6 font-sans">
              The Gallery.
            </h2>
            <p className="text-[#8E8E8E] text-base sm:text-lg leading-relaxed font-sans">
              Every line is intentional. Browse through completed projects sorted by style. 
              Tap any image to open a high-resolution view to inspect the line weight, 
              smooth gradients, and saturated blacks.
            </p>
          </div>
          
          {/* Custom Neo-Brutalist Badge */}
          <div className="mt-6 md:mt-0 flex items-center gap-3 self-start md:self-end">
            <span className="w-2.5 h-2.5 rounded-full bg-[#9E2A2B] animate-pulse" />
            <span className="font-mono text-xs text-[#8E8E8E] uppercase tracking-wider">
              Studio Precision Verified
            </span>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap gap-2 mb-12" role="tablist" aria-label="Portfolio filters">
          {CATEGORIES.map((cat) => {
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2.5 text-xs font-mono uppercase tracking-wider transition-all duration-200 border ${
                  isActive
                    ? 'bg-[#9E2A2B] text-[#F5F5F5] border-[#9E2A2B] shadow-[2px_2px_0px_0px_#F5F5F5]'
                    : 'bg-[#161616] text-[#8E8E8E] border-[#161616] hover:text-[#F5F5F5] hover:border-[#8E8E8E]'
                } focus:outline-none focus:ring-2 focus:ring-[#9E2A2B] focus:ring-offset-2 focus:ring-offset-[#0C0C0C]`}
              >
                [ {cat} ]
              </button>
            );
          })}
        </div>

        {/* Dynamic Editorial Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={activeFilter}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setSelectedItem(item)}
                className="group relative bg-[#161616] border border-[#161616] hover:border-[#9E2A2B] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedItem(item);
                  }
                }}
              >
                {/* Visual Image Container */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-black">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale contrast-125 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                    loading="lazy"
                  />
                  {/* Absolute Top-Right Technical Tag */}
                  <div className="absolute top-4 right-4 bg-[#0C0C0C]/90 border border-[#161616] px-2.5 py-1 backdrop-blur-sm">
                    <span className="font-mono text-[10px] text-[#9E2A2B] uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>
                  
                  {/* Smooth Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="font-mono text-xs text-[#9E2A2B] uppercase mb-1">
                      Placement: {item.placement || 'Custom'}
                    </span>
                    <h4 className="text-xl font-bold text-[#F5F5F5] uppercase tracking-wide">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#8E8E8E] mt-2 line-clamp-2">
                      {DESCRIPTIONS[item.title] || 'Fine-line precision built for contrast and lifetime skin durability.'}
                    </p>
                    <span className="text-xs font-mono text-[#F5F5F5] mt-4 flex items-center gap-2">
                      Inspect Detail <span className="text-[#9E2A2B]">→</span>
                    </span>
                  </div>
                </div>

                {/* Card Footer (Visible when not hovered as well) */}
                <div className="p-5 border-t border-[#161616] flex items-center justify-between bg-[#111111]">
                  <div>
                    <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wide group-hover:text-[#9E2A2B] transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#8E8E8E] font-mono mt-0.5">
                      {item.placement || 'Unspecified Placement'}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#8E8E8E] group-hover:text-[#F5F5F5] transition-colors duration-200">
                    [ VIEW ]
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom CTA Block */}
        <div className="mt-16 pt-12 border-t border-[#161616] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-[#F5F5F5] uppercase tracking-wide">
              Have a specific concept in mind that matches one of these styles?
            </h3>
            <p className="text-[#8E8E8E] text-sm mt-1">
              Let’s design a custom piece built to flow naturally with your body’s unique anatomy.
            </p>
          </div>
          <a
            href="#booking-form"
            className="w-full md:w-auto px-8 py-4 bg-[#9E2A2B] text-[#F5F5F5] font-mono text-xs uppercase tracking-wider text-center border border-[#9E2A2B] hover:bg-transparent hover:text-[#9E2A2B] transition-all duration-300 shadow-[4px_4px_0px_0px_#161616] hover:shadow-none"
          >
            Request a Custom Session
          </a>
        </div>
      </div>

      {/* Lightbox / High-Resolution Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-[#0C0C0C] border border-[#161616] w-full max-w-5xl max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-12 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
              role="dialog"
              aria-modal="true"
              aria-label={selectedItem.title}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black border border-[#161616] flex items-center justify-center hover:border-[#9E2A2B] transition-colors focus:outline-none"
                aria-label="Close dialog"
              >
                <span className="text-xl text-[#F5F5F5] font-mono">&times;</span>
              </button>

              {/* Left Side: High-res Image */}
              <div className="md:col-span-7 bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px]">
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.title}
                  className="w-full h-full max-h-[80vh] object-contain grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>

              {/* Right Side: Metadata / Technical Details */}
              <div className="md:col-span-5 p-8 sm:p-10 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#161616]">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-[#161616] border border-[#161616] text-[#9E2A2B] font-mono text-[10px] uppercase tracking-widest">
                      {selectedItem.category}
                    </span>
                    <span className="text-[#8E8E8E] text-[10px] font-mono uppercase tracking-widest">
                      // ID: {selectedItem.id.slice(0, 8)}
                    </span>
                  </div>

                  <h3 className="text-3xl font-black text-[#F5F5F5] uppercase tracking-tight mb-4 font-sans">
                    {selectedItem.title}
                  </h3>

                  <div className="space-y-6 my-6 border-y border-[#161616] py-6">
                    <div>
                      <span className="block text-xs font-mono uppercase text-[#8E8E8E] mb-1">
                        Ideal Anatomy / Placement
                      </span>
                      <p className="text-sm font-bold text-[#F5F5F5] uppercase">
                        {selectedItem.placement || 'Flexible / Custom'}
                      </p>
                    </div>

                    <div>
                      <span className="block text-xs font-mono uppercase text-[#8E8E8E] mb-1">
                        Technical Application Notes
                      </span>
                      <p className="text-sm text-[#8E8E8E] leading-relaxed">
                        {DESCRIPTIONS[selectedItem.title] || 'This design is meticulously rendered with single-use sterile grouping needles, optimized for skin longevity, and designed to dynamically age with the client\'s body geometry.'}
                      </p>
                    </div>

                    <div>
                      <span className="block text-xs font-mono uppercase text-[#8E8E8E] mb-1">
                        Studio Standard Guarantee
                      </span>
                      <p className="text-xs text-[#8E8E8E] leading-relaxed flex items-start gap-2">
                        <span className="text-[#9E2A2B]">■</span> Fully sterile application, single-use disposable setups, and clinical-grade environment.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <a
                    href="#booking-form"
                    onClick={() => setSelectedItem(null)}
                    className="block w-full text-center px-6 py-3.5 bg-[#9E2A2B] text-[#F5F5F5] font-mono text-xs uppercase tracking-wider border border-[#9E2A2B] hover:bg-transparent hover:text-[#9E2A2B] transition-all duration-300"
                  >
                    Request Similar Custom Session
                  </a>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="block w-full text-center px-6 py-3 bg-transparent text-[#8E8E8E] font-mono text-xs uppercase tracking-wider border border-[#161616] hover:text-[#F5F5F5] hover:border-[#8E8E8E] transition-all duration-300"
                  >
                    Back to Gallery
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}