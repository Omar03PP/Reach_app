import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getClientDashboardData } from "@/lib/actions/projects";
import { getProfile } from "@/lib/actions/profile";
import { completeProject } from "@/lib/actions/proposals";
import { categoryLabels } from "@/lib/project-options";
import { ReviewForm } from "@/components/ReviewForm";

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
  const data = await getClientDashboardData(session.user.id);

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

        <div className="mt-10 grid gap-6 sm:grid-cols-4">
          <div className="rounded-lg border border-ink/10 bg-white/85 p-5 shadow-soft">
            <p className="text-sm font-semibold text-ink/55">Proyectos publicados</p>
            <p className="mt-1 text-3xl font-black text-ink">{data.stats.totalProjects}</p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white/85 p-5 shadow-soft">
            <p className="text-sm font-semibold text-ink/55">Activos</p>
            <p className="mt-1 text-3xl font-black text-mint">{data.stats.activeProjects}</p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white/85 p-5 shadow-soft">
            <p className="text-sm font-semibold text-ink/55">Completados</p>
            <p className="mt-1 text-3xl font-black text-ink">{data.stats.completedProjects}</p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white/85 p-5 shadow-soft">
            <p className="text-sm font-semibold text-ink/55">Freelancers contratados</p>
            <p className="mt-1 text-3xl font-black text-coral">{data.stats.totalFreelancers}</p>
          </div>
        </div>

        {data.activeProjects.length > 0 ? (
          <div className="mt-12">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-mint">
              Proyectos activos
            </p>
            <h2 className="mt-2 text-2xl font-black text-ink">
              Trabajando actualmente
            </h2>
            <div className="mt-4 grid gap-4">
              {data.activeProjects.map((project) => {
                const freelancer = project.proposals[0]?.freelancer;
                return (
                  <article
                    key={project.id}
                    className="rounded-lg border border-ink/10 bg-white/85 p-6 shadow-soft"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div>
                        <p className="text-sm font-bold text-mint">
                          {categoryLabels[project.category]}
                        </p>
                        <h3 className="mt-1 text-xl font-black text-ink">
                          {project.title}
                        </h3>
                        {freelancer ? (
                          <p className="mt-1 text-sm text-ink/55">
                            Freelancer: {freelancer.name}
                          </p>
                        ) : null}
                      </div>
                      <form
                        action={async () => {
                          "use server";
                          await completeProject(project.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="rounded-md bg-mint px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-mint/90"
                        >
                          Marcar completado
                        </button>
                      </form>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : null}

        {data.openProjects.length > 0 ? (
          <div className="mt-12">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">
              Proyectos abiertos
            </p>
            <h2 className="mt-2 text-2xl font-black text-ink">
              Recibiendo propuestas
            </h2>
            <div className="mt-4 grid gap-4">
              {data.openProjects.map((project) => (
                <article
                  key={project.id}
                  className="rounded-lg border border-ink/10 bg-white/85 p-6 shadow-soft"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-sm font-bold text-mint">
                        {categoryLabels[project.category]}
                      </p>
                      <h3 className="mt-1 text-xl font-black text-ink">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-sm text-ink/55">
                        {project._count.proposals} propuesta
                        {project._count.proposals === 1 ? "" : "s"} recibida
                        {project._count.proposals === 1 ? "" : "s"}
                      </p>
                    </div>
                    <Link
                      href={`/projects/${project.id}`}
                      className="rounded-md bg-coral px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-coral/90"
                    >
                      Ver propuestas
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {data.completedProjects.length > 0 ? (
          <div className="mt-12">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-ink/55">
              Historial
            </p>
            <h2 className="mt-2 text-2xl font-black text-ink">
              Proyectos completados
            </h2>
            <div className="mt-4 grid gap-4">
              {data.completedProjects.map((project) => {
                const freelancer = project.proposals[0]?.freelancer;
                const hasReview = project.review !== null;
                return (
                  <article
                    key={project.id}
                    className="rounded-lg border border-ink/10 bg-white/85 p-6 shadow-soft"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div>
                        <p className="text-sm font-bold text-mint">
                          {categoryLabels[project.category]}
                        </p>
                        <h3 className="mt-1 text-xl font-black text-ink">
                          {project.title}
                        </h3>
                        {freelancer ? (
                          <Link
                            href={`/freelancers/${freelancer.id}`}
                            className="mt-1 inline-block text-sm font-semibold text-mint underline-offset-2 hover:underline"
                          >
                            {freelancer.name}
                          </Link>
                        ) : null}
                      </div>
                      <span className="rounded-md bg-ink/10 px-3 py-2 text-sm font-black text-ink/55">
                        {currencyFormatter.format(project.budget)}
                      </span>
                    </div>
                    {!hasReview ? (
                      <div className="mt-4 rounded-md bg-ink/5 p-4">
                        <p className="text-sm font-bold text-ink">
                          Deja una resena
                        </p>
                        <div className="mt-3">
                          <ReviewForm projectId={project.id} />
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm font-semibold text-mint">
                        Resena enviada
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
