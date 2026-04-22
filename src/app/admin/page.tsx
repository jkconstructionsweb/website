"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, FolderOpen, FileText, Star, TrendingUp, ArrowRight, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats]  = useState({ leads: 0, projects: 0, blogs: 0, testimonials: 3 });
  const [leads, setLeads]  = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/leads").then(r => r.json()).catch(() => []),
      fetch("/api/projects").then(r => r.json()).catch(() => []),
      fetch("/api/blogs").then(r => r.json()).catch(() => []),
    ]).then(([l, p, b]) => {
      setStats({ leads: l.length, projects: p.length, blogs: b.length, testimonials: 3 });
      setLeads(l.slice(0, 5));
      setLoading(false);
    });
  }, []);

  const STAT_CARDS = [
    { label: "Total Leads",     value: stats.leads,        icon: Users,       color: "bg-blue-500",   href: "/admin/leads",        change: "+12% this week" },
    { label: "Projects",        value: stats.projects,     icon: FolderOpen,  color: "bg-primary",    href: "/admin/projects",     change: "Live portfolio" },
    { label: "Blog Posts",      value: stats.blogs,        icon: FileText,    color: "bg-purple-500", href: "/admin/blogs",        change: "All published" },
    { label: "Testimonials",    value: stats.testimonials, icon: Star,        color: "bg-amber-500",  href: "/admin/testimonials", change: "Active reviews" },
  ];

  const QUICK_LINKS = [
    { label: "Add New Project",   href: "/admin/projects",    icon: FolderOpen,  color: "text-primary" },
    { label: "Write Blog Post",   href: "/admin/blogs",       icon: FileText,    color: "text-purple-500" },
    { label: "View New Leads",    href: "/admin/leads",       icon: Users,       color: "text-blue-500" },
    { label: "Upload Media",      href: "/admin/media",       icon: TrendingUp,  color: "text-amber-500" },
  ];

  return (
    <div className="space-y-8">

      {/* Welcome Banner */}
      <div className="bg-secondary rounded-[24px] p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full bg-primary/10 rounded-l-full" />
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-1">Welcome back, Admin 👋</h2>
          <p className="text-white/60 font-medium">Here's what's happening with your JK Constructions website today.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, href, change }) => (
          <Link key={label} href={href}
            className="bg-white rounded-[20px] p-6 border border-neutral/20 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
            <div className="flex items-center justify-between mb-5">
              <div className={`${color} w-12 h-12 rounded-2xl flex items-center justify-center shadow-md`}>
                <Icon size={22} className="text-white" />
              </div>
              <ArrowRight size={16} className="text-secondary/30 group-hover:text-primary transition-colors" />
            </div>
            <div className="text-4xl font-black text-secondary mb-1">{loading ? "—" : value}</div>
            <div className="font-bold text-secondary text-sm mb-1">{label}</div>
            <div className="text-xs text-secondary/40 font-semibold">{change}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent Leads */}
        <div className="bg-white rounded-[24px] p-6 border border-neutral/20 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-secondary">Recent Leads</h3>
            <Link href="/admin/leads" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-14 bg-neutral/20 rounded-xl animate-pulse" />)}</div>
          ) : leads.length === 0 ? (
            <div className="text-center py-8 text-secondary/40 font-semibold">No leads yet.</div>
          ) : (
            <div className="space-y-3">
              {leads.map((lead: any, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-neutral/10 rounded-xl hover:bg-neutral/20 transition-colors">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-black text-sm shrink-0">
                    {(lead.name || "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-secondary text-sm truncate">{lead.name || "Unknown"}</p>
                    <p className="text-xs text-secondary/50 truncate">{lead.phone} · {lead.source}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded-full shrink-0">New</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions + Status */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="bg-white rounded-[24px] p-6 border border-neutral/20 shadow-sm">
            <h3 className="text-lg font-black text-secondary mb-5">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_LINKS.map(({ label, href, icon: Icon, color }) => (
                <Link key={label} href={href}
                  className="flex flex-col items-center gap-2 p-4 bg-neutral/10 rounded-2xl hover:bg-primary/5 hover:border-primary/30 border border-transparent transition-all group text-center">
                  <Icon size={22} className={`${color} group-hover:scale-110 transition-transform`} />
                  <span className="text-xs font-bold text-secondary leading-tight">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-[24px] p-6 border border-neutral/20 shadow-sm">
            <h3 className="text-lg font-black text-secondary mb-5">System Status</h3>
            <div className="space-y-3">
              {[
                { label: "Website (Next.js)", status: "Online", ok: true },
                { label: "Database (MongoDB)", status: "Mock Mode", ok: null },
                { label: "API Routes", status: "All Active", ok: true },
                { label: "Media Uploads", status: "Ready", ok: true },
              ].map(({ label, status, ok }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-secondary/70">{label}</span>
                  <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full
                    ${ok === true ? "bg-green-100 text-green-700" : ok === null ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                    {ok === true ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
