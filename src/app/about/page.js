import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase text-teal-700">About</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Built for coworking operators and members</h1>
          <p className="mt-5 leading-7 text-slate-600">
            CoWork Hub helps teams manage flexible workspace inventory, member bookings, approvals, payments, and reporting.
            It keeps user-facing booking simple while giving admins the operational controls needed to run a modern coworking space.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {["Reliable scheduling", "Clear admin controls", "Actionable reporting"].map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 p-5 text-sm font-semibold text-ink">{item}</div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
