"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Save, ToggleLeft, ToggleRight, ImageIcon } from "lucide-react";

const EMPTY = { 
  name: "", 
  role: "", 
  exp: "", 
  quote: "", 
  image: "", 
  bg: "from-blue-900 to-secondary", 
  active: true 
};

const BG_GRADIENTS = [
  { label: "Blue to Dark", value: "from-blue-900 to-secondary" },
  { label: "Purple to Dark", value: "from-purple-900 to-secondary" },
  { label: "Teal to Dark", value: "from-teal-900 to-secondary" },
  { label: "Rose to Dark", value: "from-rose-900 to-secondary" },
];

export default function AdminTeam() {
  const [items, setItems]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState<"add" | "edit" | null>(null);
  const [form, setForm]         = useState<any>(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/team", { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        setItems(d);
        setLoading(false);
      });
  }, []);

  const openAdd  = () => { setForm({ ...EMPTY }); setModal("add"); };
  const openEdit = (t: any) => { setForm({ ...t }); setModal("edit"); };

  const handleSave = async () => {
    setSaving(true);
    let newItems;
    if (modal === "add") {
      newItems = [{ ...form, id: Date.now().toString() }, ...items];
    } else {
      newItems = items.map(t => t.id === form.id ? form : t);
    }
    
    await fetch("/api/team", {
      method: "POST",
      body: JSON.stringify(newItems),
      headers: { "Content-Type": "application/json" }
    });

    setItems(newItems);
    setSaving(false);
    setModal(null);
  };

  const toggleActive = async (id: string) => {
    const newItems = items.map(t => t.id === id ? { ...t, active: !t.active } : t);
    setItems(newItems);
    await fetch("/api/team", {
      method: "POST",
      body: JSON.stringify(newItems),
      headers: { "Content-Type": "application/json" }
    });
  };

  const confirmDelete = async () => {
    const newItems = items.filter(t => t.id !== deleteId);
    setItems(newItems);
    setDeleteId(null);
    await fetch("/api/team", {
      method: "POST",
      body: JSON.stringify(newItems),
      headers: { "Content-Type": "application/json" }
    });
  };

  // NATIVE FILE UPLOADING VIA BASE64 DATA URL
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((f: any) => ({ ...f, image: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
     return <div className="text-center py-20 font-bold text-secondary/40">Loading Team Data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-secondary/60 font-medium text-sm">{items.filter(t => t.active).length} active · {items.length} total</p>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-primary/90 shadow-lg shadow-primary/30">
          <Plus size={16} /> Add Team Member
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {items.map(t => (
          <div key={t.id} className={`bg-white rounded-[24px] overflow-hidden border-2 shadow-sm transition-all ${t.active ? "border-neutral/20" : "border-neutral/10 opacity-60"}`}>
            {/* Top Graphic */}
            <div className={`h-24 bg-gradient-to-t ${t.bg} relative`}>
               {t.image ? (
                  <img src={t.image} className="w-16 h-16 rounded-full object-cover border-4 border-white absolute -bottom-8 left-6 shadow-md" alt={t.name} />
               ) : (
                  <div className="w-16 h-16 rounded-full bg-white border-4 border-secondary/10 absolute -bottom-8 left-6 flex items-center justify-center font-black text-secondary text-xl">
                     {t.name?.[0]}
                  </div>
               )}
            </div>
            
            {/* Info */}
            <div className="p-6 pt-10">
              <div className="flex justify-between items-start">
                 <div>
                    <h3 className="font-black text-secondary text-lg">{t.name}</h3>
                    <p className="text-sm font-bold text-primary">{t.role}</p>
                 </div>
                 <div className="bg-neutral/10 font-bold text-xs px-2.5 py-1 rounded-full text-secondary/70">
                    {t.exp}
                 </div>
              </div>
              <p className="text-secondary/60 text-sm leading-relaxed italic line-clamp-2 mt-4">"{t.quote}"</p>
              
              <div className="flex items-center justify-between border-t border-neutral/10 mt-5 pt-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${t.active ? "bg-green-100 text-green-700" : "bg-neutral/30 text-secondary/40"}`}>
                  {t.active ? "Active" : "Hidden"}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(t)} className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100"><Pencil size={13} /></button>
                  <button onClick={() => toggleActive(t.id)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${t.active ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-neutral/20 text-secondary/40 hover:bg-neutral/40"}`}>
                    {t.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  </button>
                  <button onClick={() => setDeleteId(t.id)} className="w-8 h-8 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100"><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-neutral/20">
              <h3 className="text-lg font-black text-secondary">{modal === "add" ? "Add Team Member" : "Edit Team Member"}</h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 bg-neutral/20 rounded-full flex items-center justify-center hover:bg-neutral/40"><X size={16} /></button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                 <label className="block text-xs font-bold text-secondary/60 mb-1">Full Name *</label>
                 <input value={form.name} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))}
                   className="w-full h-10 px-4 rounded-xl border border-neutral/40 focus:border-primary focus:outline-none text-sm font-semibold" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="block text-xs font-bold text-secondary/60 mb-1">Designation *</label>
                    <input value={form.role} onChange={e => setForm((f: any) => ({ ...f, role: e.target.value }))}
                      className="w-full h-10 px-4 rounded-xl border border-neutral/40 focus:border-primary focus:outline-none text-sm font-semibold" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-secondary/60 mb-1">Experience *</label>
                    <input value={form.exp} onChange={e => setForm((f: any) => ({ ...f, exp: e.target.value }))}
                      placeholder="e.g. 10+ Years" className="w-full h-10 px-4 rounded-xl border border-neutral/40 focus:border-primary focus:outline-none text-sm font-semibold" />
                 </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary/60 mb-2">Member Photo</label>
                <div className="flex items-center gap-3">
                  {form.image ? (
                    <img src={form.image} className="w-12 h-12 rounded-full object-cover bg-neutral/10 shrink-0 border border-neutral/20" alt="Preview"/>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-neutral/5 border border-dashed border-neutral/40 flex items-center justify-center shrink-0">
                      <ImageIcon className="text-secondary/30" size={18} />
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} 
                    className="w-full border border-neutral/30 rounded-xl text-xs font-semibold file:mr-3 file:cursor-pointer file:py-2.5 file:px-4 file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                </div>
              </div>

              <div>
                 <label className="block text-xs font-bold text-secondary/60 mb-1">Card Gradient Theme</label>
                 <select value={form.bg} onChange={e => setForm((f: any) => ({ ...f, bg: e.target.value }))} className="w-full h-10 px-4 rounded-xl border border-neutral/40 focus:border-primary focus:outline-none text-sm font-semibold bg-white">
                    {BG_GRADIENTS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                 </select>
              </div>

              <div>
                 <label className="block text-xs font-bold text-secondary/60 mb-1">Biography / Quote *</label>
                 <textarea value={form.quote} onChange={e => setForm((f: any) => ({ ...f, quote: e.target.value }))}
                   rows={3} className="w-full px-4 py-3 rounded-xl border border-neutral/40 focus:border-primary focus:outline-none text-sm font-semibold resize-none" />
              </div>
              
              <label className="flex items-center gap-2 cursor-pointer mt-2 pt-2">
                <input type="checkbox" checked={form.active} onChange={e => setForm((f: any) => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-primary" />
                <span className="text-sm font-bold text-secondary">Publicly visible on website</span>
              </label>
            </div>

            <div className="flex gap-3 p-6 border-t border-neutral/20 bg-neutral/5">
              <button onClick={() => setModal(null)} className="flex-1 h-11 rounded-xl border border-neutral/40 font-bold text-secondary text-sm hover:bg-neutral/10">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.role}
                className="flex-1 h-11 bg-primary text-white rounded-xl font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2 hover:bg-primary/90 shadow-md">
                {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                {saving ? "Saving…" : "Save Data"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-500" /></div>
            <h3 className="text-xl font-black text-secondary mb-2">Remove Team Member?</h3>
            <p className="text-sm font-medium text-secondary/60">This permanently removes them from the website.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteId(null)} className="flex-1 h-11 rounded-xl border border-neutral/40 font-bold text-secondary text-sm hover:bg-neutral/5">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 h-11 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 shadow-md">Yes, Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
