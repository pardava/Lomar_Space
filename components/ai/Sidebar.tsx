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
  X,
} from "lucide-react";

type MenuItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

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

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  mobileOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[280px] flex-col border-r border-[#3A2119]/10 bg-[#F7F3EC] transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:static md:z-auto md:translate-x-0`}
      >
        {/* BRAND */}
        <div className="border-b border-[#3A2119]/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-[family-name:var(--font-fraunces)] text-2xl text-[#3A2119]">
                Lomar
              </h1>
              <p className="mt-0.5 text-xs text-[#656B4E]">
                Interior AI Studio
              </p>
            </div>

            <button
              type="button"
              className="rounded-lg border border-[#3A2119]/10 p-2 transition hover:bg-[#E8E2D6] md:hidden"
              aria-label="Close sidebar"
              onClick={onClose}
            >
              <X size={16} className="text-[#3A2119]" />
            </button>

            <button
              type="button"
              className="hidden rounded-lg border border-[#3A2119]/10 p-2 transition hover:bg-[#E8E2D6] md:block"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={16} className="text-[#3A2119]" />
            </button>
          </div>

          {/* NEW PROJECT */}
          <button
            type="button"
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#656B4E] py-3 text-sm font-semibold text-white transition hover:bg-[#51563E]"
          >
            <Plus size={16} />
            New project
          </button>

          {/* SEARCH */}
          <div className="relative mt-5">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#656B4E]"
            />
            <input
              type="search"
              placeholder="Search..."
              aria-label="Search"
              className="w-full rounded-full border border-[#3A2119]/10 bg-white py-2.5 pl-10 pr-4 text-sm text-[#3A2119] outline-none transition placeholder:text-[#957662] focus:border-[#656B4E] focus:ring-2 focus:ring-[#656B4E]/15"
            />
          </div>
        </div>

        {/* MAIN MENU */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          {mainMenu.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition ${
                  active
                    ? "bg-[#656B4E] text-white shadow-sm"
                    : "text-[#656B4E] hover:bg-[#E8E2D6] hover:text-[#3A2119]"
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM MENU */}
        <div className="border-t border-[#3A2119]/10 p-4">
          <div className="space-y-1">
            {bottomMenu.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-[#656B4E] transition hover:bg-[#E8E2D6] hover:text-[#3A2119]"
                >
                  <Icon size={18} />
                  {item.title}
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#B5533C]/10 py-2.5 text-sm font-medium text-[#B5533C] transition hover:bg-[#B5533C]/15"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}