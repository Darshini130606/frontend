"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarCheck,
  ClipboardList,
  LayoutDashboard,
  User,
  Users,
  Warehouse
} from "lucide-react";

const userItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/book-workspace", label: "Book Workspace", icon: Warehouse },
  { href: "/booking-history", label: "Booking History", icon: CalendarCheck },
  { href: "/profile", label: "Profile", icon: User }
];

const adminItems = [
  { href: "/admin/dashboard", label: "Admin Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Manage Users", icon: Users },
  { href: "/admin/workspaces", label: "Workspaces", icon: Warehouse },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/reports#bookings", label: "Bookings", icon: ClipboardList }
];

export default function Sidebar({ role = "user", open = true }) {
  const pathname = usePathname();
  const items = role === "admin" ? adminItems : userItems;

  return (
    <aside className={`${open ? "block" : "hidden"} w-full border-r border-slate-200 bg-white lg:block lg:min-h-[calc(100vh-4rem)] lg:w-64`}>
      <nav className="space-y-1 p-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                active ? "bg-teal-50 text-teal-700" : "text-slate-600 hover:bg-slate-100 hover:text-ink"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
