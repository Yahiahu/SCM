import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import BlurredBackground from "../components/aboutUs/BlurredBackground";
import Navigation from "../components/aboutUs/Navigation";
import HeroSection from "../components/aboutUs/HeroSection";
import StatsSection from "../components/aboutUs/StatsSection";
import AboutStorySection from "../components/aboutUs/AboutStorySection";
import ValuesSection from "../components/aboutUs/ValueSection";
import TestimonialsSection from "../components/aboutUs/Testimonials";
import CTASection from "../components/aboutUs/CTASection";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

const AboutUsPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 text-gray-800 overflow-x-hidden relative">
      <BlurredBackground />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <Navbar isLoggedIn={true} />

      <HeroSection y={y} opacity={opacity} />

      <StatsSection />

      <AboutStorySection />

      <ValuesSection />

      <TestimonialsSection />

      <CTASection />

      <Footer />
    </div>
  );
};

export default AboutUsPage;
