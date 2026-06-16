"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/components/ToastProvider";
import api from "@/lib/api";

export default function ProfilePage() {
  const { notify } = useToast();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/users/profile");
        setForm(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.put("/users/profile", form);
      notify(data.message);
    } catch (error) {
      notify(error.response?.data?.message || "Profile update failed.", "error");
    }
  };

  return (
    <AppShell>
      <h1 className="mb-6 text-2xl font-bold text-ink">Profile</h1>
      {loading ? <LoadingSpinner /> : (
        <form onSubmit={submit} className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">Name<input className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label className="text-sm font-medium text-slate-700">Email<input disabled className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3" value={form.email || ""} /></label>
            <label className="text-sm font-medium text-slate-700">Phone<input className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Address<textarea className="mt-2 min-h-28 w-full rounded-lg border border-slate-300 px-4 py-3" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
          </div>
          <button className="mt-6 rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-600">Save Profile</button>
        </form>
      )}
    </AppShell>
  );
}
