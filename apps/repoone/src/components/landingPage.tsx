"use client";

import { Header } from "./marketing/Header";
import { Hero } from "./marketing/Hero";
import { Testimonials } from "./marketing/Testimonials";
import { Pricing } from "./marketing/Pricing";
import { Footer } from "./marketing/Footer";
import Products from "~/components/marketing/Products";
import Banner from "~/components/marketing/Banner";

import Trusted from "~/components/marketing/Trusted";
import { Faqs } from "~/components/marketing/Faqs";
import Statistics from "./marketing/Statistics";

const LandingPage: React.FC = () => {
  return (
    <div className="font-mono">
      <Header />
      <main>
        <Hero />
        <Statistics />
        <Products />
        <Trusted />
        <Pricing />
        <Testimonials />
        <Faqs />
        <Banner />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
