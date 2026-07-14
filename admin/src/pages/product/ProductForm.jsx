import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageUpload from "../../components/ImageUpload";
import RichTextEditor from "../../components/RichTextEditor";
import { createProduct, getProduct, updateProduct } from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";
import { uploadImage } from "../../api/uploadApi";
import { getBackendRoot } from "../../api/runtimeApi";

const FALLBACK_CATEGORIES = ["Tools", "Instruments", "Projects", "Components"];

function parseJson(value, fallback) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return value;
  if (typeof value === "string" && value.trim()) {
    try { return JSON.parse(value); } catch { return fallback; }
  }
  return fallback;
}

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const getInitialForm = () => ({
  name: "", slug: "", category: "Tools", brand: "", model: "",
  price: "", discount: "", rating: "5", reviews: "0", stock: "0",
  images: [],
  imageFiles: [],
  description: "",
  overview: "",
  purpose: "",
  features: [""],
  applications: [""],
  advantages: [""],
  specifications: [{ key: "", value: "" }],
  shipping_list: [{ name: "", count: 1 }],
  documents: [{ name: "", url: "", size: "" }],
  faqs: [{ q: "", a: "" }],
  featured: false,
  sort_order: 0,
  is_active: true,
});

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading]     = useState(isEditMode);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [form, setForm]           = useState(getInitialForm);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);

  const apiRoot = useMemo(() => getBackendRoot(), []);

  const toImageUrl = useCallback((v) => {
    if (!v) return "";
    if (v.startsWith("http")) return v;
    if (v.startsWith("/uploads/")) return apiRoot + v;
    if (v.startsWith("/")) return v;
    return `${apiRoot}/uploads/${v}`;
  }, [apiRoot]);

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  useEffect(() => {
    getCategories()
      .then((res) => {
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        if (list.length) setCategories(list.map((c) => c.name));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEditMode) { setForm(getInitialForm()); setLoading(false); return; }
    (async () => {
      try {
        const res = await getProduct(id);
        const item = res?.data?.data ?? res?.data ?? {};
        const images       = parseJson(item.images, []);
        const introduction = parseJson(item.introduction, {});
        const specs        = parseJson(item.specifications, {});
        const shipping     = parseJson(item.shipping_list, []);
        const documents    = parseJson(item.documents, []);
        const faqs         = parseJson(item.faqs, []);

        const specRows = Object.entries(specs).map(([key, value]) => ({ key, value: String(value) }));

        setForm({
          name:         item.name  || "",
          slug:         item.slug  || "",
          category:     item.category || "Tools",
          brand:        item.brand || "",
          model:        item.model || "",
          price:        item.price    != null ? String(item.price) : "",
          discount:     item.discount != null ? String(item.discount) : "",
          rating:       item.rating   != null ? String(item.rating) : "5",
          reviews:      item.reviews  != null ? String(item.reviews) : "0",
          stock:        item.stock    != null ? String(item.stock) : "0",
          images:       (Array.isArray(images) ? images : []).map(toImageUrl),
          imageFiles:   [],
          description:  item.description || "",
          overview:     introduction.overview || "",
          purpose:      introduction.purpose || "",
          features:     introduction.features?.length ? introduction.features : [""],
          applications: introduction.applications?.length ? introduction.applications : [""],
          advantages:   introduction.advantages?.length ? introduction.advantages : [""],
          specifications: specRows.length ? specRows : [{ key: "", value: "" }],
          shipping_list:  shipping.length ? shipping : [{ name: "", count: 1 }],
          documents:    documents.length ? documents : [{ name: "", url: "", size: "" }],
          faqs:         faqs.length ? faqs : [{ q: "", a: "" }],
          featured:     item.featured === 1 || item.featured === true,
          sort_order:   Number(item.sort_order || 0),
          is_active:    item.is_active === 1 || item.is_active !== false,
        });
      } catch { setError("Failed to load product."); }
      finally { setLoading(false); }
    })();
  }, [id, isEditMode, toImageUrl]);

  const handleNameChange = (val) => {
    setField("name", val);
    if (!isEditMode || !form.slug) setField("slug", slugify(val));
  };

  const handleImageSelect = (file) => {
    const blobUrl = URL.createObjectURL(file);
    setForm((p) => ({
      ...p,
      images: [...p.images, blobUrl],
      imageFiles: [...p.imageFiles, file],
    }));
  };

  const handleRemoveImage = (i) => {
    const url = form.images[i];
    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
      const blobsBefore = form.images.slice(0, i).filter((u) => u.startsWith("blob:")).length;
      setForm((p) => ({
        ...p,
        images: p.images.filter((_, j) => j !== i),
        imageFiles: p.imageFiles.filter((_, j) => j !== blobsBefore),
      }));
    } else {
      setForm((p) => ({ ...p, images: p.images.filter((_, j) => j !== i) }));
    }
  };

  /* string-array editor helper */
  const listEditor = (key, placeholder) => (
    <>
      {form[key].map((v, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={v}
            onChange={(e) => { const u = [...form[key]]; u[i] = e.target.value; setField(key, u); }}
            placeholder={placeholder}
            className="flex-1 rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
          />
          <button type="button" onClick={() => setField(key, form[key].filter((_, j) => j !== i))} className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-300 text-sm">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => setField(key, [...form[key], ""])} className="rounded-lg border border-[var(--admin-border-amber)] bg-[var(--admin-primary)]/15 px-3 py-2 text-sm font-semibold text-[var(--admin-primary)]">+ Add</button>
    </>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) { setError("Product name is required."); return; }
    if (!form.price)       { setError("Price is required."); return; }

    try {
      setSaving(true);

      // Upload new files; keep existing server URLs as-is
      let fileIdx = 0;
      const uploadedImages = [];
      for (const url of form.images) {
        if (url.startsWith("blob:")) {
          const serverUrl = await uploadImage(form.imageFiles[fileIdx++], "products", "");
          uploadedImages.push(serverUrl);
          URL.revokeObjectURL(url);
        } else {
          uploadedImages.push(url);
        }
      }

      const specifications = {};
      for (const row of form.specifications) {
        if (row.key.trim()) specifications[row.key.trim()] = row.value;
      }

      const payload = {
        name:        form.name.trim(),
        slug:        form.slug.trim() || slugify(form.name),
        category:    form.category,
        brand:       form.brand.trim(),
        model:       form.model.trim(),
        price:       Number(form.price || 0),
        discount:    form.discount === "" ? null : Number(form.discount),
        rating:      Number(form.rating || 5),
        reviews:     Number(form.reviews || 0),
        stock:       Number(form.stock || 0),
        thumbnail:   uploadedImages[0] || "",
        images:      JSON.stringify(uploadedImages),
        description: form.description.trim(),
        introduction: JSON.stringify({
          overview:     form.overview.trim(),
          purpose:      form.purpose.trim(),
          features:     form.features.filter((v) => v.trim()),
          applications: form.applications.filter((v) => v.trim()),
          advantages:   form.advantages.filter((v) => v.trim()),
        }),
        specifications: JSON.stringify(specifications),
        shipping_list:  JSON.stringify(form.shipping_list.filter((s) => s.name.trim()).map((s) => ({ name: s.name.trim(), count: Number(s.count || 1) }))),
        documents:   JSON.stringify(form.documents.filter((d) => d.name.trim()).map((d) => ({ name: d.name.trim(), url: d.url.trim(), size: d.size.trim() }))),
        faqs:        JSON.stringify(form.faqs.filter((f) => f.q.trim()).map((f) => ({ q: f.q.trim(), a: f.a.trim() }))),
        featured:    form.featured ? 1 : 0,
        sort_order:  Number(form.sort_order || 0),
        is_active:   form.is_active ? 1 : 0,
      };

      if (isEditMode) await updateProduct(id, payload);
      else await createProduct(payload);

      navigate("/products");
    } catch (err) {
      if (err?.response?.status === 401) { navigate("/login", { replace: true }); return; }
      setError(err?.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white/70">Loading product…</div>;

  const inputCls = "w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white";
  const labelCls = "mb-1 block text-sm text-white/80";
  const sectionCls = "rounded-xl border border-white/10 bg-[var(--admin-bg)] p-4 space-y-3";

  return (
    <section className="mx-auto max-w-4xl">
      <h2 className="mb-4 text-2xl font-bold text-white">
        {isEditMode ? "Edit Product" : "Add Product"}
      </h2>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-6">

        {/* ── Basic Info ── */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Basic Info</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelCls}>Name *</label>
              <input value={form.name} onChange={(e) => handleNameChange(e.target.value)} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Slug</label>
              <input value={form.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="auto-generated" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select value={form.category} onChange={(e) => setField("category", e.target.value)} className={inputCls}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Brand</label>
              <input value={form.brand} onChange={(e) => setField("brand", e.target.value)} placeholder="e.g. Fluke, Rigol, Weller" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Model</label>
              <input value={form.model} onChange={(e) => setField("model", e.target.value)} placeholder="e.g. WD-80" className={inputCls} />
            </div>
          </div>
        </div>

        {/* ── Pricing & Stock ── */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Pricing & Stock</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <div>
              <label className={labelCls}>Price ($) *</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setField("price", e.target.value)} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Discount (%)</label>
              <input type="number" min="0" max="100" value={form.discount} onChange={(e) => setField("discount", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Rating</label>
              <input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={(e) => setField("rating", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Reviews Count</label>
              <input type="number" min="0" value={form.reviews} onChange={(e) => setField("reviews", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Stock (qty)</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => setField("stock", e.target.value)} className={inputCls} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setField("featured", e.target.checked)} className="h-4 w-4" />
            Featured Product
          </label>
        </div>

        {/* ── Images ── */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Product Images</h3>
          <p className="text-xs text-white/50">The first image is used as the thumbnail.</p>

          {form.images.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {form.images.map((url, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-white/10">
                  <img src={url} alt={`Product ${i + 1}`} className="h-full w-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                  {i === 0 && (
                    <span className="absolute left-1 top-1 rounded bg-[var(--admin-primary)] px-1.5 py-0.5 text-[10px] font-bold text-white">Thumbnail</span>
                  )}
                  {url.startsWith("blob:") && (
                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 text-center text-[10px] font-semibold text-amber-400">
                      New — not saved yet
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute right-1 top-1 rounded-full bg-red-500/90 px-1.5 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <ImageUpload
            value=""
            onFileSelect={handleImageSelect}
            label="Upload Product Image"
            helperText="PNG, JPG — upload one at a time, add as many as needed"
          />
        </div>

        {/* ── Description ── */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Description</h3>
          <div>
            <label className={labelCls}>Short Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => setField("description", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Overview</label>
            <RichTextEditor value={form.overview} onChange={(v) => setField("overview", v)} />
          </div>
          <div>
            <label className={labelCls}>Purpose</label>
            <textarea rows={2} value={form.purpose} onChange={(e) => setField("purpose", e.target.value)} className={inputCls} />
          </div>
        </div>

        {/* ── Features / Applications / Advantages ── */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Key Features</h3>
          {listEditor("features", "Feature…")}
        </div>
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Applications</h3>
          {listEditor("applications", "Application…")}
        </div>
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Advantages</h3>
          {listEditor("advantages", "Advantage…")}
        </div>

        {/* ── Specifications ── */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Specifications</h3>
          {form.specifications.map((row, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={row.key}
                onChange={(e) => { const u = [...form.specifications]; u[i] = { ...u[i], key: e.target.value }; setField("specifications", u); }}
                placeholder="e.g. Operating Voltage"
                className="w-2/5 rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
              />
              <input
                value={row.value}
                onChange={(e) => { const u = [...form.specifications]; u[i] = { ...u[i], value: e.target.value }; setField("specifications", u); }}
                placeholder="e.g. 230V AC / 50Hz"
                className="flex-1 rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
              />
              <button type="button" onClick={() => setField("specifications", form.specifications.filter((_, j) => j !== i))} className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-300 text-sm">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => setField("specifications", [...form.specifications, { key: "", value: "" }])} className="rounded-lg border border-[var(--admin-border-amber)] bg-[var(--admin-primary)]/15 px-3 py-2 text-sm font-semibold text-[var(--admin-primary)]">+ Add Specification</button>
        </div>

        {/* ── Shipping List ── */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">What's in the Box</h3>
          {form.shipping_list.map((row, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={row.name}
                onChange={(e) => { const u = [...form.shipping_list]; u[i] = { ...u[i], name: e.target.value }; setField("shipping_list", u); }}
                placeholder="Item name…"
                className="flex-1 rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
              />
              <input
                type="number" min="1"
                value={row.count}
                onChange={(e) => { const u = [...form.shipping_list]; u[i] = { ...u[i], count: e.target.value }; setField("shipping_list", u); }}
                className="w-20 rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
              />
              <button type="button" onClick={() => setField("shipping_list", form.shipping_list.filter((_, j) => j !== i))} className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-300 text-sm">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => setField("shipping_list", [...form.shipping_list, { name: "", count: 1 }])} className="rounded-lg border border-[var(--admin-border-amber)] bg-[var(--admin-primary)]/15 px-3 py-2 text-sm font-semibold text-[var(--admin-primary)]">+ Add Item</button>
        </div>

        {/* ── Documents ── */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Datasheets & Manuals</h3>
          {form.documents.map((row, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={row.name}
                onChange={(e) => { const u = [...form.documents]; u[i] = { ...u[i], name: e.target.value }; setField("documents", u); }}
                placeholder="Document name…"
                className="flex-1 rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
              />
              <input
                value={row.url}
                onChange={(e) => { const u = [...form.documents]; u[i] = { ...u[i], url: e.target.value }; setField("documents", u); }}
                placeholder="File URL…"
                className="flex-1 rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
              />
              <input
                value={row.size}
                onChange={(e) => { const u = [...form.documents]; u[i] = { ...u[i], size: e.target.value }; setField("documents", u); }}
                placeholder="e.g. 1.8 MB"
                className="w-28 rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
              />
              <button type="button" onClick={() => setField("documents", form.documents.filter((_, j) => j !== i))} className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-300 text-sm">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => setField("documents", [...form.documents, { name: "", url: "", size: "" }])} className="rounded-lg border border-[var(--admin-border-amber)] bg-[var(--admin-primary)]/15 px-3 py-2 text-sm font-semibold text-[var(--admin-primary)]">+ Add Document</button>
        </div>

        {/* ── FAQs ── */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Frequently Asked Questions</h3>
          {form.faqs.map((row, i) => (
            <div key={i} className="space-y-2 rounded-lg border border-white/10 p-3">
              <div className="flex gap-2">
                <input
                  value={row.q}
                  onChange={(e) => { const u = [...form.faqs]; u[i] = { ...u[i], q: e.target.value }; setField("faqs", u); }}
                  placeholder="Question…"
                  className="flex-1 rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
                />
                <button type="button" onClick={() => setField("faqs", form.faqs.filter((_, j) => j !== i))} className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-300 text-sm">✕</button>
              </div>
              <textarea
                rows={2}
                value={row.a}
                onChange={(e) => { const u = [...form.faqs]; u[i] = { ...u[i], a: e.target.value }; setField("faqs", u); }}
                placeholder="Answer…"
                className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
              />
            </div>
          ))}
          <button type="button" onClick={() => setField("faqs", [...form.faqs, { q: "", a: "" }])} className="rounded-lg border border-[var(--admin-border-amber)] bg-[var(--admin-primary)]/15 px-3 py-2 text-sm font-semibold text-[var(--admin-primary)]">+ Add FAQ</button>
        </div>

        {/* ── Visibility ── */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Visibility</h3>
          <div className="flex gap-4 items-center flex-wrap">
            <div>
              <label className={labelCls}>Sort Order</label>
              <input type="number" min="0" value={form.sort_order} onChange={(e) => setField("sort_order", Number(e.target.value))} className="w-24 rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white" />
            </div>
            <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer mt-5">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setField("is_active", e.target.checked)} className="h-4 w-4" />
              Active (visible on frontend)
            </label>
          </div>
        </div>

        {/* ── Submit ── */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={saving} className="rounded-lg bg-[var(--admin-primary)] px-5 py-2 text-white hover:bg-[var(--admin-primary-strong)] disabled:opacity-60">
            {saving ? "Saving…" : isEditMode ? "Update Product" : "Create Product"}
          </button>
          <button type="button" onClick={() => navigate("/products")} className="rounded-lg border border-white/20 px-5 py-2 text-white/90 hover:bg-white/10">
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
