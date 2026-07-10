import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCategory, getCategory, updateCategory } from "../../api/categoryApi";

const EMPTY = { name: "", cat_key: "", icon: "", sort_order: 0, is_active: 1 };

export default function CategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    getCategory(id)
      .then((res) => setForm({ ...EMPTY, ...(res.data?.data || {}) }))
      .catch(() => setError("Failed to load category."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    const payload = {
      ...form,
      cat_key: form.cat_key.trim() || form.name.trim().toLowerCase().replace(/\s+/g, "-"),
      sort_order: Number(form.sort_order || 0),
      is_active: Number(form.is_active ? 1 : 0),
    };

    setSaving(true);
    try {
      if (isEdit) await updateCategory(id, payload);
      else await createCategory(payload);
      navigate("/categories");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-white/70">Loading category...</p>;

  return (
    <section className="mx-auto max-w-2xl space-y-5">
      <header>
        <h2 className="text-3xl font-bold text-white">{isEdit ? "Edit Category" : "Add Category"}</h2>
        <p className="text-sm text-white/65">Categories group products across the store.</p>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-5">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-white">Name *</span>
          <input
            value={form.name}
            onChange={set("name")}
            className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-2.5 text-white outline-none focus:border-[var(--admin-primary)]"
            placeholder="e.g. Tools"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-white">Key (slug)</span>
          <input
            value={form.cat_key}
            onChange={set("cat_key")}
            className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-2.5 text-white outline-none focus:border-[var(--admin-primary)]"
            placeholder="auto-generated from name if empty"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-white">Icon name</span>
          <input
            value={form.icon || ""}
            onChange={set("icon")}
            className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-2.5 text-white outline-none focus:border-[var(--admin-primary)]"
            placeholder="e.g. BiGridAlt"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-white">Sort order</span>
            <input
              type="number"
              value={form.sort_order}
              onChange={set("sort_order")}
              className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-2.5 text-white outline-none focus:border-[var(--admin-primary)]"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-white">Status</span>
            <select
              value={String(form.is_active)}
              onChange={set("is_active")}
              className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-2.5 text-white outline-none focus:border-[var(--admin-primary)]"
            >
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
            {saving ? "Saving..." : isEdit ? "Update Category" : "Create Category"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/categories")}
            className="rounded-xl border border-white/15 px-6 py-2.5 font-semibold text-white hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
