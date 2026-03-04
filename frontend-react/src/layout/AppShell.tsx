import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/auth-context";

function navClassName(isActive: boolean): string {
  if (isActive) {
    return "block w-full rounded-[14px] border border-[#2fe2c259] bg-[#2fe2c21f] px-3 py-3 text-left text-sm font-semibold text-[#eafffb] transition";
  }
  return "block w-full rounded-[14px] border border-white/15 bg-transparent px-3 py-3 text-left text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-white/10";
}

function initials(value: string | undefined): string {
  const text = String(value || "").trim();
  if (!text) return "UR";
  const parts = text.split(/\s+/).slice(0, 2);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

export function AppShell() {
  const { user, signOut } = useAuth();
  const displayName = user?.name || user?.email || "Usuario";

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <aside className="w-full bg-[#0b3b48] px-5 py-6 text-white lg:flex lg:min-h-screen lg:w-[280px] lg:min-w-[260px] lg:flex-col lg:px-[22px] lg:py-7">
        <div className="flex items-center gap-3 px-1">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-lg font-black text-[#2fe2c2]">U</div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/75">Panel</p>
            <p className="text-xl font-extrabold tracking-[0.08em] text-[#2fe2c2]">URBBIS</p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-[18px] bg-white/10 px-3 py-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#2fe2c2] to-[#2197c4] text-sm font-black tracking-[0.06em] text-[#0b2230]">
            {initials(displayName)}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-white/85">Bienvenido</p>
            <p className="truncate text-sm font-extrabold">{displayName}</p>
            <p className="truncate text-xs text-white/70">{user?.email}</p>
          </div>
        </div>

        <nav className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1 lg:gap-2">
          <NavLink to="/dashboard" className={({ isActive }) => navClassName(isActive)}>
            Dashboard
          </NavLink>
          <NavLink to="/map" className={({ isActive }) => navClassName(isActive)}>
            Mapa
          </NavLink>
          <NavLink to="/planning" className={({ isActive }) => navClassName(isActive)}>
            Presupuesto
          </NavLink>
          <NavLink to="/assets" className={({ isActive }) => navClassName(isActive)}>
            Inventario
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => navClassName(isActive)}>
            Reportes
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => navClassName(isActive)}>
            Eventos
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => navClassName(isActive)}>
            Configuracion
          </NavLink>
        </nav>

        <button
          type="button"
          className="mt-4 w-full rounded-[14px] border border-white/20 bg-black/20 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-black/30 lg:mt-auto"
          onClick={signOut}
        >
          Cerrar sesion
        </button>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-[38px] lg:py-9">
        <section className="min-w-0">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
