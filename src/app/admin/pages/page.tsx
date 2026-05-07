"use client";
import { useEffect, useState } from "react";
import { Save, Layout } from "lucide-react";

export default function AdminPages() {
  const [pages] = useState(["home"]); // We start with home
  const [selectedPage, setSelectedPage] = useState("home");
  const [data, setData] = useState<any>({ hero: { slides: [], stats: [] } });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/pages?pageName=${selectedPage}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        // Provide decent fallbacks if DB is empty for 'home'
        if (selectedPage === "home" && (!d.sections || !d.sections.hero || d.sections.hero.slides.length === 0)) {
          setData({
            hero: {
              slides: [
                {
                  heading: "Build the Home\\nYou Deserve",
                  sub: "Premium villas and residences crafted with uncompromising quality across Gurugram & NCR.",
                  tag: "Luxury Residential",
                  image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80",
                  ctaLabel: "View Residential Projects",
                  ctaHref: "/projects?filter=Residential"
                },
                {
                  heading: "Spaces That\\nDrive Business",
                  sub: "Corporate campuses, retail destinations, and industrial facilities built for performance and scale.",
                  tag: "Commercial Excellence",
                  image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80",
                  ctaLabel: "Explore Commercial Work",
                  ctaHref: "/projects?filter=Commercial"
                },
                {
                  heading: "Interiors That\\nInspire Living",
                  sub: "Bespoke spaces designed with smart-home technology and handcrafted luxury finishes.",
                  tag: "Premium Interiors",
                  image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=1920&q=80",
                  ctaLabel: "See Interior Projects",
                  ctaHref: "/projects?filter=Interior"
                }
              ],
              stats: [
                { value: "500+", label: "Projects" },
                { value: "15 yrs", label: "Experience" },
                { value: "98%", label: "Satisfaction" },
                { value: "ISO", label: "9001:2015" }
              ]
            }
          });
        } else {
          setData(d.sections || { hero: { slides: [], stats: [] } });
        }
        setLoading(false);
      });
  }, [selectedPage]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        body: JSON.stringify({ pageName: selectedPage, sections: data }),
        headers: { "Content-Type": "application/json" }
      });
      const resData = await res.json();
      if (!res.ok || resData.error) {
        alert("Error saving: " + (resData.error || "Server Error"));
      } else {
        alert("Page Saved Successfully!");
      }
    } catch (e) {
      alert("Network or Server Error during save.");
    }
    setSaving(false);
  };

  const updateSlide = (index: number, field: string, value: string) => {
    const newSlides = [...data.hero.slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setData({ ...data, hero: { ...data.hero, slides: newSlides } });
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImageIndex(index);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const resData = await res.json();
      
      if (res.ok && resData.url) {
        const newSlides = [...data.hero.slides];
        newSlides[index] = { ...newSlides[index], image: resData.url };
        setData({ ...data, hero: { ...data.hero, slides: newSlides } });
      } else {
        alert("Image upload failed: " + (resData.error || "Unknown error"));
      }
    } catch (err) {
      alert("Network error during image upload");
    } finally {
      setUploadingImageIndex(null);
    }
  };

  const addSlide = () => {
    const newSlides = [...(data.hero.slides || []), { heading: "New Slide", sub: "...", tag: "New", image: "", ctaLabel: "Learn More", ctaHref: "#" }];
    setData({ ...data, hero: { ...data.hero, slides: newSlides } });
  };

  const removeSlide = (index: number) => {
    const newSlides = data.hero.slides.filter((_: any, i: number) => i !== index);
    setData({ ...data, hero: { ...data.hero, slides: newSlides } });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center mb-6">
        <Layout className="text-primary" size={24} />
        <h1 className="text-2xl font-black text-secondary">Manage Pages</h1>
      </div>

      <div className="bg-white p-6 rounded-[24px] border border-neutral/20 shadow-sm">
        <label className="block text-sm font-bold text-secondary/60 mb-2">Select Page to Edit</label>
        <select value={selectedPage} onChange={e => setSelectedPage(e.target.value)}
          className="w-full max-w-sm h-11 px-4 rounded-xl border border-neutral/40 focus:border-primary focus:outline-none font-bold text-secondary">
          {pages.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-secondary/50 font-bold">Loading Editor...</div>
      ) : (
        <div className="space-y-6">
          {/* Hero Section Editor */}
          <div className="bg-white p-6 rounded-[24px] border border-neutral/20 shadow-sm">
            <h2 className="text-xl font-black text-secondary mb-4 border-b border-neutral/20 pb-2">Hero Section</h2>
            
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-primary">Slides</h3>
              <button onClick={addSlide} className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-lg hover:bg-primary/20">+ Add Slide</button>
            </div>
            
            <div className="space-y-4">
              {data.hero?.slides?.map((slide: any, index: number) => (
                <div key={index} className="p-4 bg-neutral/5 border border-neutral/20 rounded-xl space-y-3 relative">
                  <button onClick={() => removeSlide(index)} className="absolute top-2 right-2 text-red-500 text-xs font-bold hover:underline">Remove</button>
                  <div>
                    <label className="block text-xs font-bold text-secondary/60 mb-1">Heading</label>
                    <input type="text" value={slide.heading} onChange={e => updateSlide(index, 'heading', e.target.value)} className="w-full h-10 px-3 border border-neutral/30 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-secondary/60 mb-1">Subtext</label>
                    <input type="text" value={slide.sub} onChange={e => updateSlide(index, 'sub', e.target.value)} className="w-full h-10 px-3 border border-neutral/30 rounded-lg text-sm" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-secondary/60 mb-1">Tag (e.g. Luxury)</label>
                      <input type="text" value={slide.tag} onChange={e => updateSlide(index, 'tag', e.target.value)} className="w-full h-10 px-3 border border-neutral/30 rounded-lg text-sm" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-secondary/60 mb-1">Background Image</label>
                      <div className="flex items-center gap-3">
                        {slide.image && <img src={slide.image} className="w-10 h-10 rounded-lg object-cover bg-neutral/10 shrink-0" alt="Preview"/>}
                        <input type="file" accept="image/*" onChange={e => handleImageUpload(index, e)} 
                          disabled={uploadingImageIndex === index}
                          className="w-full border border-neutral/30 rounded-lg text-sm file:mr-3 file:cursor-pointer file:py-2.5 file:px-3 file:border-0 file:bg-primary/10 file:text-primary file:font-semibold hover:file:bg-primary/20 disabled:opacity-50" />
                        {uploadingImageIndex === index && <span className="text-xs text-primary font-bold whitespace-nowrap">Uploading...</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving} className="bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/30 flex items-center gap-2">
              <Save size={18} /> {saving ? "Saving..." : "Save Page"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
