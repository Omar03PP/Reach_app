"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const freelancerProfileSchema = z.object({
  title: z.string().trim().min(2, "El titulo profesional es obligatorio."),
  bio: z.string().trim().min(10, "La biografia debe tener al menos 10 caracteres."),
  country: z.string().trim().min(2, "El pais es obligatorio."),
  skills: z.string().trim().min(1, "Agrega al menos una habilidad."),
  yearsExperience: z.coerce.number().int().min(0).max(70),
  photoUrl: z.string().trim().optional(),
});

const clientProfileSchema = z.object({
  companyName: z.string().trim().min(2, "El nombre de la empresa es obligatorio."),
  companyDesc: z.string().trim().min(10, "La descripcion debe tener al menos 10 caracteres."),
  country: z.string().trim().min(2, "El pais es obligatorio."),
  photoUrl: z.string().trim().optional(),
});

export type ProfileActionState = {
  error?: string;
  success?: boolean;
};

export async function upsertProfile(
  _state: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const session = await auth();

  if (!session?.user) {
    return { error: "No autenticado." };
  }

  const role = formData.get("role") as string;

  if (role === "FREELANCER") {
    const parsed = freelancerProfileSchema.safeParse({
      title: formData.get("title"),
      bio: formData.get("bio"),
      country: formData.get("country"),
      skills: formData.get("skills"),
      yearsExperience: formData.get("yearsExperience"),
      photoUrl: formData.get("photoUrl") || undefined,
    });

    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? "Revisa los datos del perfil.",
      };
    }

    const skills = parsed.data.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        title: parsed.data.title,
        bio: parsed.data.bio,
        country: parsed.data.country,
        skills,
        yearsExperience: parsed.data.yearsExperience,
        photoUrl: parsed.data.photoUrl || null,
      },
      update: {
        title: parsed.data.title,
        bio: parsed.data.bio,
        country: parsed.data.country,
        skills,
        yearsExperience: parsed.data.yearsExperience,
        photoUrl: parsed.data.photoUrl || null,
      },
    });
  } else {
    const parsed = clientProfileSchema.safeParse({
      companyName: formData.get("companyName"),
      companyDesc: formData.get("companyDesc"),
      country: formData.get("country"),
      photoUrl: formData.get("photoUrl") || undefined,
    });

    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? "Revisa los datos del perfil.",
      };
    }

    await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        companyName: parsed.data.companyName,
        companyDesc: parsed.data.companyDesc,
        country: parsed.data.country,
        photoUrl: parsed.data.photoUrl || null,
      },
      update: {
        companyName: parsed.data.companyName,
        companyDesc: parsed.data.companyDesc,
        country: parsed.data.country,
        photoUrl: parsed.data.photoUrl || null,
      },
    });
  }

  revalidatePath("/dashboard/profile");
  return { success: true, error: undefined };
}

export async function getProfile(userId: string) {
  return prisma.profile.findUnique({
    where: { userId },
  });
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profile: true,
    },
  });
}

export async function getFreelancerStats(freelancerId: string) {
  const proposals = await prisma.proposal.findMany({
    where: { freelancerId },
    select: { status: true },
  });

  return {
    totalProposals: proposals.length,
    acceptedProposals: proposals.filter((p) => p.status === "ACCEPTED").length,
    completedProjects: proposals.filter((p) => p.status === "ACCEPTED").length,
  };
}
