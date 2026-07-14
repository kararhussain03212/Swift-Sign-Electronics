// Generates seed SQL for swift_sign_electronic from the frontend's static data
// so the dynamic site looks identical to the static mockup on first run.
// Usage: node backend/database/generate_seed.mjs > backend/database/seed_data.sql
import { BLOG_ARTICLES } from "../../src/data/blogData.js";

const q = (v) => {
  if (v === null || v === undefined || v === "") return "NULL";
  if (typeof v === "number") return String(v);
  return "'" + String(v).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
};
const j = (v) => (v == null ? "NULL" : q(JSON.stringify(v)));

// Converts the static articles' plain "\n\n"-delimited body text into the same
// kind of HTML the admin's Quill rich-text editor produces, so BlogDetails.jsx
// can render post bodies with dangerouslySetInnerHTML consistently either way.
const escapeHtml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const toHtmlBody = (text) => {
  const paragraphs = String(text || "").split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return paragraphs
    .map((p, i) => {
      if (i === 2) {
        const sentence = p.split(".")[0] + ".";
        return `<p>${escapeHtml(p)}</p>\n<blockquote><p>${escapeHtml(sentence)}</p></blockquote>`;
      }
      return `<p>${escapeHtml(p)}</p>`;
    })
    .join("\n");
};

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
const BANNERS = [
  ["tools",       "Tools",       "Essential tools for electronics projects",       "/image.png"],
  ["instruments", "Instruments", "Precision measurement and diagnostic devices",   "/image copy.png"],
  ["projects",    "Projects",    "Complete project kits and components",           "/image copy 2.png"],
];
out.push("DELETE FROM section_banners;");
BANNERS.forEach(([key, label, subtitle, bg], i) => {
  out.push(
    `INSERT INTO section_banners (section_key, kicker, title, subtitle, description, bg_image, sort_order, is_active) VALUES (` +
      `${q(key)}, ${q(label.toUpperCase() + " ESSENTIALS")}, ${q(label)}, ${q(subtitle)}, ${q("")}, ${q(bg)}, ${i}, 1);`
  );
});

// Products are managed entirely through the admin panel / live database —
// no longer regenerated from static frontend data on every seed run.

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
        q(b.title), q(b.slug), q(b.excerpt), q(toHtmlBody(b.body)), q(b.cover),
        q(b.category), q(b.categoryColor || ""),
        q(b.author?.name || ""), q(b.author?.avatar || ""), q(b.author?.role || ""),
        q(b.readTime || ""), j(b.tags || []),
        b.featured ? 1 : 0, 1, publishedAt, i,
      ].join(", ") + ");"
  );
}

// ── blog categories (filter chips) ──
const BLOG_CATEGORY_NAMES = [...new Set(BLOG_ARTICLES.map((b) => b.category).filter(Boolean))];
out.push("DELETE FROM blog_categories;");
BLOG_CATEGORY_NAMES.forEach((name, i) => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  out.push(`INSERT INTO blog_categories (name, slug, sort_order, is_active) VALUES (${q(name)}, ${q(slug)}, ${i + 1}, 1);`);
});

// ── blog page hero settings ──
out.push("DELETE FROM settings WHERE setting_key IN ('blog_hero_title', 'blog_hero_title_accent', 'blog_hero_description', 'blog_search_placeholder');");
out.push(
  `INSERT INTO settings (setting_key, setting_value, setting_type, order_position) VALUES ` +
    `('blog_hero_title', ${q("Tech Articles &")}, 'text', 201), ` +
    `('blog_hero_title_accent', ${q("Electronics Guides")}, 'text', 202), ` +
    `('blog_hero_description', ${q("Expert-written guides on microcontrollers, firmware development, robotics, IoT, and custom PCB routing design.")}, 'text', 203), ` +
    `('blog_search_placeholder', ${q("Search articles...")}, 'text', 204);`
);

console.log(out.join("\n"));
