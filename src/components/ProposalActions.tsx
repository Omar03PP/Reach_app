"use client";

import { acceptProposal, rejectProposal } from "@/lib/actions/proposals";

type ProposalActionsProps = {
  proposalId: string;
  status: string;
};

export function ProposalActions({ proposalId, status }: ProposalActionsProps) {
  if (status !== "PENDING") {
    const statusLabel =
      status === "ACCEPTED" ? "Aceptada" : "Rechazada";
    const statusColor =
      status === "ACCEPTED"
        ? "bg-mint/10 text-mint"
        : "bg-coral/10 text-coral";

    return (
      <span
        className={`rounded-md px-3 py-2 text-sm font-black ${statusColor}`}
      >
        {statusLabel}
      </span>
    );
  }

  return (
    <div className="flex gap-3">
      <form
        action={async () => {
          await acceptProposal(proposalId);
        }}
      >
        <button
          type="submit"
          className="rounded-md bg-mint px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-mint/90"
        >
          Aceptar
        </button>
      </form>
      <form
        action={async () => {
          await rejectProposal(proposalId);
        }}
      >
        <button
          type="submit"
          className="rounded-md bg-coral px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-coral/90"
        >
          Rechazar
        </button>
      </form>
    </div>
  );
}
