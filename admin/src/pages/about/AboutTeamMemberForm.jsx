import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createAboutTeamMember, getAboutTeamMember, updateAboutTeamMember } from "../../api/aboutApi";
import { uploadImage } from "../../api/uploadApi";
import ImageUpload from "../../components/ImageUpload";

const EMPTY = {
  name: "",
  role: "",
  photo: "",
  sort_order: 0,
  is_active: 1,
};

export default function AboutTeamMemberForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    getAboutTeamMember(id)
      .then((res) => setForm({ ...EMPTY, ...(res.data?.data || {}) }))
      .catch(() => setError("Failed to load team member."))
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
      sort_order: Number(form.sort_order || 0),
      is_active: Number(form.is_active ? 1 : 0),
    };

    setSaving(true);
    try {
      if (photoFile) {
        payload.photo = await uploadImage(photoFile, "about", form.photo);
      }
      if (isEdit) await updateAboutTeamMember(id, payload);
      else await createAboutTeamMember(payload);
      navigate("/about/team-members");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-[var(--admin-muted)]">Loading team member...</p>;

  const inputCls =
    "w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-2.5 text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]";

  return (
    <section className="mx-auto max-w-2xl space-y-5">
      <header>
        <h2 className="text-3xl font-bold text-[var(--admin-ink)]">{isEdit ? "Edit Team Member" : "Add Team Member"}</h2>
        <p className="text-sm text-[var(--admin-ink)]/65">Shown in "The minds behind the magic" section.</p>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-5">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-[var(--admin-ink)]">Name *</span>
          <input value={form.name} onChange={set("name")} className={inputCls} placeholder="e.g. Sir Tahir" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-[var(--admin-ink)]">Role</span>
          <input value={form.role || ""} onChange={set("role")} className={inputCls} placeholder="e.g. Co-Founder & CEO" />
        </label>

        <div>
          <span className="mb-1 block text-sm font-semibold text-[var(--admin-ink)]">Photo</span>
          <ImageUpload value={form.photo} onFileSelect={setPhotoFile} label="Upload photo" />
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
            {saving ? "Saving..." : isEdit ? "Update Member" : "Create Member"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/about/team-members")}
            className="rounded-xl border border-[var(--admin-border)] px-6 py-2.5 font-semibold text-[var(--admin-ink)] hover:bg-[var(--admin-bg-deep)]"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
