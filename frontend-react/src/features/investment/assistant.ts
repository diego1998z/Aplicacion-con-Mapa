import type { AssistantQuickAction, InvestmentPreference, InvestmentScenario, InvestmentSummary } from "./types";

export const SUPPORT_PHONE = "+51 993931475";

export const MAIN_ACTIONS: AssistantQuickAction[] = [
  { id: "optimize", label: "Optimizar inversion" },
  { id: "auto", label: "Automatizar inversion" },
  { id: "suggest", label: "Sugerencias" },
  { id: "report", label: "Reportes" },
  { id: "support", label: "Contactar soporte" },
  { id: "reset", label: "Restaurar valores" },
];

export const PREFERENCE_ACTIONS: AssistantQuickAction[] = [
  { id: "pref_balance", label: "Balance" },
  { id: "pref_seguridad", label: "Seguridad" },
  { id: "pref_costo", label: "Costo" },
  { id: "pref_rapidez", label: "Rapidez" },
];

const PREFERENCE_TARGETS: Record<InvestmentPreference, { operatives: number; deteriorated: number }> = {
  balance: { operatives: 0.65, deteriorated: 0.23 },
  seguridad: { operatives: 0.75, deteriorated: 0.18 },
  costo: { operatives: 0.58, deteriorated: 0.27 },
  rapidez: { operatives: 0.68, deteriorated: 0.22 },
};

const PREFERENCE_LABELS: Record<InvestmentPreference, string> = {
  balance: "Balance",
  seguridad: "Seguridad",
  costo: "Costo",
  rapidez: "Rapidez",
};

export function normalizeSummary(summary: InvestmentSummary): InvestmentSummary {
  const operatives = Math.max(0, Number(summary.operatives) || 0);
  const deteriorated = Math.max(0, Number(summary.deteriorated) || 0);
  const replacement = Math.max(0, Number(summary.replacement) || 0);
  const total = Math.max(0, Number(summary.total) || operatives + deteriorated + replacement);
  return { total, operatives, deteriorated, replacement };
}

export function money(value: number): string {
  return `S/ ${Math.round(Number(value || 0)).toLocaleString("es-PE")}`;
}

export function signedMoney(value: number): string {
  const amount = Math.abs(Number(value || 0));
  const sign = Number(value || 0) >= 0 ? "+" : "-";
  return `${sign}${money(amount)}`;
}

export function preferenceLabel(preference: InvestmentPreference): string {
  return PREFERENCE_LABELS[preference];
}

export function applyPreference(summary: InvestmentSummary, preference: InvestmentPreference): InvestmentScenario {
  const base = normalizeSummary(summary);
  const target = PREFERENCE_TARGETS[preference];
  const total = Math.round(base.total);
  const operatives = Math.max(0, Math.round(total * target.operatives));
  const deteriorated = Math.max(0, Math.round(total * target.deteriorated));
  const replacement = Math.max(0, total - operatives - deteriorated);
  return { total, operatives, deteriorated, replacement, preference };
}

export function reportMessage(summary: InvestmentSummary, scenarioActive: boolean): string {
  const label = scenarioActive ? "Reporte (escenario AI)" : "Reporte actual";
  return `${label}:\nTotal ${money(summary.total)}\nOperativos ${money(summary.operatives)}\nDeteriorados ${money(summary.deteriorated)}\nReposicion ${money(summary.replacement)}`;
}

export function scenarioMessage(base: InvestmentSummary, scenario: InvestmentScenario): string {
  const deltaOperatives = scenario.operatives - base.operatives;
  const deltaDeteriorated = scenario.deteriorated - base.deteriorated;
  const deltaReplacement = scenario.replacement - base.replacement;
  return `Listo. Nuevo escenario:\nOperativos ${money(scenario.operatives)}\nDeteriorados ${money(scenario.deteriorated)}\nReposicion ${money(scenario.replacement)}\nImpacto: Operativos ${signedMoney(deltaOperatives)}, Deteriorados ${signedMoney(deltaDeteriorated)}, Reposicion ${signedMoney(deltaReplacement)}`;
}

export function suggestionsMessage(): string {
  return "Sugerencias rapidas:\n- Priorizar mantenimiento preventivo.\n- Rebalancear presupuesto hacia operativos.\n- Programar inspecciones pendientes.\n- Revisar costos de reposicion critica.";
}

export function resolvePreferenceFromText(text: string): InvestmentPreference | null {
  const lower = String(text || "").toLowerCase();
  if (lower.includes("seguridad")) return "seguridad";
  if (lower.includes("costo")) return "costo";
  if (lower.includes("rapidez")) return "rapidez";
  if (lower.includes("balance")) return "balance";
  return null;
}

