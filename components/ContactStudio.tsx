'use client';

import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

export function ContactStudio() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject || 'General Inquiry',
            message: formData.message,
          },
        ]);

      if (error) throw error;

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section
      id="contact-studio"
      className="relative bg-[#0C0C0C] text-[#F5F5F5] py-24 lg:py-32 overflow-hidden border-t border-[#161616]"
    >
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#9E2A2B]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8E8E8E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 lg:mb-24 max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#9E2A2B] mb-3">
            get in touch
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#F5F5F5]">
            Studio Logistics.
          </h2>
        </div>

        {/* Content Columns */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          
          {/* Column 1: Studio Hours & Location */}
          <motion.div className="lg:col-span-5 space-y-8" variants={itemVariants}>
            
            {/* Main Logistics Card */}
            <div className="bg-[#161616] border border-[#161616] p-8 relative overflow-hidden group hover:border-[#8E8E8E]/30 transition-all duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#9E2A2B]" />
              
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#8E8E8E] mb-6">
                location & hours
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-[#F5F5F5] mb-1">
                    Tattoos by Jake Llewellyn
                  </h4>
                  <p className="text-xs font-mono text-[#9E2A2B] uppercase">
                    Private Studio
                  </p>
                </div>

                <div className="border-t border-[#0C0C0C] pt-4">
                  <p className="text-sm font-mono text-[#8E8E8E] mb-1">LOCATION</p>
                  <p className="text-base text-[#F5F5F5] font-semibold">
                    East End Creative District, Portland, OR
                  </p>
                  <p className="text-xs text-[#8E8E8E] mt-1 italic">
                    (Exact address and entry instructions provided upon confirmed booking).
                  </p>
                </div>

                <div className="border-t border-[#0C0C0C] pt-4">
                  <p className="text-sm font-mono text-[#8E8E8E] mb-1">HOURS OF OPERATION</p>
                  <p className="text-base text-[#F5F5F5] font-semibold">
                    Tuesday – Saturday
                  </p>
                  <p className="text-base text-[#F5F5F5]">
                    11:00 AM – 7:00 PM
                  </p>
                  <p className="text-xs font-mono text-[#9E2A2B] mt-2 uppercase tracking-wider">
                    *Strictly by appointment only. No walk-ins.*
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Redirect Banner */}
            <div className="bg-[#0C0C0C] border-2 border-dashed border-[#161616] p-6 hover:border-[#9E2A2B]/40 transition-colors duration-300">
              <p className="text-sm text-[#8E8E8E] leading-relaxed">
                Looking to book a new custom tattoo or claim a flash design? Please use our structured{' '}
                <a 
                  href="#booking-form" 
                  className="text-[#9E2A2B] font-mono hover:underline font-bold inline-flex items-center gap-1 transition-colors"
                >
                  Request a Session form
                  <span className="text-xs">→</span>
                </a>{' '}
                instead of the general contact form. This ensures your project details are captured instantly.
              </p>
            </div>

            {/* Decorative Studio Image */}
            <div className="relative h-64 w-full overflow-hidden grayscale contrast-125 border border-[#161616]">
              <img 
                src="https://images.unsplash.com/photo-1605496036006-fa36378ca4ab?auto=format&fit=crop&q=80&w=800" 
                alt="Jake Llewellyn private studio setup showcasing clinical grade sterilization and custom artwork sketches"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <span className="text-[10px] font-mono tracking-widest text-[#8E8E8E] uppercase">
                  Sterile Workspace Environment
                </span>
                <span className="text-[10px] font-mono text-[#9E2A2B]">
                  [ clinical-grade ]
                </span>
              </div>
            </div>

          </motion.div>

          {/* Column 2: General Inquiry Form */}
          <motion.div className="lg:col-span-7" variants={itemVariants}>
            <div className="bg-[#161616] border border-[#161616] p-8 md:p-10 relative">
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#9E2A2B] pointer-events-none" />
              
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#8E8E8E] mb-3">
                general inquiries
              </h3>
              <p className="text-sm text-[#8E8E8E] mb-8 leading-relaxed">
                For tattoo bookings, please use our dedicated{' '}
                <a href="#booking-form" className="text-[#F5F5F5] underline hover:text-[#9E2A2B] transition-colors">
                  Request a Session
                </a>{' '}
                form. For guest spot invites, artistic collaborations, or general questions, use the form below.
              </p>

              {status === 'success' ? (
                <motion.div 
                  className="bg-[#0C0C0C] border-2 border-[#161616] p-8 text-center space-y-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-12 h-12 bg-[#9E2A2B]/10 text-[#9E2A2B] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-[#F5F5F5]">Message Sent Successfully</h4>
                  <p className="text-sm text-[#8E8E8E] max-w-md mx-auto">
                    Thank you for reaching out. Jake or a studio assistant will get back to you regarding your inquiry within 2-3 business days.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-4 px-6 py-2 bg-[#161616] text-[#F5F5F5] text-xs font-mono uppercase tracking-wider border border-[#8E8E8E]/20 hover:border-[#9E2A2B] transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Name field */}
                  <div>
                    <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-[#8E8E8E] mb-2">
                      Name <span className="text-[#9E2A2B]">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className="w-full bg-[#0C0C0C] border border-[#161616] focus:border-[#9E2A2B] outline-none text-[#F5F5F5] p-3.5 font-mono text-sm transition-colors placeholder:text-[#8E8E8E]/30"
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-[#8E8E8E] mb-2">
                      Email Address <span className="text-[#9E2A2B]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="yourname@email.com"
                      className="w-full bg-[#0C0C0C] border border-[#161616] focus:border-[#9E2A2B] outline-none text-[#F5F5F5] p-3.5 font-mono text-sm transition-colors placeholder:text-[#8E8E8E]/30"
                    />
                  </div>

                  {/* Subject field */}
                  <div>
                    <label htmlFor="subject" className="block text-xs font-mono uppercase tracking-wider text-[#8E8E8E] mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="e.g., Guest Spot Inquiry / Art Collaboration"
                      className="w-full bg-[#0C0C0C] border border-[#161616] focus:border-[#9E2A2B] outline-none text-[#F5F5F5] p-3.5 font-mono text-sm transition-colors placeholder:text-[#8E8E8E]/30"
                    />
                  </div>

                  {/* Message field */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-[#8E8E8E] mb-2">
                      Message <span className="text-[#9E2A2B]">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Write your message here..."
                      className="w-full bg-[#0C0C0C] border border-[#161616] focus:border-[#9E2A2B] outline-none text-[#F5F5F5] p-3.5 font-mono text-sm transition-colors placeholder:text-[#8E8E8E]/30 resize-none"
                    />
                  </div>

                  {/* Error display */}
                  {status === 'error' && (
                    <div className="p-4 bg-[#9E2A2B]/10 border border-[#9E2A2B] text-sm text-[#F5F5F5] font-mono">
                      {errorMessage}
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="relative w-full bg-[#9E2A2B] text-[#F5F5F5] font-mono text-xs uppercase tracking-widest font-bold py-4 px-8 hover:bg-[#802223] active:translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status === 'submitting' ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>

                </form>
              )}
            </div>
          </motion.div>

        </motion.div>

        {/* Bottom Metadata Line */}
        <div className="mt-20 pt-8 border-t border-[#161616] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-[#8E8E8E]">
          <p>© 2024 Tattoos by Jake Llewellyn. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#hero" className="hover:text-[#F5F5F5] transition-colors">Back to Top</a>
            <span className="text-[#161616]">|</span>
            <span className="text-[#9E2A2B]">Clinical Grade Standard</span>
          </div>
        </div>

      </div>
    </section>
  );
}