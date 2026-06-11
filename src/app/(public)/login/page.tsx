import { Suspense } from "react";
import { AuthShell } from "@/components/AuthShell";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      title="Iniciar sesion"
      subtitle="Accede con tu email y contrasena para continuar al dashboard segun tu rol."
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
