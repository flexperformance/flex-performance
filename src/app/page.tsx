import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import Booking from "@/components/Booking";
import Reviews from "@/components/Reviews";
import Reassurance from "@/components/Reassurance";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Reassurance />
        <Services />
        <Process />
        <div id="e85-calculator">
        <Pricing />
        </div>
        <Faq />
        <Booking />
        <Reviews />
        <FloatingCTA />
      </main>
      <Footer />
    </>
  );
}
