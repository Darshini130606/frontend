"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import ConfirmDialog from "@/components/ConfirmDialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import Pagination from "@/components/Pagination";
import WorkspaceCard from "@/components/WorkspaceCard";
import { useToast } from "@/components/ToastProvider";
import api from "@/lib/api";

const workspaceTypes = ["", "Hot Desk", "Dedicated Desk", "Meeting Room", "Private Cabin"];

export default function BookWorkspacePage() {
  const { notify } = useToast();
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: "", type: "" });
  const [selected, setSelected] = useState(null);
  const [booking, setBooking] = useState({ booking_date: "", start_time: "09:00", end_time: "17:00" });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/workspaces", { params: { ...filters, page, limit: 6 } });
      setWorkspaces(data.rows || []);
      setTotal(data.total || 0);
    } catch (error) {
      notify("Unable to load workspaces.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, filters.type]);

  const search = (event) => {
    event.preventDefault();
    setPage(1);
    load();
  };

  const confirmBooking = async () => {
    if (!booking.booking_date || !booking.start_time || !booking.end_time) {
      notify("Please choose date and time.", "error");
      return;
    }
    try {
      await api.post("/bookings", { workspace_id: selected.workspace_id, ...booking });
      notify("Booking request submitted.");
      setSelected(null);
    } catch (error) {
      notify(error.response?.data?.message || "Booking failed.", "error");
    }
  };

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Book Workspace</h1>
          <p className="mt-1 text-sm text-slate-600">Search by name, filter by type, and reserve available spaces.</p>
        </div>
        <form onSubmit={search} className="flex flex-col gap-3 sm:flex-row">
          <input className="rounded-lg border border-slate-300 px-4 py-2.5" placeholder="Search workspace" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <select className="rounded-lg border border-slate-300 px-4 py-2.5" value={filters.type} onChange={(e) => { setFilters({ ...filters, type: e.target.value }); setPage(1); }}>
            {workspaceTypes.map((type) => <option key={type} value={type}>{type || "All Types"}</option>)}
          </select>
          <button className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-600">Search</button>
        </form>
      </div>
      {loading ? <LoadingSpinner /> : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {workspaces.map((workspace) => <WorkspaceCard key={workspace.workspace_id} workspace={workspace} onBook={setSelected} />)}
          </div>
          <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
            <Pagination page={page} total={total} limit={6} onChange={setPage} />
          </div>
        </>
      )}
      <ConfirmDialog
        open={Boolean(selected)}
        title={selected ? `Book ${selected.workspace_name}` : "Book workspace"}
        message={
          <div className="grid gap-3">
            <input className="rounded-lg border border-slate-300 px-3 py-2" type="date" value={booking.booking_date} onChange={(e) => setBooking({ ...booking, booking_date: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <input className="rounded-lg border border-slate-300 px-3 py-2" type="time" value={booking.start_time} onChange={(e) => setBooking({ ...booking, start_time: e.target.value })} />
              <input className="rounded-lg border border-slate-300 px-3 py-2" type="time" value={booking.end_time} onChange={(e) => setBooking({ ...booking, end_time: e.target.value })} />
            </div>
          </div>
        }
        confirmLabel="Submit Booking"
        onCancel={() => setSelected(null)}
        onConfirm={confirmBooking}
      />
    </AppShell>
  );
}
