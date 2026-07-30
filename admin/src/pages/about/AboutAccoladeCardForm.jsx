import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createAboutAccoladeCard, getAboutAccoladeCard, updateAboutAccoladeCard } from "../../api/aboutApi";

const EMPTY = {
  icon: "",
  badge_text: "",
  title: "",
  description: "",
  size_variant: "standard",
  sort_order: 0,
  is_active: 1,
};

const ICON_OPTIONS = ["FiAward", "FiCheckCircle", "FiTarget", "FiStar", "FiCpu", "FiActivity", "FiUsers", "FiGlobe"];

export default function AboutAccoladeCardForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    getAboutAccoladeCard(id)
      .then((res) => setForm({ ...EMPTY, ...(res.data?.data || {}) }))
      .catch(() => setError("Failed to load accolade card."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    const payload = {
      ...form,
      sort_order: Number(form.sort_order || 0),
      is_active: Number(form.is_active ? 1 : 0),
    };

    setSaving(true);
    try {
      if (isEdit) await updateAboutAccoladeCard(id, payload);
      else await createAboutAccoladeCard(payload);
      navigate("/about/accolades");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-[var(--admin-muted)]">Loading accolade card...</p>;

  const inputCls =
    "w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-2.5 text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]";

  return (
    <section className="mx-auto max-w-2xl space-y-5">
      <header>
        <h2 className="text-3xl font-bold text-[var(--admin-ink)]">{isEdit ? "Edit Accolade" : "Add Accolade"}</h2>
        <p className="text-sm text-[var(--admin-ink)]/65">An award or certification shown in the "Certified Excellence" section.</p>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-5">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-[var(--admin-ink)]">Size / Layout *</span>
          <select value={form.size_variant} onChange={set("size_variant")} className={inputCls}>
            <option value="featured" className="bg-[var(--admin-bg)] text-[var(--admin-ink)]">Featured (large, badge pill top-right)</option>
            <option value="standard" className="bg-[var(--admin-bg)] text-[var(--admin-ink)]">Standard (small, label above title)</option>
            <option value="wide" className="bg-[var(--admin-bg)] text-[var(--admin-ink)]">Wide (horizontal, inline badge next to title)</option>
          </select>
          <p className="mt-1 text-xs text-[var(--admin-muted-light)]">New cards default to Standard, which fits the grid at any count.</p>
        </label>

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
          <span className="mb-1 block text-sm font-semibold text-[var(--admin-ink)]">Badge Text</span>
          <input value={form.badge_text || ""} onChange={set("badge_text")} className={inputCls} placeholder="e.g. 2024, Certification, Compliance" />
          <p className="mt-1 text-xs text-[var(--admin-muted-light)]">Rendered as a year pill (Featured), a label above the title (Standard), or an inline tag (Wide) — same field, different position depending on the layout above.</p>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-[var(--admin-ink)]">Title *</span>
          <input value={form.title} onChange={set("title")} className={inputCls} placeholder="e.g. Tech Innovator of the Year" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-[var(--admin-ink)]">Description</span>
          <textarea value={form.description || ""} onChange={set("description")} rows={3} className={inputCls} />
        </label>

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
            {saving ? "Saving..." : isEdit ? "Update Accolade" : "Create Accolade"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/about/accolades")}
            className="rounded-xl border border-[var(--admin-border)] px-6 py-2.5 font-semibold text-[var(--admin-ink)] hover:bg-[var(--admin-bg-deep)]"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
