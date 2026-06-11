import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserById, getFreelancerStats } from "@/lib/actions/profile";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function FreelancerProfilePage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await getUserById(id);

  if (!user || user.role !== "FREELANCER") {
    notFound();
  }

  const stats = await getFreelancerStats(id);
  const profile = user.profile;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto w-full max-w-4xl">
        <Link href="/projects" className="text-sm font-bold text-mint">
          Volver a proyectos
        </Link>

        <div className="mt-8 rounded-lg border border-ink/10 bg-white/85 p-8 shadow-soft">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {profile?.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={user.name}
                className="h-28 w-28 rounded-full border-4 border-mint/20 object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-mint text-3xl font-black text-white">
                {initials}
              </div>
            )}

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-black text-ink">{user.name}</h1>
              {profile?.title ? (
                <p className="mt-1 text-lg font-semibold text-mint">
                  {profile.title}
                </p>
              ) : null}
              {profile?.country ? (
                <p className="mt-1 text-sm text-ink/55">{profile.country}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-md bg-ink/5 px-4 py-5 text-center">
              <p className="text-2xl font-black text-ink">
                {stats.totalProposals}
              </p>
              <p className="mt-1 text-sm font-semibold text-ink/55">
                Propuestas enviadas
              </p>
            </div>
            <div className="rounded-md bg-ink/5 px-4 py-5 text-center">
              <p className="text-2xl font-black text-ink">
                {stats.acceptedProposals}
              </p>
              <p className="mt-1 text-sm font-semibold text-ink/55">
                Propuestas aceptadas
              </p>
            </div>
            <div className="rounded-md bg-ink/5 px-4 py-5 text-center">
              <p className="text-2xl font-black text-mint">
                {stats.completedProjects}
              </p>
              <p className="mt-1 text-sm font-semibold text-ink/55">
                Proyectos completados
              </p>
            </div>
          </div>

          {profile?.bio ? (
            <div className="mt-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-coral">
                Acerca de
              </h2>
              <p className="mt-3 leading-7 text-ink/70">{profile.bio}</p>
            </div>
          ) : null}

          {profile?.yearsExperience != null ? (
            <div className="mt-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-coral">
                Experiencia
              </h2>
              <p className="mt-2 text-lg font-bold text-ink">
                {profile.yearsExperience} ano
                {profile.yearsExperience === 1 ? "" : "s"} de experiencia
              </p>
            </div>
          ) : null}

          {profile?.skills && profile.skills.length > 0 ? (
            <div className="mt-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-coral">
                Habilidades
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-mint/10 px-3 py-2 text-sm font-bold text-mint"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
