import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustedBrands from "@/components/landing/TrustedBrands";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import InteriorStyles from "@/components/landing/InteriorStyles";
import BeforeAfter from "@/components/landing/BeforeAfter/BeforeAfter";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustedBrands />
      <Features />
      <HowItWorks />
      <InteriorStyles />
      <BeforeAfter />
      <CTA />
      <Footer />
    </>
  );
}