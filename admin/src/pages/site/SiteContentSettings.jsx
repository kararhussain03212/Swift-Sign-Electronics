import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../../api/settingApi";
import {
  getNavLinks,
  createNavLink,
  updateNavLink,
  deleteNavLink,
} from "../../api/navLinkApi";
import { useAuth } from "../../context/useAuth";
import { hasPermission } from "../../modules/users/constants";

const NAVBAR_FIELDS = [
  { key: "brand_name", label: "Brand Name" },
  { key: "brand_subtitle", label: "Brand Subtitle" },
];

const TEXT_FIELDS = NAVBAR_FIELDS;

const emptyForm = () => TEXT_FIELDS.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {});

const emptyNavLink = () => ({ id: null, label: "", url: "", is_active: 1, open_in_new_tab: 0 });

function FieldGroup({ fields, form, setField, canEdit, title }) {
  return (
    <div className="space-y-3">
      {title && <h3 className="text-sm font-bold uppercase tracking-widest text-white/70">{title}</h3>}
      {fields.map((field) => (
        <div key={field.key} className="grid grid-cols-1 gap-2 md:grid-cols-[220px_1fr] md:items-start">
          <label className="pt-2 text-sm font-semibold text-white/80">{field.label}</label>
          {field.multiline ? (
            <textarea
              rows={3}
              value={form[field.key] || ""}
              onChange={(e) => setField(field.key, e.target.value)}
              disabled={!canEdit}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--admin-primary)]"
            />
          ) : (
            <input
              type="text"
              value={form[field.key] || ""}
              onChange={(e) => setField(field.key, e.target.value)}
              disabled={!canEdit}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--admin-primary)]"
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
      setNavLinks(Array.isArray(res.data?.data) ? res.data.data.map((l) => ({ ...l, dirty: false })) : []);
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

    for (const link of navLinks) {
      const hasLabel = link.label.trim();
      const hasUrl = link.url.trim();
      if (!hasLabel && !hasUrl) continue;
      if (!hasLabel || !hasUrl) {
        setError("Every navigation link needs both a label and a URL.");
        return;
      }
    }

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = { ...form };
      payload.topbar_messages = JSON.stringify(
        messages.map((m) => ({ text: String(m || "").trim() })).filter((m) => m.text)
      );
      await updateSettings(payload);

      for (let i = 0; i < navLinks.length; i += 1) {
        const link = navLinks[i];
        if (!link.label.trim() || !link.url.trim()) continue;
        const linkPayload = {
          label: link.label.trim(),
          url: link.url.trim(),
          is_active: link.is_active ? 1 : 0,
          open_in_new_tab: link.open_in_new_tab ? 1 : 0,
          sort_order: link.sort_order ?? i + 1,
        };
        if (link.id) {
          await updateNavLink(link.id, linkPayload);
        } else {
          await createNavLink(linkPayload);
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

  if (loading) return <p className="text-white/70">Loading navbar settings...</p>;

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-3xl font-bold text-white">Navbar</h2>
        <p className="text-sm text-white/65">Navbar branding, topbar scrolling messages, and the main navbar links shown on the storefront.</p>
      </header>

      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div> : null}
      {success ? <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300">{success}</div> : null}

      <div className="space-y-3 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-4 sm:p-5">
        <FieldGroup fields={NAVBAR_FIELDS} form={form} setField={setField} canEdit={canEdit} title="Navbar Settings" />

        <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-white/80">Topbar Scrolling Messages</h4>
            <span className="text-xs text-white/50">Add, remove, or reorder — any number of messages</span>
          </div>
          {messages.map((msg, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={msg}
                onChange={(e) => updateMessage(index, e.target.value)}
                disabled={!canEdit}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[var(--admin-primary)]"
              />
              {canEdit && (
                <button type="button" onClick={() => removeMessage(index)} className="rounded-lg bg-red-500 px-3 py-2 text-xs text-white hover:bg-red-600">
                  Remove
                </button>
              )}
            </div>
          ))}
          {canEdit && (
            <button type="button" onClick={addMessage} className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20">
              + Add Message
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-white/80">Navigation Links</h4>
          {canAdd && (
            <button
              type="button"
              onClick={addNavLink}
              className="rounded-lg bg-[var(--admin-primary)] px-3 py-2 text-xs text-white hover:bg-[var(--admin-primary-strong)]"
            >
              + Add Link
            </button>
          )}
        </div>

        {navLinksLoading ? (
          <p className="text-white/70">Loading navigation links...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm text-white/80">
              <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
                <tr>
                  <th className="px-4 py-3">Label</th>
                  <th className="px-4 py-3">URL</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {navLinks.map((link, index) => (
                  <tr key={link.id ?? `new-${index}`} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => updateNavLinkField(index, "label", e.target.value)}
                        disabled={!canEdit}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-white outline-none focus:border-[var(--admin-primary)]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => updateNavLinkField(index, "url", e.target.value)}
                        disabled={!canEdit}
                        placeholder="/products or https://example.com"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-white outline-none focus:border-[var(--admin-primary)]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => updateNavLinkField(index, "is_active", link.is_active ? 0 : 1)}
                        disabled={!canEdit}
                        className={`rounded-lg px-3 py-1 text-xs ${link.is_active ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
                      >
                        {link.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
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
            disabled={saving || !loadedOk}
            className="rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-white shadow-sm hover:bg-[var(--admin-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : !loadedOk ? "Save Disabled" : "Save Changes"}
          </button>
        </div>
      )}
    </section>
  );
}
