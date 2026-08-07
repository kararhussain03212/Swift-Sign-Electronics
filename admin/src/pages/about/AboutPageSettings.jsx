import { useEffect, useState } from "react";
import { getAboutPageSettings, updateAboutPageSettings } from "../../api/aboutApi";
import ImageUpload from "../../components/ImageUpload";
import { uploadImage } from "../../api/uploadApi";

const inputCls = "w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-card)] px-3 py-2 text-[var(--admin-ink)] placeholder:text-[var(--admin-ink)]/30 focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]";
const labelCls = "mb-1 block text-sm text-[var(--admin-ink)]/80";
const sectionCls = "rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-4 space-y-3";

const EMPTY = {
  hero_badge: "", hero_heading: "", hero_heading_highlight: "", hero_description: "", hero_image: "",
  anatomy_heading: "", anatomy_subheading: "",
  ceo_eyebrow: "", ceo_quote: "", ceo_name: "", ceo_title: "", ceo_photo: "",
  team_heading: "", team_subheading: "",
  accolades_eyebrow: "", accolades_heading: "", accolades_heading_highlight: "", accolades_description: "",
  testimonials_heading: "", testimonials_subheading: "",
};

export default function AboutPageSettings() {
  const [form, setForm] = useState(EMPTY);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [ceoPhotoFile, setCeoPhotoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getAboutPageSettings()
      .then((res) => setForm({ ...EMPTY, ...(res?.data?.data || {}) }))
      .catch(() => setError("Failed to load About page settings."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { ...form };
      if (heroImageFile) payload.hero_image = await uploadImage(heroImageFile, "about", form.hero_image);
      if (ceoPhotoFile) payload.ceo_photo = await uploadImage(ceoPhotoFile, "about", form.ceo_photo);
      await updateAboutPageSettings(payload);
      setForm(payload);
      setToast("About page settings saved!");
    } catch (err) {
      console.error(err);
      setError("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-[var(--admin-muted)]">Loading…</p>;

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <header>
        <h2 className="text-3xl font-bold text-[var(--admin-ink)]">About Page Settings</h2>
        <p className="mt-1 text-sm text-[var(--admin-ink)]/65">
          Edit the hero, anatomy-of-excellence intro, CEO message, team intro, and accolades/testimonials headings.
          Manage the individual cards, team members, and testimonials in their own list screens.
        </p>
      </header>

      {toast ? <div className="rounded-xl bg-green-600/80 px-4 py-2.5 text-sm font-medium text-white">{toast}</div> : null}
      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div> : null}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-6">

        {/* Hero */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-[var(--admin-ink)]">Hero Section</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Badge Text</label>
              <input className={inputCls} value={form.hero_badge} onChange={(e) => setField("hero_badge", e.target.value)} placeholder="About Our Company" />
            </div>
            <div>
              <label className={labelCls}>Heading</label>
              <input className={inputCls} value={form.hero_heading} onChange={(e) => setField("hero_heading", e.target.value)} placeholder="Engineering the" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Highlighted Word(s)</label>
              <input className={inputCls} value={form.hero_heading_highlight} onChange={(e) => setField("hero_heading_highlight", e.target.value)} placeholder="Future of Tech." />
            </div>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={3} className={inputCls} value={form.hero_description} onChange={(e) => setField("hero_description", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Hero Image</label>
            <ImageUpload value={form.hero_image} onFileSelect={setHeroImageFile} label="Upload Hero Image" />
          </div>
        </div>

        {/* Anatomy */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-[var(--admin-ink)]">"Anatomy of Excellence" Section</h3>
          <div>
            <label className={labelCls}>Heading</label>
            <input className={inputCls} value={form.anatomy_heading} onChange={(e) => setField("anatomy_heading", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Subheading</label>
            <textarea rows={2} className={inputCls} value={form.anatomy_subheading} onChange={(e) => setField("anatomy_subheading", e.target.value)} />
          </div>
          <p className="text-xs text-[var(--admin-muted-light)]">The 4 value cards themselves are managed on the Value Cards screen.</p>
        </div>

        {/* CEO */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-[var(--admin-ink)]">CEO Message</h3>
          <div>
            <label className={labelCls}>Eyebrow Label</label>
            <input className={inputCls} value={form.ceo_eyebrow} onChange={(e) => setField("ceo_eyebrow", e.target.value)} placeholder="Message from the CEO" />
          </div>
          <div>
            <label className={labelCls}>Quote</label>
            <textarea rows={4} className={inputCls} value={form.ceo_quote} onChange={(e) => setField("ceo_quote", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Name</label>
              <input className={inputCls} value={form.ceo_name} onChange={(e) => setField("ceo_name", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Title</label>
              <input className={inputCls} value={form.ceo_title} onChange={(e) => setField("ceo_title", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Photo</label>
            <ImageUpload value={form.ceo_photo} onFileSelect={setCeoPhotoFile} label="Upload CEO Photo" />
          </div>
        </div>

        {/* Team */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-[var(--admin-ink)]">Team Section</h3>
          <div>
            <label className={labelCls}>Heading</label>
            <input className={inputCls} value={form.team_heading} onChange={(e) => setField("team_heading", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Subheading</label>
            <textarea rows={2} className={inputCls} value={form.team_subheading} onChange={(e) => setField("team_subheading", e.target.value)} />
          </div>
          <p className="text-xs text-[var(--admin-muted-light)]">Team members are managed on the Team Members screen.</p>
        </div>

        {/* Accolades */}
        {/* <div className={sectionCls}>
          <h3 className="font-semibold text-[var(--admin-ink)]">Accolades Section</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Eyebrow Label</label>
              <input className={inputCls} value={form.accolades_eyebrow} onChange={(e) => setField("accolades_eyebrow", e.target.value)} placeholder="Accolades" />
            </div>
            <div>
              <label className={labelCls}>Heading</label>
              <input className={inputCls} value={form.accolades_heading} onChange={(e) => setField("accolades_heading", e.target.value)} placeholder="Certified" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Highlighted Word(s)</label>
              <input className={inputCls} value={form.accolades_heading_highlight} onChange={(e) => setField("accolades_heading_highlight", e.target.value)} placeholder="Excellence." />
            </div>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={2} className={inputCls} value={form.accolades_description} onChange={(e) => setField("accolades_description", e.target.value)} />
          </div>
          <p className="text-xs text-[var(--admin-muted-light)]">The accolade cards are managed on the Accolades screen.</p>
        </div> */}

        {/* Testimonials */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-[var(--admin-ink)]">Testimonials Section</h3>
          <div>
            <label className={labelCls}>Heading</label>
            <input className={inputCls} value={form.testimonials_heading} onChange={(e) => setField("testimonials_heading", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Subheading</label>
            <textarea rows={2} className={inputCls} value={form.testimonials_subheading} onChange={(e) => setField("testimonials_subheading", e.target.value)} />
          </div>
          <p className="text-xs text-[var(--admin-muted-light)]">Individual testimonials are managed on the Testimonials screen.</p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[var(--admin-primary)] px-6 py-2.5 font-semibold text-black hover:bg-[var(--admin-primary-strong)] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
