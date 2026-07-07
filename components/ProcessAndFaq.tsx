'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Plus, Minus, ArrowUpRight, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

interface Step {
  number: string;
  title: string;
  description: string;
  badge: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

export function ProcessAndFaq() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const steps: Step[] = [
    {
      number: '01',
      title: 'The Request',
      badge: 'Step 1: Submit Inquiry',
      description: 'Fill out our structured inquiry form. You’ll choose between a custom piece or a flash design, describe your concept, note your desired placement, and upload reference photos.',
    },
    {
      number: '02',
      title: 'The Proposal',
      badge: 'Step 2: Review & Estimate',
      description: 'I review every proposal personally. Within 3 business days, you will receive an email containing design feedback, a transparent cost estimate, and a scheduling link.',
    },
    {
      number: '03',
      title: 'The Deposit',
      badge: 'Step 3: Secure the Date',
      description: 'To finalize your booking, a $100 non-refundable deposit is required. This deposit holds your date and goes directly toward the final price of your tattoo.',
    },
    {
      number: '04',
      title: 'Ink Day',
      badge: 'Step 4: The Session',
      description: 'We meet at our quiet, sterile private studio. We will test the stencil size and placement together until you are 100% happy with how it sits on your body before we start.',
    },
    {
      number: '05',
      title: 'The Healing',
      badge: 'Step 5: Aftercare & Beyond',
      description: 'Once finished, your tattoo is cleaned and wrapped in medical-grade protective film. You’ll walk away with a premium aftercare kit and simple, step-by-step instructions to ensure perfect healing.',
    },
  ];

  const faqs: FaqItem[] = [
    {
      question: 'What are your hourly rates for custom tattoos?',
      answer: 'Custom tattooing is billed at $150 per hour, with a minimum session fee of $100. This rate covers active tattoo time, setup, and stencil customization. Flash designs are priced at flat rates as marked on the flash page.',
    },
    {
      question: 'What are your safety and hygiene protocols?',
      answer: 'I adhere to strict clinical-grade sanitization standards. The studio is fully licensed by the health department. Every instrument is single-use, sterilized, and opened directly in front of you. All surfaces are thoroughly disinfected before and after every single client.',
    },
    {
      question: 'Do you tattoo in color?',
      answer: 'No. To maintain the highest level of mastery in my craft, I specialize exclusively in blackwork, fine-line black, and illustrative grey-wash styles. This focus ensures your tattoo ages beautifully and holds its contrast over time.',
    },
    {
      question: 'Can I bring a friend with me to my session?',
      answer: 'To keep our private studio workspace calm, sterile, and focused, you are welcome to bring one guest with you to your appointment.',
    },
    {
      question: 'What is your rescheduling and cancellation policy?',
      answer: 'Deposits are non-refundable. However, you may reschedule your appointment once without losing your deposit, provided you give at least 48 hours\' notice before your scheduled session.',
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 120, damping: 18 },
    },
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section
      id="process-and-faq"
      className="relative bg-[#0C0C0C] text-[#F5F5F5] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-[#161616]"
    >
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="mb-20 text-center md:text-left md:max-w-2xl">
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#9E2A2B] block mb-3 font-semibold">
            step-by-step
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#F5F5F5] font-sans">
            How We Work Together.
          </h2>
          <div className="h-1 w-20 bg-[#9E2A2B] mt-6 hidden md:block" />
        </div>

