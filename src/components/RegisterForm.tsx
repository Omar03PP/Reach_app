"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useMemo, useState } from "react";
import { Field } from "@/components/Field";

const professionalAreas = ["IT", "Diseno", "Marketing", "Redaccion", "Finanzas"];

type Role = "CLIENT" | "FREELANCER";

type RegisterFormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
  professionalArea: string;
  country: string;
  companyName: string;
};

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = useMemo<Role>(
    () => (searchParams.get("role") === "CLIENT" ? "CLIENT" : "FREELANCER"),
    [searchParams],
  );
  const [form, setForm] = useState<RegisterFormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: initialRole,
    professionalArea: "IT",
    country: "",
    companyName: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function validateForm() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "Ingresa un email valido.";
    }

    if (form.password.length < 8) {
      return "La contrasena debe tener al menos 8 caracteres.";
    }

    if (form.password !== form.confirmPassword) {
      return "Las contrasenas no coinciden.";
    }

    if (form.role === "FREELANCER" && !form.country.trim()) {
      return "Ingresa tu pais.";
    }

    return "";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = (await response.json()) as { message?: string };

    if (!response.ok) {
      setError(data.message ?? "No se pudo registrar la cuenta.");
      setIsSubmitting(false);
      return;
    }

    const loginResult = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (loginResult?.error) {
      router.push("/login");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-2 rounded-md bg-ink/5 p-1">
        {(["FREELANCER", "CLIENT"] as const).map((role) => (
          <button
            key={role}
            type="button"
            className={`rounded-md px-3 py-2 text-sm font-bold transition ${
              form.role === role
                ? "bg-white text-ink shadow-sm"
                : "text-ink/60 hover:text-ink"
            }`}
            onClick={() => setForm((current) => ({ ...current, role }))}
          >
            {role === "CLIENT" ? "Cliente" : "Freelancer"}
          </button>
        ))}
      </div>

      <Field
        label="Nombre"
        name="name"
        value={form.name}
        placeholder="Tu nombre completo"
        required
        onChange={updateField}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        value={form.email}
        placeholder="correo@ejemplo.com"
        required
        onChange={updateField}
      />
      <Field
        label="Contrasena"
        name="password"
        type="password"
        value={form.password}
        placeholder="Minimo 8 caracteres"
        required
        onChange={updateField}
      />
      <Field
        label="Confirmar contrasena"
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        placeholder="Repite tu contrasena"
        required
        onChange={updateField}
      />

      {form.role === "FREELANCER" ? (
        <>
          <label className="block">
            <span className="text-sm font-bold text-ink">Area profesional</span>
            <select
              className="mt-2 w-full rounded-md border border-ink/15 bg-white px-3 py-3 text-ink outline-none transition focus:border-mint focus:ring-4 focus:ring-mint/15"
              name="professionalArea"
              value={form.professionalArea}
              onChange={updateField}
            >
              {professionalAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </label>
          <Field
            label="Pais"
            name="country"
            value={form.country}
            placeholder="Honduras"
            required
            onChange={updateField}
          />
        </>
      ) : (
        <Field
          label="Nombre de empresa"
          name="companyName"
          value={form.companyName}
          placeholder="Opcional"
          onChange={updateField}
        />
      )}

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
        {isSubmitting ? "Registrando..." : "Registrarse"}
      </button>
      <p className="text-center text-sm text-ink/65">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-bold text-mint">
          Inicia sesion
        </Link>
      </p>
    </form>
  );
}
