import Hero from "@/components/Hero";
import Features from "@/components/Features";
import FeaturedBooks from "@/components/FeaturedBooks";
import PopularCategories from "@/components/PopularCategories";
import HowItWorks from "@/components/HowItWorks";
import WhyChooseUs from "@/components/WhyChooseUs";
import TopLibrarians from "@/components/TopLibrarians";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <FeaturedBooks />
      <PopularCategories />
      <HowItWorks />
      <WhyChooseUs />
      <TopLibrarians />
      <Testimonials />
      <CTASection />
      <Newsletter />
    </div>
  );
}
