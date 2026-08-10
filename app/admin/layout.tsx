import { redirect } from "next/navigation";
import { getAdminUserId } from "@/lib/adminAuth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminUserId = await getAdminUserId();

  if (!adminUserId) {
    redirect("/"); // not an admin — bounce to home
  }

  return <>{children}</>;
}
