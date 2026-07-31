import { Fragment, useEffect, useMemo, useState } from "react";
import { getSettings, updateSettings } from "../../api/settingApi";
import { uploadImage } from "../../api/uploadApi";
import { getBackendRoot } from "../../api/runtimeApi";
import ImageUpload from "../../components/ImageUpload";
import {
  getNavLinks,
  createNavLink,
  updateNavLink,
  deleteNavLink,
  createNavLinkItem,
  updateNavLinkItem,
  deleteNavLinkItem,
} from "../../api/navLinkApi";
import { useAuth } from "../../context/useAuth";
import { hasPermission } from "../../modules/users/constants";

const NAVBAR_FIELDS = [
  { key: "brand_name", label: "Brand Name" },
  { key: "brand_subtitle", label: "Brand Subtitle" },
];

const LOGO_FIELDS = ["nav_logo", "nav_logo_alt"];

const TEXT_FIELDS = [...NAVBAR_FIELDS, ...LOGO_FIELDS.map((key) => ({ key }))];

const emptyForm = () => TEXT_FIELDS.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {});

const emptyNavLink = () => ({ id: null, label: "", url: "", is_active: 1, open_in_new_tab: 0, items: [] });

const emptyNavLinkItem = () => ({ id: null, label: "", url: "", is_active: 1 });

