import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import EstimatorPreview from "@/components/sections/EstimatorPreview";
import Testimonials from "@/components/sections/Testimonials";
import BlogHighlights from "@/components/sections/BlogHighlights";
import CTABanner from "@/components/sections/CTABanner";
import Footer from "@/components/sections/Footer";

import { Page } from "@/models/Page";
import connectToDatabase from "@/lib/db";
import fs from "fs";
import path from "path";

export const revalidate = 0; // Dynamic fetch

export default async function HomePage() {
  const db = await connectToDatabase();
  
  let sections: any = {};
  if (db) {
    const pageDoc = await Page.findOne({ pageName: "home" }).lean() as any;
    sections = pageDoc?.sections || {};
  } else {
    // Local JSON Fallback
    const LOCAL_FILE = path.join(process.cwd(), 'cms-pages.json');
    if (fs.existsSync(LOCAL_FILE)) {
      const data = JSON.parse(fs.readFileSync(LOCAL_FILE, 'utf-8'));
      sections = data['home']?.sections || {};
    }
  }

  return (
    <main className="flex min-h-screen flex-col w-full overflow-hidden">
      <Hero data={sections.hero} />
      <Services />
      <WhyChooseUs />
      <FeaturedProjects />
      <EstimatorPreview />
      <Testimonials />
      <BlogHighlights />
      <CTABanner />
      <Footer />
    </main>
  );
}
