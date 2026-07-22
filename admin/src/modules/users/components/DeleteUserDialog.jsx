export default function DeleteUserDialog({ open, user, deleting, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-black/60 p-4">
      <div className="mx-auto my-10 w-full max-w-md rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5">
        <h3 className="text-lg font-semibold text-[var(--admin-ink)]">Delete User</h3>
        <p className="mt-2 text-sm text-[var(--admin-ink)]/75">Are you sure you want to delete {user?.name || "this user"}?</p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-lg border border-[var(--admin-border)] px-4 py-2 text-[var(--admin-ink)]">Cancel</button>
          <button type="button" onClick={onConfirm} disabled={deleting} className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50">{deleting ? "Deleting..." : "Delete"}</button>
        </div>
      </div>
    </div>
  );
}
