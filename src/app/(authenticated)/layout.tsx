import { auth } from "@/auth";
import { getProfile } from "@/lib/actions/profile";
import { Navbar } from "@/components/Navbar";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  let photoUrl: string | null | undefined = null;

  if (session?.user) {
    const profile = await getProfile(session.user.id);
    photoUrl = profile?.photoUrl;
  }

  return (
    <>
      {session?.user ? (
        <Navbar
          user={{
            name: session.user.name ?? "",
            role: session.user.role,
            photoUrl,
          }}
        />
      ) : null}
      {children}
    </>
  );
}
