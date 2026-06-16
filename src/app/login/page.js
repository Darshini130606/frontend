"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import api, { saveSession } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

export default function LoginPage() {
  const router = useRouter();
  const { notify } = useToast();
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("role") === "admin") setRole("admin");
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      notify("Email and password are required.", "error");
      return;
    }

    setLoading(true);
    try {
      const endpoint = role === "admin" ? "/admin/login" : "/auth/login";
      const { data } = await api.post(endpoint, form);
      saveSession(data);
      notify(data.message);
      router.push(role === "admin" ? "/admin/dashboard" : "/dashboard");
    } catch (error) {
      notify(error.response?.data?.message || "Login failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[1fr_420px] lg:px-8">
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-ink">Welcome back</h1>
          <p className="mt-4 leading-7 text-slate-600">Access your workspace bookings or sign into the admin console.</p>
          <p className="mt-6 rounded-lg bg-white p-4 text-sm text-slate-600 shadow-sm">
            Sample logins after importing SQL: admin@example.com / admin123, user@example.com / user123
          </p>
        </div>
        <form onSubmit={submit} className="rounded-lg bg-white p-6 shadow-soft">
          <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1">
            {["user", "admin"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRole(item)}
                className={`rounded-md px-4 py-2 text-sm font-semibold capitalize ${role === item ? "bg-white text-teal-700 shadow-sm" : "text-slate-600"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="mt-5 block text-sm font-medium text-slate-700">Email</label>
          <input className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <label className="mt-4 block text-sm font-medium text-slate-700">Password</label>
          <input className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button disabled={loading} className="mt-6 w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-600 disabled:opacity-60">
            {loading ? "Signing in..." : "Login"}
          </button>
          <p className="mt-4 text-center text-sm text-slate-600">
            New member? <Link className="font-semibold text-teal-700" href="/register">Create account</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
