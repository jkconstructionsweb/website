"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";

const DATE = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function BlogHighlights() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/blogs").then(r => r.json()).then(d => setPosts(d.slice(0, 3)));
  }, []);

  if (!posts.length) return null;

  const [hero, ...rest] = posts;

  return (
    <section className="py-28 px-4 md:px-6 bg-white">
      <div className="container mx-auto max-w-6xl">

        {/* Header */}
        <motion.div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-primary" />
              <span className="text-primary uppercase tracking-[0.2em] font-bold text-xs">Expert Knowledge</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-secondary leading-tight">
              Latest from Our <span className="text-primary">Blog</span>
            </h2>
          </div>
          <Link href="/blog"
            className="flex items-center gap-2 text-secondary font-bold hover:text-primary transition-colors shrink-0 group">
            All Articles <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Hero post */}
          <motion.div className="lg:col-span-3"
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Link href={`/blog/${hero.slug}`} className="group block">
              <div className="relative h-80 rounded-[28px] overflow-hidden mb-5">
                <Image src={hero.featuredImage} fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt={hero.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 to-transparent" />
                <span className="absolute top-5 left-5 bg-primary text-white text-xs font-black px-4 py-2 rounded-full uppercase">{hero.category}</span>
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Image src={hero.authorImage} width={28} height={28} className="rounded-full border-2 border-white object-cover" alt={hero.author} />
                    <span className="text-white text-xs font-bold">{hero.author}</span>
                    <span className="text-white/50 text-xs flex items-center gap-1"><Clock size={10} /> {hero.readTime}</span>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-black text-secondary leading-tight group-hover:text-primary transition-colors mb-2">{hero.title}</h3>
              <p className="text-secondary/60 font-medium leading-relaxed line-clamp-2">{hero.excerpt}</p>
            </Link>
          </motion.div>

          {/* Side posts */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {rest.map((post, i) => (
              <motion.div key={post._id}
                initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.5 }}>
                <Link href={`/blog/${post.slug}`} className="group flex gap-5 bg-neutral/10 hover:bg-neutral/20 rounded-[24px] p-4 transition-colors">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                    <Image src={post.featuredImage} fill className="object-cover transition-transform duration-500 group-hover:scale-110" alt={post.title} />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-black text-primary uppercase tracking-wider">{post.category}</span>
                      <h4 className="font-black text-secondary text-base leading-tight mt-1 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h4>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-secondary/40 font-semibold mt-2">
                      <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                      <span>{DATE(post.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* View all CTA */}
            <Link href="/blog"
              className="flex items-center justify-center gap-2 h-16 bg-secondary text-white font-black rounded-[24px] hover:bg-primary transition-colors group shadow-lg mt-auto">
              Explore All Articles <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
