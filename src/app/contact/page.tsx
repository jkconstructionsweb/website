"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import {
  MapPin, Phone, Mail, MessageCircle,
  Clock, CheckCircle, User, Send,
  ArrowRight, Building2
} from "lucide-react";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "@/components/ui/SocialIcons";

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: "Corporate Headquarters",
    color: "bg-blue-50 text-blue-600",
    lines: ["123 Premium Tower, Floor 4", "Cyber City, Sector 24", "Gurugram, Haryana — 122 002"],
  },
  {
    icon: Phone,
    label: "Phone Numbers",
    color: "bg-primary/10 text-primary",
    lines: ["+91 98765 43210 (Sales)", "+91 124 555 0000 (Office)"],
  },
  {
    icon: Mail,
    label: "Email Address",
    color: "bg-purple-50 text-purple-600",
    lines: ["info@jkconstructions.com", "projects@jkconstructions.com"],
  },
  {
    icon: Clock,
    label: "Business Hours",
    color: "bg-amber-50 text-amber-600",
    lines: ["Mon – Sat: 9:00 AM – 7:00 PM", "Sunday: By Appointment Only"],
  },
];

const SERVICES = [
  "Residential Construction",
  "Commercial Projects",
  "Premium Interiors",
  "Renovation & Remodelling",
  "Cost Consultation",
  "Other",
];

