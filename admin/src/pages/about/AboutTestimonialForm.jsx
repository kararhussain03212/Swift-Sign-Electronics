import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createAboutTestimonial, getAboutTestimonial, updateAboutTestimonial } from "../../api/aboutApi";
import { uploadImage } from "../../api/uploadApi";
import ImageUpload from "../../components/ImageUpload";

const EMPTY = {
  rating: 5,
  quote: "",
  name: "",
  title: "",
  avatar: "",
  sort_order: 0,
  is_active: 1,
};

export default function AboutTestimonialForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    getAboutTestimonial(id)
      .then((res) => setForm({ ...EMPTY, ...(res.data?.data || {}) }))
      .catch(() => setError("Failed to load testimonial."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.quote.trim() || !form.name.trim()) {
      setError("Quote and name are required.");
      return;
    }

    const payload = {
      ...form,
      rating: Math.min(5, Math.max(1, Number(form.rating || 5))),
      sort_order: Number(form.sort_order || 0),
      is_active: Number(form.is_active ? 1 : 0),
    };

    setSaving(true);
    try {
      if (avatarFile) {
        payload.avatar = await uploadImage(avatarFile, "about");
      }
      if (isEdit) await updateAboutTestimonial(id, payload);
      else await createAboutTestimonial(payload);
      navigate("/about/testimonials");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-[var(--admin-muted)]">Loading testimonial...</p>;

  const inputCls =
    "w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-2.5 text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]";

  return (
    <section className="mx-auto max-w-2xl space-y-5">
      <header>
        <h2 className="text-3xl font-bold text-[var(--admin-ink)]">{isEdit ? "Edit Testimonial" : "Add Testimonial"}</h2>
        <p className="text-sm text-[var(--admin-ink)]/65">One slide in the "Don't just take our word for it" carousel.</p>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-5">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-[var(--admin-ink)]">Rating *</span>
          <select value={String(form.rating)} onChange={set("rating")} className={inputCls}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n} className="bg-[var(--admin-bg)] text-[var(--admin-ink)]">{n} star{n > 1 ? "s" : ""}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-[var(--admin-ink)]">Quote *</span>
          <textarea value={form.quote} onChange={set("quote")} rows={4} className={inputCls} />
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[var(--admin-ink)]">Name *</span>
            <input value={form.name} onChange={set("name")} className={inputCls} placeholder="e.g. Sarah Ahmed" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[var(--admin-ink)]">Role / Company</span>
            <input value={form.title || ""} onChange={set("title")} className={inputCls} placeholder="e.g. VP Engineering, InnovateX" />
          </label>
        </div>

        <div>
          <span className="mb-1 block text-sm font-semibold text-[var(--admin-ink)]">Avatar</span>
          <ImageUpload value={form.avatar} onFileSelect={setAvatarFile} label="Upload avatar" />
        </div>

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
            {saving ? "Saving..." : isEdit ? "Update Testimonial" : "Create Testimonial"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/about/testimonials")}
            className="rounded-xl border border-[var(--admin-border)] px-6 py-2.5 font-semibold text-[var(--admin-ink)] hover:bg-[var(--admin-bg-deep)]"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
