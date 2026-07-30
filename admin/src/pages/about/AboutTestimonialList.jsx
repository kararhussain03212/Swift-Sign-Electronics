import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAboutTestimonial, getAboutTestimonials, updateAboutTestimonial } from "../../api/aboutApi";
import { useAuth } from "../../context/useAuth";
import { hasPermission } from "../../modules/users/constants";
import { getBackendRoot } from "../../api/runtimeApi";

export default function AboutTestimonialList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canAdd = hasPermission(user, "create_content");
  const canEdit = hasPermission(user, "edit_content");
  const canDelete = hasPermission(user, "delete_content");

  const apiRoot = getBackendRoot();
  const resolveImage = (value) => {
    if (!value) return "";
    if (value.startsWith("http") || value.startsWith("/")) return value.startsWith("/uploads/") ? apiRoot + value : value;
    return apiRoot + "/uploads/" + value;
  };

  useEffect(() => {
    getAboutTestimonials()
      .then((res) => setItems(Array.isArray(res.data?.data) ? res.data.data : []))
      .catch(() => setError("Failed to load testimonials."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!canDelete) return;
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      await deleteAboutTestimonial(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  const handleToggleActive = async (item) => {
    if (!canEdit) return;
    try {
      const { data } = await updateAboutTestimonial(item.id, { is_active: item.is_active ? 0 : 1 });
      setItems((prev) => prev.map((t) => (t.id === data?.data?.id ? data.data : t)));
    } catch (err) {
      console.error(err);
      setError("Failed to update testimonial status.");
    }
  };

  if (loading) return <p className="text-[var(--admin-muted)]">Loading testimonials...</p>;

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[var(--admin-ink)]">Testimonials</h2>
          <p className="text-sm text-[var(--admin-ink)]/65">"Don't just take our word for it" carousel on the About Us page.</p>
        </div>
        {canAdd && (
          <button
            type="button"
            onClick={() => navigate("/about/testimonials/new")}
            className="inline-flex w-fit rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-[var(--admin-ink)] hover:bg-[var(--admin-primary-strong)]"
          >
            + Add Testimonial
          </button>
        )}
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      ) : null}

      {items.length === 0 ? (
        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] p-6 text-[var(--admin-muted)]">
          No testimonials found.
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-bg)]">
              <div className="grid grid-cols-1 md:grid-cols-[140px_1fr]">
                {item.avatar ? (
                  <img src={resolveImage(item.avatar)} alt={item.name} className="h-32 w-full object-cover md:h-full" />
                ) : (
                  <div className="flex h-32 items-center justify-center bg-white/5 text-[var(--admin-ink)]/40 md:h-full">No photo</div>
                )}
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--admin-accent)]">
                        {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)} · #{item.sort_order}
                      </p>
                      <h3 className="mt-1 break-words text-xl font-bold text-[var(--admin-ink)]">{item.name}</h3>
                      <p className="text-sm text-[var(--admin-muted)]">{item.title || "—"}</p>
                      <p className="mt-2 break-words text-sm text-[var(--admin-muted)]">"{item.quote}"</p>
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
                          onClick={() => navigate(`/about/testimonials/edit/${item.id}`)}
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
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
