import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowRight, CalendarCheck, ShieldCheck, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="hero-photo min-h-[620px] text-white">
        <div className="mx-auto flex min-h-[620px] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">CoWork Hub</h1>
            <p className="mt-5 text-lg leading-8 text-white/90">
              Manage coworking spaces, bookings, users, payments, and reports from one professional workspace platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book-workspace" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-600">
                Find a Workspace <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/admin/dashboard" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-slate-100">
                Admin Console
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto -mt-16 grid max-w-7xl gap-4 px-4 pb-16 sm:px-6 md:grid-cols-3 lg:px-8">
        {[
          { title: "Smart Booking", text: "Search, filter, and reserve desks, rooms, and cabins without double bookings.", icon: CalendarCheck },
          { title: "Member Control", text: "Keep user profiles, booking history, and admin approvals organized.", icon: Users },
          { title: "Operational Reports", text: "Track daily activity, monthly bookings, and revenue performance.", icon: ShieldCheck }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
              <Icon className="h-7 w-7 text-teal-700" />
              <h2 className="mt-4 text-lg font-semibold text-ink">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
