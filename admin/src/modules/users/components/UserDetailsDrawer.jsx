export default function UserDetailsDrawer({ open, user, onClose }) {
  if (!open) return null;

  const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(String(value).replace(" ", "T"));
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString();
  };

  const initials =
    String(user?.name || "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "U";

  return (
    <div className="fixed inset-0 z-[110]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <aside
        className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-[var(--admin-border)] bg-[var(--admin-card)] p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--admin-border)] bg-[#0fafb8] text-lg font-bold text-white">{initials}</div>
            <div>
              <h3 className="text-3xl font-semibold text-[var(--admin-ink)]">{user?.name || "User"}</h3>
              <p className="text-lg text-[var(--admin-muted)]">{user?.email || "-"}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-1.5 text-[var(--admin-ink)]/75">Close</button>
        </div>
        <div className="mt-4 space-y-4">
          <section className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--admin-muted)]">Profile</p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between"><span className="text-[var(--admin-muted)]">Role</span><span className="font-semibold capitalize text-[var(--admin-ink)]">{user?.role || "-"}</span></div>
              <div className="flex items-center justify-between"><span className="text-[var(--admin-muted)]">Status</span><span className={String(user?.status || "").toLowerCase() === "inactive" ? "rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300 capitalize" : "rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 capitalize"}>{user?.status || "-"}</span></div>
              <div className="flex items-center justify-between"><span className="text-[var(--admin-muted)]">Last Login</span><span className="text-[var(--admin-ink)]">{formatDateTime(user?.last_login_at)}</span></div>
              <div className="flex items-center justify-between"><span className="text-[var(--admin-muted)]">Created</span><span className="text-[var(--admin-ink)]">{formatDateTime(user?.created_at)}</span></div>
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--admin-muted)]">Contact Details</p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between"><span className="text-[var(--admin-muted)]">Designation</span><span className="text-[var(--admin-ink)]">{user?.designation || "-"}</span></div>
              <div className="flex items-center justify-between"><span className="text-[var(--admin-muted)]">Phone</span><span className="text-[var(--admin-ink)]">{user?.phone || "-"}</span></div>
              <div className="flex items-center justify-between"><span className="text-[var(--admin-muted)]">Location</span><span className="text-[var(--admin-ink)]">{user?.location || "-"}</span></div>
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--admin-muted)]">Role Permissions</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(user?.permissions || []).length === 0 ? <span className="text-sm text-[var(--admin-ink)]/60">-</span> : null}
              {(user?.permissions || []).map((permission) => (
                <span key={permission} className="rounded-lg border border-blue-500/40 bg-blue-500/20 px-2.5 py-1 text-xs font-semibold text-blue-200">
                  {permission}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--admin-muted)]">Activity</p>
            <div className="mt-3 space-y-2">
              {(user?.activity || []).length === 0 ? <p className="text-sm text-[var(--admin-ink)]/60">No activity found.</p> : null}
              {(user?.activity || []).map((item, index) => (
                <article key={`${item?.title || "activity"}-${index}`} className="rounded-xl border border-[var(--admin-border)] bg-white/5 p-3">
                  <p className="font-semibold text-[var(--admin-ink)]">{item?.title || "Activity"}</p>
                  <p className="text-sm text-[var(--admin-muted)]">{item?.description || "-"}</p>
                  <p className="mt-1 text-xs text-[var(--admin-muted)]">{formatDateTime(item?.created_at)}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
