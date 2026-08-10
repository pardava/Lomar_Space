import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * Checks whether the current signed-in user has `role: "admin"` set in
 * their Clerk publicMetadata. Returns the userId if they're an admin,
 * or null otherwise (not signed in, or signed in but not an admin).
 */
export async function getAdminUserId(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const role = user.publicMetadata?.role;
  return role === "admin" ? userId : null;
}
