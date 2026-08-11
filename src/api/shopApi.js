// Swift Sign Electronics — public API client.
// Normalizers convert API rows (snake_case, DECIMAL-as-string) into the exact
// shapes the components were built against, so no markup has to change.

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost/Electronics/backend/api";
const BACKEND_ROOT = API_BASE.replace(/\/api\/?$/, "");

export const resolveUploadUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith("/") ? `${BACKEND_ROOT}${path}` : `${BACKEND_ROOT}/uploads/${path}`;
};

async function get(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || json.error || `API ${path} failed`);
  return json.data;
}

async function send(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) throw new Error(json.message || json.error || `API ${path} failed`);
  return json.data;
}

const post = (path, body) => send("POST", path, body);
const put = (path, body) => send("PUT", path, body);
const del = (path, body) => send("DELETE", path, body);

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
    thumbnail: resolveUploadUrl(row.thumbnail || ""),
    images: parseMaybeJson(row.images, []).map(resolveUploadUrl),
    description: row.description || "",
    introduction: parseMaybeJson(row.introduction, {}),
    specifications: parseMaybeJson(row.specifications, {}),
    shippingList: parseMaybeJson(row.shipping_list, []),
    documents: parseMaybeJson(row.documents, []),
    faqs: parseMaybeJson(row.faqs, []),
    project_links: parseMaybeJson(row.project_links, []),
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
    cover: resolveUploadUrl(row.cover || ""),
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

export function normalizeSectionBanner(row) {
  return {
    id: row.id,
    sectionKey: row.section_key,
    category: row.category || "",
    sectionTitle: row.section_title || "",
    kicker: row.kicker || "",
    title: row.title,
    subtitle: row.subtitle || "",
    description: row.description || "",
    bgImage: resolveUploadUrl(row.bg_image),
  };
}

export const fetchProducts = async () => {
  try {
    const raw = await get("/public/products");
    console.log('[shopApi] fetchProducts raw count:', raw.length);
    const normalized = raw.map((row, idx) => {
      try {
        return normalizeProduct(row);
      } catch (err) {
        console.error(`[shopApi] normalizeProduct error on index ${idx}:`, row, err);
        throw err;
      }
    });
    console.log('[shopApi] fetchProducts normalized count:', normalized.length);
    return normalized;
  } catch (err) {
    console.error('[shopApi] fetchProducts error:', err);
    throw err;
  }
};
export const fetchProductBySlug = async (slug) => normalizeProduct(await get(`/public/products/${slug}`));
export const fetchBlogs = async () => (await get("/public/blog")).map(normalizeBlog);
export const fetchBlogBySlug = async (slug) => normalizeBlog(await get(`/public/blog/${slug}`));
export const fetchBlogCategories = () => get("/public/blog-categories");
export const fetchBlogPageSettings = () => get("/public/blog/settings");
export const fetchBlogPosts = async ({ search = "", category = "", page = 1, limit = 6 } = {}) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set("search", search);
  if (category && category !== "All") params.set("category", category);
  const result = await get(`/public/blog?${params.toString()}`);
  return {
    items: (result.data || []).map(normalizeBlog),
    meta: result.meta || { page: 1, per_page: limit, total: 0, total_pages: 1 },
  };
};
export const fetchCategories = () => get("/public/categories");
export const fetchHeroSlides = async () => (await get("/public/hero")).map(normalizeHeroSlide);
export const fetchSectionBanner = async (key) => normalizeSectionBanner(await get(`/public/sections/${key}`));
export const fetchSectionBanners = async () => (await get("/public/sections")).map(normalizeSectionBanner);
export const submitOrder = (order) => post("/public/orders", order);
export const submitContact = (message) => post("/public/contact", message);
export const fetchSiteSettings = () => get("/public/settings");
export const fetchNavLinks = () => get("/public/nav-links");
export const fetchFooterLinkGroups = () => get("/public/footer-link-groups");
export const fetchSocialLinks = () => get("/public/social-links");
export const fetchContactPage = () => get("/public/contact-page");

export const fetchAboutPage = async () => {
  const row = await get("/public/about-page");
  return {
    ...row,
    hero_image: resolveUploadUrl(row.hero_image),
    ceo_photo: resolveUploadUrl(row.ceo_photo),
  };
};
export const fetchAboutValueCards = async () =>
  (await get("/public/about-value-cards")).map((row) => ({
    ...row,
    image: resolveUploadUrl(row.image),
  }));
export const fetchAboutTeamMembers = async () =>
  (await get("/public/about-team-members")).map((row) => ({
    ...row,
    photo: resolveUploadUrl(row.photo),
  }));
export const fetchAboutAccoladeCards = () => get("/public/about-accolade-cards");
export const fetchAboutTestimonials = async () =>
  (await get("/public/about-testimonials")).map((row) => ({
    ...row,
    avatar: resolveUploadUrl(row.avatar),
  }));

export const fetchProductComments = (productId) =>
  get(`/public/products/${productId}/comments`);
export const submitProductComment = (productId, payload) =>
  post(`/public/products/${productId}/comments`, payload);
export const updateProductComment = (commentId, payload) =>
  put(`/public/comments/${commentId}`, payload);
export const deleteProductComment = (commentId, editToken) =>
  del(`/public/comments/${commentId}`, { edit_token: editToken });
