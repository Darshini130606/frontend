"use client";

import { CalendarPlus, Users } from "lucide-react";

export default function WorkspaceCard({ workspace, onBook }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">{workspace.workspace_type}</p>
          <h3 className="mt-1 text-lg font-semibold text-ink">{workspace.workspace_name}</h3>
        </div>
        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
          {workspace.availability_status}
        </span>
      </div>
      <p className="mt-3 min-h-16 text-sm leading-6 text-slate-600">{workspace.description}</p>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
        <span className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          {workspace.capacity} seats
        </span>
        <span className="font-semibold text-ink">${Number(workspace.price_per_day).toFixed(2)}/day</span>
      </div>
      <button
        onClick={() => onBook(workspace)}
        disabled={workspace.availability_status !== "Available"}
        className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        <CalendarPlus className="h-4 w-4" />
        Book Workspace
      </button>
    </article>
  );
}
