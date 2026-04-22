"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Star, X, Save, ToggleLeft, ToggleRight } from "lucide-react";

const INIT = [
  { id: 1, name: "Rajeev Kapoor", role: "Villa Owner, Sector 57", rating: 5, text: "JK Constructions transformed our plot into a stunning villa. The craftsmanship is impeccable and they delivered 3 weeks ahead of schedule.", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80", active: true },
  { id: 2, name: "Neha Agarwal", role: "Interior Client, DLF Phase 4", rating: 5, text: "The interior team's attention to detail is unmatched. Every corner of our home feels bespoke and luxurious. Highly recommend!", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=100&q=80", active: true },
  { id: 3, name: "Vikram Singh", role: "Commercial Client, Cyber City", rating: 5, text: "Our 8,000 sq.ft office was delivered on time and within budget. The quality of RCC work and electrical finishes is outstanding.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80", active: true },
];

const EMPTY = { name: "", role: "", rating: 5, text: "", image: "", active: true };

export default function AdminTestimonials() {
  const [items, setItems]       = useState(INIT);
  const [modal, setModal]       = useState<"add" | "edit" | null>(null);
  const [form, setForm]         = useState<any>(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openAdd  = () => { setForm({ ...EMPTY }); setModal("add"); };
  const openEdit = (t: any) => { setForm({ ...t }); setModal("edit"); };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((f: any) => ({ ...f, image: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    if (modal === "add") {
      setItems(prev => [{ ...form, id: Date.now() }, ...prev]);
    } else {
      setItems(prev => prev.map(t => t.id === form.id ? form : t));
    }
    setSaving(false);
    setModal(null);
  };

  const toggleActive = (id: number) =>
    setItems(prev => prev.map(t => t.id === id ? { ...t, active: !t.active } : t));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-secondary/60 font-medium text-sm">{items.filter(t => t.active).length} active · {items.length} total</p>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-primary/90 shadow-lg shadow-primary/30">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {items.map(t => (
          <div key={t.id} className={`bg-white rounded-[24px] p-6 border-2 shadow-sm transition-all ${t.active ? "border-neutral/20" : "border-neutral/10 opacity-60"}`}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                {t.image ? (
                  <img src={t.image} className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" alt={t.name} />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-xl">{t.name[0]}</div>
                )}
                <div>
                  <p className="font-black text-secondary">{t.name}</p>
                  <p className="text-xs text-secondary/50 font-semibold">{t.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(t)} className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100"><Pencil size={13} /></button>
                <button onClick={() => toggleActive(t.id)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${t.active ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-neutral/20 text-secondary/40 hover:bg-neutral/40"}`}>
                  {t.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                </button>
                <button onClick={() => setDeleteId(t.id)} className="w-8 h-8 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100"><Trash2 size={13} /></button>
              </div>
            </div>
            <div className="flex mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className={i < t.rating ? "text-amber-400 fill-amber-400" : "text-neutral/30"} />
              ))}
            </div>
            <p className="text-secondary/70 text-sm leading-relaxed italic line-clamp-3">"{t.text}"</p>
            <div className="mt-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${t.active ? "bg-green-100 text-green-700" : "bg-neutral/30 text-secondary/40"}`}>
                {t.active ? "Visible on site" : "Hidden"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-neutral/20">
              <h3 className="text-lg font-black text-secondary">{modal === "add" ? "Add Testimonial" : "Edit Testimonial"}</h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 bg-neutral/20 rounded-full flex items-center justify-center"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              <input value={form.name} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))}
                placeholder="Client Name *" className="w-full h-10 px-4 rounded-2xl border border-neutral/40 focus:border-primary focus:outline-none text-sm font-semibold" />
              <input value={form.role} onChange={e => setForm((f: any) => ({ ...f, role: e.target.value }))}
                placeholder="Role / Project Type" className="w-full h-10 px-4 rounded-2xl border border-neutral/40 focus:border-primary focus:outline-none text-sm font-semibold" />
              <div>
                <label className="block text-xs font-bold text-secondary/60 mb-1">Avatar Image</label>
                <div className="flex items-center gap-3">
                  {form.image ? (
                    <img src={form.image} className="w-10 h-10 rounded-full object-cover bg-neutral/10 shrink-0 border border-neutral/20" alt="Preview"/>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral/10 border border-neutral/20 border-dashed flex items-center justify-center text-xs font-black text-secondary/30 shrink-0">
                      {form.name ? form.name[0] : "?"}
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} 
                    className="w-full border border-neutral/30 rounded-2xl text-sm file:mr-3 file:cursor-pointer file:py-2.5 file:px-4 file:border-0 file:bg-primary/10 file:text-primary file:font-semibold hover:file:bg-primary/20" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-secondary/60 mb-2">Star Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setForm((f: any) => ({ ...f, rating: n }))}>
                      <Star size={24} className={n <= form.rating ? "text-amber-400 fill-amber-400" : "text-neutral/40"} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea value={form.text} onChange={e => setForm((f: any) => ({ ...f, text: e.target.value }))}
                placeholder="Their testimonial text *" rows={4}
                className="w-full px-4 py-3 rounded-2xl border border-neutral/40 focus:border-primary focus:outline-none text-sm font-semibold resize-none" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm((f: any) => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-primary" />
                <span className="text-sm font-bold text-secondary">Show on website</span>
              </label>
            </div>
            <div className="flex gap-3 p-6 border-t border-neutral/20">
              <button onClick={() => setModal(null)} className="flex-1 h-11 rounded-2xl border border-neutral/40 font-bold text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.text}
                className="flex-1 h-11 bg-primary text-white rounded-2xl font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-500" /></div>
            <h3 className="text-xl font-black text-secondary mb-2">Delete Testimonial?</h3>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteId(null)} className="flex-1 h-11 rounded-2xl border border-neutral/40 font-bold text-sm">Cancel</button>
              <button onClick={() => { setItems(prev => prev.filter(t => t.id !== deleteId)); setDeleteId(null); }}
                className="flex-1 h-11 bg-red-500 text-white rounded-2xl font-bold text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
