import { useEffect, useState } from "react";
import {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
} from "../../api/socialLinkApi";
import { useAuth } from "../../context/useAuth";
import { hasPermission } from "../../modules/users/constants";

const PLATFORMS = ["github", "discord", "twitter", "linkedin", "facebook", "instagram", "youtube"];

const emptyLink = () => ({ id: null, platform: "github", url: "", is_active: 1, dirty: false });

export default function SocialLinkManager() {
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const canEdit = hasPermission(user, "edit_content");
  const canDelete = hasPermission(user, "delete_content");
  const canAdd = hasPermission(user, "create_content");

  const load = async () => {
    try {
      setLoading(true);
      const res = await getSocialLinks();
      setLinks(Array.isArray(res.data?.data) ? res.data.data.map((l) => ({ ...l, dirty: false })) : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load social links.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(""), 2000); };

  const updateField = (index, key, value) => {
    setLinks((prev) => prev.map((l, i) => (i === index ? { ...l, [key]: value, dirty: true } : l)));
  };

  const handleAdd = () => setLinks((prev) => [...prev, emptyLink()]);

  const handleSaveAll = async () => {
    const missingUrl = links.some((l) => !l.url.trim());
    if (missingUrl) {
      setError("Every social link needs a URL.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const next = [];
      for (let i = 0; i < links.length; i += 1) {
        const link = links[i];
        const payload = {
          platform: link.platform,
          url: link.url.trim(),
          is_active: link.is_active ? 1 : 0,
          sort_order: link.sort_order ?? i + 1,
        };
        if (link.id) {
          const { data } = await updateSocialLink(link.id, payload);
          next.push({ ...data.data, dirty: false });
        } else {
          const { data } = await createSocialLink(payload);
          next.push({ ...data.data, dirty: false });
        }
      }
      setLinks(next);
      flash("All changes saved.");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (index) => {
    const link = links[index];
    if (!canDelete) return;
    if (!link.id) {
      setLinks((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    if (!window.confirm(`Delete "${link.platform}" link?`)) return;
    try {
      await deleteSocialLink(link.id);
      setLinks((prev) => prev.filter((_, i) => i !== index));
      flash("Deleted.");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  if (loading) return <p className="text-[var(--admin-muted)]">Loading social links...</p>;

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[var(--admin-ink)]">Social Links Manager</h2>
          <p className="text-sm text-[var(--admin-ink)]/65">Manage the social icons shown in the footer.</p>
        </div>
        {canAdd && (
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex w-fit rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-[var(--admin-ink)] hover:bg-[var(--admin-primary-strong)]"
          >
            + Add Social Link
          </button>
        )}
      </header>

      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div> : null}
      {success ? <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300">{success}</div> : null}

      <div className="overflow-x-auto rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-bg)]">
        <table className="w-full text-left text-sm text-[var(--admin-ink)]/80">
          <thead className="border-b border-[var(--admin-border)] text-xs uppercase tracking-wider text-[var(--admin-muted-light)]">
            <tr>
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">URL</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link, index) => (
              <tr key={link.id ?? `new-${index}`} className="border-b border-[var(--admin-border)] last:border-0">
                <td className="px-4 py-3">
                  <select
                    value={link.platform}
                    onChange={(e) => updateField(index, "platform", e.target.value)}
                    disabled={!canEdit}
                    className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-2 py-1.5 text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p} className="bg-[var(--admin-bg)] text-[var(--admin-ink)]">{p}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateField(index, "url", e.target.value)}
                    disabled={!canEdit}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-[var(--admin-border)] bg-white/5 px-2 py-1.5 text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]"
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => updateField(index, "is_active", link.is_active ? 0 : 1)}
                    disabled={!canEdit}
                    className={`rounded-lg px-3 py-1 text-xs ${link.is_active ? "bg-green-600 text-[var(--admin-ink)]" : "bg-red-600 text-[var(--admin-ink)]"}`}
                  >
                    {link.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDelete(index)}
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

      {canEdit && (
        <div className="sticky bottom-4 z-10 flex justify-end">
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving || links.length === 0}
            className="rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-[var(--admin-ink)] shadow-sm hover:bg-[var(--admin-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </section>
  );
}
