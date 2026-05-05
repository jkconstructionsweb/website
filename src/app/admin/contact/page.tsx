"use client";
import { useState, useEffect } from "react";
import { Save, Phone, Mail, MapPin, Clock, Share2, Plus, Trash2, MessageCircle } from "lucide-react";

export default function AdminContact() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/contact", { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setMessage({ type: "success", text: "Contact details updated successfully!" });
      } else {
        setMessage({ type: "error", text: resData.error || "Failed to update details." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network or Server Error." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const updateField = (field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateSocial = (platform: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      socials: { ...prev.socials, [platform]: value },
    }));
  };

  const addHourRow = () => {
    setData((prev: any) => ({
      ...prev,
      businessHours: [...(prev.businessHours || []), ""],
    }));
  };

  const updateHourRow = (index: number, value: string) => {
    const newHours = [...data.businessHours];
    newHours[index] = value;
    updateField("businessHours", newHours);
  };

  const removeHourRow = (index: number) => {
    const newHours = data.businessHours.filter((_: any, i: number) => i !== index);
    updateField("businessHours", newHours);
  };

  if (loading) {
    return <div className="text-center py-20 font-bold text-secondary/40">Loading Contact Information...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between border-b border-neutral/10 pb-6">
        <div>
          <h2 className="text-2xl font-black text-secondary">Contact Settings</h2>
          <p className="text-secondary/50 text-sm font-medium">Manage global contact channels and office details</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-primary/90 shadow-lg shadow-primary/30 disabled:opacity-50 transition-all"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
          {saving ? "Saving Changes..." : "Save Settings"}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${message.type === "success" ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-500 border border-red-200"}`}>
          {message.text}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Basic Contact */}
        <section className="bg-white rounded-[32px] p-8 border border-neutral/10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Phone size={20} />
            </div>
            <h3 className="font-black text-lg text-secondary">Phone & WhatsApp</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-secondary/40 uppercase tracking-widest mb-2">Primary Phone</label>
              <input
                value={data.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full h-12 px-4 rounded-xl border-2 border-neutral/10 focus:border-primary focus:outline-none font-bold text-secondary bg-neutral/5"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-secondary/40 uppercase tracking-widest mb-2">Secondary Phone</label>
              <input
                value={data.alternatePhone}
                onChange={(e) => updateField("alternatePhone", e.target.value)}
                className="w-full h-12 px-4 rounded-xl border-2 border-neutral/10 focus:border-primary focus:outline-none font-bold text-secondary bg-neutral/5"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-secondary/40 uppercase tracking-widest mb-2">WhatsApp Number</label>
              <div className="relative">
                <MessageCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" />
                <input
                  value={data.whatsapp}
                  onChange={(e) => updateField("whatsapp", e.target.value)}
                  placeholder="+91..."
                  className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-neutral/10 focus:border-primary focus:outline-none font-bold text-secondary bg-neutral/5"
                />
              </div>
              <p className="text-[10px] text-secondary/40 mt-1 font-bold">Include country code (e.g. +91 98765...)</p>
            </div>
          </div>
        </section>

        {/* Email Settings */}
        <section className="bg-white rounded-[32px] p-8 border border-neutral/10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Mail size={20} />
            </div>
            <h3 className="font-black text-lg text-secondary">Email Addresses</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-secondary/40 uppercase tracking-widest mb-2">General Inquiries</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="w-full h-12 px-4 rounded-xl border-2 border-neutral/10 focus:border-primary focus:outline-none font-bold text-secondary bg-neutral/5"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-secondary/40 uppercase tracking-widest mb-2">Projects / Support</label>
              <input
                type="email"
                value={data.alternateEmail}
                onChange={(e) => updateField("alternateEmail", e.target.value)}
                className="w-full h-12 px-4 rounded-xl border-2 border-neutral/10 focus:border-primary focus:outline-none font-bold text-secondary bg-neutral/5"
              />
            </div>
          </div>
        </section>

        {/* Address & Maps */}
        <section className="bg-white rounded-[32px] p-8 border border-neutral/10 shadow-sm space-y-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <h3 className="font-black text-lg text-secondary">Location & Address</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-secondary/40 uppercase tracking-widest mb-2">Physical Address</label>
              <textarea
                value={data.address}
                onChange={(e) => updateField("address", e.target.value)}
                rows={3}
                placeholder="Full office address..."
                className="w-full px-4 py-3 rounded-xl border-2 border-neutral/10 focus:border-primary focus:outline-none font-bold text-secondary bg-neutral/5 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-secondary/40 uppercase tracking-widest mb-2">Google Maps Embed/Search Link</label>
              <input
                value={data.mapLink}
                onChange={(e) => updateField("mapLink", e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full h-12 px-4 rounded-xl border-2 border-neutral/10 focus:border-primary focus:outline-none font-bold text-secondary bg-neutral/5"
              />
              <p className="text-[10px] text-secondary/40 mt-1 font-bold">The link used when users click "Get Directions"</p>
            </div>
          </div>
        </section>

        {/* Business Hours */}
        <section className="bg-white rounded-[32px] p-8 border border-neutral/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                <Clock size={20} />
              </div>
              <h3 className="font-black text-lg text-secondary">Business Hours</h3>
            </div>
            <button
              onClick={addHourRow}
              className="w-8 h-8 bg-neutral/10 text-secondary hover:bg-neutral/20 rounded-full flex items-center justify-center transition-all"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {data.businessHours.map((row: string, i: number) => (
              <div key={i} className="flex gap-2">
                <input
                  value={row}
                  onChange={(e) => updateHourRow(i, e.target.value)}
                  placeholder="e.g. Mon - Fri: 9AM - 6PM"
                  className="flex-1 h-11 px-4 rounded-xl border-2 border-neutral/10 focus:border-primary focus:outline-none font-bold text-secondary bg-neutral/5 text-sm"
                />
                <button
                  onClick={() => removeHourRow(i)}
                  className="w-11 h-11 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl flex items-center justify-center transition-all shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Social Media */}
        <section className="bg-white rounded-[32px] p-8 border border-neutral/10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Share2 size={20} />
            </div>
            <h3 className="font-black text-lg text-secondary">Social Profiles</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-1.5">Instagram</label>
              <input
                value={data.socials?.instagram || ""}
                onChange={(e) => updateSocial("instagram", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border-2 border-neutral/10 focus:border-primary focus:outline-none font-bold text-secondary bg-neutral/5 text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-1.5">LinkedIn</label>
              <input
                value={data.socials?.linkedin || ""}
                onChange={(e) => updateSocial("linkedin", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border-2 border-neutral/10 focus:border-primary focus:outline-none font-bold text-secondary bg-neutral/5 text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-1.5">Facebook</label>
              <input
                value={data.socials?.facebook || ""}
                onChange={(e) => updateSocial("facebook", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border-2 border-neutral/10 focus:border-primary focus:outline-none font-bold text-secondary bg-neutral/5 text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-secondary/40 uppercase tracking-widest mb-1.5">Twitter</label>
              <input
                value={data.socials?.twitter || ""}
                onChange={(e) => updateSocial("twitter", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border-2 border-neutral/10 focus:border-primary focus:outline-none font-bold text-secondary bg-neutral/5 text-sm"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
