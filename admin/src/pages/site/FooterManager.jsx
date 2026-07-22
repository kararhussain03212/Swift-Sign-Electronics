import { useEffect, useMemo, useState } from "react";
import {
  getFooterLinkGroups,
  createFooterLinkGroup,
  updateFooterLinkGroup,
  deleteFooterLinkGroup,
  reorderFooterLinkGroups,
  createFooterLink,
  updateFooterLink,
  deleteFooterLink,
} from "../../api/footerLinkApi";
import { getSettings, updateSettings } from "../../api/settingApi";
import { uploadImage } from "../../api/uploadApi";
import { getBackendRoot } from "../../api/runtimeApi";
import ImageUpload from "../../components/ImageUpload";
import { useAuth } from "../../context/useAuth";
import { hasPermission } from "../../modules/users/constants";

const FOOTER_SETTINGS_FIELDS = [
  { key: "footer_description", label: "Footer Description", multiline: true },
  { key: "contact_phone", label: "Contact Phone" },
  { key: "contact_email", label: "Contact Email" },
  { key: "contact_address", label: "Contact Address", multiline: true },
  { key: "copyright_text", label: "Copyright Text" },
  { key: "designed_by_text", label: "Designed By (text)" },
  { key: "designed_by_url", label: "Designed By (URL)" },
];

const FOOTER_LOGO_FIELDS = ["footer_logo", "footer_logo_alt"];

const emptyLink = (groupId) => ({ id: null, group_id: groupId, label: "", url: "", is_active: 1 });

function FooterLinkRow({ link, index, onChange, onDelete, canEdit, canDelete }) {
  return (
    <div className="grid grid-cols-1 gap-2 rounded-lg border border-[var(--admin-border)] bg-white/5 p-2 md:grid-cols-[1fr_1fr_auto_auto] md:items-center">
      <input
        type="text"
        placeholder="Label"
        value={link.label}
        onChange={(e) => onChange(index, "label", e.target.value)}
        disabled={!canEdit}
        className="rounded-lg border border-[var(--admin-border)] bg-white/5 px-2 py-1.5 text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]"
      />
      <input
        type="text"
        placeholder="/page or https://..."
        value={link.url}
        onChange={(e) => onChange(index, "url", e.target.value)}
        disabled={!canEdit}
        className="rounded-lg border border-[var(--admin-border)] bg-white/5 px-2 py-1.5 text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]"
      />
      <button
        type="button"
        onClick={() => onChange(index, "is_active", link.is_active ? 0 : 1)}
        disabled={!canEdit}
        className={`rounded-lg px-3 py-1 text-xs ${link.is_active ? "bg-green-600 text-[var(--admin-ink)]" : "bg-red-600 text-[var(--admin-ink)]"}`}
      >
        {link.is_active ? "Active" : "Inactive"}
      </button>
      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete(index)}
          className="rounded-lg bg-red-500 px-3 py-1.5 text-xs text-white hover:bg-red-600"
        >
          Delete
        </button>
      )}
    </div>
  );
}

function FooterGroupCard({ group, onTitleChange, onLinkChange, onAddLink, onDeleteLink, onDeleteGroup, canEdit, canAdd, canDelete }) {
  const links = group.links || [];

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={group.title}
          onChange={(e) => onTitleChange(e.target.value)}
          disabled={!canEdit}
          className="flex-1 min-w-[200px] rounded-lg border border-[var(--admin-border)] bg-white/5 px-3 py-2 text-lg font-bold text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]"
        />
        {canDelete && (
          <button type="button" onClick={onDeleteGroup} className="rounded-lg bg-red-500 px-3 py-2 text-xs text-white hover:bg-red-600">
            Delete Column
          </button>
        )}
      </div>

      <div className="space-y-2">
        {links.map((link, index) => (
          <FooterLinkRow
            key={link.id ?? `new-${index}`}
            link={link}
            index={index}
            onChange={onLinkChange}
            onDelete={onDeleteLink}
            canEdit={canEdit}
            canDelete={canDelete}
          />
        ))}
      </div>

      {canAdd && (
        <button type="button" onClick={onAddLink} className="rounded-lg bg-[var(--admin-bg-deep)] px-3 py-2 text-sm text-[var(--admin-ink)] hover:bg-white/20">
          + Add Link
        </button>
      )}
    </div>
  );
}

