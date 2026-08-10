import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-[#33475A]/8 bg-[#F0F4F8]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-12 md:flex-row">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="" width={28} height={28} className="h-7 w-7" />
          <div className="leading-none">
            <h3 className="font-[family-name:var(--font-fraunces)] text-xl text-[#33475A]">
              Lomar Space
            </h3>
            <p className="mt-1 text-xs text-[#5B7186]">
              Turn inspiration into reality
            </p>
          </div>
        </div>

        <div className="flex gap-8 text-sm text-[#5B7186]">
          <Link href="/" className="hover:text-[#33475A]">Home</Link>
          <Link href="/catalog" className="hover:text-[#33475A]">Catalog</Link>
          <Link href="/ai" className="hover:text-[#33475A]">AI Design</Link>
          <Link href="/admin" className="hover:text-[#33475A]">Admin</Link>
        </div>
      </div>

      <div className="border-t border-[#33475A]/8 py-6 text-center text-xs text-[#8598A8]">
        © 2026 Lomar Space. All rights reserved.
      </div>
    </footer>
  );
}
