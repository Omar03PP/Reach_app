"use client";

import { useActionState } from "react";
import { upsertProfile } from "@/lib/actions/profile";

type ProfileFormProps = {
  role: "CLIENT" | "FREELANCER";
  initialData: {
    title?: string | null;
    bio?: string | null;
    country?: string | null;
    skills?: string[];
    yearsExperience?: number | null;
    photoUrl?: string | null;
    companyName?: string | null;
    companyDesc?: string | null;
  };
};

export function ProfileForm({ role, initialData }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(upsertProfile, {});

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="role" value={role} />

      <label className="block">
        <span className="text-sm font-bold text-ink">URL de foto de perfil</span>
        <input
          className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
          name="photoUrl"
          type="url"
          placeholder="https://ejemplo.com/mi-foto.jpg"
          defaultValue={initialData.photoUrl ?? ""}
        />
      </label>

      {role === "FREELANCER" ? (
        <>
          <label className="block">
            <span className="text-sm font-bold text-ink">
              Titulo profesional
            </span>
            <input
              className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
              name="title"
              placeholder="Ej. Desarrollador Full Stack"
              defaultValue={initialData.title ?? ""}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-ink">
              Biografia / Descripcion
            </span>
            <textarea
              className="mt-2 min-h-32 w-full resize-y rounded-md border border-ink/15 bg-white px-3 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
              name="bio"
              placeholder="Cuenta tu experiencia, formacion y que te apasiona."
              defaultValue={initialData.bio ?? ""}
              required
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-3">
            <label className="block">
              <span className="text-sm font-bold text-ink">Pais</span>
              <input
                className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
                name="country"
                placeholder="Ej. Honduras"
                defaultValue={initialData.country ?? ""}
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-ink">
                Anos de experiencia
              </span>
              <input
                className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
                name="yearsExperience"
                type="number"
                min="0"
                max="70"
                placeholder="5"
                defaultValue={initialData.yearsExperience ?? ""}
                required
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-bold text-ink">
              Habilidades (separadas por coma)
            </span>
            <input
              className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
              name="skills"
              placeholder="Ej. React, Node.js, PostgreSQL"
              defaultValue={initialData.skills?.join(", ") ?? ""}
              required
            />
          </label>
        </>
      ) : (
        <>
          <label className="block">
            <span className="text-sm font-bold text-ink">
              Nombre de la empresa
            </span>
            <input
              className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
              name="companyName"
              placeholder="Ej. TechCorp S.A."
              defaultValue={initialData.companyName ?? ""}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-ink">
              Descripcion de la empresa
            </span>
            <textarea
              className="mt-2 min-h-32 w-full resize-y rounded-md border border-ink/15 bg-white px-3 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
              name="companyDesc"
              placeholder="Describe a que se dedica tu empresa."
              defaultValue={initialData.companyDesc ?? ""}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-ink">Pais</span>
            <input
              className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
              name="country"
              placeholder="Ej. Honduras"
              defaultValue={initialData.country ?? ""}
              required
            />
          </label>
        </>
      )}

      {state.success ? (
        <p className="rounded-md border border-mint/30 bg-mint/10 px-3 py-2 text-sm font-semibold text-mint">
          Perfil guardado correctamente.
        </p>
      ) : null}

      {state.error ? (
        <p className="rounded-md border border-coral/30 bg-coral/10 px-3 py-2 text-sm font-semibold text-coral">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-mint px-5 py-3 font-bold text-white shadow-soft transition hover:bg-mint/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Guardando..." : "Guardar perfil"}
      </button>
    </form>
  );
}
