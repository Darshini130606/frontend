"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function AppShell({ children, role = "user" }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper">
      <Navbar onMenu={() => setOpen((value) => !value)} />
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <Sidebar role={role} open={open} />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
