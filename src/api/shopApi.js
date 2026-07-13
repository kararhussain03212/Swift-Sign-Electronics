// Swift Sign Electronics — public API client.
// Normalizers convert API rows (snake_case, DECIMAL-as-string) into the exact
// shapes the components were built against, so no markup has to change.

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost/Electronics/backend/api";
const BACKEND_ROOT = API_BASE.replace(/\/api\/?$/, "");

const resolveUploadUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith("/") ? `${BACKEND_ROOT}${path}` : `${BACKEND_ROOT}/uploads/${path}`;
};

async function get(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || `API ${path} failed`);
  return json.data;
}

async function post(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) throw new Error(json.message || `API ${path} failed`);
  return json.data;
}

const parseMaybeJson = (v, fallback) => {
  if (v == null) return fallback;
  if (typeof v !== "string") return v;
  try { return JSON.parse(v); } catch { return fallback; }
};

export function normalizeProduct(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    brand: row.brand || "",
    model: row.model || "",
    price: Number(row.price || 0),
    discount: row.discount != null ? Number(row.discount) : 0,
    rating: row.rating != null ? Number(row.rating) : 0,
    reviews: Number(row.reviews || 0),
    stock: Number(row.stock || 0),
    thumbnail: row.thumbnail || "",
    images: parseMaybeJson(row.images, []),
    description: row.description || "",
    introduction: parseMaybeJson(row.introduction, {}),
    specifications: parseMaybeJson(row.specifications, {}),
    shippingList: parseMaybeJson(row.shipping_list, []),
    featured: row.featured === 1 || row.featured === true,
  };
}

export function normalizeBlog(row) {
  const published = row.published_at ? new Date(String(row.published_at).replace(" ", "T")) : null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    body: row.body || "",
    cover: row.cover || "",
    category: row.category || "",
    categoryColor: row.category_color || "#0fafb8",
    author: {
      name: row.author_name || "",
      avatar: row.author_avatar || "",
      role: row.author_role || "",
    },
    date: published && !Number.isNaN(published.getTime())
      ? published.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : "",
    readTime: row.read_time || "",
    tags: parseMaybeJson(row.tags, []),
    featured: row.featured === 1 || row.featured === true,
  };
}

export function normalizeHeroSlide(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || "",
    image: resolveUploadUrl(row.image),
    sortOrder: Number(row.sort_order ?? 0),
  };
}

export const fetchProducts = async () => (await get("/public/products")).map(normalizeProduct);
export const fetchProductBySlug = async (slug) => normalizeProduct(await get(`/public/products/${slug}`));
export const fetchBlogs = async () => (await get("/public/blog")).map(normalizeBlog);
export const fetchBlogBySlug = async (slug) => normalizeBlog(await get(`/public/blog/${slug}`));
export const fetchCategories = () => get("/public/categories");
export const fetchHeroSlides = async () => (await get("/public/hero")).map(normalizeHeroSlide);
export const fetchSectionBanner = (key) => get(`/public/sections/${key}`);
export const submitOrder = (order) => post("/public/orders", order);
export const submitContact = (message) => post("/public/contact", message);
export const fetchSiteSettings = () => get("/public/settings");
export const fetchNavLinks = () => get("/public/nav-links");
export const fetchFooterLinkGroups = () => get("/public/footer-link-groups");
export const fetchSocialLinks = () => get("/public/social-links");
