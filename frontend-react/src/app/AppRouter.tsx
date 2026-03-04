import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "../auth/RequireAuth";
import { AppShell } from "../layout/AppShell";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { ProjectsPage } from "../pages/ProjectsPage";
import { ReportsPage } from "../pages/ReportsPage";
import { AssetsPage } from "../pages/AssetsPage";
import { PlanningPage } from "../pages/PlanningPage";
import { MapPage } from "../pages/MapPage";
import { EventsPage } from "../pages/EventsPage";
import { SettingsPage } from "../pages/SettingsPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/planning" element={<PlanningPage />} />
            <Route path="/assets" element={<AssetsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/settings" element={<SettingsPage />} />

            <Route path="/presupuesto" element={<Navigate to="/planning" replace />} />
            <Route path="/inventario" element={<Navigate to="/assets" replace />} />
            <Route path="/config" element={<Navigate to="/settings" replace />} />
            <Route path="/tareas" element={<Navigate to="/events" replace />} />

            <Route path="/projects" element={<ProjectsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
