// Generates seed SQL for swift_sign_electronic from the frontend's static data
// so the dynamic site looks identical to the static mockup on first run.
// Usage: node backend/database/generate_seed.mjs > backend/database/seed_data.sql
import { products } from "../../src/data/products.js";
import { BLOG_ARTICLES } from "../../src/data/blogData.js";

const q = (v) => {
  if (v === null || v === undefined || v === "") return "NULL";
  if (typeof v === "number") return String(v);
  return "'" + String(v).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
};
const j = (v) => (v == null ? "NULL" : q(JSON.stringify(v)));

const out = [];
out.push("USE `swift_sign_electronic`;");
out.push("SET NAMES utf8mb4;");

// ── categories (home page nav strip) ──
const CATEGORIES = [
  ["all",           "All categories",         "BiGridAlt"],
  ["audio",         "Audio and sound",        "BiVolumeFull"],
  ["iot",           "Internet of things",     "BiNetworkChart"],
  ["installations", "Installations",          "BiBuildingHouse"],
  ["home",          "Home automation",        "BiHomeAlt"],
  ["flying",        "Flying things",          "BiPaperPlane"],
  ["lab",           "Lab tools",              "BiTestTube"],
  ["env",           "Environment monitoring", "BiLeaf"],
  ["robotics",      "Robotics",               "BiBot"],
  ["games",         "Interactive games",      "BiJoystick"],
  ["lighting",      "Smart lighting",         "BiBulb"],
  ["displays",      "Displays",               "BiDesktop"],
  ["wearables",     "Wearables",              "FiWatch"],
  // product taxonomy categories
  ["tools",         "Tools",                  "BiWrench"],
  ["instruments",   "Instruments",            "BiTachometer"],
  ["projects",      "Projects",               "BiChip"],
];
out.push("DELETE FROM categories;");
CATEGORIES.forEach(([key, name, icon], i) => {
  out.push(`INSERT INTO categories (cat_key, name, icon, sort_order, is_active) VALUES (${q(key)}, ${q(name)}, ${q(icon)}, ${i}, 1);`);
});

// ── hero slides ──
const HERO = [
  ["Premium Electronics", "Explore our curated collection of quality components", "/image.png"],
  ["Latest Development Boards", "Powerful boards for your next project", "/image copy.png"],
  ["Expert Tools & Accessories", "Everything you need for electronics projects", "/image copy 2.png"],
];
out.push("DELETE FROM hero_slides;");
HERO.forEach(([title, subtitle, image], i) => {
  out.push(`INSERT INTO hero_slides (title, subtitle, image, sort_order, is_active) VALUES (${q(title)}, ${q(subtitle)}, ${q(image)}, ${i}, 1);`);
});

// ── section banners (Tools / Instruments / Projects) ──
const firstOf = (cat) => products.find((p) => p.category === cat);
const BANNERS = [
  ["tools",       "Tools",       "Essential tools for electronics projects",       "/image.png"],
  ["instruments", "Instruments", "Precision measurement and diagnostic devices",   "/image copy.png"],
  ["projects",    "Projects",    "Complete project kits and components",           "/image copy 2.png"],
];
out.push("DELETE FROM section_banners;");
BANNERS.forEach(([key, label, subtitle, bg], i) => {
  const p = firstOf(label);
  out.push(
    `INSERT INTO section_banners (section_key, kicker, title, subtitle, description, bg_image, sort_order, is_active) VALUES (` +
      `${q(key)}, ${q(label.toUpperCase() + " ESSENTIALS")}, ${q(p?.name || label)}, ${q(subtitle)}, ${q(p?.description || "")}, ${q(bg)}, ${i}, 1);`
  );
});

// ── products ──
out.push("DELETE FROM products;");
for (const [i, p] of products.entries()) {
  out.push(
    `INSERT INTO products (name, slug, category, brand, model, price, discount, rating, reviews, stock, thumbnail, images, description, introduction, specifications, shipping_list, featured, sort_order, is_active) VALUES (` +
      [
        q(p.name), q(p.slug), q(p.category), q(p.brand || ""), q(p.model || ""),
        Number(p.price || 0), p.discount != null ? Number(p.discount) : "NULL",
        p.rating != null ? Number(p.rating) : "NULL", Number(p.reviews || 0), Number(p.stock || 0),
        q(p.thumbnail || ""), j(p.images || []), q(p.description || ""),
        j(p.introduction || {}), j(p.specifications || {}), j(p.shippingList || []),
        0, i, 1,
      ].join(", ") + ");"
  );
}

// ── blog posts ──
out.push("DELETE FROM blog_posts;");
for (const [i, b] of BLOG_ARTICLES.entries()) {
  const published = new Date(b.date);
  const publishedAt = Number.isNaN(published.getTime())
    ? "NULL"
    : q(published.toISOString().slice(0, 10) + " 00:00:00");
  out.push(
    `INSERT INTO blog_posts (title, slug, excerpt, body, cover, category, category_color, author_name, author_avatar, author_role, read_time, tags, featured, is_published, published_at, sort_order) VALUES (` +
      [
        q(b.title), q(b.slug), q(b.excerpt), q(b.body), q(b.cover),
        q(b.category), q(b.categoryColor || ""),
        q(b.author?.name || ""), q(b.author?.avatar || ""), q(b.author?.role || ""),
        q(b.readTime || ""), j(b.tags || []),
        b.featured ? 1 : 0, 1, publishedAt, i,
      ].join(", ") + ");"
  );
}

console.log(out.join("\n"));
