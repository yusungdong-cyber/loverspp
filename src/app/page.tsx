import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import WhatWeHelp from "@/components/WhatWeHelp";
import WhyNotAI from "@/components/WhyNotAI";
import Pricing from "@/components/Pricing";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import LeadCapture from "@/components/LeadCapture";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <WhatWeHelp />
        <WhyNotAI />
        <Pricing />
        <Benefits />
        <Testimonials />
        <FAQ />
        <LeadCapture />
      </main>
      <Footer />
    </>
  );
}