function FieldGroup({ fields, form, setField, canEdit, title }) {
  return (
    <div className="space-y-3">
      {title && <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--admin-muted)]">{title}</h3>}
      {fields.map((field) => (
        <div key={field.key} className="grid grid-cols-1 gap-2 md:grid-cols-[220px_1fr] md:items-start">
          <label className="pt-2 text-sm font-semibold text-[var(--admin-ink)]/80">{field.label}</label>
          {field.multiline ? (
            <textarea
              rows={3}
              value={form[field.key] || ""}
              onChange={(e) => setField(field.key, e.target.value)}
              disabled={!canEdit}
              className="w-full rounded-xl border border-[var(--admin-border)] bg-white/5 px-3 py-2.5 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]"
            />
          ) : (
            <input
              type="text"
              value={form[field.key] || ""}
              onChange={(e) => setField(field.key, e.target.value)}
              disabled={!canEdit}
              className="w-full rounded-xl border border-[var(--admin-border)] bg-white/5 px-3 py-2.5 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function SiteContentSettings() {
  const { user } = useAuth();
  const canEdit = hasPermission(user, "edit_content");
  const canDelete = hasPermission(user, "delete_content");
  const canAdd = hasPermission(user, "create_content");

  const [form, setForm] = useState(emptyForm);
  const [messages, setMessages] = useState([""]);
  const [loading, setLoading] = useState(true);
  const [loadedOk, setLoadedOk] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [navLinks, setNavLinks] = useState([]);
  const [navLinksLoading, setNavLinksLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const apiRoot = useMemo(() => getBackendRoot(), []);

  const toImageUrl = (value) => {
    if (!value) return "";
    if (value.startsWith("http")) return value;
    if (value.startsWith("/")) return apiRoot + value;
    return apiRoot + "/uploads/" + value;
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getSettings();
        const rows = Array.isArray(res?.data?.data) ? res.data.data : [];
        if (!rows.length) {
          setLoadedOk(false);
          setError("Settings could not be loaded. Saving is disabled to prevent wiping existing data — reload and try again.");
          return;
        }

        const next = emptyForm();
        let nextMessages = [""];

        rows.forEach((row) => {
          const key = String(row?.setting_key || "").trim();
          if (!key) return;
          const value = row?.setting_value;

          if (key === "topbar_messages") {
            const parsed = Array.isArray(value) ? value : (() => {
              try { return JSON.parse(String(value ?? "[]")); } catch { return []; }
            })();
            const normalized = parsed.map((m) => String(m?.text || "")).filter(Boolean);
            if (normalized.length) nextMessages = normalized;
            return;
          }

          if (Object.prototype.hasOwnProperty.call(next, key)) {
            next[key] = typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? "");
          }
        });

        setForm(next);
        setMessages(nextMessages);
        setLoadedOk(true);
      } catch (err) {
        console.error(err);
        setLoadedOk(false);
        setError("Failed to load settings from backend. Saving is disabled to prevent wiping existing data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const loadNavLinks = async () => {
    try {
      setNavLinksLoading(true);
      const res = await getNavLinks();
      setNavLinks(
        Array.isArray(res.data?.data)
          ? res.data.data.map((l) => ({ ...l, items: Array.isArray(l.items) ? l.items : [] }))
          : []
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load navigation links.");
    } finally {
      setNavLinksLoading(false);
    }
  };

  useEffect(() => { loadNavLinks(); }, []);

  const updateNavLinkField = (index, key, value) => {
    setNavLinks((prev) => prev.map((l, i) => (i === index ? { ...l, [key]: value } : l)));
  };

  const addNavLink = () => setNavLinks((prev) => [...prev, emptyNavLink()]);

  const [expandedLink, setExpandedLink] = useState(null);
  const toggleExpandedLink = (index) => setExpandedLink((prev) => (prev === index ? null : index));

  const addNavLinkItem = (linkIndex) => {
    setNavLinks((prev) =>
      prev.map((l, i) => (i === linkIndex ? { ...l, items: [...(l.items || []), emptyNavLinkItem()] } : l))
    );
  };

  const updateNavLinkItemField = (linkIndex, itemIndex, key, value) => {
    setNavLinks((prev) =>
      prev.map((l, i) => {
        if (i !== linkIndex) return l;
        return {
          ...l,
          items: l.items.map((it, j) => (j === itemIndex ? { ...it, [key]: value } : it)),
        };
      })
    );
  };

  const deleteNavLinkItemRow = async (linkIndex, itemIndex) => {
    const link = navLinks[linkIndex];
    const item = link.items[itemIndex];
    if (!canDelete) return;
    if (!item.id) {
      setNavLinks((prev) =>
        prev.map((l, i) => (i === linkIndex ? { ...l, items: l.items.filter((_, j) => j !== itemIndex) } : l))
      );
      return;
    }
    if (!window.confirm(`Delete dropdown item "${item.label}"?`)) return;
    try {
      await deleteNavLinkItem(item.id);
      setNavLinks((prev) =>
        prev.map((l, i) => (i === linkIndex ? { ...l, items: l.items.filter((_, j) => j !== itemIndex) } : l))
      );
      setSuccess("Deleted.");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  const deleteNavLinkRow = async (index) => {
    const link = navLinks[index];
    if (!canDelete) return;
    if (!link.id) {
      setNavLinks((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    if (!window.confirm(`Delete "${link.label}"?`)) return;
    try {
      await deleteNavLink(link.id);
      setNavLinks((prev) => prev.filter((_, i) => i !== index));
      setSuccess("Deleted.");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (success) setSuccess("");
  };

  const uploadLogo = async (file) => {
    try {
      setUploading(true);
      const path = await uploadImage(file, "settings", form.nav_logo);
      if (path) setField("nav_logo", path);
    } catch (err) {
      console.error(err);
      setError("Logo upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const updateMessage = (index, value) => {
    setMessages((prev) => prev.map((m, i) => (i === index ? value : m)));
  };

  const addMessage = () => setMessages((prev) => [...prev, ""]);
  const removeMessage = (index) => setMessages((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));

  const handleSave = async () => {
    if (!loadedOk) {
      setError("Settings were not loaded successfully, so saving is disabled. Reload and try again.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      for (const link of navLinks) {
        const hasLabel = String(link.label || "").trim();
        const hasUrl = String(link.url || "").trim();
        if (!hasLabel && !hasUrl) continue;
        if (!hasLabel || !hasUrl) {
          setError("Every navigation link needs both a label and a URL.");
          return;
        }
        for (const item of link.items || []) {
          const itemHasLabel = String(item.label || "").trim();
          const itemHasUrl = String(item.url || "").trim();
          if (!itemHasLabel && !itemHasUrl) continue;
          if (!itemHasLabel || !itemHasUrl) {
            setError(`Every dropdown item under "${link.label}" needs both a label and a URL.`);
            return;
          }
        }
      }

      const payload = { ...form };
      payload.topbar_messages = JSON.stringify(
        messages.map((m) => ({ text: String(m || "").trim() })).filter((m) => m.text)
      );
      await updateSettings(payload);

      for (let i = 0; i < navLinks.length; i += 1) {
        const link = navLinks[i];
        const linkLabel = String(link.label || "").trim();
        const linkUrl = String(link.url || "").trim();
        if (!linkLabel || !linkUrl) continue;
        const linkPayload = {
          label: linkLabel,
          url: linkUrl,
          is_active: link.is_active ? 1 : 0,
          open_in_new_tab: link.open_in_new_tab ? 1 : 0,
          sort_order: link.sort_order ?? i + 1,
        };
        let navLinkId = link.id;
        if (navLinkId) {
          await updateNavLink(navLinkId, linkPayload);
        } else {
          const created = await createNavLink(linkPayload);
          navLinkId = created?.data?.data?.id;
        }

        for (let j = 0; j < (link.items || []).length; j += 1) {
          const item = link.items[j];
          const itemLabel = String(item.label || "").trim();
          const itemUrl = String(item.url || "").trim();
          if (!itemLabel || !itemUrl) continue;
          const itemPayload = {
            nav_link_id: navLinkId,
            label: itemLabel,
            url: itemUrl,
            is_active: item.is_active ? 1 : 0,
            sort_order: item.sort_order ?? j + 1,
          };
          if (item.id) {
            await updateNavLinkItem(item.id, itemPayload);
          } else {
            await createNavLinkItem(itemPayload);
          }
        }
      }

      setSuccess("Settings saved successfully.");
      await loadNavLinks();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-[var(--admin-muted)]">Loading navbar settings...</p>;

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-3xl font-bold text-[var(--admin-ink)]">Navbar</h2>
        <p className="text-sm text-[var(--admin-ink)]/65">Navbar branding, topbar scrolling messages, and the main navbar links shown on the storefront.</p>
      </header>

      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div> : null}
      {success ? <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300">{success}</div> : null}

      <div className="space-y-3 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-4 sm:p-5">
        <FieldGroup fields={NAVBAR_FIELDS} form={form} setField={setField} canEdit={canEdit} title="Navbar Settings" />

        <div className="mt-4 grid grid-cols-1 gap-2 border-t border-[var(--admin-border)] pt-4 md:grid-cols-[220px_1fr] md:items-start">
          <label className="pt-2 text-sm font-semibold text-[var(--admin-ink)]/80">Navbar Logo</label>
          <div className="space-y-3">
            <ImageUpload
              value={toImageUrl(form.nav_logo)}
              onFileSelect={uploadLogo}
              label="Upload Navbar Logo"
              helperText="PNG, JPG, or SVG shown at the top-left of the storefront"
            />
            <input
              type="text"
              placeholder="Navbar logo alt text"
              value={form.nav_logo_alt || ""}
              onChange={(e) => setField("nav_logo_alt", e.target.value)}
              disabled={!canEdit}
              className="w-full rounded-xl border border-[var(--admin-border)] bg-white/5 px-3 py-2.5 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]"
            />
          </div>
        </div>

        <div className="mt-4 space-y-3 border-t border-[var(--admin-border)] pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-[var(--admin-ink)]/80">Topbar Scrolling Messages</h4>
            <span className="text-xs text-[var(--admin-muted-light)]">Add, remove, or reorder — any number of messages</span>
          </div>
          {messages.map((msg, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={msg}
                onChange={(e) => updateMessage(index, e.target.value)}
                disabled={!canEdit}
                className="flex-1 rounded-lg border border-[var(--admin-border)] bg-white/5 px-3 py-2 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]"
              />
              {canEdit && (
                <button type="button" onClick={() => removeMessage(index)} className="rounded-lg bg-red-500 px-3 py-2 text-xs text-white hover:bg-red-600">
                  Remove
                </button>
              )}
            </div>
          ))}
          {canEdit && (
            <button type="button" onClick={addMessage} className="rounded-lg bg-[var(--admin-bg-deep)] px-3 py-2 text-sm text-[var(--admin-ink)] hover:bg-white/20">
              + Add Message
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-[var(--admin-ink)]/80">Navigation Links</h4>
          {canAdd && (
            <button
              type="button"
              onClick={addNavLink}
              className="rounded-lg bg-[var(--admin-primary)] px-3 py-2 text-xs text-[var(--admin-ink)] hover:bg-[var(--admin-primary-strong)]"
            >
              + Add Link
            </button>
          )}
        </div>

        {navLinksLoading ? (
          <p className="text-[var(--admin-muted)]">Loading navigation links...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[var(--admin-border)]">
            <table className="w-full text-left text-sm text-[var(--admin-ink)]/80">
              <thead className="border-b border-[var(--admin-border)] text-xs uppercase tracking-wider text-[var(--admin-muted-light)]">
                <tr>
                  <th className="px-4 py-3">Label</th>
                  <th className="px-4 py-3">URL</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {navLinks.map((link, index) => (
                  <Fragment key={link.id ?? `new-${index}`}>
                  <tr className="border-b border-[var(--admin-border)] last:border-0">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => updateNavLinkField(index, "label", e.target.value)}
                        disabled={!canEdit}
                        className="w-full rounded-lg border border-[var(--admin-border)] bg-white/5 px-2 py-1.5 text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => updateNavLinkField(index, "url", e.target.value)}
                        disabled={!canEdit}
                        placeholder="/products or https://example.com"
                        className="w-full rounded-lg border border-[var(--admin-border)] bg-white/5 px-2 py-1.5 text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => updateNavLinkField(index, "is_active", link.is_active ? 0 : 1)}
                        disabled={!canEdit}
                        className={`rounded-lg px-3 py-1 text-xs ${link.is_active ? "bg-green-600 text-[var(--admin-ink)]" : "bg-red-600 text-[var(--admin-ink)]"}`}
                      >
                        {link.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => toggleExpandedLink(index)}
                          className="rounded-lg border border-[var(--admin-border)] bg-white/5 px-3 py-1.5 text-xs text-[var(--admin-ink)] hover:bg-white/10"
                        >
                          Dropdown ({link.items?.length || 0}) {expandedLink === index ? "▲" : "▼"}
                        </button>
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => deleteNavLinkRow(index)}
                            className="rounded-lg bg-red-500 px-3 py-1.5 text-xs text-white hover:bg-red-600"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedLink === index && (
                    <tr className="border-b border-[var(--admin-border)] last:border-0 bg-white/[0.02]">
                      <td colSpan={4} className="px-4 py-3">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--admin-muted-light)]">
                              Dropdown items shown when hovering "{link.label || "this link"}"
                            </p>
                            {canAdd && (
                              <button
                                type="button"
                                onClick={() => addNavLinkItem(index)}
                                className="rounded-lg bg-[var(--admin-bg-deep)] px-3 py-1.5 text-xs text-[var(--admin-ink)] hover:bg-white/20"
                              >
                                + Add Dropdown Item
                              </button>
                            )}
                          </div>

                          {(link.items || []).length === 0 ? (
                            <p className="text-xs text-[var(--admin-muted)]">No dropdown items. This link renders as a plain nav link.</p>
                          ) : (
                            (link.items || []).map((item, itemIndex) => (
                              <div
                                key={item.id ?? `new-item-${itemIndex}`}
                                className="grid grid-cols-1 gap-2 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-2 md:grid-cols-[1fr_1fr_100px_auto] md:items-center"
                              >
                                <input
                                  type="text"
                                  placeholder="Label"
                                  value={item.label}
                                  onChange={(e) => updateNavLinkItemField(index, itemIndex, "label", e.target.value)}
                                  disabled={!canEdit}
                                  className="rounded-lg border border-[var(--admin-border)] bg-white/5 px-2 py-1.5 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]"
                                />
                                <input
                                  type="text"
                                  placeholder="/products/category-slug"
                                  value={item.url}
                                  onChange={(e) => updateNavLinkItemField(index, itemIndex, "url", e.target.value)}
                                  disabled={!canEdit}
                                  className="rounded-lg border border-[var(--admin-border)] bg-white/5 px-2 py-1.5 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]"
                                />
                                <button
                                  type="button"
                                  onClick={() => updateNavLinkItemField(index, itemIndex, "is_active", item.is_active ? 0 : 1)}
                                  disabled={!canEdit}
                                  className={`rounded-lg px-3 py-1 text-xs ${item.is_active ? "bg-green-600 text-[var(--admin-ink)]" : "bg-red-600 text-[var(--admin-ink)]"}`}
                                >
                                  {item.is_active ? "Active" : "Inactive"}
                                </button>
                                {canDelete && (
                                  <button
                                    type="button"
                                    onClick={() => deleteNavLinkItemRow(index, itemIndex)}
                                    className="rounded-lg bg-red-500 px-3 py-1.5 text-xs text-white hover:bg-red-600"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {canEdit && (
        <div className="sticky bottom-4 z-10 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploading || !loadedOk}
            className="rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-[var(--admin-ink)] shadow-sm hover:bg-[var(--admin-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : uploading ? "Uploading..." : !loadedOk ? "Save Disabled" : "Save Changes"}
          </button>
        </div>
      )}
    </section>
  );
}
