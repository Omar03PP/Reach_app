import { z } from "zod";

export const roles = ["CLIENT", "FREELANCER"] as const;

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "El nombre es obligatorio."),
    email: z.string().trim().email("Ingresa un email valido.").toLowerCase(),
    password: z
      .string()
      .min(8, "La contrasena debe tener al menos 8 caracteres."),
    confirmPassword: z.string(),
    role: z.enum(roles),
    professionalArea: z.string().optional(),
    country: z.string().optional(),
    companyName: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Las contrasenas no coinciden.",
      });
    }

    if (data.role === "FREELANCER") {
      if (!data.professionalArea) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["professionalArea"],
          message: "Selecciona un area profesional.",
        });
      }

      if (!data.country || data.country.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["country"],
          message: "Ingresa tu pais.",
        });
      }
    }
  });

export type RegisterInput = z.infer<typeof registerSchema>;