export default function FooterManager() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [footerSettings, setFooterSettings] = useState(() => ({
    ...FOOTER_SETTINGS_FIELDS.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {}),
    ...FOOTER_LOGO_FIELDS.reduce((acc, key) => ({ ...acc, [key]: "" }), {}),
  }));
  const [loading, setLoading] = useState(true);
  const [loadedSettingsOk, setLoadedSettingsOk] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newGroupTitle, setNewGroupTitle] = useState("");

  const canEdit = hasPermission(user, "edit_content");
  const canDelete = hasPermission(user, "delete_content");
  const canAdd = hasPermission(user, "create_content");

  const apiRoot = useMemo(() => getBackendRoot(), []);

  const toImageUrl = (value) => {
    if (!value) return "";
    if (value.startsWith("http")) return value;
    if (value.startsWith("/")) return apiRoot + value;
    return apiRoot + "/uploads/" + value;
  };

  const load = async () => {
    try {
      setLoading(true);
      const [groupsRes, settingsRes] = await Promise.all([
        getFooterLinkGroups(),
        getSettings(),
      ]);
      const nextGroups = Array.isArray(groupsRes.data?.data) ? groupsRes.data.data : [];
      setGroups(nextGroups.map((g) => ({ ...g, links: (g.links || []).map((l) => ({ ...l })) })));

      const rows = Array.isArray(settingsRes?.data?.data) ? settingsRes.data.data : [];
      if (rows.length) {
        const next = { ...footerSettings };
        rows.forEach((row) => {
          const key = String(row?.setting_key || "").trim();
          if (Object.prototype.hasOwnProperty.call(next, key)) {
            const value = row?.setting_value;
            next[key] = typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? "");
          }
        });
        setFooterSettings(next);
        setLoadedSettingsOk(true);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load footer settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(""), 2000); };

  const setFooterSettingField = (key, value) => {
    setFooterSettings((prev) => ({ ...prev, [key]: value }));
    if (success) setSuccess("");
  };

  const uploadLogo = async (file) => {
    try {
      setUploading(true);
      const path = await uploadImage(file, "settings", footerSettings.footer_logo);
      if (path) setFooterSettingField("footer_logo", path);
    } catch (err) {
      console.error(err);
      setError("Logo upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const setGroupTitle = (groupIndex, value) => {
    setGroups((prev) => prev.map((g, i) => (i === groupIndex ? { ...g, title: value } : g)));
  };

  const updateLinkField = (groupIndex, linkIndex, key, value) => {
    setGroups((prev) =>
      prev.map((g, i) =>
        i === groupIndex
          ? { ...g, links: g.links.map((l, j) => (j === linkIndex ? { ...l, [key]: value } : l)) }
          : g,
      ),
    );
  };

  const addLink = (groupIndex) => {
    setGroups((prev) =>
      prev.map((g, i) => (i === groupIndex ? { ...g, links: [...g.links, emptyLink(g.id)] } : g)),
    );
  };

  const deleteLink = async (groupIndex, linkIndex) => {
    const group = groups[groupIndex];
    const link = group.links[linkIndex];
    if (!link.id) {
      setGroups((prev) =>
        prev.map((g, i) => (i === groupIndex ? { ...g, links: g.links.filter((_, j) => j !== linkIndex) } : g)),
      );
      return;
    }
    if (!window.confirm(`Delete "${link.label}"?`)) return;
    try {
      await deleteFooterLink(link.id);
      setGroups((prev) =>
        prev.map((g, i) => (i === groupIndex ? { ...g, links: g.links.filter((_, j) => j !== linkIndex) } : g)),
      );
      flash("Link deleted.");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  const deleteGroup = async (groupIndex) => {
    const group = groups[groupIndex];
    if (!window.confirm(`Delete the "${group.title}" column and all its links?`)) return;
    try {
      await deleteFooterLinkGroup(group.id);
      flash("Group deleted.");
      load();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to delete group.");
    }
  };

  const addGroup = async () => {
    if (!newGroupTitle.trim()) return;
    setSaving(true);
    setError("");
    try {
      await createFooterLinkGroup({ title: newGroupTitle.trim(), sort_order: groups.length + 1 });
      setNewGroupTitle("");
      flash("Column added.");
      load();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to add column.");
    } finally {
      setSaving(false);
    }
  };

  const moveGroup = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= groups.length) return;
    const next = [...groups];
    [next[index], next[target]] = [next[target], next[index]];
    setGroups(next);
    try {
      await reorderFooterLinkGroups(next.map((g, i) => ({ id: g.id, sort_order: i + 1 })));
    } catch (err) {
      console.error(err);
      setError("Failed to save new column order.");
    }
  };

  const saveAll = async () => {
    if (!loadedSettingsOk) {
      setError("Settings were not loaded successfully, so saving is disabled. Reload and try again.");
      return;
    }
    for (const group of groups) {
      for (const link of group.links) {
        const hasLabel = link.label.trim();
        const hasUrl = link.url.trim();
        if (!hasLabel && !hasUrl) continue;
        if (!hasLabel || !hasUrl) {
          setError(`Every link in "${group.title}" needs both a label and a URL.`);
          return;
        }
      }
    }

    setSaving(true);
    setError("");
    try {
      await updateSettings(footerSettings);

      for (const group of groups) {
        await updateFooterLinkGroup(group.id, { title: group.title.trim() });

        for (let i = 0; i < group.links.length; i += 1) {
          const link = group.links[i];
          if (!link.label.trim() || !link.url.trim()) continue;
          const payload = {
            group_id: group.id,
            label: link.label.trim(),
            url: link.url.trim(),
            is_active: link.is_active ? 1 : 0,
            sort_order: link.sort_order ?? i + 1,
          };
          if (link.id) {
            await updateFooterLink(link.id, payload);
          } else {
            await createFooterLink(payload);
          }
        }
      }

      flash("Footer changes saved.");
      await load();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to save footer changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-[var(--admin-muted)]">Loading footer link groups...</p>;

  return (
    <section className="space-y-5 pb-20">
      <header>
        <h2 className="text-3xl font-bold text-[var(--admin-ink)]">Footer Manager</h2>
        <p className="text-sm text-[var(--admin-ink)]/65">Manage the footer link columns (e.g. Quick Links, Legal Information) and their links.</p>
      </header>

      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div> : null}
      {success ? <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300">{success}</div> : null}

      <div className="space-y-3 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-4 sm:p-5">
        <h3 className="mb-4 text-lg font-bold text-[var(--admin-ink)]">Footer Information</h3>
        <div className="space-y-3">
          {FOOTER_SETTINGS_FIELDS.map((field) => (
            <div key={field.key} className="grid grid-cols-1 gap-2 md:grid-cols-[220px_1fr] md:items-start">
              <label className="pt-2 text-sm font-semibold text-[var(--admin-ink)]/80">{field.label}</label>
              {field.multiline ? (
                <textarea
                  rows={3}
                  value={footerSettings[field.key] || ""}
                  onChange={(e) => setFooterSettingField(field.key, e.target.value)}
                  disabled={!canEdit}
                  className="w-full rounded-xl border border-[var(--admin-border)] bg-white/5 px-3 py-2.5 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]"
                />
              ) : (
                <input
                  type="text"
                  value={footerSettings[field.key] || ""}
                  onChange={(e) => setFooterSettingField(field.key, e.target.value)}
                  disabled={!canEdit}
                  className="w-full rounded-xl border border-[var(--admin-border)] bg-white/5 px-3 py-2.5 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]"
                />
              )}
            </div>
          ))}

          <div className="grid grid-cols-1 gap-2 md:grid-cols-[220px_1fr] md:items-start">
            <label className="pt-2 text-sm font-semibold text-[var(--admin-ink)]/80">Footer Logo</label>
            <div className="space-y-3">
              <ImageUpload
                value={toImageUrl(footerSettings.footer_logo)}
                onFileSelect={uploadLogo}
                label="Upload Footer Logo"
                helperText="PNG, JPG, or SVG shown in the footer brand column"
              />
              <input
                type="text"
                placeholder="Footer logo alt text"
                value={footerSettings.footer_logo_alt || ""}
                onChange={(e) => setFooterSettingField("footer_logo_alt", e.target.value)}
                disabled={!canEdit}
                className="w-full rounded-xl border border-[var(--admin-border)] bg-white/5 px-3 py-2.5 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]"
              />
            </div>
          </div>
        </div>
      </div>

      {canAdd && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-4">
          <input
            type="text"
            placeholder="New column title (e.g. Support)"
            value={newGroupTitle}
            onChange={(e) => setNewGroupTitle(e.target.value)}
            className="flex-1 min-w-[220px] rounded-lg border border-[var(--admin-border)] bg-white/5 px-3 py-2 text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]"
          />
          <button type="button" onClick={addGroup} disabled={saving} className="rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-[var(--admin-ink)] hover:bg-[var(--admin-primary-strong)]">
            + Add Column
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {groups.map((group, index) => (
          <div key={group.id} className="space-y-2">
            <div className="flex justify-end gap-1">
              <button type="button" onClick={() => moveGroup(index, -1)} disabled={index === 0} className="rounded border border-[var(--admin-border)] px-2 py-0.5 text-xs disabled:opacity-30">← Move Left</button>
              <button type="button" onClick={() => moveGroup(index, 1)} disabled={index === groups.length - 1} className="rounded border border-[var(--admin-border)] px-2 py-0.5 text-xs disabled:opacity-30">Move Right →</button>
            </div>
            <FooterGroupCard
              group={group}
              canEdit={canEdit}
              canAdd={canAdd}
              canDelete={canDelete}
              onTitleChange={(value) => setGroupTitle(index, value)}
              onLinkChange={(linkIndex, key, value) => updateLinkField(index, linkIndex, key, value)}
              onAddLink={() => addLink(index)}
              onDeleteLink={(linkIndex) => deleteLink(index, linkIndex)}
              onDeleteGroup={() => deleteGroup(index)}
            />
          </div>
        ))}
      </div>

      {canEdit && (
        <div className="sticky bottom-4 z-10 flex justify-end">
          <button
            type="button"
            onClick={saveAll}
            disabled={saving || uploading || !loadedSettingsOk}
            className="rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-[var(--admin-ink)] shadow-sm hover:bg-[var(--admin-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : uploading ? "Uploading..." : "Save Changes"}
          </button>
        </div>
      )}
    </section>
  );
}
