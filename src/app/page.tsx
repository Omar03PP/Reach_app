import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-xl font-black tracking-tight text-ink">
          REACH
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-md border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition hover:border-ink/40"
          >
            Iniciar sesion
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-ink/90"
          >
            Registrarse
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid min-h-[calc(100vh-88px)] w-full max-w-6xl items-center gap-10 px-6 pb-16 pt-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-coral">
            Sprint 1
          </p>
          <h1 className="text-4xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl">
            Conecta empresas con talento freelance verificado.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-ink/70">
            Una base lista para autenticar clientes y freelancers, separar roles
            y preparar los siguientes modulos del marketplace.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register?role=CLIENT"
              className="rounded-md bg-coral px-6 py-3 text-center font-bold text-white shadow-soft transition hover:bg-coral/90"
            >
              Quiero contratar
            </Link>
            <Link
              href="/register?role=FREELANCER"
              className="rounded-md bg-mint px-6 py-3 text-center font-bold text-white shadow-soft transition hover:bg-mint/90"
            >
              Quiero trabajar
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-ink/10 bg-white/75 p-6 shadow-soft backdrop-blur">
          <div className="grid gap-4">
            <div className="rounded-md border border-ink/10 bg-paper p-5">
              <p className="text-sm font-bold text-coral">Clientes</p>
              <p className="mt-2 text-2xl font-black text-ink">
                Publican proyectos
              </p>
            </div>
            <div className="rounded-md border border-ink/10 bg-white p-5">
              <p className="text-sm font-bold text-mint">Freelancers</p>
              <p className="mt-2 text-2xl font-black text-ink">
                Aplican con su perfil
              </p>
            </div>
            <div className="rounded-md border border-ink/10 bg-ink p-5 text-white">
              <p className="text-sm font-bold text-white/70">Auth</p>
              <p className="mt-2 text-2xl font-black">
                Sesiones JWT por rol
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
