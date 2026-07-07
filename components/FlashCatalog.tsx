'use client';

import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface FlashDesign {
  id: string;
  image_url: string;
  title: string;
  price_estimate: number;
  recommended_size: string;
  status: 'available' | 'reserved' | 'sold';
  ideal_placements?: string;
  flash_code?: string;
}

const FALLBACK_FLASH_DESIGNS: FlashDesign[] = [
  {
    id: 'f101-fallback-uuid',
    flash_code: '#FL-101',
    title: 'Stargazer Moth',
    image_url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=800&auto=format&fit=crop',
    status: 'available',
    recommended_size: '5" x 3"',
    price_estimate: 350,
    ideal_placements: 'Sternum, forearm, calf',
  },
  {
    id: 'f102-fallback-uuid',
    flash_code: '#FL-102',
    title: 'Willow & Eye',
    image_url: 'https://images.unsplash.com/photo-1501472312651-726afd116ff1?q=80&w=800&auto=format&fit=crop',
    status: 'reserved',
    recommended_size: '4" x 4"',
    price_estimate: 300,
    ideal_placements: 'Upper arm, thigh',
  },
  {
    id: 'f103-fallback-uuid',
    flash_code: '#FL-103',
    title: 'Dagger & Wild Rose',
    image_url: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?q=80&w=800&auto=format&fit=crop',
    status: 'sold',
    recommended_size: '6" x 3"',
    price_estimate: 400,
    ideal_placements: 'Forearm, shin',
  },
];

