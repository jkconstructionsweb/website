"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, ChevronDown } from "lucide-react";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80",
    tag: "Luxury Residential",
    heading: "Build the Home\nYou Deserve",
    sub: "Premium villas and residences crafted with uncompromising quality across Gurugram & NCR.",
    cta: { label: "View Residential Projects", href: "/projects?filter=Residential" },
  },
  {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80",
    tag: "Commercial Excellence",
    heading: "Spaces That\nDrive Business",
    sub: "Corporate campuses, retail destinations, and industrial facilities built for performance and scale.",
    cta: { label: "Explore Commercial Work", href: "/projects?filter=Commercial" },
  },
  {
    image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=1920&q=80",
    tag: "Premium Interiors",
    heading: "Interiors That\nInspire Living",
    sub: "Bespoke spaces designed with smart-home technology and handcrafted luxury finishes.",
    cta: { label: "See Interior Projects", href: "/projects?filter=Interior" },
  },
];

const STATS = [
  { value: "500+", label: "Projects" },
  { value: "15 yrs", label: "Experience" },
  { value: "98%", label: "Satisfaction" },
  { value: "ISO", label: "9001:2015" },
];

interface HeroProps {
  data?: {
    slides?: any[];
    stats?: any[];
  }
}

export default function Hero({ data }: HeroProps) {
  const activeSlides = data?.slides?.length ? data.slides : SLIDES;
  const activeStats = data?.stats?.length ? data.stats : STATS;

  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const INTERVAL = 5000;

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    setProgress(0);
  }, []);

  useEffect(() => {
    const tick = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setCurrent(c => (c + 1) % activeSlides.length);
          return 0;
        }
        return p + 100 / (INTERVAL / 50);
      });
    }, 50);
    return () => clearInterval(tick);
  }, [activeSlides.length]);

  const slide = activeSlides[current] || activeSlides[0];

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden">

      {/* ── BACKGROUND IMAGES ── */}
      {/* PERFORMANCE FIX: Static base image for instant Largest Contentful Paint (LCP) */}
      <div className="absolute inset-0 z-0">
         <Image src={activeSlides[0]?.image || SLIDES[0].image} fill sizes="100vw" className="object-cover" alt="Hero Background" priority />
      </div>

      <AnimatePresence>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <Image src={slide.image} fill sizes="100vw" className="object-cover" alt={slide.tag} priority />
        </motion.div>
      </AnimatePresence>

      {/* ── GRADIENT OVERLAYS ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/70 to-secondary/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent" />

      {/* ── CONTENT ── */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-20 pb-32">
        <div className="max-w-3xl">

          {/* Tag badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`tag-${current}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-primary px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              {slide.tag}
            </motion.div>
          </AnimatePresence>

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`h-${current}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-white leading-[0.95] tracking-tight mb-6"
              style={{ whiteSpace: "pre-line" }}
            >
              {slide.heading?.replace(/\\n/g, '\n')}
            </motion.h1>
          </AnimatePresence>

          {/* Subtext */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`s-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white/70 text-lg md:text-xl font-medium max-w-xl mb-10 leading-relaxed"
            >
              {slide.sub}
            </motion.p>
          </AnimatePresence>

          {/* CTA Buttons */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`cta-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link href={slide.cta?.href || slide.ctaHref || "#"}
                className="group inline-flex items-center gap-3 bg-primary text-white font-black px-8 py-4 rounded-full hover:bg-primary/90 transition-all shadow-2xl shadow-primary/40 text-base">
                {slide.cta?.label || slide.ctaLabel || "View Projects"}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/estimator"
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold px-8 py-4 rounded-full hover:bg-white/20 transition-all text-base">
                Free Cost Estimate
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── STATS BAR (bottom) ── */}
      <div className="absolute bottom-20 left-0 right-0 z-20 px-6 md:px-12 lg:px-20">
        <div className="flex gap-8 md:gap-16">
          {activeStats.map((stat: any) => (
            <div key={stat.label} className="text-center md:text-left">
              <div className="text-2xl md:text-4xl font-black text-white">{stat.value}</div>
              <div className="text-white/40 text-xs font-bold uppercase tracking-wider mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SLIDE CONTROLS (right side) ── */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
        {activeSlides.map((_: any, i: number) => (
          <button key={i} onClick={() => goTo(i)} className="group relative flex items-center gap-2">
            <div className={`h-12 rounded-full transition-all duration-300 overflow-hidden
              ${i === current ? "w-1.5 bg-primary" : "w-1 bg-white/20 hover:bg-white/40"}`}>
              {i === current && (
                <motion.div
                  className="w-full bg-primary/40 origin-top"
                  style={{ height: `${progress}%` }}
                />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* ── SCROLL INDICATOR ── */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Scroll</span>
        <ChevronDown size={18} className="text-white/30" />
      </motion.div>
    </section>
  );
}
