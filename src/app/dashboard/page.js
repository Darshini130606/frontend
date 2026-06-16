"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, Clock, Warehouse } from "lucide-react";
import AppShell from "@/components/AppShell";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatCard from "@/components/StatCard";
import api, { getSessionUser } from "@/lib/api";

export default function UserDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getSessionUser());
    const load = async () => {
      try {
        const [bookingRes, workspaceRes] = await Promise.all([
          api.get("/bookings/my?limit=5"),
          api.get("/workspaces?status=Available&limit=4")
        ]);
        setBookings(bookingRes.data.rows || []);
        setWorkspaces(workspaceRes.data.rows || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Welcome{user?.name ? `, ${user.name}` : ""}. Your workspace activity is below.</p>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard title="My Bookings" value={bookings.length} icon={CalendarCheck} />
            <StatCard title="Available Spaces" value={workspaces.length} icon={Warehouse} tone="amber" />
            <StatCard title="Pending Requests" value={bookings.filter((b) => b.booking_status === "Pending").length} icon={Clock} tone="ink" />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5">
                <h2 className="font-semibold text-ink">Recent Bookings</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-5 py-3">Workspace</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Time</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.booking_id} className="border-t border-slate-100">
                        <td className="px-5 py-3">{booking.workspace_name}</td>
                        <td className="px-5 py-3">{booking.booking_date?.slice(0, 10)}</td>
                        <td className="px-5 py-3">{booking.start_time} - {booking.end_time}</td>
                        <td className="px-5 py-3">{booking.booking_status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-ink">Quick Actions</h2>
              <div className="mt-4 grid gap-3">
                <Link className="rounded-lg bg-teal-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-teal-600" href="/book-workspace">Book a Workspace</Link>
                <Link className="rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-semibold hover:bg-slate-100" href="/booking-history">View Booking History</Link>
                <Link className="rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-semibold hover:bg-slate-100" href="/profile">Update Profile</Link>
              </div>
            </section>
          </div>
        </>
      )}
    </AppShell>
  );
}
