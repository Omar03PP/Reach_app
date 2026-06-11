import { signOut } from "@/auth";
import Link from "next/link";

export default function FreelancerDashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-2xl rounded-lg border border-ink/10 bg-white/85 p-8 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-mint">
          Dashboard freelancer
        </p>
        <h1 className="mt-3 text-3xl font-black text-ink">
          Explora proyectos disponibles.
        </h1>
        <p className="mt-3 leading-7 text-ink/65">
          En este sprint puedes revisar los proyectos abiertos publicados por
          clientes. Las propuestas se agregaran en el siguiente sprint.
        </p>
        <Link
          href="/projects"
          className="mt-6 inline-flex rounded-md bg-mint px-5 py-3 font-bold text-white shadow-soft transition hover:bg-mint/90"
        >
          Ver proyectos disponibles
        </Link>
        <form
          className="mt-6"
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="rounded-md bg-ink px-4 py-3 font-bold text-white">
            Cerrar sesion
          </button>
        </form>
      </section>
    </main>
  );
}
