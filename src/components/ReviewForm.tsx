"use client";

import { useActionState, useState } from "react";
import { createReview } from "@/lib/actions/reviews";

type ReviewFormProps = {
  projectId: string;
};

export function ReviewForm({ projectId }: ReviewFormProps) {
  const [state, formAction, isPending] = useActionState(createReview, {});
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <p className="text-sm font-semibold text-ink/55">Calificacion</p>
        <div className="mt-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="text-2xl transition"
            >
              {star <= (hover || rating) ? (
                <span className="text-yellow-500">&#9733;</span>
              ) : (
                <span className="text-ink/20">&#9733;</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-ink/55">Comentario</span>
        <textarea
          className="mt-1 min-h-24 w-full resize-y rounded-md border border-ink/15 bg-white px-3 py-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
          name="comment"
          placeholder="Comparte tu experiencia trabajando con este freelancer."
          required
        />
      </label>

      {state.success ? (
        <p className="rounded-md border border-mint/30 bg-mint/10 px-3 py-2 text-sm font-semibold text-mint">
          Resena guardada correctamente.
        </p>
      ) : null}

      {state.error ? (
        <p className="rounded-md border border-coral/30 bg-coral/10 px-3 py-2 text-sm font-semibold text-coral">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending || rating === 0}
        className="rounded-md bg-coral px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-coral/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Enviando..." : "Enviar resena"}
      </button>
    </form>
  );
}
