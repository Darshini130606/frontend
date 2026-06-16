"use client";

import { useEffect, useState } from "react";
import { BarChart3, CalendarDays, CircleDollarSign, ClipboardList } from "lucide-react";
import AppShell from "@/components/AppShell";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatCard from "@/components/StatCard";
import { useToast } from "@/components/ToastProvider";
import api from "@/lib/api";

export default function ReportsPage() {
  const { notify } = useToast();
  const [loading, setLoading] = useState(true);
  const [daily, setDaily] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [bookingReport, setBookingReport] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [bookings, setBookings] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const [dailyRes, monthlyRes, bookingRes, revenueRes, allBookings] = await Promise.all([
        api.get("/reports/daily"),
        api.get("/reports/monthly"),
        api.get("/reports/bookings"),
        api.get("/reports/revenue"),
        api.get("/bookings?limit=20")
      ]);
      setDaily(dailyRes.data);
      setMonthly(monthlyRes.data || []);
      setBookingReport(bookingRes.data || []);
      setRevenue(revenueRes.data || []);
      setBookings(allBookings.data.rows || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status`, { booking_status: status });
      notify(`Booking ${status.toLowerCase()}.`);
      load();
    } catch (error) {
      notify(error.response?.data?.message || "Unable to update booking.", "error");
    }
  };

  const monthlyBookings = monthly.reduce((sum, item) => sum + Number(item.total_bookings || 0), 0);
  const monthlyRevenue = monthly.reduce((sum, item) => sum + Number(item.revenue || 0), 0);

  return (
    <AppShell role="admin">
      <h1 className="mb-6 text-2xl font-bold text-ink">Reports</h1>
      {loading ? <LoadingSpinner /> : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Daily Bookings" value={daily?.total_bookings || 0} icon={CalendarDays} />
            <StatCard title="Daily Revenue" value={`$${Number(daily?.revenue || 0).toFixed(2)}`} icon={CircleDollarSign} tone="amber" />
            <StatCard title="Monthly Bookings" value={monthlyBookings} icon={ClipboardList} tone="ink" />
            <StatCard title="Monthly Revenue" value={`$${monthlyRevenue.toFixed(2)}`} icon={BarChart3} />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-ink">Booking Report</h2>
              <div className="mt-4 grid gap-3">
                {bookingReport.map((item) => (
                  <div key={item.booking_status} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm">
                    <span>{item.booking_status}</span>
                    <strong>{item.total}</strong>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-ink">Revenue Report</h2>
              <div className="mt-4 max-h-72 overflow-auto">
                {revenue.map((item) => (
                  <div key={item.payment_date} className="flex items-center justify-between border-b border-slate-100 py-3 text-sm">
                    <span>{item.payment_date?.slice(0, 10) || "Pending"}</span>
                    <strong>${Number(item.revenue || 0).toFixed(2)}</strong>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section id="bookings" className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="font-semibold text-ink">All Bookings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-5 py-3">User</th>
                    <th className="px-5 py-3">Workspace</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Time</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.booking_id} className="border-t border-slate-100">
                      <td className="px-5 py-3">{booking.user_name}</td>
                      <td className="px-5 py-3">{booking.workspace_name}</td>
                      <td className="px-5 py-3">{booking.booking_date?.slice(0, 10)}</td>
                      <td className="px-5 py-3">{booking.start_time} - {booking.end_time}</td>
                      <td className="px-5 py-3">{booking.booking_status}</td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button className="rounded-lg border border-teal-200 px-3 py-1.5 text-sm font-semibold text-teal-700" onClick={() => updateStatus(booking.booking_id, "Approved")}>Approve</button>
                          <button className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-semibold text-rose-600" onClick={() => updateStatus(booking.booking_id, "Cancelled")}>Cancel</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </AppShell>
  );
}
