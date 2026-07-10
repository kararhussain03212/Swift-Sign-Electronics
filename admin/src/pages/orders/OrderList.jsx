import { useEffect, useState } from "react";
import { deleteOrder, getOrder, getOrders, updateOrderStatus } from "../../api/orderApi";
import { useAuth } from "../../context/useAuth";
import { hasPermission } from "../../modules/users/constants";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const STATUS_COLORS = {
  pending: "bg-yellow-500/20 text-yellow-300",
  confirmed: "bg-blue-500/20 text-blue-300",
  shipped: "bg-purple-500/20 text-purple-300",
  delivered: "bg-green-500/20 text-green-300",
  cancelled: "bg-red-500/20 text-red-300",
};

export default function OrderList() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState(null);

  const canEdit = hasPermission(user, "edit_content");
  const canDelete = hasPermission(user, "delete_content");

  useEffect(() => {
    getOrders({ paginate: 0 })
      .then((res) => setOrders(Array.isArray(res.data?.data) ? res.data.data : []))
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (order, status) => {
    if (!canEdit) return;
    try {
      const { data } = await updateOrderStatus(order.id, status);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: data?.data?.status || status } : o)));
    } catch (err) {
      console.error(err);
      setError("Failed to update order status.");
    }
  };

  const handleDelete = async (id) => {
    if (!canDelete) return;
    if (!window.confirm("Delete this order?")) return;
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  const openDetail = async (id) => {
    try {
      const res = await getOrder(id);
      setDetail(res.data?.data || null);
    } catch (err) {
      console.error(err);
      setError("Failed to load order details.");
    }
  };

  if (loading) return <p className="text-white/70">Loading orders...</p>;

  return (
    <section className="space-y-5">
      <header>
        <h2 className="text-3xl font-bold text-white">Orders</h2>
        <p className="text-sm text-white/65">Checkout submissions from the store.</p>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      ) : null}

      {orders.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[var(--admin-bg)] p-6 text-white/70">
          No orders yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[var(--admin-bg)]">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
              <tr>
                <th className="px-4 py-3">Order #</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 font-mono text-white">{order.order_number}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white">{order.customer_name}</p>
                    <p className="text-xs text-white/50">{order.customer_email || order.customer_phone || ""}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">${Number(order.total).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    {canEdit ? (
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order, e.target.value)}
                        className={`rounded-lg border-0 px-2 py-1 text-xs outline-none ${STATUS_COLORS[order.status] || "bg-white/10"}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-neutral-900 text-white">{s}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`rounded-lg px-2 py-1 text-xs ${STATUS_COLORS[order.status] || "bg-white/10"}`}>
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs">{order.created_at}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openDetail(order.id)}
                        className="rounded-lg bg-[var(--admin-primary)] px-3 py-1.5 text-xs text-white hover:bg-[var(--admin-primary-strong)]"
                      >
                        View
                      </button>
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDelete(order.id)}
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

      {detail && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={() => setDetail(null)}>
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/15 bg-[var(--admin-card)] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Order {detail.order_number}</h3>
              <button type="button" onClick={() => setDetail(null)} className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white">
                <span className="pi pi-times" />
              </button>
            </div>
            <div className="space-y-2 text-sm text-white/80">
              <p><span className="text-white/50">Customer:</span> {detail.customer_name}</p>
              {detail.customer_email && <p><span className="text-white/50">Email:</span> {detail.customer_email}</p>}
              {detail.customer_phone && <p><span className="text-white/50">Phone:</span> {detail.customer_phone}</p>}
              {detail.address && <p><span className="text-white/50">Address:</span> {detail.address}{detail.city ? `, ${detail.city}` : ""}{detail.country ? `, ${detail.country}` : ""}</p>}
              {detail.notes && <p><span className="text-white/50">Notes:</span> {detail.notes}</p>}
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-left text-sm text-white/80">
                <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-white/50">
                  <tr>
                    <th className="px-3 py-2">Item</th>
                    <th className="px-3 py-2">Qty</th>
                    <th className="px-3 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(detail.items || []).map((item) => (
                    <tr key={item.id} className="border-b border-white/5 last:border-0">
                      <td className="px-3 py-2">{item.product_name}</td>
                      <td className="px-3 py-2">{item.quantity}</td>
                      <td className="px-3 py-2 text-right">${Number(item.line_total).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-right text-base font-bold text-white">Total: ${Number(detail.total).toFixed(2)}</p>
          </div>
        </div>
      )}
    </section>
  );
}
