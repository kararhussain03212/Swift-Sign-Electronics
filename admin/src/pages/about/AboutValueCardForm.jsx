import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createAboutValueCard, getAboutValueCard, updateAboutValueCard } from "../../api/aboutApi";
import { uploadImage } from "../../api/uploadApi";
import ImageUpload from "../../components/ImageUpload";

const EMPTY = {
  icon: "",
  title: "",
  description: "",
  style_variant: "light",
  image: "",
  sort_order: 0,
  is_active: 1,
};

const ICON_OPTIONS = ["FiCpu", "FiActivity", "FiUsers", "FiTarget", "FiAward", "FiCheckCircle", "FiStar", "FiGlobe"];

export default function AboutValueCardForm() {
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
    getAboutValueCard(id)
      .then((res) => setForm({ ...EMPTY, ...(res.data?.data || {}) }))
      .catch(() => setError("Failed to load value card."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const isImageVariant = form.style_variant === "image";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isImageVariant && !form.image && !imageFile) {
      setError("An image is required for the image variant.");
      return;
    }
    if (!isImageVariant && !form.title.trim()) {
      setError("Title is required for text-based cards.");
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
        payload.image = await uploadImage(imageFile, "about", form.image);
      }
      if (isEdit) await updateAboutValueCard(id, payload);
      else await createAboutValueCard(payload);
      navigate("/about/value-cards");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-[var(--admin-muted)]">Loading value card...</p>;

  const inputCls =
    "w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-2.5 text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]";

  return (
    <section className="mx-auto max-w-2xl space-y-5">
      <header>
        <h2 className="text-3xl font-bold text-[var(--admin-ink)]">{isEdit ? "Edit Value Card" : "Add Value Card"}</h2>
        <p className="text-sm text-[var(--admin-ink)]/65">One slot in the "anatomy of excellence" grid on the About Us page.</p>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-5">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-[var(--admin-ink)]">Style *</span>
          <select value={form.style_variant} onChange={set("style_variant")} className={inputCls}>
            <option value="light" className="bg-[var(--admin-bg)] text-[var(--admin-ink)]">Light (large card)</option>
            <option value="dark" className="bg-[var(--admin-bg)] text-[var(--admin-ink)]">Dark (small card)</option>
            <option value="gradient" className="bg-[var(--admin-bg)] text-[var(--admin-ink)]">Gradient (small card)</option>
            <option value="image" className="bg-[var(--admin-bg)] text-[var(--admin-ink)]">Image only</option>
          </select>
        </label>

        {isImageVariant ? (
          <div>
            <span className="mb-1 block text-sm font-semibold text-[var(--admin-ink)]">Image *</span>
            <ImageUpload value={form.image} onFileSelect={setImageFile} label="Upload decorative image" />
          </div>
        ) : (
          <>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-[var(--admin-ink)]">Icon</span>
              <select value={form.icon || ""} onChange={set("icon")} className={inputCls}>
                <option value="" className="bg-[var(--admin-bg)] text-[var(--admin-ink)]">Select icon…</option>
                {ICON_OPTIONS.map((name) => (
                  <option key={name} value={name} className="bg-[var(--admin-bg)] text-[var(--admin-ink)]">{name}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-[var(--admin-ink)]">Title *</span>
              <input value={form.title || ""} onChange={set("title")} className={inputCls} placeholder="e.g. Relentless Pursuit of Quality" />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-[var(--admin-ink)]">Description</span>
              <textarea value={form.description || ""} onChange={set("description")} rows={3} className={inputCls} />
            </label>
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[var(--admin-ink)]">Sort order</span>
            <input type="number" value={form.sort_order} onChange={set("sort_order")} className={inputCls} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[var(--admin-ink)]">Status</span>
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
            className="rounded-xl bg-[var(--admin-primary)] px-6 py-2.5 font-semibold text-[var(--admin-ink)] hover:bg-[var(--admin-primary-strong)] disabled:opacity-50"
          >
            {saving ? "Saving..." : isEdit ? "Update Card" : "Create Card"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/about/value-cards")}
            className="rounded-xl border border-[var(--admin-border)] px-6 py-2.5 font-semibold text-[var(--admin-ink)] hover:bg-[var(--admin-bg-deep)]"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
