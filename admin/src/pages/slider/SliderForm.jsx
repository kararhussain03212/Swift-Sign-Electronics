import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createSlider, getSlider, updateSlider } from "../../api/sliderApi";
import { uploadImage } from "../../api/uploadApi";
import VideoUpload from "../../components/VideoUpload";

const getInitialForm = () => ({
  title: "",
  subtitle: "",
  sort_order: 1,
  is_active: true,
  imageFile: null,
  imagePreview: "",
});

export default function SliderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [form, setForm]       = useState(getInitialForm);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!isEditMode) { setForm(getInitialForm()); setLoading(false); return; }
    (async () => {
      try {
        const res = await getSlider(id);
        const item = res.data?.data ?? {};
        setForm({
          title:                 item.title                || "",
          subtitle:              item.subtitle             || "",
          sort_order:            Number(item.sort_order ?? 1),
          is_active:             item.is_active === 1 || item.is_active === true,
          imageFile:             null,
          imagePreview:          item.image || "",
        });
      } catch {
        setError("Failed to load slider.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.imageFile && !form.imagePreview) {
      setError("Please upload a background image."); return;
    }

    try {
      setSaving(true);

      const payload = {
        title:                 form.title.trim(),
        subtitle:              form.subtitle.trim(),
        sort_order:            Number(form.sort_order || 1),
        is_active:             form.is_active ? 1 : 0,
      };

      if (form.imageFile) {
        const oldPath = isEditMode && form.imagePreview ? form.imagePreview.replace(/^.*\/uploads\//, "") : "";
        payload.image = await uploadImage(form.imageFile, "hero", oldPath);
      } else if (form.imagePreview) {
        payload.image = form.imagePreview.replace(/.*\/uploads\//, "");
      }

      if (isEditMode) await updateSlider(id, payload);
      else await createSlider(payload);

      navigate("/sliders");
    } catch (err) {
      if (err?.response?.status === 401) { navigate("/login", { replace: true }); return; }
      setError(err?.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-[var(--admin-muted)]">Loading slider…</div>;

  const inputCls = "w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-card)] px-3 py-2 text-[var(--admin-ink)]";
  const labelCls = "mb-1 block text-sm text-[var(--admin-ink)]/80";

  return (
    <section className="mx-auto max-w-3xl">
      <h2 className="mb-4 text-2xl font-bold text-[var(--admin-ink)]">
        {isEditMode ? "Edit Hero Slide" : "Add Hero Slide"}
      </h2>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-6">

        {/* Title */}
        <div>
          <label className={labelCls}>Title *</label>
          <input value={form.title} onChange={(e) => setField("title", e.target.value)} required className={inputCls} placeholder="Pure by Nature - Proven by Integrity." />
        </div>

        {/* Subtitle */}
        <div>
          <label className={labelCls}>Subtitle</label>
          <textarea rows={3} value={form.subtitle} onChange={(e) => setField("subtitle", e.target.value)} className={inputCls} placeholder="Explore quality electronics, tools, and instruments." />
        </div>

        {/* Sort & Active */}
        <div className="flex items-center gap-6">
          <div>
            <label className={labelCls}>Sort Order</label>
            <input type="number" min="1" value={form.sort_order} onChange={(e) => setField("sort_order", Number(e.target.value))} className="w-24 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-card)] px-3 py-2 text-[var(--admin-ink)]" />
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--admin-ink)]/80 mt-5">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setField("is_active", e.target.checked)} className="h-4 w-4" />
            Show on frontend
          </label>
        </div>

        {/* Background Image Upload */}
        <VideoUpload
          value={form.imagePreview}
          onFileSelect={(file) => setField("imageFile", file)}
          label="Upload Background Image"
          helperText={isEditMode ? "Upload to replace the current background image" : "PNG, JPG, WebP, or other image formats"}
          accept="image/*"
        />

        {/* Submit */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={saving} className="rounded-lg bg-[var(--admin-primary)] px-5 py-2 text-black hover:bg-[var(--admin-primary-strong)] disabled:opacity-60">
            {saving ? "Saving…" : isEditMode ? "Update Slide" : "Create Slide"}
          </button>
          <button type="button" onClick={() => navigate("/sliders")} className="rounded-lg border border-[var(--admin-border)] px-5 py-2 text-[var(--admin-ink)] hover:bg-[var(--admin-bg-deep)]">
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
