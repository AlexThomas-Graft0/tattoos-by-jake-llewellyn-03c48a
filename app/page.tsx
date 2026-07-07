import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/hero";
import { CorePillars } from "@/components/CorePillars";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { FlashCatalog } from "@/components/FlashCatalog";
import { ProcessAndFaq } from "@/components/ProcessAndFaq";
import { BookingForm } from "@/components/BookingForm";
import { AboutArtist } from "@/components/AboutArtist";
import { ContactStudio } from "@/components/ContactStudio";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"Tattoos by Jake Llewellyn\",\"description\":\"Tattoos by Jake Llewellyn\",\"url\":\"https://tattoos-by-jake-llewellyn-03c48a.duckbyte.co\"}" }} />
      <Navbar />
      <div id="hero" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <Hero />
        </Suspense>
      </div>
      <div id="core-pillars" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <CorePillars />
        </Suspense>
      </div>
      <div id="portfolio-gallery" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <PortfolioGallery />
        </Suspense>
      </div>
      <div id="flash-catalog" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <FlashCatalog />
        </Suspense>
      </div>
      <div id="process-and-faq" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <ProcessAndFaq />
        </Suspense>
      </div>
      <div id="booking-form" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <BookingForm />
        </Suspense>
      </div>
      <div id="about-artist" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <AboutArtist />
        </Suspense>
      </div>
      <div id="contact-studio" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <ContactStudio />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
