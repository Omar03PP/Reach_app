"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Field } from "@/components/Field";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(
    searchParams.get("error") ? "Credenciales incorrectas." : "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event: React.ChangeEvent<HTMLInputElement>) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Credenciales incorrectas.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <Field
        label="Email"
        name="email"
        type="email"
        value={form.email}
        placeholder="correo@empresa.com"
        required
        onChange={updateField}
      />
      <Field
        label="Contrasena"
        name="password"
        type="password"
        value={form.password}
        placeholder="Tu contrasena"
        required
        onChange={updateField}
      />

      <div className="flex items-center justify-between text-sm">
        <Link href="#" className="font-semibold text-coral">
          ¿Olvidaste tu contrasena?
        </Link>
        <Link href="/register" className="font-semibold text-mint">
          Crear cuenta
        </Link>
      </div>

      {error ? (
        <p className="rounded-md border border-coral/30 bg-coral/10 px-3 py-2 text-sm font-semibold text-coral">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-ink px-4 py-3 font-bold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Ingresando..." : "Iniciar sesion"}
      </button>
    </form>
  );
}
