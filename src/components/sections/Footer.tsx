"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { Home, Phone, Mail, MapPin } from 'lucide-react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Whatsapp, Pinterest, Justdial, Indiamart } from '@/components/ui/SocialIcons';

export default function Footer() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/contact")
      .then(r => r.json())
      .then(d => setData(d))
      .catch(e => console.error("Footer contact fetch error:", e));
  }, []);

  const renderIcon = (platform: string) => {
    const p = platform.toLowerCase().trim();
    if (p.includes('facebook')) return <Facebook size={20} />;
    if (p.includes('instagram')) return <Instagram size={20} />;
    if (p.includes('twitter') || p === 'x') return <Twitter size={20} />;
    if (p.includes('linkedin')) return <Linkedin size={20} />;
    if (p.includes('youtube')) return <Youtube size={20} />;
    if (p.includes('pinterest')) return <Pinterest size={20} />;
    if (p.includes('justdial')) return <Justdial size={20} />;
    if (p.includes('indiamart')) return <Indiamart size={20} />;
    if (p.includes('whatsapp') || p === 'wha') return <Whatsapp size={20} />;
    // default custom icon
    return <span className="font-bold text-[10px] uppercase bg-white/10 px-2 py-1 rounded border border-white/20">{platform.slice(0, 3)}</span>;
  };

  let links = data?.socialLinks || [];
  if (links.length === 0 && data?.socials) {
    links = Object.entries(data.socials)
      .filter(([k, v]) => v)
      .map(([k, v]) => ({ platform: k, url: v as string }));
  }

  return (
    <footer className="bg-secondary text-white pt-20 pb-10">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="space-y-4 lg:col-span-4">
            <Link href="/" className="-ml-2 md:-ml-6 inline-block mb-12 relative h-14 w-64 md:w-72 shrink-0">
              <img 
                src="/Logo.png" 
                alt="JK Constructions Logo" 
                className="absolute top-1/2 left-0 -translate-y-1/2 h-36 md:h-40 w-auto max-w-none object-contain pointer-events-none grayscale invert contrast-200 mix-blend-screen opacity-[0.85]"
              />
            </Link>
            <p className="text-white/70 leading-relaxed pr-4">
              Leading the industry in premium construction, commercial development, and bespoke interior solutions since 2010.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="lg:col-span-2 lg:mx-auto">
            <div className="w-fit">
              <h4 className="text-lg font-semibold mb-6 border-b border-white/10 pb-2 whitespace-nowrap inline-block">Quick Navigation</h4>
              <ul className="space-y-3 text-white/70 font-medium">
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">Company Story</Link></li>
                <li><Link href="/projects" className="hover:text-primary transition-colors">Our Projects Masterpieces</Link></li>
                <li><Link href="/estimator" className="hover:text-primary transition-colors hover:underline">Instant Cost Estimator</Link></li>
              </ul>
            </div>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2 lg:mx-auto">
            <div className="w-fit">
               <h4 className="text-lg font-semibold mb-6 border-b border-white/10 pb-2 whitespace-nowrap inline-block">Resources</h4>
              <ul className="space-y-3 text-white/70 font-medium">
                <li><Link href="/blog" className="hover:text-primary transition-colors">Construction Blog</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Backoffice</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact Col */}
          <div className="lg:col-span-4 lg:ml-auto">
            <div className="w-fit">
              <h4 className="text-lg font-semibold mb-6 border-b border-white/10 pb-2 whitespace-nowrap inline-block">Reach Out</h4>
              <ul className="space-y-4 text-white/70">
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-primary shrink-0"/> 
                  {data?.phone || "+91 98765 43210"}
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={18} className="text-primary shrink-0 mt-0.5"/> 
                  <span className="text-sm sm:text-base">{data?.email || "info@jkconstructions.com"}</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-primary mt-1 shrink-0"/> 
                  <span className="text-sm">
                    {data?.address || "123 Premium Building Floor, Cyber City, Gurugram, Haryana, India"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Copyright Bar */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-white/40 text-sm gap-4">
          <p>&copy; {new Date().getFullYear()} JK Constructions. Designed by <a href="https://webseospecialist.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline decoration-primary/50 underline-offset-4 font-semibold text-white/70">webseospecialist.com</a></p>
          
          {links.length > 0 && (
            <div className="flex items-center gap-4 flex-wrap my-4 md:my-0">
              {links.map((link: any, i: number) => {
                if (!link.url) return null;
                const href = link.url.startsWith('http') ? link.url : `https://${link.url}`;
                return (
                  <a key={i} href={href} target="_blank" rel="noopener noreferrer" 
                     className="hover:text-primary transition-colors flex items-center justify-center min-w-[20px] text-white/60 hover:opacity-100" 
                     title={link.platform}>
                    {renderIcon(link.platform)}
                  </a>
                )
              })}
            </div>
          )}

          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
