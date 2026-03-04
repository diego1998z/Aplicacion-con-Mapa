import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./auth-context";

export function RequireAuth() {
  const { status, isAuthenticated } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="card-surface px-6 py-5 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-moss">Inicializando</p>
          <p className="mt-2 text-sm text-ink/80">Validando sesion...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
