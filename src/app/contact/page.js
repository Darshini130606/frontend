"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ToastProvider";

export default function ContactPage() {
  const { notify } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (event) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.message) {
      notify("Please complete all fields.", "error");
      return;
    }
    notify("Thanks. The team will contact you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-ink">Contact</h1>
          <form onSubmit={submit} className="mt-8 grid gap-4">
            <input className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-4 py-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <textarea className="min-h-36 rounded-lg border border-slate-300 px-4 py-3" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <button className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-600">Send Message</button>
          </form>
        </div>
      </main>
    </div>
  );
}
