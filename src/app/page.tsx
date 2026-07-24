import React from "react";
import { Navber } from "../components/Navber";
import { Footer } from "../components/Footer";
import { BannerSlider } from "@/components/landing/BannerSlider";
import { StatsSection } from "@/components/landing/StatsSection";
import { CampusHeroesSlider } from "@/components/landing/CampusHeroesSlider";
import { FeedbackSection } from "@/components/landing/FeedbackSection";
import { RegistrationSection } from "@/components/landing/RegistrationSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 font-sans overflow-hidden">
      <Navber />
      
      <main className="flex-1 w-full">
        {/* Top auto-sliding Banner */}
        <BannerSlider />
        
        {/* Dynamic platform statistics */}
        <StatsSection />

        {/* Top Campus Heroes showcase */}
        <CampusHeroesSlider />

        {/* Testimonials from Ambassadors */}
        <FeedbackSection />

        {/* Embedded Registration Form */}
        <RegistrationSection />
      </main>

      <Footer />
    </div>
  );
}
