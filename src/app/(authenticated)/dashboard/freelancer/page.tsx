import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getFreelancerDashboardData } from "@/lib/actions/projects";
import { getFreelancerReviews } from "@/lib/actions/reviews";
import { getProfile } from "@/lib/actions/profile";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function FreelancerDashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "FREELANCER") {
    redirect("/login");
  }

  const profile = await getProfile(session.user.id);
  const data = await getFreelancerDashboardData(session.user.id);
  const reviews = await getFreelancerReviews(session.user.id);

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
              className="h-14 w-14 rounded-full border-2 border-mint/20 object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mint text-xl font-bold text-white">
              {initials}
            </div>
          )}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-mint">
              Dashboard freelancer
            </p>
            <h1 className="text-2xl font-black text-ink sm:text-3xl">
              Hola, {session.user.name}!
            </h1>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/projects"
            className="rounded-md bg-mint px-5 py-3 font-bold text-white shadow-soft transition hover:bg-mint/90"
          >
            Ver proyectos disponibles
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-4">
          <div className="rounded-lg border border-ink/10 bg-white/85 p-5 shadow-soft">
            <p className="text-sm font-semibold text-ink/55">Propuestas enviadas</p>
            <p className="mt-1 text-3xl font-black text-ink">{data.stats.totalProposals}</p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white/85 p-5 shadow-soft">
            <p className="text-sm font-semibold text-ink/55">Aceptadas</p>
            <p className="mt-1 text-3xl font-black text-mint">{data.stats.acceptedProposals}</p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white/85 p-5 shadow-soft">
            <p className="text-sm font-semibold text-ink/55">Completados</p>
            <p className="mt-1 text-3xl font-black text-ink">{data.stats.completedProjects}</p>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white/85 p-5 shadow-soft">
            <p className="text-sm font-semibold text-ink/55">Calificacion promedio</p>
            <p className="mt-1 text-3xl font-black text-coral">
              {data.stats.avgRating != null ? data.stats.avgRating : "—"}
            </p>
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
              {data.activeProjects.map((proposal) => (
                <article
                  key={proposal.id}
                  className="rounded-lg border border-ink/10 bg-white/85 p-6 shadow-soft"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <h3 className="text-xl font-black text-ink">
                        {proposal.project.title}
                      </h3>
                      <p className="mt-2 leading-7 text-ink/70">
                        {proposal.message}
                      </p>
                    </div>
                    <span className="rounded-md bg-ink px-3 py-2 text-sm font-black text-white">
                      {currencyFormatter.format(proposal.price)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink/55">
                    {proposal.estimatedDays} dias estimados
                  </p>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {data.pendingProposals.length > 0 ? (
          <div className="mt-12">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">
              Propuestas pendientes
            </p>
            <h2 className="mt-2 text-2xl font-black text-ink">
              Esperando respuesta
            </h2>
            <div className="mt-4 grid gap-4">
              {data.pendingProposals.map((proposal) => (
                <article
                  key={proposal.id}
                  className="rounded-lg border border-ink/10 bg-white/85 p-6 shadow-soft"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <h3 className="text-xl font-black text-ink">
                        {proposal.project.title}
                      </h3>
                      <p className="mt-2 leading-7 text-ink/70">
                        {proposal.message}
                      </p>
                    </div>
                    <span className="rounded-md bg-ink px-3 py-2 text-sm font-black text-white">
                      {currencyFormatter.format(proposal.price)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink/55">
                    {proposal.estimatedDays} dias estimados
                  </p>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-12">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-ink/55">
            Historial
          </p>
          <h2 className="mt-2 text-2xl font-black text-ink">
            Proyectos completados
          </h2>
          {data.completedProjects.length === 0 ? (
            <div className="mt-4 rounded-lg border border-ink/10 bg-white/85 p-6 shadow-soft">
              <p className="text-lg font-bold text-ink">
                Aun no tienes proyectos completados.
              </p>
              <p className="mt-2 text-ink/65">
                Cuando un cliente marque un proyecto como completado, aparecera aqui.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4">
              {data.completedProjects.map((proposal) => {
                const review = reviews.find(
                  (r) => r.project.title === proposal.project.title,
                );
                return (
                  <article
                    key={proposal.id}
                    className="rounded-lg border border-ink/10 bg-white/85 p-6 shadow-soft"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div>
                        <h3 className="text-xl font-black text-ink">
                          {proposal.project.title}
                        </h3>
                        <p className="mt-1 text-sm text-ink/55">
                          {currencyFormatter.format(proposal.price)} —{" "}
                          {proposal.estimatedDays} dias
                        </p>
                      </div>
                    </div>
                    {review ? (
                      <div className="mt-4 rounded-md bg-ink/5 p-4">
                        <p className="text-sm font-bold text-mint">
                          Resena del cliente
                        </p>
                        <div className="mt-1 flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={
                                star <= review.rating
                                  ? "text-yellow-500"
                                  : "text-ink/20"
                              }
                            >
                              &#9733;
                            </span>
                          ))}
                        </div>
                        <p className="mt-2 text-sm text-ink/70">
                          {review.comment}
                        </p>
                        <p className="mt-1 text-xs text-ink/45">
                          — {review.client.name}
                        </p>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
