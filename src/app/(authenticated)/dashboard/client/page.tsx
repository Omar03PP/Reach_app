import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getClientProjects } from "@/lib/actions/projects";
import { getProfile } from "@/lib/actions/profile";
import { categoryLabels } from "@/lib/project-options";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function ClientDashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/login");
  }

  const profile = await getProfile(session.user.id);
  const projects = await getClientProjects(session.user.id);

  const initials = session.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto w-full max-w-6xl">
        <div className="flex items-center gap-4">
          {profile?.photoUrl ? (
            <img
              src={profile.photoUrl}
              alt=""
              className="h-14 w-14 rounded-full border-2 border-coral/20 object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-coral text-xl font-bold text-white">
              {initials}
            </div>
          )}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">
              Dashboard cliente
            </p>
            <h1 className="text-2xl font-black text-ink sm:text-3xl">
              Hola, {session.user.name}!
            </h1>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/dashboard/client/post-project"
            className="rounded-md bg-coral px-5 py-3 font-bold text-white shadow-soft transition hover:bg-coral/90"
          >
            Publicar proyecto
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="mt-8 rounded-lg border border-ink/10 bg-white/85 p-8 shadow-soft">
            <h2 className="text-2xl font-black text-ink">
              Publica tu primer proyecto.
            </h2>
            <p className="mt-2 max-w-xl leading-7 text-ink/65">
              Aun no tienes proyectos. Crea uno para que freelancers puedan ver
              la oportunidad en el listado publico.
            </p>
            <Link
              href="/dashboard/client/post-project"
              className="mt-6 inline-flex rounded-md bg-coral px-5 py-3 font-bold text-white shadow-soft transition hover:bg-coral/90"
            >
              Publicar proyecto
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5">
            {projects.map((project) => (
              <article
                key={project.id}
                className="rounded-lg border border-ink/10 bg-white/85 p-6 shadow-soft"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-sm font-bold text-mint">
                      {categoryLabels[project.category]}
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-ink">
                      {project.title}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-md bg-mint/10 px-3 py-2 text-sm font-black text-mint">
                      {project.status}
                    </span>
                    <span className="rounded-md bg-ink px-3 py-2 text-sm font-black text-white">
                      {currencyFormatter.format(project.budget)}
                    </span>
                  </div>
                </div>
                <p className="mt-4 leading-7 text-ink/70">
                  {project.description}
                </p>
                <Link
                  href={`/projects/${project.id}`}
                  className="mt-4 inline-flex rounded-md bg-coral px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-coral/90"
                >
                  Ver propuestas
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
