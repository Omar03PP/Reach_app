import Link from "next/link";
import { getProjects } from "@/lib/actions/projects";
import { categoryLabels } from "@/lib/project-options";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/dashboard/freelancer"
              className="text-sm font-bold text-mint"
            >
              Volver al dashboard
            </Link>
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-coral">
              Proyectos abiertos
            </p>
            <h1 className="mt-3 text-4xl font-black text-ink">
              Proyectos disponibles
            </h1>
          </div>
          <p className="text-sm font-semibold text-ink/55">
            {projects.length} proyecto{projects.length === 1 ? "" : "s"}
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="mt-8 rounded-lg border border-ink/10 bg-white/85 p-8 shadow-soft">
            <h2 className="text-2xl font-black text-ink">
              Aun no hay proyectos abiertos.
            </h2>
            <p className="mt-2 text-ink/65">
              Cuando un cliente publique un proyecto, aparecera aqui.
            </p>
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
                  <p className="rounded-md bg-ink px-3 py-2 text-sm font-black text-white">
                    {currencyFormatter.format(project.budget)}
                  </p>
                </div>
                <p className="mt-4 leading-7 text-ink/70">
                  {project.description}
                </p>
                <p className="mt-5 text-sm font-semibold text-ink/55">
                  Publicado por {project.client.name}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
