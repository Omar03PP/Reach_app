import { signOut } from "@/auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getFreelancerProposals } from "@/lib/actions/proposals";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const proposalStatusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  ACCEPTED: "Aceptada",
  REJECTED: "Rechazada",
};

const proposalStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-mint text-white",
  REJECTED: "bg-coral/10 text-coral",
};

export default async function FreelancerDashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "FREELANCER") {
    redirect("/login");
  }

  const proposals = await getFreelancerProposals(session.user.id);

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-mint">
              Dashboard freelancer
            </p>
            <h1 className="mt-3 text-4xl font-black text-ink">
              Tus proyectos y propuestas
            </h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/projects"
              className="rounded-md bg-mint px-5 py-3 text-center font-bold text-white shadow-soft transition hover:bg-mint/90"
            >
              Ver proyectos disponibles
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button className="w-full rounded-md border border-ink/15 px-5 py-3 font-bold text-ink transition hover:border-ink/35">
                Cerrar sesion
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">
            Mis propuestas
          </p>
          <h2 className="mt-2 text-2xl font-black text-ink">
            {proposals.length} propuesta{proposals.length === 1 ? "" : "s"}{" "}
            enviada{proposals.length === 1 ? "" : "s"}
          </h2>

          {proposals.length === 0 ? (
            <div className="mt-6 rounded-lg border border-ink/10 bg-white/85 p-6 shadow-soft">
              <p className="text-lg font-bold text-ink">
                Aun no has enviado propuestas.
              </p>
              <p className="mt-2 text-ink/65">
                Explora los proyectos disponibles y envia tu primera propuesta.
              </p>
              <Link
                href="/projects"
                className="mt-4 inline-flex rounded-md bg-mint px-5 py-3 font-bold text-white shadow-soft transition hover:bg-mint/90"
              >
                Ver proyectos
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {proposals.map((proposal) => (
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
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-md bg-ink px-3 py-2 text-sm font-black text-white">
                        {currencyFormatter.format(proposal.price)}
                      </span>
                      <span
                        className={`rounded-md px-3 py-2 text-sm font-black ${
                          proposalStatusColors[proposal.status]
                        }`}
                      >
                        {proposalStatusLabels[proposal.status]}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink/55">
                    {proposal.estimatedDays} dias estimados
                    {" — "}
                    Proyecto: {proposal.project.status === "OPEN" ? "Abierto" : proposal.project.status === "IN_PROGRESS" ? "En progreso" : "Cerrado"}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
