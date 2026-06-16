import Navbar from "@/components/Navbar";

const services = [
  "Hot desk booking",
  "Dedicated desk assignment",
  "Meeting room reservations",
  "Private cabin management",
  "Payment tracking",
  "Daily and monthly reports"
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-ink">Services</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-ink">{service}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Purpose-built workflows for coworking teams that need speed, clarity, and dependable records.
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
