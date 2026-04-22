"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { MapPin, Calendar, IndianRupee, ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then(r => r.json())
      .then(data => {
        const found = data.find((p: any) => p.slug === slug);
        if (found) setProject(found);
      });
  }, [slug]);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lightboxIdx === null || !project) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setLightboxIdx(i => (i! + 1) % project.images.length);
      if (e.key === "ArrowLeft") setLightboxIdx(i => (i! - 1 + project.images.length) % project.images.length);
      if (e.key === "Escape") setLightboxIdx(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, project]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-24">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-secondary/60 font-semibold">Loading project details…</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">

      {/* ── HERO IMAGE ── */}
      <section className="relative h-[75vh] min-h-[500px] w-full pt-16 overflow-hidden">
        <Image
          src={project.images[0]}
          fill className="object-cover transition-transform duration-1000" alt={project.title} priority
        />
        {/* Gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent h-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 md:px-6 pb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors font-semibold text-sm uppercase tracking-wider"
            >
              <ArrowLeft size={18} /> Back to Portfolio
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-primary text-white text-xs font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-lg">
                {project.category}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full border border-white/20">
                {project.images.length} Photos
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight max-w-4xl">
              {project.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl grid lg:grid-cols-3 gap-16">

          {/* LEFT: Description + Gallery */}
          <div className="lg:col-span-2 space-y-14">

            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="h-[2px] w-10 bg-primary" />
                <span className="text-primary uppercase tracking-widest font-bold text-xs">Overview</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-secondary mb-6">Project Description</h2>
              <p className="text-lg text-secondary/70 leading-relaxed font-medium whitespace-pre-wrap">
                {project.description}
              </p>
            </motion.div>

            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="h-[2px] w-10 bg-primary" />
                <span className="text-primary uppercase tracking-widest font-bold text-xs">Gallery</span>
              </div>
              <h3 className="text-3xl font-black text-secondary mb-8">Project Gallery</h3>

              {/* Hero gallery image */}
              <div
                className="relative h-96 rounded-[24px] overflow-hidden shadow-xl mb-4 cursor-zoom-in group"
                onClick={() => setLightboxIdx(0)}
              >
                <Image src={project.images[0]} fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt={project.title} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="text-white font-bold opacity-0 group-hover:opacity-100 bg-black/50 px-4 py-2 rounded-full text-sm transition-opacity">
                    View Full Screen
                  </span>
                </div>
              </div>

              {/* Thumbnail grid */}
              {project.images.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {project.images.slice(1).map((img: string, i: number) => (
                    <div
                      key={i}
                      className="relative h-40 rounded-[16px] overflow-hidden shadow-md cursor-zoom-in group"
                      onClick={() => setLightboxIdx(i + 1)}
                    >
                      <Image src={img} fill className="object-cover transition-transform duration-500 group-hover:scale-110" alt={`${project.title} - ${i + 2}`} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* RIGHT: Sticky Meta Card */}
          <div className="lg:col-span-1">
            <motion.div
              className="sticky top-28"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-neutral/20">
                {/* Card Header */}
                <div className="bg-secondary p-8">
                  <h3 className="text-xl font-black text-white mb-1">Project Key Details</h3>
                  <p className="text-white/50 text-sm">Complete project at a glance</p>
                </div>

                {/* Meta Items */}
                <div className="p-8 space-y-6">
                  {[
                    { icon: MapPin, label: "Location", value: project.location },
                    { icon: Calendar, label: "Timeline", value: project.timeline },
                    { icon: IndianRupee, label: "Estimated Cost", value: project.cost },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-4 pb-6 border-b border-neutral/20 last:border-0 last:pb-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                        <Icon size={22} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-secondary/40 uppercase tracking-widest mb-1">{label}</p>
                        <p className="font-black text-secondary text-lg">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="px-8 pb-8 space-y-3">
                  <Button asChild variant="filled" className="w-full h-14 text-base font-bold shadow-xl shadow-primary/20">
                    <Link href="/estimator">Get Similar Estimate</Link>
                  </Button>
                  <Button asChild variant="tonal" className="w-full h-12 text-base font-semibold">
                    <Link href="/contact">Discuss This Project</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightboxIdx(null)}
          >
            {/* Close */}
            <button className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10">
              <X size={24} />
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 text-white/60 font-bold text-sm z-10">
              {lightboxIdx + 1} / {project.images.length}
            </div>

            {/* Prev */}
            <button
              className="absolute left-4 md:left-8 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary transition-colors z-10"
              onClick={e => { e.stopPropagation(); setLightboxIdx(i => (i! - 1 + project.images.length) % project.images.length); }}
            >
              <ChevronLeft size={28} />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl h-[80vh] mx-16"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={project.images[lightboxIdx]}
                fill className="object-contain"
                alt={`${project.title} - ${lightboxIdx + 1}`}
              />
            </motion.div>

            {/* Next */}
            <button
              className="absolute right-4 md:right-8 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary transition-colors z-10"
              onClick={e => { e.stopPropagation(); setLightboxIdx(i => (i! + 1) % project.images.length); }}
            >
              <ChevronRight size={28} />
            </button>

            {/* Thumbnail strip */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 px-4">
              {project.images.map((_: any, i: number) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setLightboxIdx(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${i === lightboxIdx ? "bg-primary w-8" : "bg-white/40 hover:bg-white/70"}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
