import { useEffect } from "react";
import FeaturedCategoriesSection from "../components/Home/FeaturedCategoriesSection";
import HeroSection from "../components/Home/HeroSection";
import LatestProductsSection from "../components/Home/LatestProductsSection";
import Layout from "../components/Layout";
import NewsletterSection from "../components/Home/NewsletterSection";
import ProductDisplaySection from "../components/Home/ProductDisplaySection";
import TestimonialsSection from "../components/Home/TestimonialsSection";
import { motion } from "framer-motion";
import "aos/dist/aos.css";
import AOS from "aos";

const Home = () => {
  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });

    // Refresh AOS when components are fully loaded
    window.addEventListener("load", () => {
      AOS.refresh();
    });

    return () => {
      window.removeEventListener("load", () => {
        AOS.refresh();
      });
    };
  }, []);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HeroSection />
        <ProductDisplaySection />
        <FeaturedCategoriesSection />
        <LatestProductsSection />
        <TestimonialsSection />
        <NewsletterSection />
      </motion.div>
    </Layout>
  );
};

export default Home;