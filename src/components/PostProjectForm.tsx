"use client";

import { useActionState } from "react";
import { createProject } from "@/lib/actions/projects";
import { categoryLabels, categoryValues } from "@/lib/project-options";

export function PostProjectForm() {
  const [state, formAction, isPending] = useActionState(createProject, {});

  return (
    <form action={formAction} className="grid gap-5">
      <label className="block">
        <span className="text-sm font-bold text-ink">Titulo del proyecto</span>
        <input
          className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
          name="title"
          placeholder="Ej. Sitio web corporativo en Next.js"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-bold text-ink">
          Descripcion detallada
        </span>
        <textarea
          className="mt-2 min-h-40 w-full resize-y rounded-md border border-ink/15 bg-white px-3 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
          name="description"
          placeholder="Describe el alcance, entregables, tecnologias esperadas y cualquier detalle importante."
          required
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-ink">
            Presupuesto en dolares
          </span>
          <input
            className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
            name="budget"
            type="number"
            min="1"
            step="0.01"
            placeholder="500"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-ink">Categoria</span>
          <select
            className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-3 text-ink outline-none transition focus:border-mint focus:ring-4 focus:ring-mint/15"
            name="category"
            required
          >
            {categoryValues.map((category) => (
              <option key={category} value={category}>
                {categoryLabels[category]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {state.error ? (
        <p className="rounded-md border border-coral/30 bg-coral/10 px-3 py-2 text-sm font-semibold text-coral">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-coral px-5 py-3 font-bold text-white shadow-soft transition hover:bg-coral/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Publicando..." : "Publicar proyecto"}
      </button>
    </form>
  );
}
