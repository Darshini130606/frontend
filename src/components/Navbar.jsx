"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BriefcaseBusiness, LogOut, Menu } from "lucide-react";
import { clearSession, getSessionUser } from "@/lib/api";

export default function Navbar({ onMenu }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getSessionUser());
  }, []);

  const logout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {onMenu && (
            <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={onMenu} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
          )}
          <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-teal-700 text-white">
              <BriefcaseBusiness className="h-5 w-5" />
            </span>
            CoWork Hub
          </Link>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <Link href="/about" className="hover:text-ink">About</Link>
          <Link href="/services" className="hover:text-ink">Services</Link>
          <Link href="/contact" className="hover:text-ink">Contact</Link>
          <Link href="/book-workspace" className="hover:text-ink">Workspaces</Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-sm text-slate-600 sm:inline">{user.name}</span>
              <button className="rounded-lg border border-slate-200 p-2 hover:bg-slate-100" onClick={logout} aria-label="Logout">
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Login</Link>
              <Link href="/register" className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
