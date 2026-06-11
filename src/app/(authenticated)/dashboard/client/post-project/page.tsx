import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PostProjectForm } from "@/components/PostProjectForm";

export default async function PostProjectPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/login");
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto w-full max-w-3xl rounded-lg border border-ink/10 bg-white/85 p-8 shadow-soft">
        <Link href="/dashboard/client" className="text-sm font-bold text-mint">
          Volver al dashboard
        </Link>
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-coral">
          Nuevo proyecto
        </p>
        <h1 className="mt-3 text-3xl font-black text-ink">
          Publicar proyecto
        </h1>
        <p className="mt-3 leading-7 text-ink/65">
          Completa los datos principales para que freelancers puedan revisar la
          oportunidad en el listado publico.
        </p>
        <div className="mt-8">
          <PostProjectForm />
        </div>
      </section>
    </main>
  );
}
