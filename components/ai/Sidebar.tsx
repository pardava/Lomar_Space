"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Upload,
  Sofa,
  ShoppingBag,
  FolderOpen,
  Heart,
  Settings,
  HelpCircle,
  ChevronLeft,
  LogOut,
  Search,
  Plus,
} from "lucide-react";

type MenuItem = { title: string; href: string; icon: React.ElementType };

const mainMenu: MenuItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "AI Studio", href: "/ai", icon: Sparkles },
  { title: "Upload", href: "/upload", icon: Upload },
  { title: "Marketplace", href: "/catalog", icon: Sofa },
  { title: "Orders", href: "/orders", icon: ShoppingBag },
  { title: "Projects", href: "/projects", icon: FolderOpen },
  { title: "Favorites", href: "/favorites", icon: Heart },
];

const bottomMenu: MenuItem[] = [
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Help Center", href: "/help", icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[280px] flex-col border-r border-[#33475A]/8 bg-white">
      <div className="border-b border-[#33475A]/8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-fraunces)] text-2xl text-[#33475A]">
              Lomar
            </h1>
            <p className="mt-0.5 text-xs text-[#8598A8]">Interior AI Studio</p>
          </div>

          <button
            className="rounded-lg border border-[#33475A]/10 p-2 transition hover:bg-[#F0F4F8]"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={16} className="text-[#5B7186]" />
          </button>
        </div>

        <button className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#33475A] py-3 text-sm font-semibold text-white transition hover:bg-[#7EA6D8]">
          <Plus size={16} />
          New project
        </button>

        <div className="relative mt-5">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8598A8]"
          />
          <input
            placeholder="Search..."
            className="w-full rounded-full border border-[#33475A]/10 bg-[#F0F4F8] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#7EA6D8]"
          />
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
        {mainMenu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition ${
                active
                  ? "bg-[#7EA6D8] text-white"
                  : "text-[#5B7186] hover:bg-[#F0F4F8] hover:text-[#33475A]"
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#33475A]/8 p-4">
        <div className="space-y-1">
          {bottomMenu.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-[#5B7186] transition hover:bg-[#F0F4F8] hover:text-[#33475A]"
              >
                <Icon size={18} />
                {item.title}
              </Link>
            );
          })}
        </div>

        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#B5533C]/10 py-2.5 text-sm font-medium text-[#B5533C] transition hover:bg-[#B5533C]/15">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
