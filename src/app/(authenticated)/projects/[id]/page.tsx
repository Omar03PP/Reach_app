import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProjectById } from "@/lib/actions/projects";
import { getProposalsByProject } from "@/lib/actions/proposals";
import { categoryLabels } from "@/lib/project-options";
import { ProposalForm } from "@/components/ProposalForm";
import { ProposalActions } from "@/components/ProposalActions";
import { prisma } from "@/lib/prisma";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const statusLabels: Record<string, string> = {
  OPEN: "Abierto",
  IN_PROGRESS: "En progreso",
  CLOSED: "Cerrado",
};

const proposalStatusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  ACCEPTED: "Aceptada",
  REJECTED: "Rechazada",
};

const proposalStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-mint/10 text-mint",
  REJECTED: "bg-coral/10 text-coral",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const isClientOwner = session.user.role === "CLIENT" && project.client.id === session.user.id;
  const isFreelancer = session.user.role === "FREELANCER";

  let existingProposal: Awaited<ReturnType<typeof prisma.proposal.findUnique>> = null;
  let proposals: Awaited<ReturnType<typeof getProposalsByProject>> = [];

  if (isFreelancer) {
    existingProposal = await prisma.proposal.findUnique({
      where: {
        projectId_freelancerId: {
          projectId: id,
          freelancerId: session.user.id,
        },
      },
    });
  }

  if (isClientOwner) {
    proposals = await getProposalsByProject(id);
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <Link
              href={
                isClientOwner
                  ? "/dashboard/client"
                  : "/projects"
              }
              className="text-sm font-bold text-mint"
            >
              {isClientOwner ? "Volver al dashboard" : "Volver a proyectos"}
            </Link>
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-coral">
              {categoryLabels[project.category]}
            </p>
            <h1 className="mt-3 text-4xl font-black text-ink">
              {project.title}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md bg-ink px-3 py-2 text-sm font-black text-white">
              {currencyFormatter.format(project.budget)}
            </span>
            <span className="rounded-md bg-mint/10 px-3 py-2 text-sm font-black text-mint">
              {statusLabels[project.status] ?? project.status}
            </span>
          </div>
        </div>

        <p className="mt-6 leading-7 text-ink/70">{project.description}</p>

        <p className="mt-5 text-sm font-semibold text-ink/55">
          Publicado por {project.client.name} el{" "}
          {new Intl.DateTimeFormat("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(new Date(project.createdAt))}
        </p>

        {isFreelancer && (
          <div className="mt-10 rounded-lg border border-ink/10 bg-white/85 p-6 shadow-soft">
            {existingProposal ? (
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-mint">
                  Tu propuesta
                </p>
                <div className="mt-4 grid gap-4">
                  <div>
                    <p className="text-sm font-semibold text-ink/55">Mensaje</p>
                    <p className="mt-1 leading-7 text-ink/70">
                      {existingProposal.message}
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold text-ink/55">
                        Precio propuesto
                      </p>
                      <p className="mt-1 text-xl font-black text-ink">
                        {currencyFormatter.format(existingProposal.price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink/55">
                        Tiempo estimado
                      </p>
                      <p className="mt-1 text-xl font-black text-ink">
                        {existingProposal.estimatedDays} dias
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink/55">Estado</p>
                    <span
                      className={`mt-1 inline-block rounded-md px-3 py-2 text-sm font-black ${
                        proposalStatusColors[existingProposal.status]
                      }`}
                    >
                      {proposalStatusLabels[existingProposal.status]}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-mint">
                  Enviar propuesta
                </p>
                <h2 className="mt-2 text-2xl font-black text-ink">
                  Aplica a este proyecto
                </h2>
                <p className="mt-2 leading-7 text-ink/65">
                  Cuentale al cliente por que eres la persona indicada para este
                  trabajo.
                </p>
                <div className="mt-6">
                  <ProposalForm projectId={id} />
                </div>
              </div>
            )}
          </div>
        )}

        {isClientOwner && (
          <div className="mt-10">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">
              Propuestas recibidas
            </p>
            <h2 className="mt-2 text-2xl font-black text-ink">
              {proposals.length} propuesta{proposals.length === 1 ? "" : "s"}
            </h2>

            {proposals.length === 0 ? (
              <div className="mt-6 rounded-lg border border-ink/10 bg-white/85 p-6 shadow-soft">
                <p className="text-lg font-bold text-ink">
                  Aun no hay propuestas.
                </p>
                <p className="mt-2 text-ink/65">
                  Cuando un freelancer envie una propuesta, aparecera aqui.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-5">
                {proposals.map((proposal) => (
                  <article
                    key={proposal.id}
                    className="rounded-lg border border-ink/10 bg-white/85 p-6 shadow-soft"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div>
                        <Link
                          href={`/freelancers/${proposal.freelancer.id}`}
                          className="text-lg font-black text-ink underline-offset-2 hover:underline"
                        >
                          {proposal.freelancer.name}
                        </Link>
                        <p className="text-sm text-ink/55">
                          {proposal.freelancer.email}
                        </p>
                      </div>
                      <ProposalActions
                        proposalId={proposal.id}
                        status={proposal.status}
                      />
                    </div>
                    <p className="mt-4 leading-7 text-ink/70">
                      {proposal.message}
                    </p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-semibold text-ink/55">
                          Precio
                        </p>
                        <p className="text-xl font-black text-ink">
                          {currencyFormatter.format(proposal.price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink/55">
                          Tiempo estimado
                        </p>
                        <p className="text-xl font-black text-ink">
                          {proposal.estimatedDays} dias
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
