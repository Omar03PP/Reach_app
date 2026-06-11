import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProfile } from "@/lib/actions/profile";
import { ProfileForm } from "@/components/ProfileForm";

export default async function EditProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const profile = await getProfile(session.user.id);
  const isFreelancer = session.user.role === "FREELANCER";

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto w-full max-w-3xl rounded-lg border border-ink/10 bg-white/85 p-8 shadow-soft">
        <Link
          href={
            isFreelancer ? "/dashboard/freelancer" : "/dashboard/client"
          }
          className="text-sm font-bold text-mint"
        >
          Volver al dashboard
        </Link>
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-mint">
          Mi perfil
        </p>
        <h1 className="mt-3 text-3xl font-black text-ink">
          Editar perfil
        </h1>
        <p className="mt-3 leading-7 text-ink/65">
          {isFreelancer
            ? "Completa tu informacion profesional para que los clientes puedan conocerte."
            : "Completa la informacion de tu empresa para que los freelancers sepan quien eres."}
        </p>
        <div className="mt-8">
          <ProfileForm
            role={session.user.role}
            initialData={{
              title: profile?.title,
              bio: profile?.bio,
              country: profile?.country,
              skills: profile?.skills ?? [],
              yearsExperience: profile?.yearsExperience,
              photoUrl: profile?.photoUrl,
              companyName: profile?.companyName,
              companyDesc: profile?.companyDesc,
            }}
          />
        </div>
      </section>
    </main>
  );
}
