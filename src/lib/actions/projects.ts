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
