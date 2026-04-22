"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/sections/Footer";
import { Clock, Tag, ArrowRight, Search, Flame } from "lucide-react";

const CATEGORIES = ["All", "Tips & Advice", "Design Trends", "Finance & Planning", "Technology", "Sustainability", "Industry Insights"];

const DATE_FMT = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs").then(r => r.json()).then(d => { setPosts(d); setLoading(false); });
  }, []);

  const filtered = posts
    .filter(p => filter === "All" || p.category === filter)
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt?.toLowerCase().includes(search.toLowerCase()));

  const featured = posts.filter(p => p.featured).slice(0, 2);

  return (
    <main className="min-h-screen bg-background flex flex-col w-full overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative h-[55vh] min-h-[420px] w-full flex items-end overflow-hidden pt-16">
        <Image src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
          fill className="object-cover" alt="Blog" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-transparent" />
        <div className="container relative z-10 px-4 md:px-6 pb-14 mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-primary" />
              <span className="text-white/60 uppercase tracking-[0.2em] font-bold text-xs">Our Blog</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white">Construction <span className="text-primary">Insights</span></h1>
            <p className="text-white/60 text-lg mt-3 max-w-xl font-medium">Expert articles on building, design, finance & the future of construction in India.</p>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED ARTICLES ── */}
      {!loading && featured.length > 0 && (
        <section className="bg-neutral/10 py-16 px-4 md:px-6 border-b border-neutral/30 w-full">
          <div className="container mx-auto max-w-6xl w-full">
            <div className="flex items-center gap-3 mb-8">
              <Flame className="text-primary" size={22} />
              <h2 className="text-2xl font-black text-secondary">Featured Articles</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {featured.map((post, i) => (
                <Link key={post._id} href={`/blog/${post.slug}`} className="group">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="bg-white rounded-[28px] overflow-hidden shadow-lg border border-neutral/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <Image src={post.featuredImage} fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt={post.title} />
                      <div className="absolute top-4 left-4 bg-primary text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                        Featured
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-xs text-secondary/50 font-semibold mb-3">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">{post.category}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                      </div>
                      <h3 className="text-xl font-black text-secondary mb-2 leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
                      <p className="text-secondary/60 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FILTERS + SEARCH ── */}
      <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-neutral/20 shadow-sm py-4 px-4 w-full overflow-hidden">
        <div className="container mx-auto max-w-6xl w-full flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 md:pb-0 w-full max-w-full">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filter === cat ? "bg-primary text-white shadow-md shadow-primary/30" : "bg-neutral/30 text-secondary hover:bg-neutral/60"}`}>
                {cat}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" size={16} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="w-full h-10 pl-9 pr-4 rounded-full border border-neutral/40 focus:border-primary focus:outline-none text-sm font-medium text-secondary bg-neutral/10" />
          </div>
        </div>
      </section>

      {/* ── ARTICLE GRID ── */}
      <section className="py-16 px-4 md:px-6 flex-1 w-full">
        <div className="container mx-auto max-w-6xl w-full">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => <div key={i} className="bg-neutral/20 rounded-[24px] h-96 animate-pulse" />)}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={filter + search} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((post, i) => (
                  <motion.div key={post._id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.45 }}>
                    <Link href={`/blog/${post.slug}`} className="group block h-full">
                      <div className="bg-white rounded-[24px] overflow-hidden shadow-md border border-neutral/20 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col">
                        <div className="relative h-52 overflow-hidden">
                          <Image src={post.featuredImage} fill className="object-cover transition-transform duration-700 group-hover:scale-110" alt={post.title} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <div className="absolute bottom-4 left-4 flex items-center gap-2">
                            <Image src={post.authorImage} width={28} height={28} className="rounded-full border-2 border-white object-cover" alt={post.author} />
                            <span className="text-white text-xs font-bold drop-shadow">{post.author}</span>
                          </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="bg-primary/10 text-primary text-xs font-black px-3 py-1 rounded-full">{post.category}</span>
                            <span className="flex items-center gap-1 text-xs text-secondary/50 font-semibold">
                              <Clock size={12} /> {post.readTime}
                            </span>
                          </div>
                          <h3 className="text-lg font-black text-secondary leading-snug mb-2 group-hover:text-primary transition-colors flex-1">{post.title}</h3>
                          <p className="text-secondary/60 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center justify-between border-t border-neutral/20 pt-4">
                            <span className="text-xs text-secondary/40 font-semibold">{DATE_FMT(post.createdAt)}</span>
                            <span className="text-primary font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                              Read <ArrowRight size={14} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-24">
              <div className="text-7xl mb-4">📰</div>
              <h3 className="text-2xl font-black text-secondary">No articles found.</h3>
              <p className="text-secondary/50 mt-2 font-medium">Try a different category or search term.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
