import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-[#3A2119]/8 bg-[#D2E2EC]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-12 md:flex-row">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="" width={28} height={28} className="h-7 w-7" />
          <div className="leading-none">
            <h3 className="font-[family-name:var(--font-fraunces)] text-xl text-[#3A2119]">
              Lomar Space
            </h3>
            <p className="mt-1 text-xs text-[#957662]">
              Turn inspiration into reality
            </p>
          </div>
        </div>

        <div className="flex gap-8 text-sm text-[#957662]">
          <Link href="/" className="hover:text-[#3A2119]">Home</Link>
          <Link href="/catalog" className="hover:text-[#3A2119]">Catalog</Link>
          <Link href="/ai" className="hover:text-[#3A2119]">AI Design</Link>
          <Link href="/admin" className="hover:text-[#3A2119]">Admin</Link>
        </div>
      </div>

      <div className="border-t border-[#3A2119]/8 py-6 text-center text-xs text-[#957662]">
        © 2026 Lomar Space. All rights reserved.
      </div>
    </footer>
  );
}
