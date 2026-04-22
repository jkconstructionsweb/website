"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Menu, X, Home as HomeIcon } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide header completely on admin panel routes (moved below hooks)
  if (pathname.startsWith("/admin")) return null;

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/projects", label: "Projects" },
    { href: "/estimator", label: "Cost Estimator" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  // The transparent effect is now applied to all pages when at the very top
  const isHeaderLightText = !isScrolled;
  
  const headerBgClass = isHeaderLightText 
    ? "bg-transparent py-5" 
    : "bg-white/95 backdrop-blur-md shadow-sm py-4 border-b border-neutral/30";
  
  const textColorClass = isHeaderLightText ? "text-white" : "text-secondary";

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${headerBgClass} ${textColorClass}`}>
      {/* Permanent protective gradient behind transparent header for readability on light images */}
      {isHeaderLightText && (
        <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-black/80 via-black/30 to-transparent -z-10 pointer-events-none" />
      )}
      
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 flex justify-between items-center relative z-10">
        
        {/* Brand Logo */}
        <Link href="/" className="-ml-2 md:-ml-6 flex items-center relative h-12 md:h-14 w-56 md:w-72 shrink-0" onClick={() => setMobileMenuOpen(false)}>
          <img 
            src="/Logo.png" 
            alt="JK Constructions Logo" 
            className={`absolute top-1/2 left-0 -translate-y-1/2 h-32 md:h-40 w-auto max-w-none object-contain transition-all duration-300 pointer-events-none ${
              isHeaderLightText 
                ? 'grayscale invert contrast-200 mix-blend-screen opacity-[0.85]' 
                : 'mix-blend-multiply'
            }`}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
          {links.map(link => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`font-semibold text-[15px] whitespace-nowrap transition-colors hover:text-primary ${pathname === link.href ? "text-primary" : ""}`}
            >
              {link.label}
            </Link>
          ))}
          <Button 
            asChild 
            variant="filled" 
            className={`whitespace-nowrap ${isHeaderLightText ? "bg-white text-primary hover:bg-neutral-100 shadow-xl" : "shadow-md"}`}
          >
             <Link href="/contact">Get Free Quote</Link>
          </Button>
        </nav>

        {/* Mobile Toggle Button */}
        <button className="lg:hidden p-1 focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Sticky Menu Render */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl text-secondary flex flex-col py-4 border-t border-neutral/20 z-50 animate-in slide-in-from-top-4 duration-200">
          {links.map(link => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 font-semibold hover:bg-primary/5 hover:text-primary transition-colors border-l-4 border-transparent hover:border-primary"
            >
              {link.label}
            </Link>
          ))}
          <div className="px-6 pt-4 mt-2 border-t border-neutral/20 pb-2">
            <Button asChild className="w-full h-12 text-lg">
               <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Get Free Quote</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
