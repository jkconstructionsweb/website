"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Footer from "@/components/sections/Footer";
import Link from "next/link";
import Image from "next/image";
import {
  Calculator, Home, Building2, Sparkles, CheckCircle,
  ChevronRight, Phone, User, Layers, Maximize, IndianRupee,
  ArrowRight, Star, Shield, Clock, Mail
} from "lucide-react";

// ── RATE CARD ─────────────────────────────────────────────────────────────────
const MATERIAL_TIERS = {
  Basic: {
    rate: 1500,
    color: "from-slate-500 to-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-300",
    badge: "bg-slate-100 text-slate-700",
    label: "Essential",
    perks: ["RCC Structure", "Standard Bricks", "Basic Flooring", "Standard Fittings"],
  },
  Standard: {
    rate: 2200,
    color: "from-blue-500 to-primary",
    bg: "bg-blue-50",
    border: "border-primary",
    badge: "bg-primary/10 text-primary",
    label: "Most Popular",
    perks: ["Superior RCC", "AAC Blocks", "Vitrified Tiles", "Premium Fittings"],
  },
  Premium: {
    rate: 3200,
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-400",
    badge: "bg-amber-100 text-amber-700",
    label: "Luxury",
    perks: ["Steel Structure", "Italian Marble", "Smart Home Ready", "Designer Fittings"],
  },
};

type Material = keyof typeof MATERIAL_TIERS;

