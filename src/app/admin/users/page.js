"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import AppShell from "@/components/AppShell";
import ConfirmDialog from "@/components/ConfirmDialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import Pagination from "@/components/Pagination";
import { useToast } from "@/components/ToastProvider";
import api from "@/lib/api";

export default function ManageUsersPage() {
  const { notify } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users", { params: { page, limit: 10, search } });
      setUsers(data.rows || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const updateStatus = async (id, status) => {
    await api.put(`/users/${id}`, { status });
    notify("User status updated.");
    load();
  };

  const remove = async () => {
    await api.delete(`/users/${deleteId}`);
    notify("User deleted.");
    setDeleteId(null);
    load();
  };

  return (
    <AppShell role="admin">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-ink">Manage Users</h1>
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); load(); }} className="flex gap-2">
          <input className="rounded-lg border border-slate-300 px-4 py-2.5" placeholder="Search users" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white">Search</button>
        </form>
      </div>
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.user_id} className="border-t border-slate-100">
                    <td className="px-5 py-3">{user.name}</td>
                    <td className="px-5 py-3">{user.email}</td>
                    <td className="px-5 py-3">{user.phone || "-"}</td>
                    <td className="px-5 py-3">
                      <select className="rounded-lg border border-slate-300 px-3 py-2" value={user.status} onChange={(e) => updateStatus(user.user_id, e.target.value)}>
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <button className="rounded-lg border border-rose-200 p-2 text-rose-600" onClick={() => setDeleteId(user.user_id)} aria-label="Delete user">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} total={total} limit={10} onChange={setPage} />
      </section>
      <ConfirmDialog open={Boolean(deleteId)} title="Delete user" message="This permanently removes the user account. Existing bookings may prevent deletion because of database relationships." confirmLabel="Delete" onCancel={() => setDeleteId(null)} onConfirm={remove} />
    </AppShell>
  );
}
