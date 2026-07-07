'use client';

import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface FlashCountState {
  count: number;
  loading: boolean;
}

export function Footer() {
  const [flashData, setFlashData] = useState<FlashCountState>({
    count: 3, // Premium default fallback
    loading: true,
  });

  useEffect(() => {
    async function fetchAvailableFlashCount() {
      try {
        const { count, error } = await supabase
          .from('flash_designs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'available');

        if (!error && count !== null) {
          setFlashData({ count, loading: false });
        } else {
          setFlashData((prev) => ({ ...prev, loading: false }));
        }
      } catch {
        setFlashData((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchAvailableFlashCount();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.08,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const quickLinks = [
    { label: 'The Studio', href: '#hero' },
    { label: 'Our Pillars', href: '#core-pillars' },
    { label: 'The Gallery', href: '#portfolio-gallery' },
    { label: 'Original Flash', href: '#flash-catalog' },
    { label: 'The Process & FAQ', href: '#process-and-faq' },
    { label: 'Request a Session', href: '#booking-form' },
    { label: 'About Jake', href: '#about-artist' },
    { label: 'Studio Logistics', href: '#contact-studio' },
  ];

  return (
    <footer className="relative bg-[#0C0C0C] text-[#F5F5F5] border-t border-[#161616] overflow-hidden font-sans selection:bg-[#9E2A2B] selection:text-[#F5F5F5]">
      {/* Neo-Brutalist Ambient Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      {/* Decorative Crimson Ink Top Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#9E2A2B] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-[#161616]"
        >
          {/* Main Brand Column */}
          <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#9E2A2B] block">
                Portland, Oregon
              </span>
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-[#F5F5F5]">
                TATTOOS BY <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F5F5] via-[#8E8E8E] to-[#9E2A2B]">
                  JAKE LLEWELLYN
                </span>
              </h3>
            </div>
            <p className="text-sm text-[#8E8E8E] leading-relaxed max-w-md">
              A clinical-grade, highly structured tattooing experience designed to bring your vision to life on skin. Specialize in blackwork, fine-line, and expressive illustrative designs built to age with you.
            </p>

            {/* Live Studio Status Indicator */}
            <div className="inline-flex items-center gap-3 bg-[#161616] border border-[#222] px-4 py-2.5 rounded-none shadow-[2px_2px_0px_0px_rgba(158,42,43,0.3)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9E2A2B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9E2A2B]"></span>
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-[#F5F5F5]">
                Accepting Bookings for 2024
              </span>
            </div>
          </motion.div>

          {/* Navigation Links Column */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#8E8E8E] border-b border-[#161616] pb-2">
              Navigation
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-[#8E8E8E] hover:text-[#F5F5F5] transition-colors duration-200 flex items-center gap-1.5 group font-medium"
                >
                  <span className="text-[#9E2A2B] opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-mono text-xs">
                    //
                  </span>
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Studio Info & Live Flash Availability */}
          <motion.div variants={itemVariants} className="lg:col-span-3 space-y-6">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#8E8E8E] border-b border-[#161616] pb-2">
              Studio & Flash Status
            </h4>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-mono text-[#8E8E8E]">STUDIO LOCATION</p>
                <p className="text-sm text-[#F5F5F5] font-medium">East End Creative District</p>
                <p className="text-xs text-[#8E8E8E]">Portland, OR — Private Space</p>
              </div>

              <div className="bg-[#161616] p-4 border border-[#222] space-y-2">
                <p className="text-xs font-mono text-[#8E8E8E] uppercase tracking-wider">Available Flash Designs</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-mono font-bold text-[#F5F5F5]">
                    {flashData.loading ? '...' : `${flashData.count}`}
                  </span>
                  <span className="text-xs text-[#8E8E8E]">original designs ready to wear</span>
                </div>
                <a
                  href="#flash-catalog"
                  className="block text-center text-xs font-mono uppercase tracking-wider bg-[#9E2A2B] text-[#F5F5F5] py-2 px-3 hover:bg-[#b03031] transition-colors duration-200 font-bold"
                >
                  Claim a Design
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Brand Sign-off Typography */}
        <div className="py-8 border-b border-[#161616] overflow-hidden select-none pointer-events-none">
          <p className="text-[12vw] font-black tracking-tighter text-[#161616] leading-none uppercase text-center block whitespace-nowrap">
            Art Built To Age With You
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-mono text-[#8E8E8E] text-center md:text-left">
            &copy; 2024 Tattoos by Jake Llewellyn. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs font-mono text-[#8E8E8E]">
              Strictly Appointment Only
            </span>
            <a
              href="#hero"
              className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-[#9E2A2B] hover:text-[#F5F5F5] transition-colors duration-200 group"
            >
              Back to Top
              <span className="transform group-hover:-translate-y-0.5 transition-transform duration-200">
                &uarr;
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}