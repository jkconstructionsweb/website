"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calculator, ArrowRight, Home, Building2, Sparkles } from "lucide-react";

const TIERS = [
  { label: "Basic", rate: "₹1,500/sq.ft", color: "bg-slate-100 text-slate-700 border-slate-200" },
  { label: "Standard", rate: "₹2,200/sq.ft", color: "bg-primary/10 text-primary border-primary/30", highlight: true },
  { label: "Premium", rate: "₹3,200/sq.ft", color: "bg-amber-50 text-amber-700 border-amber-200" },
];

export default function EstimatorPreview() {
  return (
    <section className="py-28 px-4 md:px-6 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-primary" />
              <span className="text-primary uppercase tracking-[0.2em] font-bold text-xs">Free Tool</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-secondary leading-tight mb-6">
              Know Your Build <br /><span className="text-primary">Cost Instantly</span>
            </h2>
            <p className="text-secondary/60 text-lg font-medium leading-relaxed mb-8">
              Input your plot size, floors, and preferred material quality — get a real-time cost estimate in seconds. No sign-up required.
            </p>

            <div className="space-y-4 mb-10">
              {[
                { icon: Home, text: "Works for any project type — residential, commercial, or interior" },
                { icon: Building2, text: "Choose from 3 material quality tiers with instant price updates" },
                { icon: Sparkles, text: "Get a detailed quote emailed to you by our experts within 2 hours" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <p className="text-secondary/70 font-semibold text-sm">{text}</p>
                </div>
              ))}
            </div>

            <Link href="/estimator"
              className="inline-flex items-center gap-3 bg-primary text-white font-black px-8 py-4 rounded-full hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 text-base group">
              <Calculator size={20} /> Launch Cost Estimator
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right: Preview card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="bg-secondary rounded-[32px] p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center">
                  <Calculator size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-black">JK Cost Estimator</h3>
                  <p className="text-white/40 text-xs font-medium">Live preview — try the full tool</p>
                </div>
              </div>

              {/* Mock inputs */}
              <div className="space-y-4 mb-6">
                <div className="bg-white/10 rounded-2xl px-4 py-3 flex justify-between items-center">
                  <span className="text-white/60 text-sm font-semibold">Plot Size</span>
                  <span className="text-white font-black">1,200 sq.ft</span>
                </div>
                <div className="bg-white/10 rounded-2xl px-4 py-3 flex justify-between items-center">
                  <span className="text-white/60 text-sm font-semibold">Floors</span>
                  <span className="text-white font-black">2</span>
                </div>
              </div>

              {/* Tier selector */}
              <div className="space-y-3 mb-6">
                <p className="text-white/50 text-xs font-black uppercase tracking-widest">Material Quality</p>
                {TIERS.map(t => (
                  <div key={t.label}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl border ${t.color} ${t.highlight ? "ring-2 ring-primary" : ""}`}>
                    <span className="font-black text-sm">{t.label}</span>
                    <span className="font-black text-sm">{t.rate}</span>
                    {t.highlight && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-black ml-2">Popular</span>}
                  </div>
                ))}
              </div>

              {/* Output */}
              <div className="bg-primary/20 border border-primary/30 rounded-2xl px-5 py-4 flex justify-between items-center">
                <div>
                  <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Estimated Cost</p>
                  <p className="text-3xl font-black text-primary mt-0.5">₹52,80,000</p>
                </div>
                <Link href="/estimator"
                  className="bg-primary text-white px-4 py-2 rounded-full text-xs font-black hover:bg-primary/90 transition-colors shadow-lg">
                  Full Tool →
                </Link>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-amber-400 text-secondary font-black text-xs px-4 py-2 rounded-full shadow-lg rotate-3">
              100% Free ✓
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
