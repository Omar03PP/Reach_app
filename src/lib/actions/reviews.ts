"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "La calificacion debe ser al menos 1.").max(5, "La calificacion maxima es 5."),
  comment: z.string().trim().min(3, "El comentario debe tener al menos 3 caracteres."),
});

export type ReviewActionState = {
  error?: string;
  success?: boolean;
};

export async function createReview(
  _state: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  const session = await auth();

  if (!session?.user || session.user.role !== "CLIENT") {
    return { error: "Solo los clientes pueden dejar reseñas." };
  }

  const projectId = formData.get("projectId") as string;
  if (!projectId) {
    return { error: "Falta el ID del proyecto." };
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { clientId: true, status: true },
  });

  if (!project || project.clientId !== session.user.id) {
    return { error: "No eres el dueno de este proyecto." };
  }

  if (project.status !== "CLOSED") {
    return { error: "El proyecto debe estar completado para dejar una resena." };
  }

  const existingReview = await prisma.review.findUnique({
    where: { projectId },
  });

  if (existingReview) {
    return { error: "Ya dejaste una resena para este proyecto." };
  }

  const parsed = reviewSchema.safeParse({
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Revisa los datos de la resena.",
    };
  }

  const acceptedProposal = await prisma.proposal.findFirst({
    where: { projectId, status: "ACCEPTED" },
    select: { freelancerId: true },
  });

  if (!acceptedProposal) {
    return { error: "No se encontro el freelancer asignado a este proyecto." };
  }

  await prisma.review.create({
    data: {
      projectId,
      clientId: session.user.id,
      freelancerId: acceptedProposal.freelancerId,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    },
  });

  revalidatePath("/dashboard/client");
  revalidatePath(`/freelancers/${acceptedProposal.freelancerId}`);
  return { success: true, error: undefined };
}

export async function getFreelancerReviews(freelancerId: string) {
  return prisma.review.findMany({
    where: { freelancerId },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { name: true } },
      project: { select: { title: true } },
    },
  });
}

export async function getFreelancerAverageRating(freelancerId: string) {
  const reviews = await prisma.review.findMany({
    where: { freelancerId },
    select: { rating: true },
  });

  if (reviews.length === 0) return null;

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return Math.round(avg * 10) / 10;
}