        {/* 5-Step Process Interactive Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32 items-stretch">
          
          {/* Left Column: Interactive Selector List */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {steps.map((step, index) => {
                const isActive = activeStep === index;
                return (
                  <button
                    key={step.number}
                    onClick={() => setActiveStep(index)}
                    className={`w-full text-left p-5 transition-all duration-300 border-l-4 flex items-center justify-between ${
                      isActive
                        ? 'bg-[#161616] border-[#9E2A2B] text-[#F5F5F5] shadow-[4px_4px_0px_0px_rgba(158,42,43,0.15)]'
                        : 'bg-transparent border-transparent text-[#8E8E8E] hover:text-[#F5F5F5] hover:bg-[#161616]/40'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-mono text-lg font-bold transition-colors ${
                          isActive ? 'text-[#9E2A2B]' : 'text-[#8E8E8E]/60'
                        }`}
                      >
                        {step.number}
                      </span>
                      <span className="font-sans font-bold text-lg tracking-tight">
                        {step.title}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono tracking-wider px-2 py-1 uppercase rounded-sm border ${
                        isActive
                          ? 'border-[#9E2A2B]/40 text-[#9E2A2B] bg-[#9E2A2B]/10'
                          : 'border-transparent text-transparent'
                      }`}
                    >
                      Active
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick trust badge */}
            <div className="hidden lg:flex items-center gap-3 p-4 bg-[#161616]/40 border border-[#161616] rounded-sm">
              <Shield className="text-[#9E2A2B] w-5 h-5 shrink-0" />
              <p className="text-xs text-[#8E8E8E] font-sans leading-relaxed">
                Every step is optimized to guarantee clinical safety, clear aesthetic alignment, and lifetime ink longevity.
              </p>
            </div>
          </div>

          {/* Right Column: Visual Detailed Display Card */}
          <div className="lg:col-span-7">
            <div className="h-full bg-[#161616] border-2 border-[#161616] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(22,22,22,1)]">
              {/* Massive background watermark number */}
              <div className="absolute right-[-10%] bottom-[-10%] text-[18rem] font-black font-sans leading-none text-[#0C0C0C] select-none pointer-events-none font-mono">
                {steps[activeStep].number}
              </div>

              <div className="relative z-10">
                <span className="inline-block bg-[#9E2A2B]/10 border border-[#9E2A2B]/30 text-[#9E2A2B] font-mono text-xs tracking-wider uppercase px-3 py-1.5 mb-8 rounded-sm">
                  {steps[activeStep].badge}
                </span>

                <h3 className="text-3xl md:text-4xl font-black tracking-tight text-[#F5F5F5] mb-6 font-sans">
                  {steps[activeStep].title}
                </h3>

                <p className="text-lg text-[#8E8E8E] leading-relaxed max-w-xl font-sans">
                  {steps[activeStep].description}
                </p>
              </div>

              {/* Progress visual and CTA link */}
              <div className="relative z-10 mt-12 pt-8 border-t border-[#0C0C0C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex gap-1.5">
                  {steps.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === activeStep ? 'w-8 bg-[#9E2A2B]' : 'w-2 bg-[#8E8E8E]/30'
                      }`}
                    />
                  ))}
                </div>

                <a
                  href="#booking-form"
                  className="inline-flex items-center gap-2 group text-sm font-bold uppercase tracking-wider text-[#F5F5F5] hover:text-[#9E2A2B] transition-colors"
                >
                  Skip to Booking
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* FAQs Header */}
        <div className="border-t border-[#161616] pt-24 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#9E2A2B] block mb-3 font-semibold">
                client assurance
              </span>
              <h3 className="text-3xl md:text-4xl font-black tracking-tight text-[#F5F5F5] font-sans">
                Frequently Answered.
              </h3>
            </div>
            <div className="lg:col-span-5">
              <p className="text-[#8E8E8E] font-sans text-sm md:text-base leading-relaxed">
                Everything you need to know about rates, studio operations, and safety standards before stepping into the chair.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs Accordion Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* FAQ Column (Left/Center span) */}
          <div className="lg:col-span-8 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="border border-[#161616] bg-[#161616]/30 overflow-hidden transition-colors hover:border-[#9E2A2B]/30"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 text-left transition-colors focus:outline-none focus:ring-1 focus:ring-[#9E2A2B]"
                    aria-expanded={isOpen}
                  >
                    <span className="font-sans font-bold text-base md:text-lg text-[#F5F5F5] pr-4">
                      {faq.question}
                    </span>
                    <span className="shrink-0 p-1.5 bg-[#161616] text-[#8E8E8E] hover:text-[#F5F5F5] transition-colors rounded">
                      {isOpen ? <Minus className="w-4 h-4 text-[#9E2A2B]" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-1 border-t border-[#161616]/50">
                          <p className="text-sm md:text-base text-[#8E8E8E] leading-relaxed font-sans">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Sticky CTA Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit">
            <div className="p-8 bg-[#161616] border-2 border-[#161616] relative shadow-[4px_4px_0px_0px_rgba(158,42,43,0.3)]">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#9E2A2B]" />
              
              <div className="flex items-center gap-2 text-[#9E2A2B] mb-4">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">Booking Status: Open</span>
              </div>

              <h4 className="text-xl font-bold font-sans text-[#F5F5F5] mb-3">
                Ready to Commit to Skin?
              </h4>
              <p className="text-xs md:text-sm text-[#8E8E8E] font-sans leading-relaxed mb-6">
                Submit your project concept, target size, and references. Together, we’ll sketch an original, custom blackwork masterpiece designed to align beautifully with your body.
              </p>

              <a
                href="#booking-form"
                className="w-full text-center block bg-[#9E2A2B] hover:bg-[#802223] text-[#F5F5F5] font-sans font-bold text-sm uppercase tracking-wider py-4 px-6 transition-all shadow-[2px_2px_0px_0px_#0C0C0C]"
              >
                Request a Session
              </a>

              <p className="text-[10px] text-center text-[#8E8E8E]/60 mt-4 font-mono">
                Average inquiry response time: 3 business days
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}