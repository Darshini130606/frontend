"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import ConfirmDialog from "@/components/ConfirmDialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import Pagination from "@/components/Pagination";
import { useToast } from "@/components/ToastProvider";
import api from "@/lib/api";

export default function BookingHistoryPage() {
  const { notify } = useToast();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [cancelId, setCancelId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/bookings/my", { params: { page, limit: 10 } });
      setRows(data.rows || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const cancel = async () => {
    try {
      await api.patch(`/bookings/${cancelId}/cancel`);
      notify("Booking cancelled.");
      setCancelId(null);
      load();
    } catch (error) {
      notify(error.response?.data?.message || "Unable to cancel booking.", "error");
    }
  };

  return (
    <AppShell>
      <h1 className="mb-6 text-2xl font-bold text-ink">Booking History</h1>
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-3">Workspace</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Time</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((booking) => (
                  <tr key={booking.booking_id} className="border-t border-slate-100">
                    <td className="px-5 py-3">{booking.workspace_name}</td>
                    <td className="px-5 py-3">{booking.workspace_type}</td>
                    <td className="px-5 py-3">{booking.booking_date?.slice(0, 10)}</td>
                    <td className="px-5 py-3">{booking.start_time} - {booking.end_time}</td>
                    <td className="px-5 py-3">{booking.booking_status}</td>
                    <td className="px-5 py-3">
                      <button disabled={booking.booking_status === "Cancelled"} onClick={() => setCancelId(booking.booking_id)} className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-semibold text-rose-600 disabled:opacity-40">
                        Cancel
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
      <ConfirmDialog open={Boolean(cancelId)} title="Cancel booking" message="This will cancel your booking request and update payment status." confirmLabel="Cancel Booking" onCancel={() => setCancelId(null)} onConfirm={cancel} />
    </AppShell>
  );
}
