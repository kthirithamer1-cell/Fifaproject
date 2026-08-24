import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { FeaturesBar } from "./_components/FeaturesBar";
import { Gallery } from "./_components/Gallery";
import { Packages } from "./_components/Packages";
import { HowItWorks } from "./_components/HowItWorks";
import { AboutFlawless } from "./_components/AboutFlawless";
import { Testimonials } from "./_components/Testimonials";
import { Faq } from "./_components/Faq";
import { Footer } from "./_components/Footer";
import { FloatingCtaBar } from "./_components/FloatingCtaBar";
import RecentOrderPopup from "./_components/generator/RecentOrderPopup";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturesBar />
        <Gallery />
        <Packages />
        <HowItWorks />
        <AboutFlawless />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
      <FloatingCtaBar />
      <RecentOrderPopup currentStep="landing" />
    </>
  );
}