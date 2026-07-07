'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  Check, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  Trash2, 
  Loader2,
  FileText,
  Info
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface FlashDesign {
  id: string;
  title: string;
  price_estimate: number;
  recommended_size: string;
  status: 'available' | 'reserved' | 'sold';
  image_url: string;
}

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  })
};

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

export function BookingForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [flashDesigns, setFlashDesigns] = useState<FlashDesign[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    inquiry_type: 'custom' as 'custom' | 'flash',
    flash_design_id: '',
    placement: '',
    approximate_size: '',
    description: '',
    reference_image_urls: [] as string[],
    budget_range: '',
    preferred_days: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch available flash designs
  useEffect(() => {
    async function fetchFlash() {
      try {
        const { data, error } = await supabase
          .from('flash_designs')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (data && !error) {
          setFlashDesigns(data);
        }
      } catch (err) {
        console.error('Error fetching flash designs:', err);
      }
    }
    fetchFlash();
  }, []);

  // Validation helper
  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.client_name.trim()) newErrors.client_name = 'Full Name is required';
      if (!formData.client_email.trim()) {
        newErrors.client_email = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.client_email)) {
        newErrors.client_email = 'Please provide a valid email';
      }
      if (!formData.client_phone.trim()) newErrors.client_phone = 'Phone number is required';
    }

    if (currentStep === 2) {
      if (formData.inquiry_type === 'flash' && !formData.flash_design_id) {
        newErrors.flash_design_id = 'Please select a flash design';
      }
    }

    if (currentStep === 3) {
      if (!formData.placement.trim()) newErrors.placement = 'Tattoo placement on body is required';
      if (!formData.approximate_size.trim()) newErrors.approximate_size = 'Approximate size is required';
      if (!formData.description.trim()) newErrors.description = 'Project description is required';
    }

    if (currentStep === 5) {
      if (!formData.budget_range) newErrors.budget_range = 'Please select a budget range';
      if (formData.preferred_days.length === 0) {
        newErrors.preferred_days = 'Please select at least one preferred day';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setDirection(1);
      setStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev) => {
      const days = prev.preferred_days.includes(day)
        ? prev.preferred_days.filter((d) => d !== day)
        : [...prev.preferred_days, day];
      return { ...prev, preferred_days: days };
    });
  };

  // Simulate premium visual reference upload
  const handleSimulatedUpload = () => {
    setUploadingFile(true);
    setTimeout(() => {
      const mockReferences = [
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&q=80&w=600'
      ];
      
      const nextIndex = formData.reference_image_urls.length;
      if (nextIndex < 3) {
        setFormData((prev) => ({
          ...prev,
          reference_image_urls: [...prev.reference_image_urls, mockReferences[nextIndex]]
        }));
      }
      setUploadingFile(false);
    }, 1200);
  };

  const removeReference = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      reference_image_urls: prev.reference_image_urls.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('booking_inquiries')
        .insert([{
          client_name: formData.client_name,
          client_email: formData.client_email,
          client_phone: formData.client_phone,
          inquiry_type: formData.inquiry_type,
          flash_design_id: formData.inquiry_type === 'flash' ? formData.flash_design_id : null,
          placement: formData.placement,
          approximate_size: formData.approximate_size,
          description: formData.description,
          reference_image_urls: formData.reference_image_urls,
          budget_range: formData.budget_range,
          preferred_days: formData.preferred_days,
          status: 'pending_review'
        }]);

      if (error) throw error;
      
      setIsSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      alert('An error occurred while submitting your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedFlashDetails = flashDesigns.find(f => f.id === formData.flash_design_id);

  return (
    <section id="booking-form" className="relative bg-[#0C0C0C] text-[#F5F5F5] py-24 px-4 sm:px-6 lg:px-8 border-t border-[#161616] overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#9E2A2B]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-900/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#9E2A2B] bg-[#9E2A2B]/10 px-3 py-1 border border-[#9E2A2B]/20 rounded-sm inline-block mb-4">
            booking request
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#F5F5F5] mb-6">
            Request a Session.
          </h2>
          <p className="text-[#8E8E8E] text-base md:text-lg leading-relaxed">
            Please fill out this form with as much detail as possible. This structured information allows me to understand your vision, estimate costs accurately, and prepare for our session.
          </p>
        </div>

        {isSubmitted ? (
          /* Success Screen */
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeVariants}
            className="max-w-3xl mx-auto bg-[#161616] border-2 border-[#9E2A2B] p-8 md:p-12 rounded-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#9E2A2B]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#9E2A2B]/20 border border-[#9E2A2B] text-[#9E2A2B] mb-8">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-[#F5F5F5] mb-4">
              Inquiry Submitted Successfully!
            </h3>
            
            <p className="text-[#8E8E8E] mb-8 leading-relaxed">
              Thank you for trusting me with your skin, <span className="text-[#F5F5F5] font-semibold">{formData.client_name}</span>. I personally review every single inquiry to ensure it aligns with my style and technical standards.
            </p>

            <div className="border-t border-[#262626] pt-6 space-y-6">
              <h4 className="text-sm font-mono text-[#9E2A2B] uppercase tracking-wider">Here is what happens next:</h4>
              <ol className="space-y-4 text-sm md:text-base text-[#8E8E8E]">
                <li className="flex gap-4">
                  <span className="font-mono text-[#F5F5F5] bg-[#262626] px-2 py-0.5 rounded text-xs h-fit">1</span>
                  <div>
                    <strong className="text-[#F5F5F5] block">Review Process</strong>
                    I will look over your concept, sizing details, and reference images.
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="font-mono text-[#F5F5F5] bg-[#262626] px-2 py-0.5 rounded text-xs h-fit">2</span>
                  <div>
                    <strong className="text-[#F5F5F5] block">Detailed Response</strong>
                    Within 3 business days, you will receive an email containing design feedback, a price estimate, and a calendar link to book your slot.
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="font-mono text-[#F5F5F5] bg-[#262626] px-2 py-0.5 rounded text-xs h-fit">3</span>
                  <div>
                    <strong className="text-[#F5F5F5] block">Check Spam Folders</strong>
                    If you don't hear from me by then, please check your spam folder for an email from <span className="text-[#F5F5F5] underline">jake@llewellyntattoo.com</span>.
                  </div>
                </li>
              </ol>
            </div>

            <div className="mt-10 pt-6 border-t border-[#262626] flex justify-between items-center flex-wrap gap-4">
              <p className="font-mono text-xs text-[#8E8E8E]">Talk soon!</p>
              <button 
                onClick={() => {
                  setFormData({
                    client_name: '',
                    client_email: '',
                    client_phone: '',
                    inquiry_type: 'custom',
                    flash_design_id: '',
                    placement: '',
                    approximate_size: '',
                    description: '',
                    reference_image_urls: [],
                    budget_range: '',
                    preferred_days: []
                  });
                  setStep(1);
                  setIsSubmitted(false);
                }}
                className="bg-[#262626] hover:bg-[#323232] text-[#F5F5F5] px-6 py-2.5 font-mono text-xs uppercase tracking-wider border border-white/10 transition-colors"
              >
                Submit New Inquiry
              </button>
            </div>
          </motion.div>
        ) : (
          /* Multistep Form Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Side: Form Container */}
            <div className="lg:col-span-7 bg-[#161616] border border-white/5 rounded-lg p-6 md:p-10 shadow-2xl">
              
              {/* Step Navigation Progress */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#9E2A2B]">
                    [ Step {step} of 5 ]
                  </span>
                  <span className="font-mono text-xs text-[#8E8E8E]">
                    {step === 1 && 'Contact Info'}
                    {step === 2 && 'Project Type'}
                    {step === 3 && 'Design Details'}
                    {step === 4 && 'Visual Reference'}
                    {step === 5 && 'Logistics'}
                  </span>
                </div>
                <div className="w-full h-[3px] bg-[#262626] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: '20%' }}
                    animate={{ width: `${step * 20}%` }}
                    transition={{ ease: 'easeOut', duration: 0.3 }}
                    className="h-full bg-[#9E2A2B]"
                  />
                </div>
              </div>

              {/* Form Element */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="overflow-hidden relative min-h-[360px] flex flex-col justify-between">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-6 py-2"
                    >
                      {/* STEP 1: CONTACT INFORMATION */}
                      {step === 1 && (
                        <div className="space-y-5">
                          <h3 className="text-xl font-bold text-[#F5F5F5] border-b border-[#262626] pb-3">
                            Contact Information
                          </h3>
                          
                          <div>
                            <label className="block text-xs uppercase tracking-wider font-mono text-[#8E8E8E] mb-2">
                              Full Name <span className="text-[#9E2A2B]">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.client_name}
                              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                              placeholder="e.g., Rowan Vance"
                              className={`w-full bg-[#0C0C0C] border ${errors.client_name ? 'border-[#9E2A2B]' : 'border-[#262626]'} text-[#F5F5F5] px-4 py-3 rounded-sm focus:border-[#9E2A2B] focus:ring-1 focus:ring-[#9E2A2B] outline-none transition-colors font-sans`}
                            />
                            {errors.client_name && <p className="text-xs text-[#9E2A2B] mt-1 font-mono">{errors.client_name}</p>}
                          </div>

                          <div>
                            <label className="block text-xs uppercase tracking-wider font-mono text-[#8E8E8E] mb-2">
                              Email Address <span className="text-[#9E2A2B]">*</span>
                            </label>
                            <input
                              type="email"
                              value={formData.client_email}
                              onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                              placeholder="e.g., rowan@example.com"
                              className={`w-full bg-[#0C0C0C] border ${errors.client_email ? 'border-[#9E2A2B]' : 'border-[#262626]'} text-[#F5F5F5] px-4 py-3 rounded-sm focus:border-[#9E2A2B] focus:ring-1 focus:ring-[#9E2A2B] outline-none transition-colors font-sans`}
                            />
                            {errors.client_email && <p className="text-xs text-[#9E2A2B] mt-1 font-mono">{errors.client_email}</p>}
                          </div>

                          <div>
                            <label className="block text-xs uppercase tracking-wider font-mono text-[#8E8E8E] mb-2">
                              Phone Number <span className="text-[#9E2A2B]">*</span>
                            </label>
                            <input
                              type="tel"
                              value={formData.client_phone}
                              onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                              placeholder="e.g., (555) 019-2834"
                              className={`w-full bg-[#0C0C0C] border ${errors.client_phone ? 'border-[#9E2A2B]' : 'border-[#262626]'} text-[#F5F5F5] px-4 py-3 rounded-sm focus:border-[#9E2A2B] focus:ring-1 focus:ring-[#9E2A2B] outline-none transition-colors font-sans`}
                            />
                            {errors.client_phone && <p className="text-xs text-[#9E2A2B] mt-1 font-mono">{errors.client_phone}</p>}
                          </div>
                        </div>
                      )}

                      {/* STEP 2: PROJECT TYPE */}
                      {step === 2 && (
                        <div className="space-y-6">
                          <h3 className="text-xl font-bold text-[#F5F5F5] border-b border-[#262626] pb-3">
                            Project Type
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, inquiry_type: 'custom', flash_design_id: '' })}
                              className={`p-5 text-left border rounded-sm transition-all flex flex-col justify-between h-36 ${
                                formData.inquiry_type === 'custom'
                                  ? 'border-[#9E2A2B] bg-[#9E2A2B]/5'
                                  : 'border-[#262626] bg-[#0C0C0C] hover:border-[#8E8E8E]'
                              }`}
                            >
                              <div className="flex justify-between items-center w-full">
                                <span className="font-mono text-xs uppercase tracking-wider text-[#8E8E8E]">Custom Work</span>
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.inquiry_type === 'custom' ? 'border-[#9E2A2B]' : 'border-[#262626]'}`}>
                                  {formData.inquiry_type === 'custom' && <div className="w-2 h-2 rounded-full bg-[#9E2A2B]" />}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-bold text-[#F5F5F5] text-lg">Custom Design</h4>
                                <p className="text-xs text-[#8E8E8E] mt-1">Bring your own concept & references for a unique, tailored piece.</p>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, inquiry_type: 'flash' })}
                              className={`p-5 text-left border rounded-sm transition-all flex flex-col justify-between h-36 ${
                                formData.inquiry_type === 'flash'
                                  ? 'border-[#9E2A2B] bg-[#9E2A2B]/5'
                                  : 'border-[#262626] bg-[#0C0C0C] hover:border-[#8E8E8E]'
                              }`}
                            >
                              <div className="flex justify-between items-center w-full">
                                <span className="font-mono text-xs uppercase tracking-wider text-[#8E8E8E]">Pre-drawn</span>
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.inquiry_type === 'flash' ? 'border-[#9E2A2B]' : 'border-[#262626]'}`}>
                                  {formData.inquiry_type === 'flash' && <div className="w-2 h-2 rounded-full bg-[#9E2A2B]" />}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-bold text-[#F5F5F5] text-lg">Pre-drawn Flash</h4>
                                <p className="text-xs text-[#8E8E8E] mt-1">Claim an existing, retired-once-inked design from the catalog.</p>
                              </div>
                            </button>
                          </div>

                          {/* Conditional Dropdown for Flash Design */}
                          {formData.inquiry_type === 'flash' && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="pt-4"
                            >
                              <label className="block text-xs uppercase tracking-wider font-mono text-[#8E8E8E] mb-2">
                                Select Pre-drawn Flash Design <span className="text-[#9E2A2B]">*</span>
                              </label>
                              <select
                                value={formData.flash_design_id}
                                onChange={(e) => setFormData({ ...formData, flash_design_id: e.target.value })}
                                className={`w-full bg-[#0C0C0C] border ${errors.flash_design_id ? 'border-[#9E2A2B]' : 'border-[#262626]'} text-[#F5F5F5] px-4 py-3 rounded-sm focus:border-[#9E2A2B] focus:ring-1 focus:ring-[#9E2A2B] outline-none transition-colors font-sans`}
                              >
                                <option value="">[ Select Flash Design ]</option>
                                {flashDesigns.map((flash) => (
                                  <option key={flash.id} value={flash.id}>
                                    {flash.title} ({flash.recommended_size || 'N/A'}) — ${flash.price_estimate || 'Custom Price'}
                                  </option>
                                ))}
                                {flashDesigns.length === 0 && (
                                  <>
                                    <option value="FL-101">#FL-101 (Stargazer Moth) — $350</option>
                                    <option value="FL-102">#FL-102 (Willow & Eye) — $300</option>
                                  </>
                                )}
                              </select>
                              {errors.flash_design_id && <p className="text-xs text-[#9E2A2B] mt-1 font-mono">{errors.flash_design_id}</p>}
                            </motion.div>
                          )}
                        </div>
                      )}

                      {/* STEP 3: DESIGN DETAILS */}
                      {step === 3 && (
                        <div className="space-y-5">
                          <h3 className="text-xl font-bold text-[#F5F5F5] border-b border-[#262626] pb-3">
                            Design Details
                          </h3>

                          <div>
                            <label className="block text-xs uppercase tracking-wider font-mono text-[#8E8E8E] mb-1">
                              Where on your body will this tattoo go? <span className="text-[#9E2A2B]">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.placement}
                              onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                              placeholder="e.g., Right inner forearm, left calf..."
                              className={`w-full bg-[#0C0C0C] border ${errors.placement ? 'border-[#9E2A2B]' : 'border-[#262626]'} text-[#F5F5F5] px-4 py-3 rounded-sm focus:border-[#9E2A2B] focus:ring-1 focus:ring-[#9E2A2B] outline-none transition-colors`}
                            />
                            {errors.placement && <p className="text-xs text-[#9E2A2B] mt-1 font-mono">{errors.placement}</p>}
                          </div>

                          <div>
                            <label className="block text-xs uppercase tracking-wider font-mono text-[#8E8E8E] mb-1">
                              What is the desired width and height of the piece? <span className="text-[#9E2A2B]">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.approximate_size}
                              onChange={(e) => setFormData({ ...formData, approximate_size: e.target.value })}
                              placeholder="e.g., 4 inches high by 3 inches wide"
                              className={`w-full bg-[#0C0C0C] border ${errors.approximate_size ? 'border-[#9E2A2B]' : 'border-[#262626]'} text-[#F5F5F5] px-4 py-3 rounded-sm focus:border-[#9E2A2B] focus:ring-1 focus:ring-[#9E2A2B] outline-none transition-colors`}
                            />
                            {errors.approximate_size && <p className="text-xs text-[#9E2A2B] mt-1 font-mono">{errors.approximate_size}</p>}
                          </div>

                          <div>
                            <label className="block text-xs uppercase tracking-wider font-mono text-[#8E8E8E] mb-1">
                              Describe your concept, elements to include, and the overall vibe. <span className="text-[#9E2A2B]">*</span>
                            </label>
                            <textarea
                              rows={4}
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              placeholder="Describe your idea here. For flash, note any minor modifications you'd like to discuss..."
                              className={`w-full bg-[#0C0C0C] border ${errors.description ? 'border-[#9E2A2B]' : 'border-[#262626]'} text-[#F5F5F5] px-4 py-3 rounded-sm focus:border-[#9E2A2B] focus:ring-1 focus:ring-[#9E2A2B] outline-none transition-colors resize-none`}
                            />
                            {errors.description && <p className="text-xs text-[#9E2A2B] mt-1 font-mono">{errors.description}</p>}
                          </div>
                        </div>
                      )}

                      {/* STEP 4: VISUAL REFERENCE UPLOAD */}
                      {step === 4 && (
                        <div className="space-y-5">
                          <h3 className="text-xl font-bold text-[#F5F5F5] border-b border-[#262626] pb-3">
                            Visual Reference
                          </h3>
                          <p className="text-[#8E8E8E] text-xs leading-relaxed">
                            Upload up to 3 reference images. These can be photos of my past work, sketches, or anatomy photos showing where you want the tattoo placed.
                          </p>

                          <div 
                            onClick={formData.reference_image_urls.length < 3 ? handleSimulatedUpload : undefined}
                            className={`border-2 border-dashed rounded-sm p-8 text-center transition-all ${
                              formData.reference_image_urls.length < 3 
                                ? 'border-[#262626] hover:border-[#9E2A2B] cursor-pointer bg-[#0C0C0C]' 
                                : 'border-[#262626] opacity-50 cursor-not-allowed bg-black/20'
                            }`}
                          >
                            {uploadingFile ? (
                              <div className="flex flex-col items-center justify-center space-y-3">
                                <Loader2 className="w-8 h-8 text-[#9E2A2B] animate-spin" />
                                <span className="text-xs font-mono text-[#8E8E8E]">Simulating clinical-grade secure upload...</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center space-y-3">
                                <Upload className="w-8 h-8 text-[#8E8E8E] group-hover:text-[#9E2A2B] transition-colors" />
                                <span className="font-mono text-xs uppercase text-[#F5F5F5] tracking-wider">
                                  {formData.reference_image_urls.length >= 3 ? 'Max references added' : '[ Choose Reference Files ]'}
                                </span>
                                <span className="text-[10px] text-[#8E8E8E]">Max 3, up to 10MB each. Jpeg, png formats.</span>
                              </div>
                            )}
                          </div>

                          {/* Uploaded Previews */}
                          {formData.reference_image_urls.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-mono text-[10px] uppercase tracking-wider text-[#8E8E8E]">References Attached:</h4>
                              <div className="grid grid-cols-3 gap-3">
                                {formData.reference_image_urls.map((url, idx) => (
                                  <div key={idx} className="relative group aspect-square bg-[#0C0C0C] border border-white/10 rounded overflow-hidden">
                                    <img src={url} alt={`Reference ${idx + 1}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                                    <button
                                      type="button"
                                      onClick={() => removeReference(idx)}
                                      className="absolute top-1 right-1 bg-black/80 hover:bg-[#9E2A2B] text-white p-1 rounded transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="absolute bottom-1 left-1 bg-black/80 text-[9px] font-mono px-1 py-0.5 rounded text-white">
                                      #{idx + 1}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* STEP 5: BUDGET & AVAILABILITY */}
                      {step === 5 && (
                        <div className="space-y-6">
                          <h3 className="text-xl font-bold text-[#F5F5F5] border-b border-[#262626] pb-3">
                            Logistics
                          </h3>

                          <div>
                            <label className="block text-xs uppercase tracking-wider font-mono text-[#8E8E8E] mb-2">
                              Estimated Budget Range <span className="text-[#9E2A2B]">*</span>
                            </label>
                            <select
                              value={formData.budget_range}
                              onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                              className={`w-full bg-[#0C0C0C] border ${errors.budget_range ? 'border-[#9E2A2B]' : 'border-[#262626]'} text-[#F5F5F5] px-4 py-3 rounded-sm focus:border-[#9E2A2B] focus:ring-1 focus:ring-[#9E2A2B] outline-none transition-colors font-sans`}
                            >
                              <option value="">[ Select Budget Range ]</option>
                              <option value="Under $250">Under $250</option>
                              <option value="$250 - $500">$250 - $500</option>
                              <option value="$500 - $1,000">$500 - $1,000</option>
                              <option value="$1,000+">$1,000+</option>
                            </select>
                            {errors.budget_range && <p className="text-xs text-[#9E2A2B] mt-1 font-mono">{errors.budget_range}</p>}
                          </div>

                          <div>
                            <label className="block text-xs uppercase tracking-wider font-mono text-[#8E8E8E] mb-2">
                              Preferred Session Days <span className="text-[#9E2A2B]">*</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => {
                                const isSelected = formData.preferred_days.includes(day);
                                return (
                                  <button
                                    key={day}
                                    type="button"
                                    onClick={() => handleDayToggle(day)}
                                    className={`p-3 font-mono text-xs uppercase text-center border transition-all ${
                                      isSelected
                                        ? 'bg-[#9E2A2B]/10 border-[#9E2A2B] text-[#F5F5F5]'
                                        : 'bg-[#0C0C0C] border-[#262626] text-[#8E8E8E] hover:border-[#8E8E8E]'
                                    }`}
                                  >
                                    {day}
                                  </button>
                                );
                              })}
                            </div>
                            {errors.preferred_days && <p className="text-xs text-[#9E2A2B] mt-1 font-mono">{errors.preferred_days}</p>}
                          </div>

                          {/* Info Banner */}
                          <div className="bg-[#1e1414] border border-[#9E2A2B]/30 p-4 rounded flex items-start gap-3">
                            <Info className="w-5 h-5 text-[#9E2A2B] shrink-0 mt-0.5" />
                            <p className="text-xs text-[#8E8E8E] leading-relaxed">
                              <strong className="text-[#F5F5F5]">Booking Policy:</strong> To finalize your booking, a $100 non-refundable deposit is required. This deposit holds your date and goes directly toward the final price of your tattoo.
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Form Actions Footer */}
                  <div className="flex justify-between items-center pt-8 border-t border-[#262626] mt-8">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#8E8E8E] hover:text-[#F5F5F5] transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </button>
                    ) : (
                      <div />
                    )}

                    {step < 5 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="bg-[#F5F5F5] hover:bg-[#E5E5E5] text-[#0C0C0C] font-mono text-xs uppercase tracking-wider px-6 py-3 rounded-sm flex items-center gap-2 transition-colors ml-auto"
                      >
                        Next Step
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#9E2A2B] hover:bg-[#b03536] text-[#F5F5F5] font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-sm flex items-center gap-2 transition-colors ml-auto shadow-lg disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Booking Request
                            <Sparkles className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Right Side: Sterile Ticket Preview Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#161616] border border-dashed border-[#262626] rounded-lg p-6 font-mono text-xs uppercase tracking-wider text-[#8E8E8E] relative overflow-hidden">
                {/* Decorative cut-outs for modern receipt feel */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-repeat-x bg-[linear-gradient(to_right,#0C0C0C_0%,#0C0C0C_50%,transparent_50%,transparent_100%)] bg-[length:12px_4px]" />
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-[#F5F5F5] font-bold text-sm">SESSION REQUEST</h4>
                    <p className="text-[10px] text-[#8E8E8E] mt-0.5">STATUS: DRAFT TICKET</p>
                  </div>
                  <FileText className="w-5 h-5 text-[#9E2A2B]" />
                </div>

                <div className="space-y-4 border-t border-b border-[#262626] py-6">
                  <div className="flex justify-between gap-4">
                    <span>Client Name:</span>
                    <span className="text-[#F5F5F5] text-right truncate max-w-[180px]">
                      {formData.client_name || '---'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Contact Email:</span>
                    <span className="text-[#F5F5F5] text-right truncate max-w-[180px] normal-case">
                      {formData.client_email || '---'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Inquiry Type:</span>
                    <span className="text-[#9E2A2B] font-bold">
                      {formData.inquiry_type}
                    </span>
                  </div>

                  {formData.inquiry_type === 'flash' && (
                    <div className="flex justify-between gap-4">
                      <span>Selected Flash:</span>
                      <span className="text-[#F5F5F5] text-right max-w-[180px] truncate">
                        {selectedFlashDetails?.title || 'No flash selected'}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between gap-4">
                    <span>Placement:</span>
                    <span className="text-[#F5F5F5] text-right truncate max-w-[180px]">
                      {formData.placement || '---'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Target Size:</span>
                    <span className="text-[#F5F5F5] text-right">
                      {formData.approximate_size || '---'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Budget range:</span>
                    <span className="text-[#F5F5F5] text-right">
                      {formData.budget_range || '---'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Pref. Days:</span>
                    <span className="text-[#F5F5F5] text-right max-w-[180px] truncate">
                      {formData.preferred_days.join(', ') || '---'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>References:</span>
                    <span className="text-[#F5F5F5] text-right">
                      {formData.reference_image_urls.length} / 3 Uploaded
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center text-[10px]">
                  <span>STUDIO MINIMUM: $100</span>
                  <span>HOURLY RATE: $150/HR</span>
                </div>
              </div>

              {/* Live Flash preview card if they chose flash */}
              {formData.inquiry_type === 'flash' && selectedFlashDetails && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#161616] border border-white/5 rounded-lg p-4 flex gap-4 items-center"
                >
                  <img 
                    src={selectedFlashDetails.image_url} 
                    alt={selectedFlashDetails.title} 
                    className="w-20 h-20 object-cover rounded bg-[#0C0C0C] border border-white/10 grayscale"
                  />
                  <div>
                    <span className="text-[10px] font-mono text-[#9E2A2B] border border-[#9E2A2B]/30 px-1.5 py-0.5 rounded bg-[#9E2A2B]/5">
                      Selected Flash
                    </span>
                    <h5 className="font-bold text-sm text-[#F5F5F5] mt-1.5">{selectedFlashDetails.title}</h5>
                    <p className="text-xs text-[#8E8E8E] mt-0.5">Est. {selectedFlashDetails.recommended_size}</p>
                    <p className="text-xs font-mono text-[#F5F5F5] mt-1">${selectedFlashDetails.price_estimate} Flat Rate</p>
                  </div>
                </motion.div>
              )}
            </div>

          </div>
        )}
      </div>
    </section>
  );
}