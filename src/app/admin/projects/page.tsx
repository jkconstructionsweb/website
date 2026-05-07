"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, Search, X, Image as ImageIcon, Save } from "lucide-react";

const CATEGORIES = ["Residential", "Commercial", "Interior"];

const EMPTY = { title: "", slug: "", category: "Residential", location: "", cost: "", timeline: "", description: "", images: [""], featured: false };

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState<"add" | "edit" | null>(null);
  const [form, setForm]         = useState<any>(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects").then(r => r.json()).then(d => { setProjects(d); setLoading(false); });
  }, []);

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setForm({ ...EMPTY }); setModal("add"); };
  const openEdit = (p: any) => { setForm({ ...p, images: p.images?.length ? p.images : [""] }); setModal("edit"); };
  const closeModal = () => { setModal(null); setForm(EMPTY); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const isAdd = modal === "add";
      const payload = { ...form };
      if (isAdd && !payload.slug) {
        payload.slug = payload.title.toLowerCase().replace(/ /g, "-");
      }
      
      const res = await fetch("/api/projects", {
        method: isAdd ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (isAdd) {
          setProjects(prev => [data.data, ...prev]);
        } else {
          setProjects(prev => prev.map(p => p._id === data.data._id ? data.data : p));
        }
        closeModal();
      } else {
        alert("Error saving: " + (data.error || "Server Error"));
      }
    } catch (e) {
      alert("Network Error");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p._id !== id));
      } else {
        alert("Delete failed");
      }
    } catch (e) {
      alert("Network Error");
    }
    setDeleteId(null);
  };

  const handleImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      
      if (res.ok && data.url) {
        const imgs = [...(form.images || [""])];
        imgs[idx] = data.url;
        setForm((f: any) => ({ ...f, images: imgs }));
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" size={16} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="w-full h-10 pl-9 pr-4 rounded-full border border-neutral/40 focus:border-primary focus:outline-none text-sm font-medium bg-white" />
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all">
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] border border-neutral/20 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-neutral/20 border-b border-neutral/30">
            <tr>
              {["Project", "Category", "Location", "Cost", "Featured", "Actions"].map(h => (
                <th key={h} className="text-left px-5 py-4 text-xs font-black text-secondary/60 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-8 bg-neutral/20 rounded-xl animate-pulse" /></td></tr>
              ))
            ) : filtered.map(p => (
              <tr key={p._id} className="border-b border-neutral/10 hover:bg-neutral/5 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {p.images?.[0] && (
                      <img src={p.images[0]} className="w-10 h-10 rounded-xl object-cover" alt="" />
                    )}
                    <div>
                      <p className="font-bold text-secondary line-clamp-1">{p.title}</p>
                      <p className="text-xs text-secondary/40">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="bg-primary/10 text-primary text-xs font-black px-3 py-1 rounded-full">{p.category}</span>
                </td>
                <td className="px-5 py-4 text-secondary/70 font-medium">{p.location}</td>
                <td className="px-5 py-4 font-black text-secondary">{p.cost}</td>
                <td className="px-5 py-4">
                  {p.featured
                    ? <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">Yes</span>
                    : <span className="bg-neutral/30 text-secondary/50 text-xs font-bold px-2.5 py-1 rounded-full">No</span>}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <a href={`/projects/${p.slug}`} target="_blank" className="w-8 h-8 bg-neutral/20 text-secondary/60 rounded-xl flex items-center justify-center hover:bg-neutral/40 transition-colors">
                      <Eye size={14} />
                    </a>
                    <button onClick={() => setDeleteId(p._id)} className="w-8 h-8 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-secondary/40 font-semibold">No projects found.</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral/20">
              <h3 className="text-lg font-black text-secondary">{modal === "add" ? "Add New Project" : "Edit Project"}</h3>
              <button onClick={closeModal} className="w-8 h-8 bg-neutral/20 rounded-full flex items-center justify-center hover:bg-neutral/40"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-secondary/60 mb-1">Title *</label>
                  <input value={form.title} onChange={e => setForm((f: any) => ({ ...f, title: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-neutral/40 focus:border-primary focus:outline-none text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary/60 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-neutral/40 focus:border-primary focus:outline-none text-sm font-semibold bg-white">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary/60 mb-1">Location</label>
                  <input value={form.location} onChange={e => setForm((f: any) => ({ ...f, location: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-neutral/40 focus:border-primary focus:outline-none text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary/60 mb-1">Cost</label>
                  <input value={form.cost} onChange={e => setForm((f: any) => ({ ...f, cost: e.target.value }))} placeholder="e.g. ₹2.5 Cr+"
                    className="w-full h-10 px-3 rounded-xl border border-neutral/40 focus:border-primary focus:outline-none text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary/60 mb-1">Timeline</label>
                  <input value={form.timeline} onChange={e => setForm((f: any) => ({ ...f, timeline: e.target.value }))} placeholder="e.g. 12 Months"
                    className="w-full h-10 px-3 rounded-xl border border-neutral/40 focus:border-primary focus:outline-none text-sm font-semibold" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm((f: any) => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-primary" />
                    <span className="text-sm font-bold text-secondary">Mark as Featured</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-secondary/60 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-neutral/40 focus:border-primary focus:outline-none text-sm font-semibold resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-secondary/60 mb-2">Project Images</label>
                <div className="space-y-4">
                  {(form.images || [""]).map((img: string, i: number) => (
                    <div key={i} className="flex gap-4 items-center bg-white border border-neutral/40 p-3 rounded-2xl">
                      {img ? (
                        <img src={img} className="w-16 h-16 rounded-xl object-cover shrink-0" alt="Preview" />
                      ) : (
                        <div className="w-16 h-16 bg-neutral/10 rounded-xl flex items-center justify-center shrink-0 border border-neutral/20 border-dashed">
                          <ImageIcon className="text-secondary/30" size={24} />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <input type="file" accept="image/*" onChange={e => handleImageUpload(i, e)}
                          className="w-full text-sm font-semibold file:mr-4 file:cursor-pointer file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                      </div>
                      
                      {i > 0 && (
                        <button onClick={() => setForm((f: any) => ({ ...f, images: f.images.filter((_: any, j: number) => j !== i) }))}
                          className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 shrink-0"><X size={14} /></button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => setForm((f: any) => ({ ...f, images: [...(f.images || []), ""] }))}
                    className="text-xs text-primary font-bold hover:underline flex items-center gap-1 mt-1">
                    <Plus size={12} /> Add another image URL
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-neutral/20">
              <button onClick={closeModal} className="flex-1 h-11 rounded-2xl border border-neutral/40 font-bold text-secondary text-sm hover:bg-neutral/10">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.title}
                className="flex-1 h-11 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary/90 shadow-md disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                {saving ? "Saving…" : "Save Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-xl font-black text-secondary mb-2">Delete Project?</h3>
            <p className="text-secondary/60 text-sm font-medium mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 h-11 rounded-2xl border border-neutral/40 font-bold text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 h-11 bg-red-500 text-white rounded-2xl font-bold text-sm hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
