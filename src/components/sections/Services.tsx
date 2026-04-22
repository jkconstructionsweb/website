"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Home, Building2, Sparkles, Wrench, ArrowRight } from "lucide-react";

const SERVICES = [
  {
    icon: Home,
    title: "Residential Construction",
    desc: "Custom villas, luxury homes, and multi-storey residences built to last generations with premium materials.",
    stat: "350+ Homes",
    color: "from-blue-500 to-primary",
    href: "/projects?filter=Residential",
  },
  {
    icon: Building2,
    title: "Commercial Projects",
    desc: "Corporate campuses, retail destinations, and industrial facilities engineered for efficiency and scale.",
    stat: "120+ Projects",
    color: "from-purple-500 to-indigo-600",
    href: "/projects?filter=Commercial",
  },
  {
    icon: Sparkles,
    title: "Premium Interiors",
    desc: "Bespoke interior spaces that blend smart-home technology with handcrafted luxury finishes.",
    stat: "200+ Interiors",
    color: "from-amber-500 to-orange-500",
    href: "/projects?filter=Interior",
  },
  {
    icon: Wrench,
    title: "Renovation & Remodelling",
    desc: "Transform existing structures with structural upgrades, modern facades, and complete interior overhauls.",
    stat: "80+ Renovations",
    color: "from-green-500 to-teal-600",
    href: "/contact",
  },
];

export default function Services() {
  return (
    <section className="py-28 px-4 md:px-6 bg-white relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute -right-40 -top-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[2px] w-10 bg-primary" />
            <span className="text-primary uppercase tracking-[0.2em] font-bold text-xs">What We Do</span>
            <div className="h-[2px] w-10 bg-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-secondary leading-tight">
            End-to-End Construction <br className="hidden md:block" />
            <span className="text-primary">Services</span>
          </h2>
          <p className="mt-5 text-secondary/60 text-lg max-w-2xl mx-auto font-medium">
            From concept to completion — we handle every phase of your project with precision and care.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={s.href} className="group block h-full">
                <div className="bg-white border-2 border-neutral/20 rounded-[28px] p-8 h-full hover:border-primary/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden flex flex-col">
                  {/* Gradient bg on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-[26px]`} />

                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <s.icon size={26} className="text-white" />
                  </div>

                  <h3 className="text-xl font-black text-secondary mb-3 leading-tight">{s.title}</h3>
                  <p className="text-secondary/60 text-sm leading-relaxed flex-1">{s.desc}</p>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral/20">
                    <span className="text-primary font-black text-sm">{s.stat}</span>
                    <ArrowRight size={18} className="text-secondary/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
