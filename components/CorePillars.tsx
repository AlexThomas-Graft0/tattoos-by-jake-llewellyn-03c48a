'use client';

import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';

interface Pillar {
  id: string;
  number: string;
  heading: string;
  body: string;
  accentTitle: string;
  details: string[];
  imageUrl: string;
  imageAlt: string;
}

const PILLARS_DATA: Pillar[] = [
  {
    id: 'safety',
    number: '01',
    heading: 'Clean Lines, Safe Space',
    accentTitle: 'CLINICAL-GRADE SAFETY',
    body: 'I operate out of a fully licensed, ultra-hygienic private studio. Every single needle, barrier grip, and pigment tray is 100% single-use disposable and opened directly in front of you. Your safety is non-negotiable.',
    details: [
      '100% Single-Use Sterile Disposables',
      'Hospital-Grade Disinfectants (Cavicide)',
      'Fully Licensed & Health Dept. Compliant',
      'Opened & Assembled in Your Direct View'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&q=80&w=800',
    imageAlt: 'Sterile tattoo needles and precision equipment laid out on a clean metal tray.'
  },
  {
    id: 'pricing',
    number: '02',
    heading: 'No Hidden Fees',
    accentTitle: 'TRANSPARENT PRICING',
    body: 'No awkward math at the end of your session. You will receive a clear, upfront cost estimate based on size, placement, and complexity before we ever touch skin.',
    details: [
      'Guaranteed Flat Rates for All Flash',
      'Detailed Custom Estimates Pre-Session',
      'No Hidden Setup or Stencil Charges',
      'Clear Breakdown of Hourly vs. Flat Rates'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
    imageAlt: 'Meticulous design blueprints, calipers, and sketches on a dark wooden table.'
  },
  {
    id: 'longevity',
    number: '03',
    heading: 'Drawn for the Future',
    accentTitle: 'COLLABORATIVE LONGEVITY',
    body: 'Ink spreads naturally over time. I design with your body’s natural anatomy and skin longevity in mind, ensuring your tattoo looks just as sharp in ten years as it does on day one.',
    details: [
      'Anatomically Matched Flow & Placement',
      'Strategic Line-Weight Calibration',
      'Engineered to Prevent Ink Bleed & Blur',
      'Premium Healing Film & Aftercare Guide'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&q=80&w=800',
    imageAlt: 'High-contrast detailed dark artwork showcasing fine-line precision.'
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 15
    }
  }
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

export function CorePillars() {
  const [activePillar, setActivePillar] = useState<string>('safety');

  const currentPillarData = PILLARS_DATA.find((p) => p.id === activePillar) || PILLARS_DATA[0];

  return (
    <section
      id="core-pillars"
      className="relative bg-[#0C0C0C] text-[#F5F5F5] py-24 px-4 sm:px-6 lg:px-8 border-b border-[#161616] overflow-hidden"
    >
      {/* Decorative Neo-Brutalist Grid Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b-2 border-[#161616]">
          <div className="max-w-2xl">
            <span className="font-mono text-xs tracking-[0.2em] text-[#9E2A2B] uppercase block mb-3 font-semibold">
              // professional standards
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase font-sans text-[#F5F5F5]">
              Built to Last.
            </h2>
          </div>
          <p className="mt-4 md:mt-0 max-w-md font-sans text-sm sm:text-base text-[#8E8E8E] leading-relaxed">
            Eliminating the gatekeeper tattoo stigma with a structured, clinical-grade tattooing experience engineered around your safety and vision.
          </p>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Interactive Selection Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-7 flex flex-col gap-6 justify-between"
          >
            <div className="space-y-6">
              {PILLARS_DATA.map((pillar) => {
                const isActive = activePillar === pillar.id;
                return (
                  <motion.div
                    key={pillar.id}
                    variants={cardVariants}
                    onClick={() => setActivePillar(pillar.id)}
                    className={`group relative cursor-pointer p-6 sm:p-8 border-2 transition-all duration-300 rounded-none bg-[#161616] ${
                      isActive
                        ? 'border-[#9E2A2B] shadow-[4px_4px_0px_0px_#9E2A2B]'
                        : 'border-[#161616] hover:border-[#8E8E8E] hover:shadow-[4px_4px_0px_0px_#161616]'
                    }`}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isActive}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActivePillar(pillar.id);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <span className="font-mono text-xs tracking-wider text-[#9E2A2B] uppercase block mb-1 font-semibold">
                          {pillar.accentTitle}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-[#F5F5F5] group-hover:text-white transition-colors">
                          {pillar.heading}
                        </h3>
                      </div>
                      <span className="font-mono text-3xl sm:text-4xl font-black text-[#161616] stroke-text select-none group-hover:text-[#9E2A2B]/10 transition-colors">
                        {pillar.number}
                      </span>
                    </div>

                    <p className="font-sans text-sm sm:text-base text-[#8E8E8E] group-hover:text-[#F5F5F5] transition-colors leading-relaxed">
                      {pillar.body}
                    </p>

                    {/* Expandable Technical Specifications on Active */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                        isActive ? 'grid-rows-[1fr] mt-6 pt-6 border-t border-[#161616] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <h4 className="font-mono text-[10px] tracking-widest text-[#8E8E8E] uppercase mb-3">
                          PROTOCOL SPECIFICATIONS:
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {pillar.details.map((detail, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs font-mono text-[#F5F5F5]">
                              <span className="w-1.5 h-1.5 bg-[#9E2A2B]" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* In-Page Action Block */}
            <div className="mt-8 pt-8 border-t border-[#161616] flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#booking-form"
                className="w-full sm:w-auto px-8 py-4 bg-[#9E2A2B] text-[#F5F5F5] font-mono text-xs uppercase tracking-widest font-black border-2 border-[#9E2A2B] hover:bg-transparent hover:text-[#9E2A2B] transition-all duration-300 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9E2A2B] active:translate-y-0.5"
              >
                Request a Session
              </a>
              <a
                href="#flash-catalog"
                className="w-full sm:w-auto px-8 py-4 bg-transparent text-[#F5F5F5] font-mono text-xs uppercase tracking-widest font-black border-2 border-[#F5F5F5] hover:bg-[#F5F5F5] hover:text-[#0C0C0C] transition-all duration-300 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:translate-y-0.5"
              >
                Browse Available Flash
              </a>
            </div>
          </motion.div>

          {/* Right Column: High-Impact Visual Proof Display */}
          <div className="lg:col-span-5 relative flex flex-col justify-between border-2 border-[#161616] bg-[#161616] p-4 min-h-[450px] lg:min-h-auto">
            {/* Visual Screen Frame */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between border-b border-[#161616] pb-3 z-20 mix-blend-difference">
              <span className="font-mono text-[10px] tracking-wider text-[#F5F5F5] uppercase">
                STATUS: ACTIVE_MONITOR
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#9E2A2B] animate-pulse" />
                <span className="font-mono text-[10px] text-[#F5F5F5]">SECURE</span>
              </div>
            </div>

            <div className="relative flex-1 w-full h-full min-h-[300px] overflow-hidden">
              <motion.img
                key={currentPillarData.id}
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                src={currentPillarData.imageUrl}
                alt={currentPillarData.imageAlt}
                className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-transparent to-transparent opacity-80" />
            </div>

            {/* Dynamic Visual Captions */}
            <div className="relative mt-4 z-10">
              <div className="p-4 bg-[#0C0C0C] border border-[#161616]">
                <span className="font-mono text-[9px] text-[#9E2A2B] uppercase block mb-1">
                  // STUDIO EVIDENCE FILE // {currentPillarData.id.toUpperCase()}
                </span>
                <p className="font-mono text-xs text-[#8E8E8E] leading-relaxed">
                  Every instrument and methodology has been carefully chosen to support premium biological integration and absolute design precision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .stroke-text {
          -webkit-text-stroke: 1px #8E8E8E;
          color: transparent;
        }
      `}</style>
    </section>
  );
}