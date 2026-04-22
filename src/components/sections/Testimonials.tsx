"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Rajeev Kapoor",
    role: "Villa Owner",
    location: "Sector 57, Gurugram",
    rating: 5,
    text: "JK Constructions transformed our plot into a stunning villa we couldn't have imagined. The craftsmanship is impeccable and they delivered 3 weeks ahead of schedule. Truly a world-class team.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80",
    project: "4BHK Luxury Villa · ₹2.8 Cr",
  },
  {
    name: "Neha Agarwal",
    role: "Interior Design Client",
    location: "DLF Phase 4, Gurugram",
    rating: 5,
    text: "The interior team's attention to detail is absolutely unmatched. Every corner of our home feels bespoke and luxurious — exactly what we envisioned. The smart-home integration was especially impressive.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=100&q=80",
    project: "Premium 3BHK Interior · ₹38 Lakhs",
  },
  {
    name: "Vikram Singh",
    role: "CEO, TechVenture Pvt. Ltd.",
    location: "Cyber City, Gurugram",
    rating: 5,
    text: "Our 8,000 sq.ft headquarters was delivered on time and within budget. The quality of RCC work, glass partitions, and electrical finishes is outstanding. Our team loves coming to work every day.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
    project: "Corporate HQ · ₹5.2 Cr",
  },
  {
    name: "Meera Joshi",
    role: "Home Owner",
    location: "Sohna Road, Gurugram",
    rating: 5,
    text: "We were nervous about construction after a bad experience with another builder. JK Constructions restored our faith completely. The transparency, the daily updates, and the final result — all outstanding.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80",
    project: "Duplex Residence · ₹1.9 Cr",
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);

  const prev = () => setIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setIdx(i => (i + 1) % TESTIMONIALS.length);
  const t = TESTIMONIALS[idx];

  return (
    <section className="py-28 px-4 md:px-6 bg-neutral/10 overflow-hidden">
      <div className="container mx-auto max-w-5xl">

        {/* Header */}
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[2px] w-10 bg-primary" />
            <span className="text-primary uppercase tracking-[0.2em] font-bold text-xs">Client Love</span>
            <div className="h-[2px] w-10 bg-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-secondary">Client <span className="text-primary">Testimonials</span></h2>
          <p className="text-secondary/50 text-lg mt-4 font-medium">What our clients say about working with us.</p>
        </motion.div>

        {/* Main Testimonial */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}
              className="bg-white rounded-[36px] shadow-2xl border border-neutral/20 overflow-hidden"
            >
              <div className="grid md:grid-cols-5">
                {/* Left: Big quote */}
                <div className="md:col-span-3 p-10 md:p-14 flex flex-col justify-between">
                  <Quote className="text-primary/20 w-16 h-16 mb-6" />
                  <div className="flex mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={20} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-secondary text-xl md:text-2xl font-semibold leading-relaxed flex-1">
                    "{t.text}"
                  </p>
                  <div className="mt-8 pt-8 border-t border-neutral/20 flex items-center gap-5">
                    <Image src={t.image} width={60} height={60} className="rounded-2xl object-cover border-2 border-primary/20" alt={t.name} />
                    <div>
                      <h4 className="font-black text-secondary text-lg">{t.name}</h4>
                      <p className="text-secondary/50 font-semibold text-sm">{t.role} · {t.location}</p>
                    </div>
                  </div>
                </div>

                {/* Right: Project info panel */}
                <div className="md:col-span-2 bg-secondary flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                      🏗️
                    </div>
                    <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-2">Project Completed</p>
                    <h3 className="text-white font-black text-lg">{t.project}</h3>
                    <div className="mt-6 flex justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-white/40 text-xs mt-2 font-bold">Verified Review</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === idx ? "bg-primary w-8" : "bg-neutral/40 w-2 hover:bg-neutral/60"}`} />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-3">
              <button onClick={prev}
                className="w-12 h-12 rounded-full border-2 border-neutral/30 flex items-center justify-center text-secondary hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                <ChevronLeft size={22} />
              </button>
              <button onClick={next}
                className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/30">
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
