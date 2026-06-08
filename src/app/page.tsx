import Nav from "@/components/Nav";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import Marquee from "@/components/Marquee";
import Hero from "@/components/sections/Hero";
import WardrobeSection from "@/components/sections/WardrobeSection";
import KitchenSection from "@/components/sections/KitchenSection";
import CabinetSection from "@/components/sections/CabinetSection";
import StatsSection from "@/components/sections/StatsSection";
import WhyUsSection from "@/components/sections/WhyUsSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <Preloader />
      <CustomCursor />
      <Nav />
      <main id="top" className="relative">
        <Hero />
        <Marquee />
        <WardrobeSection />
        <KitchenSection />
        <CabinetSection />
        <StatsSection />
        <WhyUsSection />
        <CTASection />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
