"use client";
import { motion } from "framer-motion";
import { Shield, Clock, Award, Users, CheckCircle, TrendingUp } from "lucide-react";

const STATS = [
  { value: "500+", label: "Projects Delivered", icon: TrendingUp },
  { value: "15+", label: "Years Experience", icon: Clock },
  { value: "98%", label: "Client Satisfaction", icon: Users },
  { value: "ISO", label: "9001:2015 Certified", icon: Award },
];

const REASONS = [
  { icon: Shield, title: "Zero Compromise Quality", desc: "Every project uses specification-grade materials with independent quality audits at each milestone." },
  { icon: Clock, title: "On-Time Delivery", desc: "Our project management system tracks every activity in real-time — 95% of our projects finish ahead of deadline." },
  { icon: Award, title: "Award-Winning Design", desc: "Our architecture and interior teams have won 12 regional design excellence awards since 2018." },
  { icon: CheckCircle, title: "Full Transparency", desc: "You get a live project dashboard with daily photo updates, cost tracking, and milestone alerts — zero surprises." },
  { icon: Users, title: "Dedicated Project Manager", desc: "Every client gets a senior PM as a single point-of-contact from groundbreaking to handover." },
  { icon: TrendingUp, title: "Strong Resale Value", desc: "JK Constructions projects command 12–20% premium resale value vs comparable builds in the same micro-market." },
];

export default function WhyChooseUs() {
  return (
    <section className="py-28 px-4 md:px-6 bg-secondary relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="container mx-auto max-w-6xl relative z-10">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[2px] w-10 bg-primary" />
            <span className="text-primary uppercase tracking-[0.2em] font-bold text-xs">Our Advantage</span>
            <div className="h-[2px] w-10 bg-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Why Choose <span className="text-primary">JK Constructions</span>
          </h2>
          <p className="mt-5 text-white/50 text-lg max-w-2xl mx-auto font-medium">
            15 years. 500+ projects. One unwavering standard of excellence.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
        >
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[24px] p-6 text-center hover:bg-white/10 transition-colors group">
              <Icon size={22} className="text-primary mx-auto mb-3" />
              <div className="text-4xl font-black text-white mb-1">{value}</div>
              <div className="text-xs font-bold text-white/50 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {REASONS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-[24px] p-7 hover:bg-white/12 hover:border-primary/40 transition-all group"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <Icon size={22} className="text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed font-medium">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
