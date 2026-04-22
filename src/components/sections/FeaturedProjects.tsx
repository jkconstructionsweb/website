"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, ArrowRight, IndianRupee } from "lucide-react";

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    fetch("/api/projects")
      .then(r => r.json())
      .then(d => setProjects(d.filter((p: any) => p.featured).slice(0, 4)));
  }, []);

  if (!projects.length) return null;

  const main = projects[active];

  return (
    <section className="py-28 px-4 md:px-6 bg-neutral/10 relative overflow-hidden">
      <div className="absolute -left-40 top-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-primary" />
              <span className="text-primary uppercase tracking-[0.2em] font-bold text-xs">Our Work</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-secondary leading-tight">
              Featured <span className="text-primary">Projects</span>
            </h2>
          </div>
          <Link href="/projects"
            className="flex items-center gap-2 text-secondary font-bold hover:text-primary transition-colors shrink-0 group">
            View All Projects <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Main feature panel */}
          <div className="lg:col-span-3">
            <div className="relative h-[480px] rounded-[32px] overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0">
                  <Image src={main?.images?.[0] || ""} fill className="object-cover" alt={main?.title || ""} />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent" />

              <AnimatePresence mode="wait">
                <motion.div key={`text-${active}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                  className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="bg-primary text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider mb-3 inline-block">
                    {main?.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-3">{main?.title}</h3>
                  <div className="flex flex-wrap gap-4 mb-5 text-sm text-white/70 font-semibold">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {main?.location}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {main?.timeline}</span>
                    <span className="flex items-center gap-1 text-primary font-black"><IndianRupee size={14} /> {main?.cost}</span>
                  </div>
                  <Link href={`/projects/${main?.slug}`}
                    className="inline-flex items-center gap-2 bg-white text-secondary font-black px-6 py-3 rounded-full hover:bg-primary hover:text-white transition-all text-sm shadow-lg">
                    View Case Study <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Thumbnail list */}
          <div className="lg:col-span-2 flex flex-col gap-4 justify-between">
            {projects.map((p, i) => (
              <motion.button key={p._id}
                onClick={() => setActive(i)}
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-[20px] border-2 text-left transition-all duration-300 group
                  ${active === i ? "border-primary bg-primary/5 shadow-lg" : "border-neutral/20 bg-white hover:border-primary/30 hover:shadow-md"}`}
              >
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                  <Image src={p.images?.[0] || ""} fill className="object-cover" alt={p.title} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${active === i ? "text-primary" : "text-secondary/40"}`}>{p.category}</span>
                  <h4 className={`font-black text-sm leading-tight mt-0.5 line-clamp-2 ${active === i ? "text-secondary" : "text-secondary/70"}`}>{p.title}</h4>
                  <p className="text-xs text-secondary/40 font-semibold mt-1">{p.location?.split(",")[0]}</p>
                </div>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${active === i ? "border-primary bg-primary" : "border-neutral/30"}`}>
                  {active === i && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