const FORMAT = (v: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

// ── STEP INDICATOR ─────────────────────────────────────────────────────────────
function StepDot({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-base transition-all duration-300 shadow-md
      ${done ? "bg-green-500 text-white" : active ? "bg-primary text-white scale-110 shadow-primary/30" : "bg-neutral/30 text-secondary/40"}`}>
      {done ? <CheckCircle size={20} /> : n}
    </div>
  );
}

export default function EstimatorPage() {
  // Wizard state
  const [step, setStep] = useState(1);

  // Step 1 inputs
  const [plotSize, setPlotSize] = useState("");
  const [floors, setFloors] = useState("1");
  const [projectType, setProjectType] = useState<"Residential" | "Commercial" | "Interior">("Residential");

  // Step 2
  const [material, setMaterial] = useState<Material>("Standard");

  // Step 3 (lead capture)
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Output
  const [estimate, setEstimate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Real-time calculation ──────────────────────────────────────────────────
  useEffect(() => {
    const size = parseFloat(plotSize) || 0;
    const flrs = parseInt(floors) || 1;
    const rate = MATERIAL_TIERS[material].rate;
    setEstimate(size * flrs * rate);
  }, [plotSize, floors, material]);

  // ── Submit to DB & Email ──────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const targetEmail = "725760f1142c8bea7f4e25c2a94c15db"; // Secured Hash for jkconstructionsweb@gmail.com
    const waMessage = `*New Cost Estimate Request!*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Email:* ${email}\n*Type:* ${projectType}\n*Size:* ${plotSize} sq.ft\n*Floors:* ${floors}\n*Material:* ${material}\n*Estimated Cost:* ${FORMAT(estimate)}`;
    const waURL = `https://wa.me/919971237817?text=${encodeURIComponent(waMessage)}`;

    try {
      // 1. Send Email silently in background (using FormSubmit API)
      await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: `New Cost Estimate Request from ${name}`,
          Name: name,
          Phone: phone,
          Email: email,
          "Project Type": projectType,
          "Plot Size": `${plotSize} sq.ft`,
          Floors: floors,
          "Material Quality": material,
          "Estimated Cost": FORMAT(estimate)
        }),
      });

      // 2. Save Lead
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone, email,
          source: "Estimator",
          plotSize,
          floors: parseInt(floors),
          projectType,
          materialType: material,
          estimatedCost: FORMAT(estimate),
        }),
      });

      setSubmitted(true);
      window.open(waURL, "_blank");
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const canProceedStep1 = parseFloat(plotSize) > 0 && parseInt(floors) > 0;

  return (
    <main className="min-h-screen bg-background flex flex-col">

      {/* ── PAGE HERO ── */}
      <section className="relative pt-16 overflow-hidden bg-secondary">
        <Image
          src="https://images.unsplash.com/photo-1541888086925-920a0f4438f7?auto=format&fit=crop&w=1920&q=80"
          fill sizes="100vw" className="object-cover opacity-20" alt="Estimator" priority
        />
        <div className="container relative z-10 mx-auto px-4 md:px-6 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-5 py-2 rounded-full text-sm font-bold mb-6 backdrop-blur-sm">
              <Calculator size={16} /> Free Instant Estimate
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">Construction Cost <span className="text-primary">Estimator</span></h1>
            <p className="text-white/60 text-xl max-w-2xl mx-auto font-medium">
              Get an accurate, real-time construction cost estimate in under 60 seconds — completely free.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── WIZARD ── */}
      <section className="py-20 px-4 md:px-6 flex-1">
        <div className="container mx-auto max-w-5xl">

          {!submitted ? (
            <>
              {/* Step Indicators */}
              <div className="flex items-center justify-center gap-4 mb-16">
                {[1, 2, 3].map((n) => (
                  <React.Fragment key={n}>
                    <StepDot n={n} active={step === n} done={step > n} />
                    {n < 3 && (
                      <div className={`flex-1 max-w-[80px] h-[2px] transition-colors duration-500 ${step > n ? "bg-green-400" : "bg-neutral/40"}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="grid lg:grid-cols-5 gap-10 items-start">

                {/* ── LEFT: Wizard Form ── */}
                <div className="lg:col-span-3">
                  <AnimatePresence mode="wait">

                    {/* STEP 1 */}
                    {step === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4 }}>
                        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-xl border border-neutral/20">
                          <h2 className="text-2xl font-black text-secondary mb-2">Project Specifications</h2>
                          <p className="text-secondary/50 text-sm mb-8 font-medium">Tell us about your project to calculate an accurate estimate.</p>

                          {/* Project Type */}
                          <div className="mb-8">
                            <label className="block text-sm font-bold text-secondary/70 mb-3 uppercase tracking-wider">Project Type</label>
                            <div className="grid grid-cols-3 gap-3">
                              {([
                                { v: "Residential", icon: Home, label: "Residential" },
                                { v: "Commercial", icon: Building2, label: "Commercial" },
                                { v: "Interior", icon: Sparkles, label: "Interior" },
                              ] as const).map(({ v, icon: Icon, label }) => (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => setProjectType(v)}
                                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-sm font-bold transition-all duration-200
                                    ${projectType === v ? "bg-primary/10 border-primary text-primary scale-105 shadow-md shadow-primary/10" : "border-neutral/40 text-secondary/60 hover:border-primary/30 hover:bg-neutral/20"}`}
                                >
                                  <Icon size={24} />
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Plot Size */}
                          <div className="mb-6">
                            <label className="block text-sm font-bold text-secondary/70 mb-3 uppercase tracking-wider">Plot Size (Square Feet)</label>
                            <div className="relative">
                              <Maximize className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={20} />
                              <input
                                type="number"
                                value={plotSize}
                                onChange={e => setPlotSize(e.target.value)}
                                placeholder="e.g. 1200"
                                min="1"
                                className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-neutral/40 focus:border-primary focus:outline-none text-secondary font-bold text-lg bg-neutral/10 transition-colors"
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/40 text-sm font-semibold">sq.ft</span>
                            </div>
                            {/* Quick size buttons */}
                            <div className="flex gap-2 mt-3 flex-wrap">
                              {["500", "800", "1000", "1500", "2000", "3000"].map(s => (
                                <button key={s} type="button" onClick={() => setPlotSize(s)}
                                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${plotSize === s ? "bg-primary text-white" : "bg-neutral/30 text-secondary hover:bg-primary/10 hover:text-primary"}`}>
                                  {s} sq.ft
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Floors */}
                          <div className="mb-8">
                            <label className="block text-sm font-bold text-secondary/70 mb-3 uppercase tracking-wider">Number of Floors</label>
                            <div className="flex items-center gap-4">
                              <button type="button" onClick={() => setFloors(f => String(Math.max(1, parseInt(f) - 1)))}
                                className="w-12 h-12 rounded-full border-2 border-neutral/40 text-secondary hover:border-primary hover:text-primary font-black text-2xl flex items-center justify-center transition-all">
                                −
                              </button>
                              <div className="relative flex-1">
                                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={20} />
                                <input type="number" value={floors} onChange={e => setFloors(e.target.value)} min="1" max="20"
                                  className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-neutral/40 focus:border-primary focus:outline-none text-secondary font-black text-xl text-center bg-neutral/10 transition-colors" />
                              </div>
                              <button type="button" onClick={() => setFloors(f => String(Math.min(20, parseInt(f) + 1)))}
                                className="w-12 h-12 rounded-full border-2 border-neutral/40 text-secondary hover:border-primary hover:text-primary font-black text-2xl flex items-center justify-center transition-all">
                                +
                              </button>
                            </div>
                          </div>

                          <Button
                            variant="filled"
                            className="w-full h-14 text-lg font-bold shadow-xl"
                            disabled={!canProceedStep1}
                            onClick={() => setStep(2)}
                          >
                            Choose Material Quality <ChevronRight size={20} />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4 }}>
                        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-xl border border-neutral/20">
                          <h2 className="text-2xl font-black text-secondary mb-2">Choose Material Quality</h2>
                          <p className="text-secondary/50 text-sm mb-8 font-medium">Your selection directly impacts the final cost and finish quality.</p>

                          <div className="space-y-4">
                            {(Object.entries(MATERIAL_TIERS) as [Material, typeof MATERIAL_TIERS.Basic][]).map(([tier, config]) => (
                              <button
                                key={tier}
                                type="button"
                                onClick={() => setMaterial(tier)}
                                className={`w-full text-left p-6 rounded-[24px] border-2 transition-all duration-200 hover:shadow-md
                                  ${material === tier ? `${config.bg} ${config.border} shadow-lg scale-[1.01]` : "border-neutral/30 hover:border-neutral/60"}`}
                              >
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <div className="flex items-center gap-3">
                                      <span className="text-xl font-black text-secondary">{tier}</span>
                                      <span className={`text-xs font-black px-3 py-1 rounded-full ${config.badge}`}>{config.label}</span>
                                    </div>
                                    <p className="text-secondary/50 text-sm mt-1 font-semibold">₹{config.rate.toLocaleString("en-IN")} per sq.ft / floor</p>
                                  </div>
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                                    ${material === tier ? "bg-primary border-primary" : "border-neutral/40"}`}>
                                    {material === tier && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  {config.perks.map(p => (
                                    <div key={p} className="flex items-center gap-2 text-sm text-secondary/70 font-medium">
                                      <CheckCircle size={14} className="text-green-500 shrink-0" /> {p}
                                    </div>
                                  ))}
                                </div>
                              </button>
                            ))}
                          </div>

                          <div className="flex gap-3 mt-8">
                            <Button variant="outlined" className="flex-1 h-14 font-bold" onClick={() => setStep(1)}>← Back</Button>
                            <Button variant="filled" className="flex-1 h-14 font-bold shadow-xl" onClick={() => setStep(3)}>
                              Get Detailed Quote <ChevronRight size={20} />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4 }}>
                        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-xl border border-neutral/20">
                          <h2 className="text-2xl font-black text-secondary mb-2">Get Your Full Quotation</h2>
                          <p className="text-secondary/50 text-sm mb-8 font-medium">Enter your details and our expert will send you a detailed PDF report within 24 hours.</p>

                          <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={20} />
                              <input
                                required value={name} onChange={e => setName(e.target.value)}
                                placeholder="Your Full Name"
                                className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-neutral/40 focus:border-primary focus:outline-none text-secondary font-semibold bg-neutral/10 transition-colors"
                              />
                            </div>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={20} />
                              <input
                                required type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                                placeholder="+91 98765 43210"
                                className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-neutral/40 focus:border-primary focus:outline-none text-secondary font-semibold bg-neutral/10 transition-colors"
                              />
                            </div>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={20} />
                              <input
                                required
                                type="email" value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="Email Address (for PDF report)"
                                className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-neutral/40 focus:border-primary focus:outline-none text-secondary font-semibold bg-neutral/10 transition-colors"
                              />
                            </div>

                            <p className="text-xs text-secondary/40 font-medium">
                              🔒 Your information is 100% secure and never shared with third parties.
                            </p>

                            <div className="flex gap-3 pt-2">
                              <Button type="button" variant="outlined" className="flex-1 h-14 font-bold" onClick={() => setStep(2)}>← Back</Button>
                              <Button type="submit" variant="filled" className="flex-1 h-14 font-bold shadow-xl" disabled={loading || estimate === 0}>
                                {loading ? "Submitting…" : "Send Me the Quote"}
                                {!loading && <ArrowRight size={18} className="ml-2" />}
                              </Button>
                            </div>
                          </form>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── RIGHT: Live Estimate Card ── */}
                <div className="lg:col-span-2">
                  <motion.div
                    className="sticky top-28 space-y-5"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {/* Cost Display */}
                    <div className="bg-secondary rounded-[32px] p-8 text-white shadow-2xl">
                      <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">Live Estimate</p>
                      <motion.div
                        key={estimate}
                        initial={{ scale: 0.95, opacity: 0.7 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="text-4xl font-black text-primary mb-1"
                      >
                        {estimate > 0 ? FORMAT(estimate) : "₹ 0"}
                      </motion.div>
                      <p className="text-white/40 text-xs font-semibold">*Approximate estimate only</p>

                      <div className="mt-6 space-y-3 pt-6 border-t border-white/10">
                        {[
                          { label: "Plot Size", value: plotSize ? `${plotSize} sq.ft` : "—" },
                          { label: "Floors", value: `${floors} Floor${parseInt(floors) > 1 ? "s" : ""}` },
                          { label: "Project Type", value: projectType },
                          { label: "Material Tier", value: material },
                          { label: "Rate", value: `₹${MATERIAL_TIERS[material].rate.toLocaleString("en-IN")}/sq.ft` },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex justify-between items-center text-sm">
                            <span className="text-white/50 font-medium">{label}</span>
                            <span className="text-white font-bold">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="bg-white rounded-[24px] p-6 shadow-lg border border-neutral/20 space-y-4">
                      {[
                        { icon: Shield, text: "ISO 9001:2015 Certified Agency", color: "text-blue-500" },
                        { icon: Star, text: "500+ Projects Delivered", color: "text-amber-500" },
                        { icon: Clock, text: "Response within 2 hours", color: "text-green-500" },
                      ].map(({ icon: Icon, text, color }) => (
                        <div key={text} className="flex items-center gap-3">
                          <Icon size={20} className={`${color} shrink-0`} />
                          <span className="text-sm font-semibold text-secondary/70">{text}</span>
                        </div>
                      ))}
                    </div>

                    <Button asChild variant="tonal" className="w-full h-12 font-bold">
                      <Link href="/contact">Talk to an Expert Instead</Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </>
          ) : (
            /* ── SUCCESS STATE ── */
            <motion.div
              className="max-w-2xl mx-auto text-center bg-white rounded-[40px] p-12 md:p-16 shadow-2xl border border-neutral/20"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <CheckCircle className="text-green-500 w-12 h-12" />
              </div>
              <h2 className="text-4xl font-black text-secondary mb-4">Quote Request Sent! 🎉</h2>
              <p className="text-secondary/60 text-lg font-medium mb-4">
                Thank you, <span className="font-black text-secondary">{name}</span>! Our construction expert will review your estimate and contact you within <strong>2 hours</strong>.
              </p>

              <div className="bg-neutral/20 rounded-[24px] p-6 my-8 text-left space-y-3">
                {[
                  ["Project Type", projectType],
                  ["Plot Size", `${plotSize} sq.ft`],
                  ["Floors", `${floors} Floor${parseInt(floors) > 1 ? "s" : ""}`],
                  ["Material", material],
                  ["Your Estimate", FORMAT(estimate)],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between items-center">
                    <span className="text-secondary/50 font-semibold text-sm">{l}</span>
                    <span className="font-black text-secondary">{v}</span>
                  </div>
                ))}
              </div>

              {/* FAST TRACK COMMUNICATION BUTTONS */}
              <div className="bg-neutral/5 rounded-2xl p-6 border border-neutral/10 mb-8 mx-auto text-center max-w-sm">
                <p className="text-xs font-black uppercase text-secondary/50 tracking-wider mb-4">Fast-Track Your Response</p>
                <Link 
                  href={`https://wa.me/919971237817?text=${encodeURIComponent(`*New Cost Estimate Request!*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Email:* ${email}\n*Type:* ${projectType}\n*Size:* ${plotSize} sq.ft\n*Floors:* ${floors}\n*Material:* ${material}\n*Estimated Cost:* ${FORMAT(estimate)}`)}`} 
                  target="_blank"
                  className="bg-[#25D366] text-white w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all shadow-lg shadow-green-500/20 mb-3"
                >
                  <Phone size={18} /> Send Details via WhatsApp
                </Link>
                <p className="text-[11px] text-secondary/40 leading-relaxed">
                  If WhatsApp didn't open automatically, click the button above to safely send your details directly to our team!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="filled" className="h-14 px-8 font-bold shadow-xl" onClick={() => { setSubmitted(false); setStep(1); setPlotSize(""); setName(""); setPhone(""); setEmail(""); }}>
                  Calculate Another
                </Button>
                <Button asChild variant="outlined" className="h-14 px-8 font-bold">
                  <Link href="/projects">View Projects</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
