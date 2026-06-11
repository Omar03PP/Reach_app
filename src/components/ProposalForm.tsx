"use client";

import { useActionState } from "react";
import { createProposal } from "@/lib/actions/proposals";

type ProposalFormProps = {
  projectId: string;
};

export function ProposalForm({ projectId }: ProposalFormProps) {
  const [state, formAction, isPending] = useActionState(createProposal, {});

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="projectId" value={projectId} />

      <label className="block">
        <span className="text-sm font-bold text-ink">
          Mensaje de presentacion
        </span>
        <textarea
          className="mt-2 min-h-32 w-full resize-y rounded-md border border-ink/15 bg-white px-3 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
          name="message"
          placeholder="Explica tu experiencia, enfoque y por que eres el candidato ideal."
          required
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-ink">
            Precio propuesto (USD)
          </span>
          <input
            className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
            name="price"
            type="number"
            min="1"
            step="0.01"
            placeholder="500"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-ink">
            Tiempo estimado (dias)
          </span>
          <input
            className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
            name="estimatedDays"
            type="number"
            min="1"
            max="365"
            placeholder="14"
            required
          />
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
        className="rounded-md bg-mint px-5 py-3 font-bold text-white shadow-soft transition hover:bg-mint/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Enviando..." : "Enviar propuesta"}
      </button>
    </form>
  );
}
