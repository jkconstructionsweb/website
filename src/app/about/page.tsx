"use client";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/sections/Footer";
import { motion } from "framer-motion";
import {
  Target, Flag, Award, CheckCircle, Star,
  ExternalLink, ArrowRight, Quote
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const TEAM = [
  {
    name: "Jagdish Kumar",
    role: "Founder & CEO",
    exp: "15+ Years",
    quote: "Quality is not an option — it's the only language we speak.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    bg: "from-blue-900 to-secondary",
  },
  {
    name: "Priya Sharma",
    role: "Chief Architect",
    exp: "12 Years",
    quote: "Great architecture is a feeling — not just a structure.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
    bg: "from-purple-900 to-secondary",
  },
  {
    name: "Arjun Mehta",
    role: "Head — Project Delivery",
    exp: "10 Years",
    quote: "Every delay is a design flaw in our process.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
    bg: "from-teal-900 to-secondary",
  },
  {
    name: "Sneha Kapoor",
    role: "Interior Design Lead",
    exp: "9 Years",
    quote: "A room should feel like a perfectly written sentence.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    bg: "from-rose-900 to-secondary",
  },
];

const TIMELINE = [
  { year: "2010", event: "Founded in Gurugram", desc: "Born from a bold vision — JK Constructions was established with a team of five and an unyielding commitment to quality.", dot: "bg-primary" },
  { year: "2013", event: "50 Projects Delivered", desc: "Crossed the first major milestone with 50 completed residential builds — all delivered ahead of schedule.", dot: "bg-blue-500" },
  { year: "2016", event: "ISO 9001:2015 Certified", desc: "Became one of NCR's first ISO-certified builders, formalising our engineering excellence standards.", dot: "bg-purple-500" },
  { year: "2018", event: "Commercial Division", desc: "Expanded into large-scale commercial, retail, and hospitality construction with a dedicated expert team.", dot: "bg-amber-500" },
  { year: "2021", event: "IGBC Green Member", desc: "Joined the Indian Green Building Council, committing fully to sustainable and eco-friendly construction.", dot: "bg-green-500" },
  { year: "2024", event: "500+ Projects", desc: "Crossed a landmark 500 projects — representing thousands of families and businesses served across India.", dot: "bg-primary" },
];

const CERTS = [
  { title: "ISO 9001:2015", body: "Quality Management Systems", icon: "🏅" },
  { title: "IGBC Member", body: "Indian Green Building Council", icon: "🌿" },
  { title: "CREDAI", body: "Real Estate Developers Association", icon: "🏗️" },
  { title: "BIS Compliant", body: "Bureau of Indian Standards", icon: "✅" },
  { title: "RERA Approved", body: "Real Estate Regulatory Authority", icon: "📜" },
  { title: "5-Star Safety", body: "National Safety Council of India", icon: "⭐" },
];

const FV = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.7 } };

export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";

