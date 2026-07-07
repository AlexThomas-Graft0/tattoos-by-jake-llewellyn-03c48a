'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  tag: string;
}

const navItems: NavItem[] = [
  { label: 'Curated Gallery', href: '#portfolio-gallery', tag: '01' },
  { label: 'Available Flash', href: '#flash-catalog', tag: '02' },
  { label: 'The Process & FAQ', href: '#process-and-faq', tag: '03' },
  { label: 'About Artist', href: '#about-artist', tag: '04' },
  { label: 'Contact Studio', href: '#contact-studio', tag: '05' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

const mobileMenuVariants: Variants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  open: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Track active section for indicator
      const scrollPosition = window.scrollY + 100;
      const sections = navItems.map(item => item.href.substring(1));
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const offset = 80; // Offset for fixed navbar
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-[#0C0C0C]/90 backdrop-blur-md border-[#161616] py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]' 
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand Block */}
          <motion.a 
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            variants={itemVariants}
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#9E2A2B] focus:ring-offset-2 focus:ring-offset-[#0C0C0C] rounded-sm"
          >
            <div className="relative flex items-center justify-center w-10 h-10 border-2 border-[#F5F5F5] bg-[#161616] font-mono text-sm font-bold text-[#F5F5F5] group-hover:border-[#9E2A2B] transition-colors duration-300">
              JL
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#9E2A2B]" />
            </div>
            
            <div className="flex flex-col">
              <span className="font-sans font-black tracking-tight text-[#F5F5F5] text-lg leading-none uppercase group-hover:text-[#9E2A2B] transition-colors duration-300">
                Jake Llewellyn
              </span>
              <span className="font-mono text-[10px] uppercase text-[#8E8E8E] tracking-widest mt-1 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-[#9E2A2B]" />
                Fine-line / Blackwork
              </span>
            </div>
          </motion.a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  variants={itemVariants}
                  className="relative py-2 group focus:outline-none focus:ring-2 focus:ring-[#9E2A2B] rounded-sm"
                >
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-[9px] text-[#8E8E8E] group-hover:text-[#9E2A2B] transition-colors duration-300">
                      {item.tag}
                    </span>
                    <span className={`font-sans text-sm font-semibold tracking-wide transition-colors duration-300 ${
                      isActive ? 'text-[#9E2A2B]' : 'text-[#8E8E8E] group-hover:text-[#F5F5F5]'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  {/* Underline Indicator */}
                  <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#9E2A2B] origin-left transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </motion.a>
              );
            })}
          </nav>

          {/* Clinical-Grade Trust Badge & CTA */}
          <div className="hidden md:flex items-center gap-6">
            <motion.div 
              variants={itemVariants} 
              className="hidden xl:flex items-center gap-2 border border-[#161616] bg-[#161616]/50 px-3 py-1.5 rounded-sm font-mono text-[10px] text-[#8E8E8E]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#9E2A2B]" />
              <span>CLINICAL-GRADE SANITIZATION</span>
            </motion.div>

            <motion.a
              href="#booking-form"
              onClick={(e) => handleNavClick(e, '#booking-form')}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative inline-flex items-center gap-2 bg-[#9E2A2B] text-[#F5F5F5] font-sans font-extrabold text-xs tracking-wider uppercase px-5 py-3 border border-[#9E2A2B] hover:bg-[#0C0C0C] hover:text-[#9E2A2B] transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-[#9E2A2B] focus:ring-offset-2 focus:ring-offset-[#0C0C0C]"
            >
              <span>Request a Session</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>
          </div>

          {/* Mobile Menu Toggle button */}
          <div className="flex lg:hidden">
            <motion.button
              variants={itemVariants}
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 text-[#8E8E8E] hover:text-[#F5F5F5] hover:bg-[#161616] focus:outline-none focus:ring-2 focus:ring-[#9E2A2B] border border-transparent hover:border-[#161616] transition-all duration-200"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </motion.button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="lg:hidden overflow-hidden bg-[#0C0C0C] border-b border-[#161616]"
          >
            <div className="px-4 pt-4 pb-6 space-y-3 bg-[#0C0C0C] relative">
              {/* Decorative side line */}
              <div className="absolute left-4 top-4 bottom-6 w-[1px] bg-[#161616]" />
              
              <div className="pl-6 space-y-4">
                {navItems.map((item) => {
                  const isActive = activeSection === item.href;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="flex items-center gap-3 py-2 group"
                    >
                      <span className="font-mono text-xs text-[#9E2A2B] font-bold">
                        {item.tag}
                      </span>
                      <span className={`font-sans text-base font-bold tracking-wide transition-colors ${
                        isActive ? 'text-[#9E2A2B]' : 'text-[#8E8E8E] group-hover:text-[#F5F5F5]'
                      }`}>
                        {item.label}
                      </span>
                    </a>
                  );
                })}

                <div className="pt-4 border-t border-[#161616] flex flex-col gap-4">
                  <div className="flex items-center gap-2 font-mono text-[10px] text-[#8E8E8E]">
                    <ShieldCheck className="w-4 h-4 text-[#9E2A2B]" />
                    <span>CLINICAL-GRADE SANITIZATION STANDARDS</span>
                  </div>
                  
                  <a
                    href="#booking-form"
                    onClick={(e) => handleNavClick(e, '#booking-form')}
                    className="w-full text-center inline-flex items-center justify-center gap-2 bg-[#9E2A2B] text-[#F5F5F5] font-sans font-extrabold text-xs tracking-wider uppercase py-3.5 border border-[#9E2A2B] hover:bg-transparent hover:text-[#9E2A2B] transition-colors"
                  >
                    <span>Request a Session</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}