"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Footer from "@/components/sections/Footer";
import { MapPin, IndianRupee, Clock, ArrowRight, Home, Building2, Sparkles } from "lucide-react";

const CATEGORIES = [
  { label: "All Projects", value: "All", icon: Sparkles },
  { label: "Residential", value: "Residential", icon: Home },
  { label: "Commercial", value: "Commercial", icon: Building2 },
  { label: "Interior", value: "Interior", icon: Sparkles },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then(r => r.json())
      .then(data => { setProjects(data); setLoading(false); });
  }, []);

  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <main className="min-h-screen bg-background flex flex-col">

      {/* ── PAGE HERO ── */}
      <section className="relative h-[50vh] min-h-[400px] w-full flex items-end overflow-hidden pt-16">
        <Image
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=80"
          fill className="object-cover" alt="Our Projects" priority unoptimized
        />
        {/* Gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent h-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-transparent" />
        <div className="container relative z-10 px-4 md:px-6 pb-14 mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-primary" />
              <span className="text-white/60 uppercase tracking-[0.2em] font-bold text-xs">Portfolio</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white">Our <span className="text-primary">Projects</span></h1>
            <p className="text-white/60 text-lg mt-3 max-w-xl font-medium">
              {projects.length}+ completed projects across residential, commercial, and interior categories.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-neutral/20 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4 flex gap-3 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  filter === cat.value
                    ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                    : "bg-neutral/30 text-secondary hover:bg-neutral/60"
                }`}
              >
                <Icon size={16} /> {cat.label}
                {filter === cat.value && (
                  <span className="bg-white/30 text-white text-xs px-2 py-0.5 rounded-full font-black">
                    {filtered.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── PROJECT GRID ── */}
      <section className="py-20 px-4 md:px-6 flex-1">
        <div className="container mx-auto max-w-7xl">

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-neutral/20 rounded-[28px] h-[480px] animate-pulse" />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={filter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filtered.map((project, i) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="group bg-white rounded-[28px] overflow-hidden shadow-md hover:shadow-2xl border border-neutral/20 hover:-translate-y-2 transition-all duration-300 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={project.images[0]}
                        fill className="object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={project.title}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {/* Category pill */}
                      <div className="absolute top-5 left-5 bg-primary text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                        {project.category}
                      </div>
                      {/* Image count */}
                      {project.images.length > 1 && (
                        <div className="absolute top-5 right-5 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                          +{project.images.length - 1} photos
                        </div>
                      )}
                      {/* Hover gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Content */}
                    <div className="p-7 flex-1 flex flex-col">
                      <h3 className="text-xl font-black text-secondary mb-2 leading-tight group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-secondary/60 text-sm mb-6 flex-1 leading-relaxed line-clamp-2">
                        {project.description}
                      </p>

                      {/* Meta chips */}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-neutral/20 rounded-2xl p-3 flex flex-col items-center text-center">
                          <MapPin size={14} className="text-primary mb-1" />
                          <span className="text-[10px] font-bold text-secondary/50 uppercase tracking-wider">Location</span>
                          <span className="text-xs font-bold text-secondary mt-0.5 leading-tight">{project.location.split(",")[0]}</span>
                        </div>
                        <div className="bg-neutral/20 rounded-2xl p-3 flex flex-col items-center text-center">
                          <Clock size={14} className="text-primary mb-1" />
                          <span className="text-[10px] font-bold text-secondary/50 uppercase tracking-wider">Timeline</span>
                          <span className="text-xs font-bold text-secondary mt-0.5">{project.timeline}</span>
                        </div>
                        <div className="bg-primary/10 rounded-2xl p-3 flex flex-col items-center text-center">
                          <IndianRupee size={14} className="text-primary mb-1" />
                          <span className="text-[10px] font-bold text-primary/70 uppercase tracking-wider">Value</span>
                          <span className="text-xs font-black text-primary mt-0.5">{project.cost}</span>
                        </div>
                      </div>

                      <Button asChild variant="filled" className="w-full h-12 font-bold group/btn">
                        <Link href={`/projects/${project.slug}`} className="flex items-center justify-center gap-2">
                          View Case Study <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-28">
              <div className="text-7xl mb-6">🏗️</div>
              <h3 className="text-2xl font-black text-secondary mb-2">No projects in this category yet.</h3>
              <p className="text-secondary/50 font-medium">Check back soon or explore another category.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
