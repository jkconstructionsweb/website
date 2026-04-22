"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calculator, MessageCircle, ArrowRight, Phone } from "lucide-react";

export default function CTABanner() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/contact")
      .then(r => r.json())
      .then(d => setData(d))
      .catch(e => console.error("CTA contact fetch error:", e));
  }, []);

  const whatsappNumber = data?.whatsapp || "+91 98765 43210";
  const whatsappClean  = whatsappNumber.replace(/\D/g, "");

  return (
    <section className="py-28 px-4 md:px-6 bg-secondary relative overflow-hidden">
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1439337153520-7082a56a81f4?auto=format&fit=crop&w=1920&q=80"
        fill className="object-cover opacity-10" alt="CTA background"
      />

      {/* Blobs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />

      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
        >
          {/* Pill */}
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary px-5 py-2.5 rounded-full text-sm font-bold mb-8">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Taking New Projects — Limited Slots Available
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6">
            Ready to Build<br />
            <span className="text-primary">Your Vision?</span>
          </h2>
          <p className="text-white/60 text-xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            Whether it's your dream home, a commercial space, or a stunning interior — JK Constructions turns your vision into a landmark.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/estimator"
              className="inline-flex items-center justify-center gap-3 bg-primary text-white font-black px-10 py-5 rounded-full hover:bg-primary/90 transition-all shadow-2xl shadow-primary/40 text-lg group">
              <Calculator size={22} /> Get Free Estimate
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact"
              className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-black px-10 py-5 rounded-full hover:bg-white/20 transition-all text-lg group">
              <MessageCircle size={22} /> Talk to an Expert
            </Link>
          </div>

          {/* Social proof row */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            {[
              { value: "500+", label: "Projects Delivered" },
              { value: "₹500 Cr+", label: "Construction Value" },
              { value: "15 Years", label: "Of Excellence" },
              { value: "98%", label: "Client Retention" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-black text-white">{value}</div>
                <div className="text-white/40 text-xs font-bold uppercase tracking-wider mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* WhatsApp strip */}
          <div className="mt-12 inline-flex items-center gap-3 bg-green-500/20 border border-green-500/30 text-green-300 px-6 py-3 rounded-full text-sm font-bold">
            <MessageCircle size={16} className="text-green-400" />
            WhatsApp us at&nbsp;
            <Link href={`https://wa.me/${whatsappClean}`} target="_blank" className="text-green-300 underline underline-offset-2 hover:text-white transition-colors">
              {whatsappNumber}
            </Link>
            &nbsp;— we reply within 5 minutes
          </div>
        </motion.div>
      </div>
    </section>
  );
}
