import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function AdminPage() {
  const { count: totalCount } = await supabaseAdmin
    .from("furniture")
    .select("*", { count: "exact", head: true });

  const { count: activeCount } = await supabaseAdmin
    .from("furniture")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  const { count: inStockCount } = await supabaseAdmin
    .from("furniture")
    .select("*", { count: "exact", head: true })
    .eq("in_stock", true);

  const { data: categoryStats } = await supabaseAdmin
    .from("categories")
    .select("id, name, furniture(count)")
    .order("name");

  const sortedCategories = (categoryStats ?? [])
    .map((c: any) => ({
      id: c.id,
      name: c.name,
      count: c.furniture?.[0]?.count ?? 0,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-[#FAF6EE] p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="font-[family-name:var(--font-fraunces)] text-3xl text-[#2E3B2A]">
            Admin Dashboard
          </h1>
          <Link
            href="/admin/furniture"
            className="rounded-full bg-[#2E3B2A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3D4F37]"
          >
            Manage furniture
          </Link>
        </div>

        {/* STATS */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#2E3B2A]/10 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#5C6B54]">
              Total products
            </p>
            <p className="mt-2 text-3xl font-bold text-[#2E3B2A]">
              {totalCount ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-[#2E3B2A]/10 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#5C6B54]">
              Active products
            </p>
            <p className="mt-2 text-3xl font-bold text-[#2E3B2A]">
              {activeCount ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-[#2E3B2A]/10 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#5C6B54]">
              In stock
            </p>
            <p className="mt-2 text-3xl font-bold text-[#2E3B2A]">
              {inStockCount ?? 0}
            </p>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="mt-8 rounded-2xl border border-[#2E3B2A]/10 bg-white p-6">
          <h2 className="text-lg font-semibold text-[#2E3B2A]">
            Products by category
          </h2>

          <div className="mt-4 divide-y divide-[#2E3B2A]/8">
            {sortedCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between py-3"
              >
                <span className="text-sm text-[#2E3B2A]">{cat.name}</span>
                <span className="rounded-full bg-[#FAF6EE] px-3 py-1 text-xs font-semibold text-[#5C6B54]">
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}