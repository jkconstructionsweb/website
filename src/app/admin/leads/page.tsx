"use client";
import { useEffect, useState } from "react";
import { Search, Download, Mail, Phone, Calendar, Filter } from "lucide-react";

const SOURCES = ["All", "Contact", "Estimator"];

const DATE = (d: string) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

const MOCK_LEADS = [
  { _id: "1", name: "Rajesh Sharma", phone: "+91 98765 43210", email: "rajesh@email.com", source: "Contact", service: "Residential Construction", message: "Need quote for a 4BHK villa in Sector 57", createdAt: new Date("2025-04-15").toISOString() },
  { _id: "2", name: "Priya Mehta", phone: "+91 87654 32109", email: "priya@email.com", source: "Estimator", plotSize: "1200", floors: "2", materialType: "Premium", estimatedCost: "₹76,80,000", createdAt: new Date("2025-04-16").toISOString() },
  { _id: "3", name: "Amit Bose", phone: "+91 76543 21098", email: "", source: "Contact", service: "Commercial Projects", message: "Office space of 5000 sq ft in Cyber Hub", createdAt: new Date("2025-04-17").toISOString() },
  { _id: "4", name: "Sunita Rao", phone: "+91 65432 10987", email: "sunita@email.com", source: "Estimator", plotSize: "800", floors: "1", materialType: "Standard", estimatedCost: "₹17,60,000", createdAt: new Date("2025-04-17").toISOString() },
];

export default function AdminLeads() {
  const [leads, setLeads]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [source, setSource]     = useState("All");
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/leads")
      .then(r => r.json())
      .then(d => {
        const data = Array.isArray(d) && d.length > 0 ? d : MOCK_LEADS;
        setLeads(data);
        setLoading(false);
      })
      .catch(() => { setLeads(MOCK_LEADS); setLoading(false); });
  }, []);

  const filtered = leads
    .filter(l => source === "All" || l.source === source)
    .filter(l => l.name?.toLowerCase().includes(search.toLowerCase()) || l.phone?.includes(search));

  const exportCSV = () => {
    const header = "Name,Phone,Email,Source,Service,Message,Date\n";
    const rows = filtered.map(l =>
      `"${l.name}","${l.phone}","${l.email || ""}","${l.source}","${l.service || ""}","${l.message || l.estimatedCost || ""}","${l.createdAt ? new Date(l.createdAt).toLocaleDateString() : ""}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = "jk_leads.csv"; a.click();
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Leads",   val: leads.length, color: "bg-primary" },
          { label: "Contact Form",  val: leads.filter(l => l.source === "Contact").length,   color: "bg-blue-500" },
          { label: "Estimator",     val: leads.filter(l => l.source === "Estimator").length, color: "bg-purple-500" },
          { label: "Today",         val: leads.filter(l => l.createdAt && new Date(l.createdAt).toDateString() === new Date().toDateString()).length, color: "bg-green-500" },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-white rounded-[20px] p-5 border border-neutral/20 shadow-sm">
            <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
              <Filter size={16} className="text-white" />
            </div>
            <div className="text-3xl font-black text-secondary">{val}</div>
            <p className="text-xs font-bold text-secondary/50 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads…"
              className="h-10 pl-9 pr-4 rounded-full border border-neutral/40 focus:border-primary focus:outline-none text-sm font-medium bg-white w-52" />
          </div>
          <div className="flex gap-2">
            {SOURCES.map(s => (
              <button key={s} onClick={() => setSource(s)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${source === s ? "bg-primary text-white" : "bg-white border border-neutral/40 text-secondary/60 hover:bg-neutral/20"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 bg-white border border-neutral/40 text-secondary px-4 py-2 rounded-full text-sm font-bold hover:bg-neutral/10">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] border border-neutral/20 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-neutral/20 border-b border-neutral/30">
            <tr>
              {["Name & Contact", "Source", "Details", "Date", "Action"].map(h => (
                <th key={h} className="text-left px-5 py-4 text-xs font-black text-secondary/60 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(4)].map((_, i) => <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-10 bg-neutral/20 rounded-xl animate-pulse" /></td></tr>)
            ) : filtered.map((l, i) => (
              <tr key={l._id || i} className="border-b border-neutral/10 hover:bg-neutral/5 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black text-base shrink-0">
                      {(l.name || "?")[0]}
                    </div>
                    <div>
                      <p className="font-bold text-secondary">{l.name}</p>
                      <p className="text-xs text-secondary/50 flex items-center gap-1"><Phone size={10} /> {l.phone}</p>
                      {l.email && <p className="text-xs text-secondary/50 flex items-center gap-1"><Mail size={10} /> {l.email}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${l.source === "Estimator" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                    {l.source}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {l.source === "Estimator" ? (
                    <div className="text-xs space-y-0.5">
                      <p className="font-semibold text-secondary">{l.plotSize} sq.ft · {l.floors} floor(s)</p>
                      <p className="text-secondary/60">{l.materialType} · <span className="font-bold text-primary">{l.estimatedCost}</span></p>
                    </div>
                  ) : (
                    <p className="text-xs text-secondary/70 font-medium line-clamp-2 max-w-[200px]">{l.service || l.message}</p>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs text-secondary/50 font-semibold flex items-center gap-1 whitespace-nowrap">
                    <Calendar size={11} /> {DATE(l.createdAt)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button onClick={() => setSelected(l)}
                    className="text-xs bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && <div className="text-center py-12 text-secondary/40 font-semibold">No leads found.</div>}
      </div>

      {/* Lead Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-secondary px-6 py-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white">Lead Details</h3>
                <button onClick={() => setSelected(null)} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Name", value: selected.name },
                { label: "Phone", value: selected.phone },
                { label: "Email", value: selected.email || "Not provided" },
                { label: "Source", value: selected.source },
                { label: "Service", value: selected.service || "—" },
                ...(selected.source === "Estimator" ? [
                  { label: "Plot Size", value: `${selected.plotSize} sq.ft` },
                  { label: "Floors", value: selected.floors },
                  { label: "Material", value: selected.materialType },
                  { label: "Estimate", value: selected.estimatedCost },
                ] : [
                  { label: "Message", value: selected.message },
                ]),
                { label: "Received", value: DATE(selected.createdAt) },
              ].map(({ label, value }, i) => (
                <div key={`${label}-${i}`} className="flex justify-between items-start gap-4 py-2 border-b border-neutral/10 last:border-0">
                  <span className="text-xs font-black text-secondary/50 uppercase tracking-wider shrink-0">{label}</span>
                  <span className="text-sm font-bold text-secondary text-right">{value}</span>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-neutral/20 flex gap-3">
              <a href={`tel:${selected.phone}`} className="flex-1 h-11 bg-primary text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90">
                <Phone size={16} /> Call Lead
              </a>
              <a href={`https://wa.me/${selected.phone?.replace(/[^0-9]/g, "")}?text=Hi ${selected.name}, this is JK Constructions regarding your enquiry.`} target="_blank"
                className="flex-1 h-11 bg-green-500 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-600">
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

