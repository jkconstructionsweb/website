"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";

// ─── Simple Auth Context ─────────────────────────────────────────────────────
const AUTH_KEY = "jk_admin_auth";

function useAuth() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  useEffect(() => {
    setAuthed(localStorage.getItem(AUTH_KEY) === "true");
  }, []);
  return authed;
}

export function logout() {
  localStorage.removeItem("jk_admin_auth");
  window.location.href = "/admin/login";
}

// ─── Layout ─────────────────────────────────────────────────────────────────
import Link from "next/link";
import {
  LayoutDashboard, FolderOpen, FileText, Users,
  Star, Image as ImageIcon, LogOut, Menu, X,
  ChevronRight, Home, Settings, MessageCircle, Shield
} from "lucide-react";
import React from "react";

const NAV = [
  { href: "/admin",             label: "Dashboard",    icon: LayoutDashboard },
  { href: "/admin/pages",       label: "Pages",        icon: FileText },
  { href: "/admin/projects",    label: "Projects",     icon: FolderOpen },
  { href: "/admin/blogs",       label: "Blog Posts",   icon: FileText },
  { href: "/admin/leads",       label: "Leads",        icon: MessageCircle },
  { href: "/admin/testimonials",label: "Testimonials", icon: Star },
  { href: "/admin/team",        label: "Team Members", icon: Users },
  { href: "/admin/contact",     label: "Contact Info", icon: Settings },
  { href: "/admin/media",       label: "Media",        icon: ImageIcon },
  { href: "/admin/account",     label: "Security",     icon: Shield },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const authed   = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (authed === false && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [authed, pathname, router]);

  // Show login page without layout wrapper
  if (pathname === "/admin/login") return <>{children}</>;

  // Loading guard
  if (authed === null || authed === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pageTitle = NAV.find(n => n.href === pathname)?.label ?? "Admin";

  return (
    <div className="flex h-screen bg-[#F0F2F5] font-sans overflow-hidden">

      {/* ── MOBILE OVERLAY ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-secondary flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>

        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 shrink-0">
          <div className="flex items-center relative h-10 w-48 shrink-0">
            <img 
              src="/Logo.png" 
              alt="JK Admin Logo" 
              className="absolute top-1/2 left-0 -translate-y-1/2 h-28 w-auto max-w-none object-contain pointer-events-none grayscale invert contrast-200 mix-blend-screen opacity-[0.85]"
            />
          </div>
          <button className="lg:hidden text-white/60 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          <p className="text-white/30 text-[10px] font-black uppercase tracking-widest px-3 mb-3">Main Menu</p>
          {NAV.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-white/60 hover:bg-white/10 hover:text-white"}`}>
                <Icon size={18} />
                <span className="flex-1 font-semibold text-sm">{label}</span>
                {isActive && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/10 space-y-1 shrink-0">
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all text-sm font-semibold">
            <Home size={18} /> View Live Site
          </Link>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-all text-sm font-semibold">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-neutral/30 flex items-center px-6 gap-4 shrink-0 shadow-sm">
          <button className="lg:hidden text-secondary/60 hover:text-secondary" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="flex-1">
            <h1 className="font-black text-secondary text-lg">{pageTitle}</h1>
            <nav className="flex items-center gap-1 text-xs text-secondary/40 font-medium">
              <span>Admin</span>
              {pathname !== "/admin" && <><ChevronRight size={10} /><span className="text-primary font-bold">{pageTitle}</span></>}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-black text-sm">A</div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
