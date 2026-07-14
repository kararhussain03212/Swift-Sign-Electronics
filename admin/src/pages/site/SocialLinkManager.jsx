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

  const handleSaveRow = async (index) => {
    const link = links[index];
    if (!link.url.trim()) {
      setError("URL is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        platform: link.platform,
        url: link.url.trim(),
        is_active: link.is_active ? 1 : 0,
        sort_order: link.sort_order ?? index + 1,
      };
      if (link.id) {
        const { data } = await updateSocialLink(link.id, payload);
        setLinks((prev) => prev.map((l, i) => (i === index ? { ...data.data, dirty: false } : l)));
      } else {
        const { data } = await createSocialLink(payload);
        setLinks((prev) => prev.map((l, i) => (i === index ? { ...data.data, dirty: false } : l)));
      }
      flash("Saved.");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to save link.");
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

  if (loading) return <p className="text-white/70">Loading social links...</p>;

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Social Links Manager</h2>
          <p className="text-sm text-white/65">Manage the social icons shown in the footer.</p>
        </div>
        {canAdd && (
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex w-fit rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-white hover:bg-[var(--admin-primary-strong)]"
          >
            + Add Social Link
          </button>
        )}
      </header>

      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div> : null}
      {success ? <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300">{success}</div> : null}

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[var(--admin-bg)]">
        <table className="w-full text-left text-sm text-white/80">
          <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
            <tr>
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">URL</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link, index) => (
              <tr key={link.id ?? `new-${index}`} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3">
                  <select
                    value={link.platform}
                    onChange={(e) => updateField(index, "platform", e.target.value)}
                    disabled={!canEdit}
                    className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-white outline-none focus:border-[var(--admin-primary)]"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>{p}</option>
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
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-white outline-none focus:border-[var(--admin-primary)]"
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => updateField(index, "is_active", link.is_active ? 0 : 1)}
                    disabled={!canEdit}
                    className={`rounded-lg px-3 py-1 text-xs ${link.is_active ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
                  >
                    {link.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => handleSaveRow(index)}
                        disabled={saving || !link.dirty}
                        className="rounded-lg bg-[var(--admin-primary)] px-3 py-1.5 text-xs text-white hover:bg-[var(--admin-primary-strong)] disabled:opacity-40"
                      >
                        Save
                      </button>
                    )}
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
    </section>
  );
}
