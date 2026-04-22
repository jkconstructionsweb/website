"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, Search, X, Save, Upload } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// @ts-ignore
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false, loading: () => <div className="min-h-[200px] bg-neutral/10 animate-pulse rounded-xl" /> });

const QUILL_MODULES = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link', 'image'],
    ['clean']
  ],
};

const CATS = ["Tips & Advice", "Design Trends", "Finance & Planning", "Technology", "Sustainability", "Industry Insights"];

const EMPTY = { title: "", slug: "", category: "Tips & Advice", author: "", authorRole: "", excerpt: "", content: "", featuredImage: "", readTime: "", tags: [] as string[], featured: false };

export default function AdminBlogs() {
  const [posts, setPosts]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal]   = useState<"add" | "edit" | null>(null);
  const [form, setForm]     = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/blogs").then(r => r.json()).then(d => { setPosts(d); setLoading(false); });
  }, []);

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setForm({ ...EMPTY }); setTagInput(""); setModal("add"); };
  const openEdit = (p: any) => { setForm({ ...p }); setTagInput(""); setModal("edit"); };
  const closeModal = () => { setModal(null); setForm(EMPTY); };

  const addTag = () => {
    if (tagInput.trim()) {
      setForm((f: any) => ({ ...f, tags: [...(f.tags || []), tagInput.trim()] }));
      setTagInput("");
    }
  };
  const removeTag = (t: string) => setForm((f: any) => ({ ...f, tags: f.tags.filter((x: string) => x !== t) }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    if (modal === "add") {
      setPosts(prev => [{ ...form, _id: Date.now().toString(), createdAt: new Date().toISOString() }, ...prev]);
    } else {
      setPosts(prev => prev.map(p => p._id === form._id ? form : p));
    }
    setSaving(false);
    closeModal();
  };

  const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((f: any) => ({ ...f, featuredImage: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const DATE = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" size={16} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts…"
            className="w-full h-10 pl-9 pr-4 rounded-full border border-neutral/40 focus:border-primary focus:outline-none text-sm font-medium bg-white" />
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-primary/90 shadow-lg shadow-primary/30">
          <Plus size={16} /> Write Post
        </button>
      </div>

      <div className="bg-white rounded-[24px] border border-neutral/20 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-neutral/20 border-b border-neutral/30">
            <tr>
              {["Post Title", "Category", "Author", "Date", "Featured", "Actions"].map(h => (
                <th key={h} className="text-left px-5 py-4 text-xs font-black text-secondary/60 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(4)].map((_, i) => <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-8 bg-neutral/20 rounded-xl animate-pulse" /></td></tr>)
            ) : filtered.map(p => (
              <tr key={p._id} className="border-b border-neutral/10 hover:bg-neutral/5 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {p.featuredImage && <img src={p.featuredImage} className="w-10 h-10 rounded-xl object-cover shrink-0" alt="" />}
                    <div>
                      <p className="font-bold text-secondary line-clamp-1">{p.title}</p>
                      <p className="text-xs text-secondary/40 flex items-center gap-1"><span className="flex items-center gap-1">📖 {p.readTime}</span></p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4"><span className="bg-purple-100 text-purple-700 text-xs font-black px-3 py-1 rounded-full">{p.category}</span></td>
                <td className="px-5 py-4 font-semibold text-secondary/70">{p.author}</td>
                <td className="px-5 py-4 text-secondary/50 font-medium">{p.createdAt ? DATE(p.createdAt) : "—"}</td>
                <td className="px-5 py-4">
                  {p.featured
                    ? <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">Yes</span>
                    : <span className="bg-neutral/30 text-secondary/50 text-xs font-bold px-2.5 py-1 rounded-full">No</span>}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100"><Pencil size={14} /></button>
                    <a href={`/blog/${p.slug}`} target="_blank" className="w-8 h-8 bg-neutral/20 text-secondary/60 rounded-xl flex items-center justify-center hover:bg-neutral/40"><Eye size={14} /></a>
                    <button onClick={() => setDeleteId(p._id)} className="w-8 h-8 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && <div className="text-center py-12 text-secondary/40 font-semibold">No blog posts found.</div>}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral/20">
              <h3 className="text-lg font-black text-secondary">{modal === "add" ? "Write New Post" : "Edit Post"}</h3>
              <button onClick={closeModal} className="w-8 h-8 bg-neutral/20 rounded-full flex items-center justify-center"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              <input value={form.title} onChange={e => setForm((f: any) => ({ ...f, title: e.target.value }))}
                placeholder="Post Title *"
                className="w-full h-11 px-4 rounded-2xl border border-neutral/40 focus:border-primary focus:outline-none text-base font-black text-secondary" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-secondary/60 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-neutral/40 focus:border-primary focus:outline-none text-sm font-semibold bg-white">
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary/60 mb-1">Read Time</label>
                  <input value={form.readTime} onChange={e => setForm((f: any) => ({ ...f, readTime: e.target.value }))} placeholder="e.g. 5 min read"
                    className="w-full h-10 px-3 rounded-xl border border-neutral/40 focus:border-primary focus:outline-none text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary/60 mb-1">Author Name</label>
                  <input value={form.author} onChange={e => setForm((f: any) => ({ ...f, author: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-neutral/40 focus:border-primary focus:outline-none text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary/60 mb-1">Author Role</label>
                  <input value={form.authorRole} onChange={e => setForm((f: any) => ({ ...f, authorRole: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-neutral/40 focus:border-primary focus:outline-none text-sm font-semibold" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary/60 mb-1">Featured Image</label>
                <div className="flex items-center gap-4 bg-white border border-neutral/40 p-2 rounded-xl focus-within:border-primary transition-colors">
                  {form.featuredImage ? (
                    <img src={form.featuredImage} className="w-16 h-16 rounded-lg object-cover shrink-0" alt="Preview" />
                  ) : (
                    <div className="w-16 h-16 bg-neutral/10 rounded-lg flex items-center justify-center shrink-0">
                      <Upload className="text-secondary/30" size={24} />
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFeaturedImageUpload}
                    className="w-full text-sm font-semibold file:mr-4 file:cursor-pointer file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary/60 mb-1">Excerpt</label>
                <textarea value={form.excerpt} onChange={e => setForm((f: any) => ({ ...f, excerpt: e.target.value }))} rows={2}
                  placeholder="Short summary shown in listing…"
                  className="w-full px-3 py-2 rounded-xl border border-neutral/40 focus:border-primary focus:outline-none text-sm font-semibold resize-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary/60 mb-1">Full Content</label>
                <div className="bg-white rounded-xl overflow-hidden [&_.quill]:bg-white [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-b-neutral/20 [&_.ql-toolbar]:bg-neutral/5 [&_.ql-container]:border-none [&_.ql-container]:min-h-[250px] [&_.ql-editor]:min-h-[250px] border border-neutral/40 focus-within:border-primary transition-colors">
                  <ReactQuill 
                    theme="snow" 
                    value={form.content} 
                    onChange={val => setForm((f: any) => ({ ...f, content: val }))} 
                    modules={QUILL_MODULES}
                    placeholder="Write your article here..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary/60 mb-2">Tags</label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {(form.tags || []).map((t: string) => (
                    <span key={t} className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      {t} <button onClick={() => removeTag(t)} className="hover:text-red-500"><X size={10} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addTag()}
                    placeholder="Type tag and press Enter" className="flex-1 h-9 px-3 rounded-xl border border-neutral/40 focus:border-primary focus:outline-none text-sm" />
                  <button onClick={addTag} className="px-4 h-9 bg-primary/10 text-primary rounded-xl text-sm font-bold hover:bg-primary/20">Add</button>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm((f: any) => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-primary" />
                <span className="text-sm font-bold text-secondary">Mark as Featured Post</span>
              </label>
            </div>
            <div className="flex gap-3 p-6 border-t border-neutral/20">
              <button onClick={closeModal} className="flex-1 h-11 rounded-2xl border border-neutral/40 font-bold text-secondary text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.title}
                className="flex-1 h-11 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                {saving ? "Saving…" : "Publish Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-500" /></div>
            <h3 className="text-xl font-black text-secondary mb-2">Delete Post?</h3>
            <p className="text-secondary/60 text-sm font-medium mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 h-11 rounded-2xl border border-neutral/40 font-bold text-sm">Cancel</button>
              <button onClick={() => { setPosts(prev => prev.filter(p => p._id !== deleteId)); setDeleteId(null); }}
                className="flex-1 h-11 bg-red-500 text-white rounded-2xl font-bold text-sm hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

