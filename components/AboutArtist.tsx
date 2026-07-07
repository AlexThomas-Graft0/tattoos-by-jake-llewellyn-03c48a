'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Shield, Sparkles, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

export function AboutArtist() {
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
    hidden: { opacity: 0, y: 30 },
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
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 18,
      },
    },
  };

  const credentials = [
    {
      icon: <Sparkles className="w-5 h-5 text-[#9E2A2B]" />,
      title: "7+ Years Professional Experience",
      description: "Dedicated to fine-line precision, high-contrast blackwork, and custom illustrative tattoos that stand the test of time."
    },
    {
      icon: <Compass className="w-5 h-5 text-[#9E2A2B]" />,
      title: "Printmaking Roots",
      description: "Trained in traditional woodcut and etching techniques, directly influencing how custom art translates onto living skin."
    },
    {
      icon: <Shield className="w-5 h-5 text-[#9E2A2B]" />,
      title: "Clinical Safety Standards",
      description: "Fully licensed, sterile private studio environment. Every tray, needle, and barrier is single-use and opened in front of you."
    }
  ];

  return (
    <section 
      id="about-artist" 
      className="relative bg-[#0C0C0C] text-[#F5F5F5] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-[#161616]"
    >
      {/* Background Subtle Accent Gradients */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#9E2A2B] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#8E8E8E] opacity-[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#9E2A2B] block mb-3">
            the artist
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase font-sans">
            Behind <span className="text-[#8E8E8E]">the</span> Needle.
          </h2>
          <div className="h-1 w-20 bg-[#9E2A2B] mt-6" />
        </div>

        {/* Content Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
        >
          
          {/* Left Column: Premium Imagery (Neo-Brutalist Layout) */}
          <motion.div 
            variants={imageVariants} 
            className="lg:col-span-5 relative group"
          >
            {/* Solid Neo-Brutalist Offset border background */}
            <div className="absolute inset-0 border-2 border-[#9E2A2B] translate-x-3 translate-y-3 transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
            
            {/* Primary Portrait Container */}
            <div className="relative bg-[#161616] border-2 border-[#161616] overflow-hidden aspect-[4/5]">
              <img 
                src="https://images.unsplash.com/photo-1598136490941-30d885318abd?auto=format&fit=crop&q=80&w=1200" 
                alt="Jake Llewellyn meticulously sketching custom tattoo design in a clean studio"
                className="w-full h-full object-cover filter grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C]/80 via-transparent to-transparent" />
              
              {/* Overlay Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#0C0C0C]/95 border border-[#161616] p-4 backdrop-blur-md">
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#8E8E8E] mb-1">Current Residency</p>
                <p className="text-sm font-bold tracking-wide">East End Creative District, Portland, OR</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio & Core Philosophy */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-10">
            
            {/* Bio Paragraphs */}
            <motion.div variants={itemVariants} className="space-y-6 text-[#8E8E8E] leading-relaxed text-base md:text-lg">
              <p className="text-[#F5F5F5] font-medium text-lg md:text-xl leading-relaxed">
                I believe that a tattoo is more than just ink under the skin — it is a personal landmark, a way to reclaim your body, and a physical record of your story.
              </p>
              <p>
                With over seven years of professional tattooing experience, I have dedicated my practice to mastering the nuances of fine-line precision, bold blackwork contrast, and expressive illustrative designs. My journey started in traditional printmaking, which deeply influences how I translate art onto a moving, living canvas.
              </p>
              <p>
                Tattooing historically carried an intimidating, exclusive reputation. I built my practice to change that. My studio is a safe, inclusive, and respectful space for all bodies, skin tones, and walks of life. I work collaboratively with every client, ensuring that you feel completely safe, informed, and comfortable in the chair.
              </p>
              <p>
                When I am not in the studio, you can find me drawing in the woods, studying historical woodcut prints, or spending time with my dog, Scout.
              </p>
            </motion.div>

            {/* Premium Quote Block */}
            <motion.div 
              variants={itemVariants}
              className="relative bg-[#161616] border-l-4 border-[#9E2A2B] p-6 md:p-8 shadow-xl"
            >
              <span className="absolute top-2 right-4 text-6xl text-[#161616] font-serif select-none pointer-events-none">”</span>
              <blockquote className="text-lg md:text-xl italic font-medium text-[#F5F5F5] relative z-10">
                &ldquo;A great tattoo is fifty percent technical application, and fifty percent how safe and comfortable you felt while you were getting it.&rdquo;
              </blockquote>
              <cite className="block mt-4 not-italic font-mono text-xs uppercase tracking-widest text-[#9E2A2B]">
                – Jake Llewellyn
              </cite>
            </motion.div>

            {/* Action CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#booking-form" 
                className="inline-flex items-center justify-between gap-3 bg-[#9E2A2B] text-[#F5F5F5] px-6 py-4 font-mono uppercase text-xs tracking-wider font-bold hover:bg-[#b03536] transition-colors group border border-[#9E2A2B]"
              >
                Request a Session
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a 
                href="#portfolio-gallery" 
                className="inline-flex items-center justify-center bg-transparent text-[#F5F5F5] px-6 py-4 font-mono uppercase text-xs tracking-wider font-bold border border-[#F5F5F5] hover:bg-[#F5F5F5] hover:text-[#0C0C0C] transition-colors"
              >
                Browse My Gallery
              </a>
            </motion.div>

          </div>
        </motion.div>

        {/* Credentials / Details Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 pt-16 border-t border-[#161616]"
        >
          {credentials.map((cred, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="bg-[#161616] p-6 md:p-8 border border-[#161616] hover:border-[#9E2A2B]/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 bg-[#0C0C0C] flex items-center justify-center border border-[#161616] mb-6 group-hover:border-[#9E2A2B] transition-colors">
                  {cred.icon}
                </div>
                <h3 className="text-lg font-bold text-[#F5F5F5] mb-3 group-hover:text-[#9E2A2B] transition-colors">
                  {cred.title}
                </h3>
                <p className="text-sm text-[#8E8E8E] leading-relaxed">
                  {cred.description}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 font-mono text-[10px] text-[#9E2A2B] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Standard</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}