export default function AboutPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    fetch("/api/team")
      .then(r => r.json())
      .then(d => {
        if (d && d.length > 0) {
          setTeam(d.filter((t: any) => t.active !== false));
        }
      })
      .catch(e => console.error("Failed to load dynamic team:", e))
      .finally(() => setLoadingTeam(false));
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-white overflow-hidden">

      {/* ══ 1. HERO — same style as Projects page ═════════════════════════════ */}
      <section className="relative h-[55vh] min-h-[420px] w-full flex items-end overflow-hidden pt-16">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80"
          fill sizes="100vw" className="object-cover object-center" alt="About JK Constructions" priority
        />
        {/* Gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent h-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-transparent" />
        <div className="container relative z-10 px-4 md:px-6 pb-14 mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-primary" />
              <span className="text-white/60 uppercase tracking-[0.2em] font-bold text-xs">Our Identity</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white">
              About <span className="text-primary">JK Constructions</span>
            </h1>
            <p className="text-white/60 text-lg mt-3 max-w-2xl font-medium">
              Building legacies through precision, innovation, and unwavering trust since 2010.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══ 2. COMPANY STORY ════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-14 bg-white">
        <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-20 items-center">

          {/* Images */}
          <motion.div className="relative h-[580px]"
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9 }}>
            {/* Primary image */}
            <div className="absolute top-0 left-0 w-[82%] h-[74%] rounded-[32px] overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80"
                className="w-full h-full object-cover" alt="Construction site"
              />
            </div>
            {/* Secondary offset image */}
            <div className="absolute bottom-0 right-0 w-[54%] h-[46%] rounded-[28px] overflow-hidden shadow-2xl border-4 border-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80"
                className="w-full h-full object-cover" alt="Architecture"
              />
            </div>
            {/* Floating year badge */}
            <div className="absolute top-6 -right-4 bg-primary rounded-2xl p-6 shadow-2xl shadow-primary/40 text-white text-center z-10">
              <div className="text-5xl font-black leading-none">15+</div>
              <div className="text-xs font-bold uppercase tracking-widest mt-1 opacity-80">Years</div>
            </div>
            {/* Dot grid decoration */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 opacity-20"
              style={{ backgroundImage: "radial-gradient(#007AAD 1.5px, transparent 1.5px)", backgroundSize: "12px 12px" }} />
          </motion.div>

          {/* Copy */}
          <motion.div {...FV} className="space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 text-primary text-xs font-black uppercase tracking-[0.25em] mb-4">
                <span className="w-8 h-px bg-primary" /> Our Story
              </span>
              <h2 className="text-5xl md:text-6xl font-black text-secondary leading-tight">
                From a Workshop <br />to a{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-primary">Construction</span>
                </span>
                <br />Empire
              </h2>
            </div>

            <p className="text-secondary/70 text-lg leading-relaxed">
              Founded in 2010 by <strong className="text-secondary font-black">Jagdish Kumar</strong> with a team of five and a vision larger than any blueprint, JK Constructions set out to transform Gurugram's suburban sprawl into architectural landmarks built to endure generations.
            </p>
            <p className="text-secondary/60 leading-relaxed">
              We grew methodically — never chasing volume, always championing quality. Every residential villa, commercial tower, and bespoke interior carries the same uncompromising engineering standard our founder demanded on day one. Today, 200+ professionals strong and 500+ projects later — we are the benchmark others aspire to reach.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {["Zero compromise on materials", "On-time delivery — always", "Full cost transparency", "Sustainable by design"].map(v => (
                <div key={v} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-primary shrink-0" />
                  <span className="text-secondary/70 font-semibold text-sm">{v}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-6 pt-6 border-t border-neutral/20">
              {[["500+", "Projects"], ["₹800 Cr", "Value"], ["98%", "Satisfaction"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-4xl font-black text-primary">{v}</div>
                  <div className="text-xs font-bold text-secondary/40 uppercase tracking-wider mt-1">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ 3. MISSION & VISION ═════════════════════════════════════════════════ */}
      <section className="relative py-32 px-6 md:px-14 overflow-hidden bg-secondary">
        <Image src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
          fill className="object-cover opacity-10" alt="" />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div className="text-center mb-16" {...FV}>
            <span className="inline-flex items-center gap-2 text-primary text-xs font-black uppercase tracking-[0.25em] mb-4">
              <span className="w-8 h-px bg-primary" /> Our Purpose <span className="w-8 h-px bg-primary" />
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-white">Mission & <span className="text-primary">Vision</span></h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {[
              {
                icon: Target,
                title: "Our Mission",
                text: "To deliver sustainable, structurally sound, and aesthetically superior spaces — with complete transparency in cost, timeline, and quality — that elevate the everyday experience of every family and enterprise we serve.",
                points: ["Zero compromise on material quality", "On-time project completion, every time", "Full transparency — cost, timeline, quality"],
                pointIcon: CheckCircle,
                color: "text-primary",
                side: -30,
              },
              {
                icon: Flag,
                title: "Our Vision",
                text: "To be India's most trusted, award-winning, and technologically advanced construction company by 2030 — pioneering green building, smart-home integration, and community-first development in every city we operate.",
                points: ["Pan-India operations by 2027", "100% green-certified projects by 2030", "Tech-integrated smart construction"],
                pointIcon: Star,
                color: "text-amber-400",
                side: 30,
              },
            ].map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, x: item.side }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.7 }}
                className="bg-white/5 border border-white/10 rounded-[32px] p-10 hover:bg-white/8 transition-all group"
              >
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4">{item.title}</h3>
                <p className="text-white/60 text-lg leading-relaxed mb-7">{item.text}</p>
                <ul className="space-y-3">
                  {item.points.map(pt => (
                    <li key={pt} className="flex items-center gap-3 text-white/80 font-semibold text-sm">
                      <item.pointIcon size={16} className={`${item.color} shrink-0 fill-current`} /> {pt}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Founder quote */}
          <motion.div className="text-center"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <Quote className="text-primary/30 w-14 h-14 mx-auto mb-4" />
            <p className="text-2xl md:text-4xl font-black text-white/70 max-w-3xl mx-auto italic leading-relaxed">
              "We don't build structures. We build the places where life's most important moments happen."
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="h-px w-12 bg-primary" />
              <span className="text-primary font-black text-sm uppercase tracking-widest">Jagdish Kumar, Founder</span>
              <div className="h-px w-12 bg-primary" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ 4. TEAM ════════════════════════════════════════════════════════════ */}
      {/* MD3 Surface Container — intentionally different from white "Our Story" section */}
      <section className="py-32 overflow-hidden" style={{ background: "linear-gradient(135deg, #EEF4FB 0%, #E8F0F8 100%)" }}>
        <div className="container mx-auto max-w-7xl px-6 md:px-14">

          {/* MD3 Section Header */}
          <motion.div className="text-center mb-20" {...FV}>
            <span className="inline-flex items-center gap-2 text-primary text-xs font-black uppercase tracking-[0.25em] mb-5">
              <span className="w-8 h-px bg-primary" /> The People Behind The Vision <span className="w-8 h-px bg-primary" />
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-secondary leading-tight">
              Meet Our <span className="text-primary">Core Team</span>
            </h2>
            <p className="text-secondary/50 mt-4 max-w-lg mx-auto text-lg font-medium">
              Engineers, architects, and visionaries united by one unwavering standard.
            </p>
          </motion.div>

          {/* MD3 Card Grid */}
          {loadingTeam ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-neutral/10 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
                className="group cursor-pointer"
              >
                {/* MD3 Elevated Card */}
                <div className="relative rounded-[28px] overflow-hidden bg-white shadow-md group-hover:shadow-2xl group-hover:shadow-secondary/15 transition-shadow duration-500 flex flex-col">

                  {/* ── Photo Area (top 55% of card) ── */}
                  <div className="relative overflow-hidden" style={{ height: 240 }}>
                    <Image
                      src={m.image}
                      fill
                      className="object-cover object-top scale-[1.05] group-hover:scale-100 transition-transform duration-700 ease-out"
                      alt={m.name}
                    />
                    {/* Clean bottom shadow — no harsh white line */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10" />
                    {/* Bottom separator shadow (instead of gradient-to-white) */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 shadow-[inset_0_-8px_12px_rgba(255,255,255,0.9)]" />

                    {/* MD3 Number chip — top left */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-secondary/70 backdrop-blur-md text-white/60 text-[9px] font-black px-2.5 py-1 rounded-full">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* MD3 Experience Filled Tonal Chip — top right — consistent dark glass style */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-secondary/60 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider border border-white/10">
                        {m.exp}
                      </span>
                    </div>
                  </div>

                  {/* ── MD3 Card Content ── */}
                  <div className="px-6 pt-3 pb-6 flex flex-col flex-1">
                    {/* Role — MD3 Label/Caption */}
                    <p className="text-primary text-[9px] font-black uppercase tracking-[0.28em] mb-1">
                      {m.role}
                    </p>
                    {/* Name — MD3 Headline */}
                    <h3 className="text-[1.35rem] font-black text-secondary leading-snug mb-4">
                      {m.name}
                    </h3>

                    {/* Divider */}
                    <div className="h-px bg-neutral/30 mb-4" />

                    {/* MD3 Quote — collapsed by default, expand on hover using CSS grid */}
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out">
                      <div className="overflow-hidden">
                        <p className="text-secondary/55 text-xs leading-relaxed italic flex items-start gap-1.5 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400 delay-100">
                          <Quote size={11} className="text-primary/60 shrink-0 mt-0.5" />
                          {m.quote}
                        </p>
                      </div>
                    </div>

                    {/* MD3 Bottom Row — always visible */}
                    <div className="mt-auto flex items-center justify-between pt-1">
                      {/* Tonal filled chip */}
                      <span className="bg-neutral/20 text-secondary/50 text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full">
                        {m.exp} Exp.
                      </span>
                      {/* MD3 Icon Button - circular */}
                      <div className="w-8 h-8 rounded-full bg-primary/10 group-hover:bg-primary flex items-center justify-center transition-colors duration-400 shadow-sm group-hover:shadow-md group-hover:shadow-primary/30">
                        <ArrowRight size={13} className="text-primary group-hover:text-white transition-colors duration-400" />
                      </div>
                    </div>
                  </div>

                  {/* MD3 State Layer — ripple-style hover overlay */}
                  <div className="absolute inset-0 rounded-[28px] bg-primary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </div>
          )}

        </div>
      </section>

      {/* ══ 5. TIMELINE ════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-14 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div className="text-center mb-20" {...FV}>
            <span className="inline-flex items-center gap-2 text-primary text-xs font-black uppercase tracking-[0.25em] mb-4">
              <span className="w-8 h-px bg-primary" /> Milestones <span className="w-8 h-px bg-primary" />
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-secondary">Our <span className="text-primary">Journey</span></h2>
            <p className="text-secondary/60 mt-4 text-lg font-medium max-w-xl mx-auto">
              Every milestone earned through discipline, dedication, and a refusal to settle.
            </p>
          </motion.div>

          <div className="relative">
            {/* Spine */}
            <div className="absolute left-1/2 -translate-x-px top-4 bottom-4 w-[2px] bg-gradient-to-b from-primary/0 via-neutral/40 to-primary/0 hidden md:block" />

            <div className="space-y-12">
              {TIMELINE.map((item, i) => (
                <motion.div key={item.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.65 }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className="bg-white border-2 border-neutral/20 rounded-[24px] p-8 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group">
                      <p className="text-primary font-black text-base mb-2 uppercase tracking-wide group-hover:text-primary/80 transition-colors">{item.event}</p>
                      <p className="text-secondary/60 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>

                  {/* Year bubble */}
                  <div className="relative z-10 shrink-0 flex flex-col items-center gap-2">
                    <div className={`w-24 h-24 rounded-full ${item.dot} flex items-center justify-center shadow-2xl ring-4 ring-white`}>
                      <span className="text-white font-black text-base">{item.year}</span>
                    </div>
                  </div>

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 6. CERTIFICATIONS ══════════════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-14 bg-neutral/10">
        <div className="container mx-auto max-w-6xl">
          <motion.div className="text-center mb-16" {...FV}>
            <span className="inline-flex items-center gap-2 text-primary text-xs font-black uppercase tracking-[0.25em] mb-4">
              <span className="w-8 h-px bg-primary" /> Credentials
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-secondary">
              Certified. <span className="text-primary">Trusted.</span> Proven.
            </h2>
            <p className="text-secondary/60 text-lg max-w-xl mx-auto mt-4 font-medium">
              Accredited by the industry's most rigorous and respected standards bodies.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {CERTS.map((cert, i) => (
              <motion.div key={cert.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                className="bg-white border-2 border-neutral/20 rounded-[24px] p-8 flex items-center gap-5 hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="text-5xl">{cert.icon}</div>
                <div>
                  <h3 className="text-xl font-black text-secondary">{cert.title}</h3>
                  <p className="text-secondary/60 text-sm font-semibold mt-1">{cert.body}</p>
                </div>
                <Award size={22} className="ml-auto text-neutral/30 group-hover:text-primary transition-colors shrink-0" />
              </motion.div>
            ))}
          </div>

          {/* CTA strip */}
          <motion.div
            className="bg-secondary rounded-[32px] p-10 md:p-14 text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h3 className="text-4xl md:text-5xl font-black text-white mb-4">
                Ready to <span className="text-primary">Start Building?</span>
              </h3>
              <p className="text-white/60 text-lg font-medium mb-8 max-w-xl mx-auto">
                Work with Gurugram's most certified and trusted construction team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/estimator"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-black px-10 py-4 rounded-full hover:bg-primary/90 shadow-2xl shadow-primary/40 group transition-all">
                  Get Free Estimate <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/contact"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-bold px-10 py-4 rounded-full hover:bg-white/10 transition-all">
                  Talk to an Expert
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
