import Link from "next/link";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-md rounded-lg border border-ink/10 bg-white/85 p-6 shadow-soft backdrop-blur">
        <Link href="/" className="text-lg font-black text-ink">
          REACH
        </Link>
        <div className="mt-8">
          <h1 className="text-3xl font-black text-ink">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-ink/65">{subtitle}</p>
        </div>
        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}
