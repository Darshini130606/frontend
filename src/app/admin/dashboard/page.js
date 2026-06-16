"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, CircleDollarSign, Users, Warehouse } from "lucide-react";
import AppShell from "@/components/AppShell";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatCard from "@/components/StatCard";
import api from "@/lib/api";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/admin/dashboard");
        setData(response.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <AppShell role="admin">
      <h1 className="mb-6 text-2xl font-bold text-ink">Admin Dashboard</h1>
      {loading ? <LoadingSpinner /> : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <StatCard title="Total Users" value={data?.totalUsers || 0} icon={Users} />
            <StatCard title="Workspaces" value={data?.totalWorkspaces || 0} icon={Warehouse} tone="ink" />
            <StatCard title="Today's Bookings" value={data?.todaysBookings || 0} icon={CalendarCheck} tone="amber" />
            <StatCard title="Available" value={data?.availableWorkspaces || 0} icon={Warehouse} />
            <StatCard title="Revenue" value={`$${Number(data?.revenue || 0).toFixed(2)}`} icon={CircleDollarSign} tone="amber" />
          </div>
          <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="font-semibold text-ink">Recent Bookings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-5 py-3">User</th>
                    <th className="px-5 py-3">Workspace</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.recentBookings || []).map((booking) => (
                    <tr key={booking.booking_id} className="border-t border-slate-100">
                      <td className="px-5 py-3">{booking.user_name}</td>
                      <td className="px-5 py-3">{booking.workspace_name}</td>
                      <td className="px-5 py-3">{booking.booking_date?.slice(0, 10)}</td>
                      <td className="px-5 py-3">{booking.booking_status}</td>
                      <td className="px-5 py-3">${Number(booking.amount || 0).toFixed(2)}</td>
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
