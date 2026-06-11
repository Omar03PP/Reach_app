import { auth } from "@/auth";
import { getProfile } from "@/lib/actions/profile";
import { getNotifications, getUnreadCount } from "@/lib/actions/notifications";
import { Navbar } from "@/components/Navbar";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  let photoUrl: string | null | undefined = null;
  let notifications: Awaited<ReturnType<typeof getNotifications>> = [];
  let unreadCount = 0;

  if (session?.user) {
    const profile = await getProfile(session.user.id);
    photoUrl = profile?.photoUrl;
    notifications = await getNotifications(session.user.id);
    unreadCount = await getUnreadCount(session.user.id);
  }

  return (
    <>
      {session?.user ? (
        <Navbar
          user={{
            id: session.user.id,
            name: session.user.name ?? "",
            role: session.user.role,
            photoUrl,
          }}
          notifications={notifications.map((n) => ({
            ...n,
            createdAt: new Date(n.createdAt),
          }))}
          unreadCount={unreadCount}
        />
      ) : null}
      {children}
    </>
  );
}
