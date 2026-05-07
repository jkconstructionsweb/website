"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { Clock, Calendar, Tag, ArrowLeft, Send, User, MessageCircle } from "lucide-react";

const DATE_FMT = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

// Render bold/italic markdown-ish formatting
function RenderContent({ content }: { content: string }) {
  const paragraphs = content.split("\n\n");
  return (
    <div className="space-y-6 text-secondary/80 text-lg leading-relaxed">
      {paragraphs.map((para, i) => {
        if (para.startsWith("**") && para.endsWith("**")) {
          return <h3 key={i} className="text-2xl font-black text-secondary mt-8 mb-2">{para.replace(/\*\*/g, "")}</h3>;
        }
        const formatted = para
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em class='text-primary font-semibold not-italic'>$1</em>")
          .replace(/^- (.*)$/gm, '• $1');
        return (
          <p key={i} className="font-medium" dangerouslySetInnerHTML={{ __html: formatted }} />
        );
      })}
    </div>
  );
}

// Mock comments
const MOCK_COMMENTS = [
  { id: 1, name: "Rahul Verma", date: "2025-01-20", text: "Extremely helpful article! We were just planning our Gurugram villa and this gave us a clear pre-construction checklist.", avatar: "R" },
  { id: 2, name: "Meera Joshi", date: "2025-01-22", text: "Point 4 on Total Cost of Ownership is something nobody talks about. Thank you for breaking it down so clearly.", avatar: "M" },
];

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/blogs")
      .then(r => r.json())
      .then(data => {
        const found = data.find((p: any) => p.slug === slug);
        setPost(found || null);
        setRelated(data.filter((p: any) => p.slug !== slug).slice(0, 3));
      });
  }, [slug]);

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName || !commentText) return;
    setComments(prev => [...prev, {
      id: Date.now(), name: commentName,
      date: new Date().toISOString().slice(0, 10),
      text: commentText, avatar: commentName[0]
    }]);
    setCommentName(""); setCommentText("");
    setCommentSubmitted(true);
    setTimeout(() => setCommentSubmitted(false), 3000);
  };

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-24">
        <div className="w-14 h-14 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-secondary/60 font-semibold">Loading article…</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">

      {/* ── HERO ── */}
      <section className="relative h-[65vh] min-h-[480px] w-full pt-16">
        <Image src={post.featuredImage} fill className="object-cover" alt={post.title} priority />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 md:px-6 pb-14">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 font-semibold text-sm uppercase tracking-wider transition-colors">
              <ArrowLeft size={16} /> All Articles
            </Link>
            <div className="flex flex-wrap gap-3 mb-5">
              <span className="bg-primary text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider">{post.category}</span>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1 border border-white/20">
                <Clock size={12} /> {post.readTime}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight max-w-4xl">{post.title}</h1>
            <div className="flex items-center gap-4 mt-6">
              <Image src={post.authorImage} width={44} height={44} className="rounded-full border-2 border-primary object-cover" alt={post.author} />
              <div>
                <p className="text-white font-black">{post.author}</p>
                <p className="text-white/50 text-sm font-medium">{post.authorRole} · {DATE_FMT(post.createdAt)}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT + SIDEBAR ── */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-3 gap-16">

          {/* Article body */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
            >
              {/* Excerpt lead */}
              {post.excerpt && (
                <p className="text-xl font-semibold text-secondary/80 leading-relaxed mb-10 pb-10 border-b border-neutral/30 italic">
                  {post.excerpt}
                </p>
              )}

              <RenderContent content={post.content} />

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="mt-12 pt-8 border-t border-neutral/30">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag size={16} className="text-secondary/40" />
                    {post.tags.map((tag: string) => (
                      <span key={tag} className="bg-neutral/30 text-secondary text-xs font-bold px-4 py-2 rounded-full hover:bg-primary/10 hover:text-primary transition-colors cursor-default">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Author card */}
              <div className="mt-12 bg-neutral/20 rounded-[28px] p-8 flex items-start gap-6">
                <Image src={post.authorImage} width={80} height={80} className="rounded-2xl object-cover border-2 border-primary shrink-0" alt={post.author} />
                <div>
                  <p className="text-xs font-bold text-secondary/40 uppercase tracking-widest mb-1">Written by</p>
                  <h4 className="text-xl font-black text-secondary">{post.author}</h4>
                  <p className="text-primary font-bold text-sm mb-3">{post.authorRole}</p>
                  <p className="text-secondary/60 text-sm leading-relaxed">Senior construction expert at JK Constructions with over 12 years of hands-on project experience across residential and commercial segments in Haryana and Delhi NCR.</p>
                </div>
              </div>

              {/* ── COMMENTS ── */}
              <div className="mt-16">
                <div className="flex items-center gap-3 mb-8">
                  <MessageCircle className="text-primary" size={24} />
                  <h3 className="text-2xl font-black text-secondary">Comments ({comments.length})</h3>
                </div>

                {/* Comment list */}
                <div className="space-y-6 mb-12">
                  {comments.map(c => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-[20px] p-6 border border-neutral/20 shadow-sm flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black text-lg shrink-0">
                        {c.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-black text-secondary">{c.name}</h5>
                          <span className="text-xs text-secondary/40 font-semibold">{DATE_FMT(c.date)}</span>
                        </div>
                        <p className="text-secondary/70 leading-relaxed">{c.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Comment form */}
                <div className="bg-white rounded-[28px] p-8 border border-neutral/20 shadow-lg">
                  <h4 className="text-xl font-black text-secondary mb-6 flex items-center gap-2">
                    <User size={20} className="text-primary" /> Leave a Comment
                  </h4>
                  {commentSubmitted ? (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-green-600 text-2xl">✓</span>
                      </div>
                      <p className="font-bold text-secondary">Comment posted! Thank you.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleComment} className="space-y-5">
                      <input required value={commentName} onChange={e => setCommentName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full h-12 px-4 rounded-2xl border-2 border-neutral/40 focus:border-primary focus:outline-none font-semibold text-secondary bg-neutral/10 transition-colors" />
                      <textarea required value={commentText} onChange={e => setCommentText(e.target.value)}
                        placeholder="Share your thoughts on this article…" rows={4}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-neutral/40 focus:border-primary focus:outline-none font-semibold text-secondary bg-neutral/10 transition-colors resize-none" />
                      <Button type="submit" variant="filled" className="h-12 px-8 font-bold shadow-lg">
                        Post Comment <Send size={16} className="ml-2" />
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div className="sticky top-28 space-y-6"
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}>

              {/* CTA box */}
              <div className="bg-secondary rounded-[28px] p-8 text-white shadow-2xl">
                <h3 className="text-xl font-black mb-3">Ready to Start Building?</h3>
                <p className="text-white/60 text-sm mb-6 font-medium leading-relaxed">Get a free, instant construction cost estimate tailored to your project today.</p>
                <Button asChild variant="filled" className="w-full h-12 font-bold shadow-xl">
                  <Link href="/estimator">Try Cost Estimator</Link>
                </Button>
                <Button asChild variant="outlined" className="w-full h-12 font-semibold mt-3 border-white/20 text-white hover:bg-white/10">
                  <Link href="/contact">Talk to an Expert</Link>
                </Button>
              </div>

              {/* Related articles */}
              {related.length > 0 && (
                <div className="bg-white rounded-[28px] p-6 border border-neutral/20 shadow-lg">
                  <h3 className="text-lg font-black text-secondary mb-5">Related Articles</h3>
                  <div className="space-y-4">
                    {related.map(r => (
                      <Link key={r._id} href={`/blog/${r.slug}`} className="group flex gap-4 items-start hover:bg-neutral/10 p-2 rounded-2xl transition-colors">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <Image src={r.featuredImage} fill className="object-cover" alt={r.title} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-black text-primary uppercase tracking-wider">{r.category}</span>
                          <p className="text-sm font-bold text-secondary leading-tight mt-0.5 group-hover:text-primary transition-colors line-clamp-2">{r.title}</p>
                          <span className="text-xs text-secondary/40 font-semibold flex items-center gap-1 mt-1"><Clock size={10} />{r.readTime}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags cloud */}
              {post.tags?.length > 0 && (
                <div className="bg-white rounded-[28px] p-6 border border-neutral/20 shadow-lg">
                  <h3 className="text-lg font-black text-secondary mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <span key={tag} className="bg-neutral/30 text-secondary text-xs font-bold px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-colors cursor-default">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