export function FlashCatalog() {
  const [designs, setDesigns] = useState<FlashDesign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'available' | 'reserved' | 'sold'>('all');
  const [selectedPlacement, setSelectedPlacement] = useState<string>('all');

  useEffect(() => {
    async function fetchFlashDesigns() {
      try {
        const { data, error } = await supabase
          .from('flash_designs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped: FlashDesign[] = data.map((item, index) => ({
            id: item.id,
            flash_code: item.flash_code || `#FL-${101 + index}`,
            title: item.title,
            image_url: item.image_url,
            status: (item.status as 'available' | 'reserved' | 'sold') || 'available',
            recommended_size: item.recommended_size || '5" x 3"',
            price_estimate: Number(item.price_estimate) || 300,
            ideal_placements: item.ideal_placements || (index % 3 === 0 ? 'Sternum, forearm' : index % 3 === 1 ? 'Upper arm, thigh' : 'Forearm, shin'),
          }));
          setDesigns(mapped);
        } else {
          setDesigns(FALLBACK_FLASH_DESIGNS);
        }
      } catch (err) {
        console.error('Error loading flash designs, using premium catalog fallback:', err);
        setDesigns(FALLBACK_FLASH_DESIGNS);
      } finally {
        setLoading(false);
      }
    }

    fetchFlashDesigns();
  }, []);

  const handleClaim = (design: FlashDesign) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selected_flash_id', design.id);
      localStorage.setItem('selected_flash_title', `${design.title} (${design.flash_code || '#FL-Custom'})`);
      window.dispatchEvent(new Event('flash_selected'));
      
      const bookingSection = document.getElementById('booking-form');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const filteredDesigns = designs.filter((design) => {
    const matchesStatus = filter === 'all' || design.status === filter;
    const matchesPlacement =
      selectedPlacement === 'all' ||
      (design.ideal_placements &&
        design.ideal_placements.toLowerCase().includes(selectedPlacement.toLowerCase()));
    return matchesStatus && matchesPlacement;
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section
      id="flash-catalog"
      className="relative bg-[#0C0C0C] text-[#F5F5F5] py-24 px-4 sm:px-6 lg:px-8 border-t border-[#161616] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(158,42,43,0.05),transparent_45%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#9E2A2B] block mb-3">
              ready to wear
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#F5F5F5] font-sans mb-6">
              Original Flash Designs.
            </h2>
            <p className="text-[#8E8E8E] text-base md:text-lg leading-relaxed font-sans">
              Flash designs are original, pre-drawn pieces of art waiting for a permanent home on skin.
              They require zero design wait times, are booked at a flat rate, and once a design is
              claimed, it is retired forever. Select a design below to lock it in.
            </p>
          </div>

          <div className="font-mono text-xs text-[#8E8E8E] border border-[#161616] p-4 bg-[#121212]/50 max-w-sm">
            <span className="text-[#9E2A2B] font-bold">●</span> Only the original claimant receives the design.
            We never tattoo the same flash piece twice. All appointments require a non-refundable deposit.
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-12 border-b border-[#161616]">
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All Designs', value: 'all' },
              { label: 'Available', value: 'available' },
              { label: 'Reserved', value: 'reserved' },
              { label: 'Retired', value: 'sold' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value as any)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-200 border ${
                  filter === tab.value
                    ? 'bg-[#F5F5F5] text-[#0C0C0C] border-[#F5F5F5]'
                    : 'bg-transparent text-[#8E8E8E] border-[#161616] hover:text-[#F5F5F5] hover:border-[#8E8E8E]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8E8E8E] uppercase">Filter placement:</span>
            <select
              value={selectedPlacement}
              onChange={(e) => setSelectedPlacement(e.target.value)}
              className="bg-[#161616] border border-[#161616] text-[#F5F5F5] font-mono text-xs px-3 py-2 outline-none focus:border-[#9E2A2B] transition-colors"
            >
              <option value="all">All Body Placements</option>
              <option value="forearm">Forearm</option>
              <option value="sternum">Sternum</option>
              <option value="calf">Calf</option>
              <option value="thigh">Thigh</option>
              <option value="arm">Upper Arm</option>
              <option value="shin">Shin</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-[500px] bg-[#161616] animate-pulse border border-[#161616]"
              />
            ))}
          </div>
        ) : filteredDesigns.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#161616] bg-[#0C0C0C]">
            <p className="font-mono text-sm text-[#8E8E8E]">
              No designs found matching your current filter.
            </p>
            <button
              onClick={() => {
                setFilter('all');
                setSelectedPlacement('all');
              }}
              className="mt-4 text-xs font-mono text-[#9E2A2B] underline uppercase hover:text-[#F5F5F5]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredDesigns.map((design) => {
              const isAvailable = design.status === 'available';
              const isReserved = design.status === 'reserved';
              const isSold = design.status === 'sold';

              return (
                <motion.div
                  key={design.id}
                  variants={itemVariants}
                  className="group relative flex flex-col bg-[#121212] border-2 border-[#161616] hover:border-[#9E2A2B] transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-[4/5] w-full bg-[#161616] overflow-hidden">
                    <img
                      src={design.image_url}
                      alt={design.title}
                      className={`object-cover w-full h-full grayscale contrast-125 group-hover:scale-105 transition-transform duration-700 ${
                        isSold ? 'opacity-40 blur-[1px]' : 'opacity-90 hover:opacity-100'
                      }`}
                      loading="lazy"
                    />

                    <div className="absolute top-4 left-4 z-10">
                      {isAvailable && (
                        <span className="inline-flex items-center px-3 py-1 font-mono text-xs font-semibold bg-[#0C0C0C] text-[#9E2A2B] border border-[#9E2A2B]">
                          ● Available
                        </span>
                      )}
                      {isReserved && (
                        <span className="inline-flex items-center px-3 py-1 font-mono text-xs font-semibold bg-[#0C0C0C] text-[#8E8E8E] border border-[#161616]">
                          ● Reserved
                        </span>
                      )}
                      {isSold && (
                        <span className="inline-flex items-center px-3 py-1 font-mono text-xs font-semibold bg-[#0C0C0C]/90 text-[#8E8E8E] line-through border border-dashed border-[#8E8E8E]/30">
                          Tattooed
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-4 right-4 z-10 bg-[#0C0C0C]/90 border border-[#161616] px-3 py-1 font-mono text-xs text-[#8E8E8E]">
                      {design.flash_code || '#FL'}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold font-sans tracking-tight text-[#F5F5F5] group-hover:text-[#9E2A2B] transition-colors">
                        {design.title}
                      </h3>
                      <span className="font-mono text-lg font-black text-[#F5F5F5]">
                        {isSold ? (
                          <span className="text-[#8E8E8E] line-through">${design.price_estimate}</span>
                        ) : (
                          `$${design.price_estimate}`
                        )}
                      </span>
                    </div>

                    <div className="space-y-2 mb-6 flex-grow font-mono text-xs text-[#8E8E8E]">
                      <div className="flex justify-between py-1 border-b border-[#161616]">
                        <span>Size Suggestion:</span>
                        <span className="text-[#F5F5F5]">{design.recommended_size}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#161616]">
                        <span>Ideal Placements:</span>
                        <span className="text-[#F5F5F5] text-right truncate max-w-[180px]">
                          {design.ideal_placements || 'Consult Artist'}
                        </span>
                      </div>
                    </div>

                    {isAvailable && (
                      <button
                        onClick={() => handleClaim(design)}
                        className="w-full bg-[#9E2A2B] text-[#F5F5F5] font-mono text-xs uppercase tracking-wider py-3 border border-[#9E2A2B] hover:bg-transparent hover:text-[#9E2A2B] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#9E2A2B]"
                      >
                        Claim This Design
                      </button>
                    )}

                    {isReserved && (
                      <button
                        onClick={() => handleClaim(design)}
                        className="w-full bg-transparent text-[#8E8E8E] font-mono text-xs uppercase tracking-wider py-3 border border-[#161616] hover:border-[#8E8E8E] hover:text-[#F5F5F5] transition-all duration-300 focus:outline-none"
                      >
                        Inquire (Join Waitlist)
                      </button>
                    )}

                    {isSold && (
                      <button
                        disabled
                        className="w-full bg-[#161616] text-[#8E8E8E] font-mono text-xs uppercase tracking-wider py-3 border border-[#161616] cursor-not-allowed opacity-55"
                      >
                        Retired Design
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        <div className="mt-16 p-8 border-2 border-[#161616] bg-[#121212] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold text-[#F5F5F5] font-sans mb-2">
              Have a unique concept in mind instead?
            </h4>
            <p className="text-[#8E8E8E] text-sm font-sans max-w-xl">
              Jake also works closely with clients to construct premium custom blackwork and fine-line illustrations based on your stories and motifs.
            </p>
          </div>
          <a
            href="#booking-form"
            className="whitespace-nowrap px-6 py-3 bg-transparent border-2 border-[#F5F5F5] text-[#F5F5F5] hover:bg-[#F5F5F5] hover:text-[#0C0C0C] font-mono text-xs uppercase tracking-wider transition-all duration-300"
          >
            Request a Custom Session
          </a>
        </div>
      </div>
    </section>
  );
}