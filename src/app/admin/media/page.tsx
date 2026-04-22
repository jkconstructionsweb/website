"use client";
import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Copy, Trash2, Check, Grid, List } from "lucide-react";

const INIT_MEDIA = [
  { id: 1, url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80", name: "luxury-villa.jpg", size: "245 KB", type: "image/jpeg" },
  { id: 2, url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=80", name: "architecture.jpg", size: "312 KB", type: "image/jpeg" },
  { id: 3, url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80", name: "office-interior.jpg", size: "198 KB", type: "image/jpeg" },
  { id: 4, url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80", name: "apartment.jpg", size: "278 KB", type: "image/jpeg" },
  { id: 5, url: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=400&q=80", name: "duplex.jpg", size: "301 KB", type: "image/jpeg" },
  { id: 6, url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=400&q=80", name: "green-building.jpg", size: "187 KB", type: "image/jpeg" },
];

export default function AdminMedia() {
  const [media, setMedia]       = useState(INIT_MEDIA);
  const [view, setView]         = useState<"grid" | "list">("grid");
  const [copied, setCopied]     = useState<number | null>(null);
  const [delId, setDelId]       = useState<number | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const copyUrl = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const addByUrl = () => {
    if (!urlInput.trim()) return;
    const name = urlInput.split("/").pop() || "image.jpg";
    setMedia(prev => [{ id: Date.now(), url: urlInput.trim(), name, size: "—", type: "image" }, ...prev]);
    setUrlInput("");
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMedia(prev => [{
          id: Date.now() + Math.random(),
          url: e.target?.result as string,
          name: file.name,
          size: `${(file.size / 1024).toFixed(0)} KB`,
          type: file.type
        }, ...prev]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}
        className={`relative border-2 border-dashed rounded-[24px] p-10 text-center cursor-pointer transition-all
          ${dragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-neutral/40 bg-white hover:border-primary/50 hover:bg-neutral/5"}`}
      >
        <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={e => handleFiles(e.target.files)} />
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Upload size={28} className="text-primary" />
        </div>
        <h3 className="text-lg font-black text-secondary mb-1">Drop images here or click to upload</h3>
        <p className="text-secondary/50 text-sm font-medium">Supports JPG, PNG, WebP, GIF · Max 10MB per file</p>
        <p className="text-xs text-secondary/30 mt-2 font-medium">(Files are stored in-browser for demo. Connect Cloudinary/S3 for production.)</p>
      </div>

      {/* URL Import */}
      <div className="bg-white rounded-[20px] p-5 border border-neutral/20 shadow-sm flex gap-3">
        <div className="relative flex-1">
          <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" size={16} />
          <input
            value={urlInput} onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addByUrl()}
            placeholder="Or paste an image URL and press Enter…"
            className="w-full h-11 pl-10 pr-4 rounded-2xl border border-neutral/40 focus:border-primary focus:outline-none text-sm font-semibold bg-neutral/5"
          />
        </div>
        <button onClick={addByUrl}
          className="px-5 h-11 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary/90 shadow-md shrink-0">
          Add URL
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-secondary/60 font-semibold text-sm">{media.length} items</p>
        <div className="flex gap-2">
          <button onClick={() => setView("grid")}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${view === "grid" ? "bg-primary text-white" : "bg-white border border-neutral/40 text-secondary/50"}`}>
            <Grid size={16} />
          </button>
          <button onClick={() => setView("list")}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${view === "list" ? "bg-primary text-white" : "bg-white border border-neutral/40 text-secondary/50"}`}>
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {media.map(m => (
            <div key={m.id} className="group bg-white rounded-[20px] overflow-hidden border border-neutral/20 shadow-sm hover:shadow-md transition-all">
              <div className="relative aspect-square">
                <img src={m.url} className="w-full h-full object-cover" alt={m.name} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button onClick={() => copyUrl(m.id, m.url)}
                      className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      {copied === m.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-secondary" />}
                    </button>
                    <button onClick={() => setDelId(m.id)}
                      className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors">
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-xs font-bold text-secondary truncate">{m.name}</p>
                <p className="text-[10px] text-secondary/40 font-semibold">{m.size}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[24px] border border-neutral/20 shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-neutral/20 border-b border-neutral/30">
              <tr>
                {["Preview", "Filename", "Type", "Size", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-black text-secondary/60 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {media.map(m => (
                <tr key={m.id} className="border-b border-neutral/10 hover:bg-neutral/5">
                  <td className="px-5 py-3"><img src={m.url} className="w-12 h-12 rounded-xl object-cover" alt="" /></td>
                  <td className="px-5 py-3 font-semibold text-secondary">{m.name}</td>
                  <td className="px-5 py-3 text-secondary/50">{m.type}</td>
                  <td className="px-5 py-3 text-secondary/50">{m.size}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => copyUrl(m.id, m.url)}
                        className={`h-8 px-3 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${copied === m.id ? "bg-green-100 text-green-700" : "bg-neutral/20 text-secondary hover:bg-primary/10 hover:text-primary"}`}>
                        {copied === m.id ? <><Check size={12} />Copied</> : <><Copy size={12} />Copy URL</>}
                      </button>
                      <button onClick={() => setDelId(m.id)} className="w-8 h-8 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirm */}
      {delId !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-500" /></div>
            <h3 className="text-xl font-black text-secondary mb-2">Delete Image?</h3>
            <p className="text-secondary/60 text-sm font-medium mb-6">This will remove the image from the media library.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} className="flex-1 h-11 rounded-2xl border border-neutral/40 font-bold text-sm">Cancel</button>
              <button onClick={() => { setMedia(prev => prev.filter(m => m.id !== delId)); setDelId(null); }}
                className="flex-1 h-11 bg-red-500 text-white rounded-2xl font-bold text-sm hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

