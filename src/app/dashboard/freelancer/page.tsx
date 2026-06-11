import { signOut } from "@/auth";

export default function FreelancerDashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-2xl rounded-lg border border-ink/10 bg-white/85 p-8 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-mint">
          Dashboard freelancer
        </p>
        <h1 className="mt-3 text-3xl font-black text-ink">
          Routing por rol funcionando.
        </h1>
        <p className="mt-3 leading-7 text-ink/65">
          Esta pagina queda vacia para el sprint 1 y confirma que el freelancer
          entra al dashboard correcto.
        </p>
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