export default function ContactPage() {
  const [data, setData]       = useState<any>(null);
  const [contactLoading, setContactLoading] = useState(true);
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    fetch("/api/contact")
      .then(r => r.json())
      .then(d => {
        setData(d);
        setContactLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Construct prefilled message format
    const adminWhatsApp = data?.whatsapp?.replace(/\D/g, '') || "919971237817";
    const cleanMsg = `*New Website Inquiry!*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Email:* ${email || "N/A"}\n*Service:* ${service || "General"}\n*Message:* ${message}`;
    const waURL = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(cleanMsg)}`;

    // Background Email Process using FormSubmit Api (Secure Hash instead of naked email)
    const targetEmail = "725760f1142c8bea7f4e25c2a94c15db";

    try {
      // 1. Send Email silently in background (using FormSubmit API)
      await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: `New Construction Inquiry from ${name}`,
          Name: name,
          Phone: phone,
          Email: email || "Not Provided",
          Service: service || "General",
          Message: message
        }),
      });

      // 2. Save to Mock DB (Optional functionality)
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, service, source: "Contact" }),
      });

      if (res.ok) {
        setSuccess(true);
        // Automatically attempt to redirect to WhatsApp
        window.open(waURL, "_blank");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (contactLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const CONTACT_GRID = [
    {
      icon: MapPin,
      label: "Corporate Headquarters",
      color: "bg-blue-50 text-blue-600",
      lines: [data.address],
    },
    {
      icon: Phone,
      label: "Phone Numbers",
      color: "bg-primary/10 text-primary",
      lines: [data.phone, data.alternatePhone].filter(Boolean),
    },
    {
      icon: Mail,
      label: "Email Address",
      color: "bg-purple-50 text-purple-600",
      lines: [data.email, data.alternateEmail].filter(Boolean),
    },
    {
      icon: Clock,
      label: "Business Hours",
      color: "bg-amber-50 text-amber-600",
      lines: data.businessHours || [],
    },
  ];

  return (
    <main className="min-h-screen bg-background flex flex-col">

      {/* ── HERO ── */}
      <section className="relative h-[55vh] min-h-[400px] w-full flex items-end overflow-hidden pt-16">
        <Image
          src="https://images.unsplash.com/photo-1577415124269-fc1140a69e91?auto=format&fit=crop&w=1920&q=80"
          fill className="object-cover object-center" alt="Contact Us" priority unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/65 to-transparent" />
        <div className="container relative z-10 px-4 md:px-6 pb-14 mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-primary" />
              <span className="text-white/60 uppercase tracking-[0.2em] font-bold text-xs">Get In Touch</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white">
              Let's Build <span className="text-primary">Together</span>
            </h1>
            <p className="text-white/60 text-lg mt-3 max-w-xl font-medium">
              Have a project in mind? We would love to hear from you. Reach out and we'll respond within 2 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT GRID ── */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-10 md:gap-14 mb-20">

            {/* LEFT: Info + WhatsApp */}
            <motion.div
              className="space-y-8 lg:col-span-7"
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-secondary mb-3">Contact Information</h2>
                <p className="text-secondary/60 text-lg font-medium leading-relaxed">
                  Whether you're planning a home, commercial space, or premium interior — our team of experts is ready to guide you every step of the way.
                </p>
              </div>

              {/* Info cards */}
              <div className="grid sm:grid-cols-2 gap-5">
                {CONTACT_GRID.map(({ icon: Icon, label, color, lines }: any) => (
                  <div key={label} className="bg-white rounded-[24px] p-6 border border-neutral/20 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4`}>
                      <Icon size={22} />
                    </div>
                    <h4 className="font-black text-secondary mb-2 text-sm uppercase tracking-wider">{label}</h4>
                    {lines.map((line: string) => (
                      <p key={line} className="text-secondary/70 text-sm font-semibold leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <motion.div
                className="relative overflow-hidden bg-green-600 rounded-[28px] p-8 text-white shadow-2xl shadow-green-600/30"
                whileHover={{ scale: 1.01 }}
              >
                <div className="absolute -right-8 -top-8 w-40 h-40 bg-green-500/30 rounded-full" />
                <div className="absolute -right-4 bottom-0 w-24 h-24 bg-green-700/30 rounded-full" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                      <MessageCircle size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black">WhatsApp Us</h3>
                      <p className="text-green-100 text-sm font-medium">Instant response guaranteed</p>
                    </div>
                  </div>
                  <p className="text-green-100 text-base mb-6 font-medium leading-relaxed">
                    Skip the wait. Chat directly with our construction experts on WhatsApp. We typically reply within <strong className="text-white">5 minutes</strong> during business hours.
                  </p>
                  <div className="flex items-center gap-4">
                    <Link
                      href={`https://wa.me/${data.whatsapp?.replace(/\D/g, '')}?text=Hi!%20I'm%20interested%20in%20your%20construction%20services.%20Please%20get%20in%20touch.`}
                      target="_blank"
                      className="flex-1 h-14 bg-white text-green-600 flex items-center justify-center gap-2 rounded-2xl font-black text-base hover:bg-green-50 transition-colors shadow-lg text-center"
                    >
                      <MessageCircle size={20} /> Start WhatsApp Chat
                    </Link>
                    <Link
                      href={`tel:${data.phone}`}
                      className="w-14 h-14 bg-white/20 border border-white/30 flex items-center justify-center rounded-2xl hover:bg-white/30 transition-colors text-white"
                    >
                      <Phone size={22} />
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Social Networks */}
              {data?.socials && (
                <motion.div
                  className="bg-white rounded-[28px] p-8 border border-neutral/20 shadow-sm"
                  whileHover={{ scale: 1.01 }}
                >
                  <h3 className="text-2xl font-black text-secondary mb-5">Connect With Us Online</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    {data.socials.facebook && (
                      <a href={data.socials.facebook} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-blue-50 text-blue-600 flex items-center justify-center rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100 hover:scale-105" title="Facebook">
                        <Facebook size={22} />
                      </a>
                    )}
                    {data.socials.instagram && (
                      <a href={data.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-pink-50 text-pink-600 flex items-center justify-center rounded-2xl hover:bg-pink-600 hover:text-white transition-all shadow-sm border border-pink-100 hover:scale-105" title="Instagram">
                        <Instagram size={22} />
                      </a>
                    )}
                    {data.socials.twitter && (
                      <a href={data.socials.twitter} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-sky-50 text-sky-500 flex items-center justify-center rounded-2xl hover:bg-sky-500 hover:text-white transition-all shadow-sm border border-sky-100 hover:scale-105" title="X / Twitter">
                        <Twitter size={22} />
                      </a>
                    )}
                    {data.socials.linkedin && (
                      <a href={data.socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-blue-50 text-blue-700 flex items-center justify-center rounded-2xl hover:bg-blue-700 hover:text-white transition-all shadow-sm border border-blue-200 hover:scale-105" title="LinkedIn">
                        <Linkedin size={22} />
                      </a>
                    )}
                    {data.socials.youtube && (
                      <a href={data.socials.youtube} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-red-50 text-red-600 flex items-center justify-center rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100 hover:scale-105" title="YouTube">
                        <Youtube size={22} />
                      </a>
                    )}
                    {data.socials.pinterest && (
                      <a href={data.socials.pinterest} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-red-50 flex items-center justify-center rounded-2xl hover:bg-red-100 transition-all shadow-sm border border-red-200 hover:scale-105" title="Pinterest">
                        <img src="/pinterest.png" alt="Pinterest" className="w-7 h-7 object-contain" />
                      </a>
                    )}
                    {data.socials.justdial && (
                      <a href={data.socials.justdial} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-orange-50 flex items-center justify-center rounded-2xl hover:bg-orange-100 transition-all shadow-sm border border-orange-200 hover:scale-105" title="Justdial">
                        <img src="/justdial.png" alt="Justdial" className="w-7 h-7 object-contain" />
                      </a>
                    )}
                    {data.socials.indiamart && (
                      <a href={data.socials.indiamart} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-indigo-50 flex items-center justify-center rounded-2xl hover:bg-indigo-100 transition-all shadow-sm border border-indigo-200 hover:scale-105" title="IndiaMART">
                        <img src="/indiamart.png" alt="IndiaMART" className="w-7 h-7 object-contain mix-blend-multiply" />
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* RIGHT: Form */}
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
            >
              <div className="bg-white rounded-[32px] shadow-2xl border border-neutral/20 overflow-hidden">
                {/* Form header */}
                <div className="bg-secondary px-8 py-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                      <Building2 size={22} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">Send Us a Message</h2>
                      <p className="text-white/50 text-sm font-medium">We'll respond within 2 business hours</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 md:p-10">
                  {success ? (
                    <motion.div
                      className="text-center py-8"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                        <CheckCircle className="text-green-500 w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-black text-secondary mb-2">Message Sent! 🎉</h3>
                      <p className="text-secondary/60 text-sm font-medium leading-relaxed mb-6">
                        Thank you, <strong>{name}</strong>! We've captured your inquiry.
                      </p>

                      {/* FAST TRACK COMMUNICATION BUTTONS */}
                      <div className="bg-neutral/5 rounded-2xl p-6 border border-neutral/10 mb-6">
                        <p className="text-xs font-black uppercase text-secondary/50 tracking-wider mb-4">Fast-Track Your Response</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Link 
                            href={`https://wa.me/${data?.whatsapp?.replace(/\D/g, '') || "919971237817"}?text=${encodeURIComponent(`*New Website Inquiry!*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Service:* ${service || "General"}\n*Message:* ${message}`)}`} 
                            target="_blank"
                            className="bg-[#25D366] text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all shadow-lg shadow-green-500/20"
                          >
                            <MessageCircle size={18} /> Send via WhatsApp
                          </Link>
                          <Link 
                            href={`sms:${data?.phone?.replace(/\D/g, '') || "+919971237817"}?body=${encodeURIComponent(`Website Inquiry:\nName: ${name}\Phone: ${phone}\nService: ${service || "General"}\nMessage: ${message}`)}`}
                            className="bg-secondary text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/10"
                          >
                            <Phone size={18} /> Send via SMS
                          </Link>
                        </div>
                        <p className="text-[11px] text-secondary/40 mt-4 leading-relaxed">
                          If WhatsApp didn't open automatically, click the button above to safely send your details directly to our team!
                        </p>
                      </div>

                      <button
                        onClick={() => { setSuccess(false); setName(""); setEmail(""); setPhone(""); setService(""); setMessage(""); }}
                        className="text-primary font-bold text-sm underline hover:no-underline"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Name + Phone */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
                          <input required value={name} onChange={e => setName(e.target.value)}
                            placeholder="Full Name"
                            className="w-full h-13 py-4 pl-11 pr-4 rounded-2xl border-2 border-neutral/40 focus:border-primary focus:outline-none font-semibold text-secondary bg-neutral/10 transition-colors text-sm" />
                        </div>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
                          <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full h-13 py-4 pl-11 pr-4 rounded-2xl border-2 border-neutral/40 focus:border-primary focus:outline-none font-semibold text-secondary bg-neutral/10 transition-colors text-sm" />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                          placeholder="Email Address"
                          className="w-full h-13 py-4 pl-11 pr-4 rounded-2xl border-2 border-neutral/40 focus:border-primary focus:outline-none font-semibold text-secondary bg-neutral/10 transition-colors text-sm" />
                      </div>

                      {/* Service Interest */}
                      <div>
                        <label className="block text-xs font-bold text-secondary/60 uppercase tracking-wider mb-2">I'm Interested In</label>
                        <div className="flex flex-wrap gap-2">
                          {SERVICES.map(s => (
                            <button key={s} type="button" onClick={() => setService(s)}
                              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${service === s ? "bg-primary text-white border-primary shadow-md" : "border-neutral/40 text-secondary/60 hover:border-primary/50 hover:text-primary"}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={4}
                          placeholder="Tell us about your project — location, size, timeline, and any specific requirements…"
                          className="w-full px-4 py-4 rounded-2xl border-2 border-neutral/40 focus:border-primary focus:outline-none font-semibold text-secondary bg-neutral/10 transition-colors text-sm resize-none" />
                      </div>

                      <p className="text-xs text-secondary/40 font-medium">
                        🔒 Your information is 100% private and never shared with third parties.
                      </p>

                      <Button type="submit" variant="filled" className="w-full h-14 text-base font-bold shadow-xl" disabled={loading}>
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            Sending…
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Send Message <Send size={18} />
                          </span>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── GOOGLE MAP ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="text-primary" size={24} />
              <h2 className="text-2xl font-black text-secondary">Find Us on the Map</h2>
            </div>
            <div className="w-full h-[480px] rounded-[32px] overflow-hidden shadow-2xl border border-neutral/20 relative z-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112173.23863486339!2d76.953179!3d28.5272803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19d582e38859%3A0x2cf5fe8e5c64b1e!2sGurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1689255673623!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="JK Constructions Location — Gurugram"
              />
            </div>

            {/* Get Directions CTA below map */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-white rounded-[24px] p-6 border border-neutral/20 shadow-sm gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="text-primary" size={22} />
                </div>
                <div>
                  <h4 className="font-black text-secondary text-sm">JK Constructions HQ</h4>
                  <p className="text-secondary/60 text-sm font-medium">{data.address}</p>
                </div>
              </div>
              <Link
                href={data.mapLink || "#"}
                target="_blank"
                className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-primary transition-colors shrink-0"
              >
                Get Directions <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FLOATING WHATSAPP BUTTON ── */}
      <Link
        href={`https://wa.me/${data.whatsapp?.replace(/\D/g, '')}?text=Hi!%20I'm%20interested%20in%20your%20construction%20services.`}
        target="_blank"
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-green-500 text-white px-5 py-4 rounded-full shadow-2xl shadow-green-500/40 hover:bg-green-600 hover:scale-105 transition-all font-bold text-sm group"
      >
        <MessageCircle size={24} className="shrink-0" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          Chat on WhatsApp
        </span>
      </Link>

      <Footer />
    </main>
  );
}
