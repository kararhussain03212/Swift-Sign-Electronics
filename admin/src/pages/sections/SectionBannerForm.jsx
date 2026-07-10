import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createSectionBanner, getSectionBanner, updateSectionBanner } from "../../api/sectionBannerApi";
import { uploadImage } from "../../api/uploadApi";
import ImageUpload from "../../components/ImageUpload";

const EMPTY = {
  section_key: "",
  kicker: "",
  title: "",
  subtitle: "",
  description: "",
  bg_image: "",
  sort_order: 0,
  is_active: 1,
};

export default function SectionBannerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    getSectionBanner(id)
      .then((res) => setForm({ ...EMPTY, ...(res.data?.data || {}) }))
      .catch(() => setError("Failed to load section banner."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.section_key.trim() || !form.title.trim()) {
      setError("Section key and title are required.");
      return;
    }

    const payload = {
      ...form,
      sort_order: Number(form.sort_order || 0),
      is_active: Number(form.is_active ? 1 : 0),
    };

    setSaving(true);
    try {
      if (imageFile) {
        payload.bg_image = await uploadImage(imageFile, "sections");
      }
      if (isEdit) await updateSectionBanner(id, payload);
      else await createSectionBanner(payload);
      navigate("/section-banners");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-white/70">Loading section banner...</p>;

  const inputCls =
    "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-2.5 text-white outline-none focus:border-[var(--admin-primary)]";

  return (
    <section className="mx-auto max-w-2xl space-y-5">
      <header>
        <h2 className="text-3xl font-bold text-white">{isEdit ? "Edit Section Banner" : "Add Section Banner"}</h2>
        <p className="text-sm text-white/65">Shown above the product slider for each home page section.</p>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-white">Section key *</span>
            <select value={form.section_key} onChange={set("section_key")} className={inputCls}>
              <option value="">Select section…</option>
              <option value="tools">tools</option>
              <option value="instruments">instruments</option>
              <option value="projects">projects</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-white">Kicker</span>
            <input value={form.kicker || ""} onChange={set("kicker")} className={inputCls} placeholder="e.g. TOOLS ESSENTIALS" />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-white">Title *</span>
          <input value={form.title} onChange={set("title")} className={inputCls} placeholder="e.g. Professional Digital Soldering Station" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-white">Subtitle</span>
          <input value={form.subtitle || ""} onChange={set("subtitle")} className={inputCls} />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-white">Description</span>
          <textarea value={form.description || ""} onChange={set("description")} rows={3} className={inputCls} />
        </label>

        <div>
          <span className="mb-1 block text-sm font-semibold text-white">Background image</span>
          <ImageUpload
            value={form.bg_image}
            onFileSelect={(file) => setImageFile(file)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-white">Sort order</span>
            <input type="number" value={form.sort_order} onChange={set("sort_order")} className={inputCls} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-white">Status</span>
            <select value={String(form.is_active)} onChange={set("is_active")} className={inputCls}>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[var(--admin-primary)] px-6 py-2.5 font-semibold text-white hover:bg-[var(--admin-primary-strong)] disabled:opacity-50"
          >
            {saving ? "Saving..." : isEdit ? "Update Banner" : "Create Banner"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/section-banners")}
            className="rounded-xl border border-white/15 px-6 py-2.5 font-semibold text-white hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
