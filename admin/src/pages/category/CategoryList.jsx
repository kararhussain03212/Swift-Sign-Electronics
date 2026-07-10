import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCategory, getCategories, updateCategory } from "../../api/categoryApi";
import { useAuth } from "../../context/useAuth";
import { hasPermission } from "../../modules/users/constants";

export default function CategoryList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canAdd = hasPermission(user, "create_content");
  const canEdit = hasPermission(user, "edit_content");
  const canDelete = hasPermission(user, "delete_content");

  const load = async () => {
    try {
      const res = await getCategories();
      setCategories(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!canDelete) return;
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  const handleToggleActive = async (item) => {
    if (!canEdit) return;
    try {
      const { data } = await updateCategory(item.id, { is_active: item.is_active ? 0 : 1 });
      setCategories((prev) => prev.map((c) => (c.id === data?.data?.id ? data.data : c)));
    } catch (err) {
      console.error(err);
      setError("Failed to update category status.");
    }
  };

  if (loading) return <p className="text-white/70">Loading categories...</p>;

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Categories</h2>
          <p className="text-sm text-white/65">Manage product categories shown in the store.</p>
        </div>
        {canAdd && (
          <button
            type="button"
            onClick={() => navigate("/categories/new")}
            className="inline-flex w-fit rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-white hover:bg-[var(--admin-primary-strong)]"
          >
            + Add Category
          </button>
        )}
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      ) : null}

      {categories.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[var(--admin-bg)] p-6 text-white/70">
          No categories found. Add your first category.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[var(--admin-bg)]">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Key</th>
                <th className="px-4 py-3">Icon</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((item) => (
                <tr key={item.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 font-semibold text-white">{item.name}</td>
                  <td className="px-4 py-3">{item.cat_key}</td>
                  <td className="px-4 py-3">{item.icon || "—"}</td>
                  <td className="px-4 py-3">{Number(item.sort_order || 0)}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(item)}
                      className={`rounded-lg px-3 py-1 text-xs ${item.is_active ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => navigate(`/categories/edit/${item.id}`)}
                          className="rounded-lg bg-[var(--admin-primary)] px-3 py-1.5 text-xs text-white hover:bg-[var(--admin-primary-strong)]"
                        >
                          Edit
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
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
    </section>
  );
}
