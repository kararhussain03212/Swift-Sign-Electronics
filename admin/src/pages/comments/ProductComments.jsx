import React, { useEffect, useState, useCallback } from "react";
import { getProductComments, deleteProductComment } from "../../api/productCommentApi";

export default function ProductComments() {
  const [comments, setComments] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, per_page: 20 };
      if (search) params.search = search;
      const res = await getProductComments(params);
      const payload = res?.data ?? res;
      setComments(Array.isArray(payload?.data) ? payload.data : []);
      setMeta(payload?.meta ?? null);
    } catch {
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this comment? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await deleteProductComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
      if (expanded === id) setExpanded(null);
    } catch {
      setError("Failed to delete comment.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[var(--admin-ink)]">Product Comments</h2>
          <p className="mt-0.5 text-sm text-[var(--admin-muted)]">
            Comments and reviews submitted on product pages. Remove anything abusive or off-topic.
          </p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name, email, product, or comment…"
          className="w-full max-w-xs rounded-lg border border-[var(--admin-border)] bg-[var(--admin-card)] px-3 py-1.5 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-primary)]"
        />
      </header>

      {error && (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)]">
        {loading ? (
          <div className="py-16 text-center text-sm text-[var(--admin-muted)]">Loading comments…</div>
        ) : comments.length === 0 ? (
          <div className="py-16 text-center text-sm text-[var(--admin-muted)]">No comments found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--admin-border)] text-left text-xs uppercase tracking-widest text-[var(--admin-muted)]">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 hidden sm:table-cell">Email</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3 hidden lg:table-cell">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((c) => (
                <React.Fragment key={c.id}>
                  <tr
                    onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                    className="cursor-pointer border-b border-[var(--admin-border)] transition hover:bg-[var(--admin-bg)]"
                  >
                    <td className="px-4 py-3 text-[var(--admin-ink)] hover:text-[var(--admin-primary)]">{c.name}</td>
                    <td className="px-4 py-3 hidden text-[var(--admin-muted)] sm:table-cell">{c.email}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate text-[var(--admin-muted)]">{c.product_name}</td>
                    <td className="px-4 py-3 hidden text-[var(--admin-muted)] lg:table-cell">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString("en-PK") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}
                        disabled={deleting === c.id}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20"
                        title="Delete"
                      >
                        <span className="pi pi-trash" />
                      </button>
                    </td>
                  </tr>
                  {expanded === c.id && (
                    <tr key={`${c.id}-expanded`} className="border-b border-[var(--admin-border)] bg-[var(--admin-bg)]">
                      <td colSpan={5} className="px-5 py-4">
                        <div className="space-y-2 text-sm">
                          <p className="text-[var(--admin-muted)]">
                            <strong className="text-[var(--admin-ink)]">Product:</strong> {c.product_name}
                          </p>
                          <p className="whitespace-pre-wrap text-[var(--admin-muted)]">
                            <strong className="text-[var(--admin-ink)]">Comment:</strong><br />{c.comment}
                          </p>
                          <p className="text-xs text-[var(--admin-muted)]">
                            Posted: {c.created_at ? new Date(c.created_at).toLocaleString("en-PK") : "—"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-card)] px-3 py-1.5 text-sm text-[var(--admin-muted)] disabled:opacity-40 hover:text-[var(--admin-ink)]"
          >
            ← Prev
          </button>
          <span className="text-sm text-[var(--admin-muted)]">Page {page} of {meta.total_pages}</span>
          <button
            onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))}
            disabled={page === meta.total_pages}
            className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-card)] px-3 py-1.5 text-sm text-[var(--admin-muted)] disabled:opacity-40 hover:text-[var(--admin-ink)]"
          >
            Next →
          </button>
        </div>
      )}
    </section>
  );
}
