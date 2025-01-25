import FeaturedCategoriesSection from "../components/Home/FeaturedCategoriesSection";
import HeroSection from "../components/Home/HeroSection";
import LatestProductsSection from "../components/Home/LatestProductsSection";
import Layout from "../components/Layout";
import NewsletterSection from "../components/Home/NewsletterSection";
import ProductDisplaySection from "../components/Home/ProductDisplaySection";
import TestimonialsSection from "../components/Home/TestimonialsSection";

const Home = () => {
  return (
    <Layout>
      <HeroSection />
      <ProductDisplaySection />
      <FeaturedCategoriesSection />
      <LatestProductsSection />
      <TestimonialsSection />
      <NewsletterSection />
    </Layout>
  );
};

export default Home;
