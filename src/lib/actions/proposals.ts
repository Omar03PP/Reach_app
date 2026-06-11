"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/actions/notifications";

const proposalSchema = z.object({
  message: z
    .string()
    .trim()
    .min(10, "El mensaje debe tener al menos 10 caracteres."),
  price: z.coerce
    .number()
    .positive("El precio debe ser mayor que cero.")
    .max(1000000, "El precio es demasiado alto."),
  estimatedDays: z.coerce
    .number()
    .int()
    .positive("Los dias deben ser un numero positivo.")
    .max(365, "El plazo no puede exceder un ano."),
});

export type ProposalActionState = {
  error?: string;
};

export async function createProposal(
  _state: ProposalActionState,
  formData: FormData,
): Promise<ProposalActionState> {
  const session = await auth();

  if (!session?.user || session.user.role !== "FREELANCER") {
    redirect("/login");
  }

  const projectId = formData.get("projectId") as string;
  if (!projectId) {
    return { error: "Falta el ID del proyecto." };
  }

  const parsed = proposalSchema.safeParse({
    message: formData.get("message"),
    price: formData.get("price"),
    estimatedDays: formData.get("estimatedDays"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Revisa los datos de la propuesta.",
    };
  }

  const existing = await prisma.proposal.findUnique({
    where: {
      projectId_freelancerId: {
        projectId,
        freelancerId: session.user.id,
      },
    },
  });

  if (existing) {
    return { error: "Ya enviaste una propuesta a este proyecto." };
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { clientId: true, title: true },
  });

  if (!project) {
    return { error: "El proyecto no existe." };
  }

  await prisma.proposal.create({
    data: {
      ...parsed.data,
      projectId,
      freelancerId: session.user.id,
      status: "PENDING",
    },
  });

  await createNotification(
    project.clientId,
    `Recibiste una nueva propuesta para "${project.title}"`,
    "PROPOSAL_RECEIVED",
  );

  revalidatePath(`/projects/${projectId}`);
  return { error: undefined };
}

export async function getProposalsByProject(projectId: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return prisma.proposal.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    include: {
      freelancer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function acceptProposal(proposalId: string) {
  const session = await auth();

  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/login");
  }

  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    select: {
      projectId: true,
      freelancerId: true,
      project: { select: { clientId: true, title: true } },
    },
  });

  if (!proposal || proposal.project.clientId !== session.user.id) {
    return { error: "No tienes permiso para aceptar esta propuesta." };
  }

  await prisma.$transaction([
    prisma.proposal.update({
      where: { id: proposalId },
      data: { status: "ACCEPTED" },
    }),
    prisma.proposal.updateMany({
      where: {
        projectId: proposal.projectId,
        id: { not: proposalId },
        status: "PENDING",
      },
      data: { status: "REJECTED" },
    }),
    prisma.project.update({
      where: { id: proposal.projectId },
      data: { status: "IN_PROGRESS" },
    }),
  ]);

  await createNotification(
    proposal.freelancerId,
    `Tu propuesta para "${proposal.project.title}" fue aceptada`,
    "PROPOSAL_ACCEPTED",
  );

  revalidatePath(`/projects/${proposal.projectId}`);
  return { error: undefined };
}

export async function rejectProposal(proposalId: string) {
  const session = await auth();

  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/login");
  }

  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    select: {
      projectId: true,
      freelancerId: true,
      project: { select: { clientId: true, title: true } },
    },
  });

  if (!proposal || proposal.project.clientId !== session.user.id) {
    return { error: "No tienes permiso para rechazar esta propuesta." };
  }

  await prisma.proposal.update({
    where: { id: proposalId },
    data: { status: "REJECTED" },
  });

  await createNotification(
    proposal.freelancerId,
    `Tu propuesta para "${proposal.project.title}" fue rechazada`,
    "PROPOSAL_REJECTED",
  );

  revalidatePath(`/projects/${proposal.projectId}`);
  return { error: undefined };
}

export async function getFreelancerProposals(freelancerId: string) {
  return prisma.proposal.findMany({
    where: { freelancerId },
    orderBy: { createdAt: "desc" },
    include: {
      project: {
        select: {
          title: true,
          status: true,
        },
      },
    },
  });
}

export async function completeProject(projectId: string) {
  const session = await auth();

  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/login");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { clientId: true, title: true },
  });

  if (!project || project.clientId !== session.user.id) {
    return { error: "No tienes permiso para completar este proyecto." };
  }

  const acceptedProposal = await prisma.proposal.findFirst({
    where: { projectId, status: "ACCEPTED" },
    select: { freelancerId: true },
  });

  await prisma.project.update({
    where: { id: projectId },
    data: { status: "CLOSED" },
  });

  if (acceptedProposal) {
    await createNotification(
      acceptedProposal.freelancerId,
      `El proyecto "${project.title}" fue marcado como completado`,
      "PROJECT_COMPLETED",
    );
  }

  revalidatePath("/dashboard/client");
  return { error: undefined };
}
