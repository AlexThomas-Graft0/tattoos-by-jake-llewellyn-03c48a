'use client';

import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

// Type definition for Flash Designs count
interface FlashCountState {
  count: number | null;
  loading: boolean;
}

export function Hero() {
  const [flashData, setFlashData] = useState<FlashCountState>({
    count: null,
    loading: true,
  });

  useEffect(() => {
    async function fetchAvailableFlashCount() {
      try {
        const { count, error } = await supabase
          .from('flash_designs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'available');

        if (!error) {
          setFlashData({ count: count, loading: false });
        } else {
          setFlashData({ count: null, loading: false });
        }
      } catch (err) {
        setFlashData({ count: null, loading: false });
      }
    }
    fetchAvailableFlashCount();
  }, []);

  // Framer Motion Variants explicitly typed to meet build rules
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { scale: 1.05, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen bg-[#0C0C0C] text-[#F5F5F5] font-sans overflow-hidden flex flex-col justify-between"
    >
      {/* Structural Brutalist Grid Lines */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10">
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-[#8E8E8E]" />
        <div className="absolute left-2/4 top-0 bottom-0 w-px bg-[#8E8E8E]" />
        <div className="absolute left-3/4 top-0 bottom-0 w-px bg-[#8E8E8E]" />
        <div className="absolute top-1/3 left-0 right-0 h-px bg-[#8E8E8E]" />
        <div className="absolute top-2/3 left-0 right-0 h-px bg-[#8E8E8E]" />
      </div>

      {/* Hero Body Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24 flex-grow flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Copy & Actions */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col justify-center space-y-8 pr-0 lg:pr-4"
          >
            {/* lowercase style subheading */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs tracking-widest text-[#9E2A2B] uppercase bg-[#9E2A2B]/10 px-3 py-1 border border-[#9E2A2B]/30">
                [ status: booking active ]
              </span>
              <span className="font-mono text-sm tracking-wider text-[#8E8E8E] lowercase">
                custom blackwork & fine-line tattooing
              </span>
            </motion.div>

            {/* Title Case Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-[#F5F5F5] leading-none select-none"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Art Built to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F5F5] via-[#8E8E8E] to-[#9E2A2B]">
                Age With You.
              </span>
            </motion.h1>

            {/* Body Copy */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-[#8E8E8E] leading-relaxed max-w-2xl font-normal"
            >
              No chaotic social media threads. No guessing games. Welcome to a structured, clinical-grade tattooing experience designed to bring your vision to life on skin. Whether you want a custom, life-scale illustrative piece or a clean, minimal fine-line design, we make the process transparent, safe, and collaborative from first sketch to final heal.
            </motion.p>

            {/* Call to Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
            >
              <a
                href="#booking-form"
                className="group relative px-8 py-4 bg-[#9E2A2B] text-[#F5F5F5] font-mono text-sm tracking-wider font-bold uppercase transition-all duration-300 hover:bg-[#b03031] active:translate-y-0.5 text-center border border-[#9E2A2B]"
              >
                Request a Session
                <span className="absolute right-3 top-3 w-1.5 h-1.5 bg-[#F5F5F5] transition-transform group-hover:scale-150" />
              </a>

              <a
                href="#flash-catalog"
                className="group relative px-8 py-4 bg-transparent text-[#F5F5F5] font-mono text-sm tracking-wider font-bold uppercase transition-all duration-300 hover:bg-[#161616] border border-[#F5F5F5] text-center"
              >
                Browse Available Flash
              </a>
            </motion.div>

            {/* Dynamic Supabase Flash Alert & Trust Badges */}
            <motion.div
              variants={itemVariants}
              className="pt-6 border-t border-[#161616] flex flex-wrap gap-y-4 gap-x-8 text-xs font-mono text-[#8E8E8E]"
            >
              <div>
                <span className="text-[#9E2A2B] mr-2">●</span>
                <span>STUDIO: PORTLAND, OR (EAST END)</span>
              </div>
              <div>
                <span className="text-[#9E2A2B] mr-2">●</span>
                <span>
                  {flashData.loading ? (
                    'RETRIEVING FLASH CATALOG...'
                  ) : flashData.count !== null && flashData.count > 0 ? (
                    <span className="text-[#F5F5F5]">
                      {flashData.count} ORIGINAL FLASH DESIGNS READY
                    </span>
                  ) : (
                    'EXCLUSIVE FLASH DESIGNS AVAILABLE'
                  )}
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Split Screen Dramatic Visual */}
          <div className="lg:col-span-5 flex items-center justify-center relative min-h-[400px] lg:min-h-0">
            <div className="absolute inset-0 border-2 border-[#161616] bg-[#161616] overflow-hidden group">
              {/* Artistic Overlay Grid */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-transparent to-transparent z-10 opacity-80" />
              <div className="absolute top-4 left-4 z-20 font-mono text-[10px] tracking-widest text-[#F5F5F5] bg-[#0C0C0C] px-3 py-1.5 border border-[#161616]">
                JAKE LLEWELLYN • INK & NEEDLE
              </div>
              <div className="absolute bottom-4 right-4 z-20 font-mono text-[10px] tracking-widest text-[#8E8E8E]">
                EST. 2017
              </div>
              
              {/* High-Contrast Black and White Image of Tattooing */}
              <motion.img
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=1200"
                alt="Jake Llewellyn working in a clean, clinical private studio workspace with precision instruments"
                className="w-full h-full object-cover filter grayscale contrast-125 brightness-90 transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            
            {/* Brutalist Shadow Box Accent */}
            <div className="absolute -bottom-3 -right-3 w-full h-full border-2 border-[#9E2A2B] pointer-events-none -z-10" />
          </div>

        </div>
      </div>

      {/* Core Pillars / Value Propositions Section */}
      <div id="core-pillars" className="w-full bg-[#161616] border-t border-b border-[#161616] relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#0C0C0C]">
          
          {/* Pillar 1 */}
          <div className="p-8 lg:p-12 flex flex-col justify-between space-y-6 group hover:bg-[#0C0C0C] transition-colors duration-300">
            <div className="space-y-4">
              <div className="font-mono text-xs text-[#9E2A2B] tracking-widest uppercase">
                [ PILLAR 01 / SAFETY ]
              </div>
              <h3 className="text-xl font-bold text-[#F5F5F5]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Clean Lines, Safe Space
              </h3>
              <p className="text-sm text-[#8E8E8E] leading-relaxed">
                I operate out of a fully licensed, ultra-hygienic private studio. Every single needle, barrier grip, and pigment tray is 100% single-use disposable and opened directly in front of you. Your safety is non-negotiable.
              </p>
            </div>
            <div className="pt-2">
              <a 
                href="#booking-form" 
                className="font-mono text-xs text-[#F5F5F5] hover:text-[#9E2A2B] tracking-widest transition-colors inline-flex items-center gap-2"
              >
                VIEW PROTOCOLS <span className="text-xs">→</span>
              </a>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-8 lg:p-12 flex flex-col justify-between space-y-6 group hover:bg-[#0C0C0C] transition-colors duration-300">
            <div className="space-y-4">
              <div className="font-mono text-xs text-[#9E2A2B] tracking-widest uppercase">
                [ PILLAR 02 / PRICING ]
              </div>
              <h3 className="text-xl font-bold text-[#F5F5F5]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                No Hidden Fees
              </h3>
              <p className="text-sm text-[#8E8E8E] leading-relaxed">
                No awkward math at the end of your session. You will receive a clear, upfront cost estimate based on size, placement, and complexity before we ever touch skin.
              </p>
            </div>
            <div className="pt-2">
              <a 
                href="#process-and-faq" 
                className="font-mono text-xs text-[#F5F5F5] hover:text-[#9E2A2B] tracking-widest transition-colors inline-flex items-center gap-2"
              >
                PRICING GUIDE <span className="text-xs">→</span>
              </a>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-8 lg:p-12 flex flex-col justify-between space-y-6 group hover:bg-[#0C0C0C] transition-colors duration-300">
            <div className="space-y-4">
              <div className="font-mono text-xs text-[#9E2A2B] tracking-widest uppercase">
                [ PILLAR 03 / DESIGN ]
              </div>
              <h3 className="text-xl font-bold text-[#F5F5F5]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Drawn for the Future
              </h3>
              <p className="text-sm text-[#8E8E8E] leading-relaxed">
                Ink spreads naturally over time. I design with your body’s natural anatomy and skin longevity in mind, ensuring your tattoo looks just as sharp in ten years as it does on day one.
              </p>
            </div>
            <div className="pt-2">
              <a 
                href="#portfolio-gallery" 
                className="font-mono text-xs text-[#F5F5F5] hover:text-[#9E2A2B] tracking-widest transition-colors inline-flex items-center gap-2"
              >
                EXPLORE AGED WORK <span className="text-xs">→</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}