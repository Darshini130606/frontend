"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import api, { saveSession } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { notify } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name || !form.email || form.password.length < 6) {
      notify("Name, valid email, and a 6 character password are required.", "error");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      saveSession(data);
      notify(data.message);
      router.push("/dashboard");
    } catch (error) {
      notify(error.response?.data?.message || "Registration failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
        <form onSubmit={submit} className="rounded-lg bg-white p-6 shadow-soft">
          <h1 className="text-3xl font-bold text-ink">Create your account</h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <input className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <textarea className="min-h-28 rounded-lg border border-slate-300 px-4 py-3 sm:col-span-2" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <button disabled={loading} className="mt-6 w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-600 disabled:opacity-60">
            {loading ? "Creating..." : "Register"}
          </button>
          <p className="mt-4 text-center text-sm text-slate-600">
            Already registered? <Link className="font-semibold text-teal-700" href="/login">Login</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
