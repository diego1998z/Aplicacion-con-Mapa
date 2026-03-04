import { useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ApiError } from "../lib/api";
import { useAuth } from "../auth/auth-context";
import type { FormEvent } from "react";
import type { LoginPayload } from "../lib/api";

type RouteState = {
  from?: string;
};

function resolveTarget(state: RouteState | null): string {
  if (!state?.from) return "/dashboard";
  if (!state.from.startsWith("/")) return "/dashboard";
  return state.from;
}

export function LoginPage() {
  const { status, isAuthenticated, signIn } = useAuth();
  const location = useLocation();
  const targetPath = useMemo(() => resolveTarget((location.state || null) as RouteState | null), [location.state]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const payload: LoginPayload = { email, password };
    try {
      await signIn(payload);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("No se pudo iniciar sesion.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4">
        <div className="card-surface px-6 py-5 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-moss">Cargando</p>
          <p className="mt-2 text-sm text-ink/80">Comprobando credenciales guardadas...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={targetPath} replace />;
  }

  return (
    <main className="min-h-screen w-full bg-[#f5f7fb]">
      <section className="grid min-h-screen w-full lg:grid-cols-[1.4fr,1fr]">
        <article className="relative hidden lg:block">
          <div className="absolute inset-0 bg-[url('/login-bg.webp')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b3b48]/20 to-transparent" />
        </article>

        <article className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md rounded-[14px] border border-[#e5e9f2] bg-white px-6 py-7 text-center shadow-card sm:px-8">
            <img
              src="/logo-login.webp"
              alt="Urbbis"
              className="mx-auto mb-3 w-[180px] max-w-full"
              decoding="async"
              fetchPriority="high"
            />

            <h1 className="text-[28px] font-bold leading-tight text-ink">Acceso</h1>
            <p className="mt-1 text-sm text-[#6b778c]">Ingresa tu correo y contrasena para continuar</p>

            <form className="mt-5 space-y-3 text-left" onSubmit={onSubmit}>
              <label className="block space-y-1.5">
                <span className="text-[13px] font-semibold text-[#6b778c]">Correo electronico</span>
                <input
                  type="email"
                  className="field-input"
                  placeholder="usuario@correo.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-[13px] font-semibold text-[#6b778c]">Contrasena</span>
                <input
                  type="password"
                  className="field-input"
                  placeholder="********"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>

              {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

              <div className="flex items-center justify-between gap-3 pt-1">
                <a href="#" className="text-sm font-semibold text-clay hover:text-moss" onClick={(event) => event.preventDefault()}>
                  Olvidaste tu contrasena?
                </a>
                <button className="cta min-w-[150px]" type="submit" disabled={submitting}>
                  {submitting ? "Ingresando..." : "Iniciar sesion"}
                </button>
              </div>
            </form>

            <small className="mt-4 block text-xs text-[#6b778c]">
              Usa una cuenta del backend. Ejemplo: muni@muni.gob.pe / Muni123
            </small>
          </div>
        </article>
      </section>
    </main>
  );
}
