import { AboutFlawless } from "./_components/AboutFlawless";
import { Faq } from "./_components/Faq";
import { FeaturesBar } from "./_components/FeaturesBar";
import { Footer } from "./_components/Footer";
import { Gallery } from "./_components/Gallery";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { HowItWorks } from "./_components/HowItWorks";
import { Packages } from "./_components/Packages";
import { StatsChips } from "./_components/StatsChips";
import { Testimonials } from "./_components/Testimonials";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AboutFlawless />
        <FeaturesBar />
        <Gallery />
        <HowItWorks />
        <StatsChips />
        <Packages />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </>
  );
}