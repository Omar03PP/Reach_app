"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { categoryValues } from "@/lib/project-options";

const projectSchema = z.object({
  title: z.string().trim().min(4, "El titulo debe tener al menos 4 caracteres."),
  description: z
    .string()
    .trim()
    .min(20, "La descripcion debe tener al menos 20 caracteres."),
  budget: z.coerce
    .number()
    .positive("El presupuesto debe ser mayor que cero.")
    .max(1000000, "El presupuesto es demasiado alto."),
  category: z.enum(categoryValues),
});

export type ProjectActionState = {
  error?: string;
};

export async function createProject(
  _state: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const session = await auth();

  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/login");
  }

  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    budget: formData.get("budget"),
    category: formData.get("category"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Revisa los datos del proyecto.",
    };
  }

  await prisma.project.create({
    data: {
      ...parsed.data,
      status: "OPEN",
      clientId: session.user.id,
    },
  });

  revalidatePath("/projects");
  revalidatePath("/dashboard/client");
  redirect("/dashboard/client");
}

export async function getHomeStats() {
  const [totalProjects, totalFreelancers, completedProjects] = await Promise.all([
    prisma.project.count(),
    prisma.user.count({ where: { role: "FREELANCER" } }),
    prisma.project.count({ where: { status: "CLOSED" } }),
  ]);

  return { totalProjects, totalFreelancers, completedProjects };
}

export async function getProjects() {
  return prisma.project.findMany({
    where: {
      status: "OPEN",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      client: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function getClientProjects(clientId: string) {
  return prisma.project.findMany({
    where: {
      clientId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getProjectById(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function getClientDashboardData(clientId: string) {
  const [projects, totalFreelancers] = await Promise.all([
    prisma.project.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
      include: {
        proposals: {
          where: { status: "ACCEPTED" },
          include: {
            freelancer: { select: { id: true, name: true } },
          },
        },
        review: true,
        _count: { select: { proposals: true } },
      },
    }),
    prisma.proposal.count({
      where: {
        project: { clientId },
        status: "ACCEPTED",
      },
    }),
  ]);

  const active = projects.filter((p) => p.status === "IN_PROGRESS");
  const open = projects.filter((p) => p.status === "OPEN");
  const completed = projects.filter((p) => p.status === "CLOSED");

  return {
    stats: {
      totalProjects: projects.length,
      activeProjects: active.length,
      completedProjects: completed.length,
      totalFreelancers,
    },
    activeProjects: active,
    openProjects: open,
    completedProjects: completed,
  };
}

export async function getFreelancerDashboardData(freelancerId: string) {
  const [proposals, reviews] = await Promise.all([
    prisma.proposal.findMany({
      where: { freelancerId },
      orderBy: { createdAt: "desc" },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            budget: true,
            status: true,
          },
        },
      },
    }),
    prisma.review.findMany({
      where: { freelancerId },
      select: { rating: true },
    }),
  ]);

  const accepted = proposals.filter((p) => p.status === "ACCEPTED");
  const pending = proposals.filter((p) => p.status === "PENDING");
  const rejected = proposals.filter((p) => p.status === "REJECTED");
  const completed = proposals.filter(
    (p) => p.status === "ACCEPTED" && p.project.status === "CLOSED",
  );

  const avgRating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10,
        ) / 10
      : null;

  return {
    stats: {
      totalProposals: proposals.length,
      acceptedProposals: accepted.length,
      completedProjects: completed.length,
      avgRating,
    },
    activeProjects: accepted.filter((p) => p.project.status === "IN_PROGRESS"),
    pendingProposals: pending,
    completedProjects: completed,
    rejectedProposals: rejected,
  };
}
