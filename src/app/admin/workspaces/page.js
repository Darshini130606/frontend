"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import AppShell from "@/components/AppShell";
import ConfirmDialog from "@/components/ConfirmDialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import Pagination from "@/components/Pagination";
import { useToast } from "@/components/ToastProvider";
import api from "@/lib/api";

const emptyForm = {
  workspace_name: "",
  workspace_type: "Hot Desk",
  capacity: 1,
  price_per_day: 25,
  availability_status: "Available",
  description: ""
};

export default function ManageWorkspacesPage() {
  const { notify } = useToast();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/workspaces", { params: { page, limit: 10 } });
      setRows(data.rows || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (workspace) => {
    setEditingId(workspace.workspace_id);
    setForm({
      workspace_name: workspace.workspace_name,
      workspace_type: workspace.workspace_type,
      capacity: workspace.capacity,
      price_per_day: workspace.price_per_day,
      availability_status: workspace.availability_status,
      description: workspace.description || ""
    });
    setFormOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.workspace_name || !form.description) {
      notify("Workspace name and description are required.", "error");
      return;
    }
    try {
      if (editingId) {
        await api.put(`/workspaces/${editingId}`, form);
        notify("Workspace updated.");
      } else {
        await api.post("/workspaces", form);
        notify("Workspace created.");
      }
      setFormOpen(false);
      load();
    } catch (error) {
      notify(error.response?.data?.message || "Unable to save workspace.", "error");
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/workspaces/${deleteId}`);
      notify("Workspace deleted.");
      setDeleteId(null);
      load();
    } catch (error) {
      notify(error.response?.data?.message || "Unable to delete workspace.", "error");
    }
  };

  return (
    <AppShell role="admin">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-ink">Manage Workspaces</h1>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-600">
          <Plus className="h-4 w-4" /> Add Workspace
        </button>
      </div>
      {formOpen && (
        <form onSubmit={submit} className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink">{editingId ? "Edit Workspace" : "Add Workspace"}</h2>
            <button type="button" className="rounded-lg p-2 hover:bg-slate-100" onClick={() => setFormOpen(false)} aria-label="Close form"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <input className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Workspace name" value={form.workspace_name} onChange={(e) => setForm({ ...form, workspace_name: e.target.value })} />
            <select className="rounded-lg border border-slate-300 px-4 py-3" value={form.workspace_type} onChange={(e) => setForm({ ...form, workspace_type: e.target.value })}>
              <option>Hot Desk</option>
              <option>Dedicated Desk</option>
              <option>Meeting Room</option>
              <option>Private Cabin</option>
            </select>
            <select className="rounded-lg border border-slate-300 px-4 py-3" value={form.availability_status} onChange={(e) => setForm({ ...form, availability_status: e.target.value })}>
              <option>Available</option>
              <option>Unavailable</option>
              <option>Maintenance</option>
            </select>
            <input className="rounded-lg border border-slate-300 px-4 py-3" type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-4 py-3" type="number" min="0" step="0.01" value={form.price_per_day} onChange={(e) => setForm({ ...form, price_per_day: e.target.value })} />
            <button className="rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-600">{editingId ? "Update" : "Create"}</button>
            <textarea className="min-h-24 rounded-lg border border-slate-300 px-4 py-3 md:col-span-3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </form>
      )}
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Capacity</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((workspace) => (
                  <tr key={workspace.workspace_id} className="border-t border-slate-100">
                    <td className="px-5 py-3 font-medium text-ink">{workspace.workspace_name}</td>
                    <td className="px-5 py-3">{workspace.workspace_type}</td>
                    <td className="px-5 py-3">{workspace.capacity}</td>
                    <td className="px-5 py-3">${Number(workspace.price_per_day).toFixed(2)}</td>
                    <td className="px-5 py-3">{workspace.availability_status}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button className="rounded-lg border border-slate-200 p-2" onClick={() => openEdit(workspace)} aria-label="Edit workspace"><Pencil className="h-4 w-4" /></button>
                        <button className="rounded-lg border border-rose-200 p-2 text-rose-600" onClick={() => setDeleteId(workspace.workspace_id)} aria-label="Delete workspace"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} total={total} limit={10} onChange={setPage} />
      </section>
      <ConfirmDialog open={Boolean(deleteId)} title="Delete workspace" message="This will remove the workspace if it is not referenced by existing bookings." confirmLabel="Delete" onCancel={() => setDeleteId(null)} onConfirm={remove} />
    </AppShell>
  );
}
