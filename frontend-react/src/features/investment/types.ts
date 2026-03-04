export type InvestmentPreference = "balance" | "seguridad" | "costo" | "rapidez";

export type InvestmentSummary = {
  total: number;
  operatives: number;
  deteriorated: number;
  replacement: number;
};

export type InvestmentScenario = InvestmentSummary & {
  preference: InvestmentPreference;
};

export type AssistantMessageRole = "assistant" | "user";

export type AssistantMessage = {
  id: string;
  role: AssistantMessageRole;
  text: string;
};

export type AssistantQuickActionId =
  | "optimize"
  | "auto"
  | "suggest"
  | "report"
  | "support"
  | "reset"
  | "pref_balance"
  | "pref_seguridad"
  | "pref_costo"
  | "pref_rapidez";

export type AssistantQuickAction = {
  id: AssistantQuickActionId;
  label: string;
};

