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
    <aside className="flex h-screen w-[280px] flex-col border-r border-[#3A2119]/8 bg-white">
      <div className="border-b border-[#3A2119]/8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-fraunces)] text-2xl text-[#3A2119]">
              Lomar
            </h1>
            <p className="mt-0.5 text-xs text-[#957662]">Interior AI Studio</p>
          </div>

          <button
            className="rounded-lg border border-[#3A2119]/10 p-2 transition hover:bg-[#D2E2EC]"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={16} className="text-[#957662]" />
          </button>
        </div>

        <button className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#3A2119] py-3 text-sm font-semibold text-white transition hover:bg-[#3A2119]">
          <Plus size={16} />
          New project
        </button>

        <div className="relative mt-5">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#957662]"
          />
          <input
            placeholder="Search..."
            className="w-full rounded-full border border-[#3A2119]/10 bg-[#D2E2EC] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#3A2119]"
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
                  ? "bg-[#3A2119] text-white"
                  : "text-[#957662] hover:bg-[#D2E2EC] hover:text-[#3A2119]"
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#3A2119]/8 p-4">
        <div className="space-y-1">
          {bottomMenu.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-[#957662] transition hover:bg-[#D2E2EC] hover:text-[#3A2119]"
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
