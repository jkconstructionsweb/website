"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { Home, Phone, Mail, MapPin } from 'lucide-react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from '@/components/ui/SocialIcons';

export default function Footer() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/contact")
      .then(r => r.json())
      .then(d => setData(d))
      .catch(e => console.error("Footer contact fetch error:", e));
  }, []);

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
          
          {data?.socials && (
            <div className="flex items-center gap-5 my-4 md:my-0">
              {data.socials.facebook && <a href={data.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" title="Facebook"><Facebook size={20} /></a>}
              {data.socials.instagram && <a href={data.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" title="Instagram"><Instagram size={20} /></a>}
              {data.socials.twitter && <a href={data.socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" title="X / Twitter"><Twitter size={20} /></a>}
              {data.socials.linkedin && <a href={data.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" title="LinkedIn"><Linkedin size={20} /></a>}
              {data.socials.youtube && <a href={data.socials.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" title="YouTube"><Youtube size={20} /></a>}
              {data.socials.pinterest && (
                <a href={data.socials.pinterest} target="_blank" rel="noopener noreferrer" className="hover:opacity-100 opacity-60 transition-opacity bg-white p-0.5 rounded-sm" title="Pinterest">
                  <img src="/pinterest.png" alt="Pinterest" className="w-[18px] h-[18px] object-contain" />
                </a>
              )}
              {data.socials.justdial && (
                <a href={data.socials.justdial} target="_blank" rel="noopener noreferrer" className="hover:opacity-100 opacity-60 transition-opacity bg-white p-0.5 rounded-sm" title="Justdial">
                  <img src="/justdial.png" alt="Justdial" className="w-[18px] h-[18px] object-contain" />
                </a>
              )}
              {data.socials.indiamart && (
                <a href={data.socials.indiamart} target="_blank" rel="noopener noreferrer" className="hover:opacity-100 opacity-60 transition-opacity bg-white p-0.5 rounded-sm" title="IndiaMART">
                  <img src="/indiamart.png" alt="IndiaMART" className="w-[18px] h-[18px] object-contain" />
                </a>
              )}
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
