import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAboutAccoladeCard, getAboutAccoladeCards, updateAboutAccoladeCard } from "../../api/aboutApi";
import { useAuth } from "../../context/useAuth";
import { hasPermission } from "../../modules/users/constants";

const SIZE_LABELS = {
  featured: "Featured (large, badge pill)",
  standard: "Standard (small, label above title)",
  wide: "Wide (horizontal, inline badge)",
};

export default function AboutAccoladeCardList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canAdd = hasPermission(user, "create_content");
  const canEdit = hasPermission(user, "edit_content");
  const canDelete = hasPermission(user, "delete_content");

  useEffect(() => {
    getAboutAccoladeCards()
      .then((res) => setCards(Array.isArray(res.data?.data) ? res.data.data : []))
      .catch(() => setError("Failed to load accolade cards."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!canDelete) return;
    if (!window.confirm("Delete this accolade card?")) return;
    try {
      await deleteAboutAccoladeCard(id);
      setCards((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  const handleToggleActive = async (item) => {
    if (!canEdit) return;
    try {
      const { data } = await updateAboutAccoladeCard(item.id, { is_active: item.is_active ? 0 : 1 });
      setCards((prev) => prev.map((c) => (c.id === data?.data?.id ? data.data : c)));
    } catch (err) {
      console.error(err);
      setError("Failed to update card status.");
    }
  };

  if (loading) return <p className="text-[var(--admin-muted)]">Loading accolade cards...</p>;

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[var(--admin-ink)]">Accolades</h2>
          <p className="text-sm text-[var(--admin-ink)]/65">"Certified Excellence" awards & certifications section.</p>
        </div>
        {canAdd && (
          <button
            type="button"
            onClick={() => navigate("/about/accolades/new")}
            className="inline-flex w-fit rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-[var(--admin-ink)] hover:bg-[var(--admin-primary-strong)]"
          >
            + Add Accolade
          </button>
        )}
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      ) : null}

      {cards.length === 0 ? (
        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-6 text-[var(--admin-muted)]">
          No accolade cards found.
        </div>
      ) : (
        <div className="grid gap-4">
          {cards.map((item) => (
            <article key={item.id} className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--admin-accent)]">
                    {SIZE_LABELS[item.size_variant] || item.size_variant} · #{item.sort_order}
                  </p>
                  <h3 className="mt-1 break-words text-xl font-bold text-[var(--admin-ink)]">
                    {item.title} {item.badge_text ? <span className="ml-2 rounded bg-white/10 px-2 py-0.5 text-xs align-middle">{item.badge_text}</span> : null}
                  </h3>
                  <p className="mt-2 break-words text-sm text-[var(--admin-muted)]">{item.icon || "—"}</p>
                  <p className="mt-2 break-words text-sm text-[var(--admin-muted)]">{item.description || "—"}</p>
                </div>
                <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(item)}
                    className={`rounded-lg px-4 py-2 text-sm text-[var(--admin-ink)] ${item.is_active ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                  >
                    {item.is_active ? "Active" : "Inactive"}
                  </button>
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => navigate(`/about/accolades/edit/${item.id}`)}
                      className="rounded-lg bg-[var(--admin-primary)] px-4 py-2 text-sm text-[var(--admin-ink)] hover:bg-[var(--admin-primary-strong)]"
                    >
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
