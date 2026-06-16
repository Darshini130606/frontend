export default function StatCard({ title, value, icon: Icon, tone = "teal" }) {
  const tones = {
    teal: "bg-teal-50 text-teal-700",
    amber: "bg-amber-100 text-amber-500",
    ink: "bg-slate-100 text-ink",
    rose: "bg-rose-50 text-rose-600"
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
        </div>
        {Icon && (
          <span className={`grid h-11 w-11 place-items-center rounded-lg ${tones[tone] || tones.teal}`}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
    </div>
  );
}
