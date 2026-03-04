import { useCallback, useMemo, useRef, useState } from "react";
import {
  MAIN_ACTIONS,
  PREFERENCE_ACTIONS,
  SUPPORT_PHONE,
  applyPreference,
  normalizeSummary,
  preferenceLabel,
  reportMessage,
  resolvePreferenceFromText,
  scenarioMessage,
  suggestionsMessage,
} from "./assistant";
import type {
  AssistantMessage,
  AssistantQuickAction,
  AssistantQuickActionId,
  InvestmentPreference,
  InvestmentScenario,
  InvestmentSummary,
} from "./types";

export type InvestmentAssistantController = {
  isOpen: boolean;
  status: string;
  input: string;
  messages: AssistantMessage[];
  quickActions: AssistantQuickAction[];
  isSimulationActive: boolean;
  activeSummary: InvestmentSummary;
  setInput: (value: string) => void;
  toggleOpen: () => void;
  close: () => void;
  submitInput: () => void;
  runQuickAction: (actionId: AssistantQuickActionId) => void;
};

function includesAny(text: string, tokens: string[]): boolean {
  return tokens.some((token) => text.includes(token));
}

export function useInvestmentAssistant(summary: InvestmentSummary): InvestmentAssistantController {
  const messageSeqRef = useRef(0);
  const baseSummary = useMemo(() => normalizeSummary(summary), [summary]);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [quickActions, setQuickActions] = useState<AssistantQuickAction[]>(MAIN_ACTIONS);
  const [selectedPreference, setSelectedPreference] = useState<InvestmentPreference>("balance");
  const [scenario, setScenario] = useState<InvestmentScenario | null>(null);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: "assistant-1",
      role: "assistant",
      text: "Hola, soy el asistente de inversion. Puedo simular mejoras y ajustar los valores del panel.",
    },
  ]);

  const nextMessageId = useCallback((role: "assistant" | "user"): string => {
    messageSeqRef.current += 1;
    return `${role}-${messageSeqRef.current}`;
  }, []);

  const pushAssistant = useCallback(
    (text: string) => {
      setMessages((previous) => [...previous, { id: nextMessageId("assistant"), role: "assistant", text }]);
    },
    [nextMessageId],
  );

  const pushUser = useCallback(
    (text: string) => {
      setMessages((previous) => [...previous, { id: nextMessageId("user"), role: "user", text }]);
    },
    [nextMessageId],
  );

  const applyScenario = useCallback(
    (preference: InvestmentPreference) => {
      if (baseSummary.total <= 0) {
        pushAssistant("No hay datos de inversion disponibles.");
        return;
      }
      const nextScenario = applyPreference(baseSummary, preference);
      setScenario(nextScenario);
      setSelectedPreference(preference);
      pushAssistant(scenarioMessage(baseSummary, nextScenario));
      setQuickActions(MAIN_ACTIONS);
    },
    [baseSummary, pushAssistant],
  );

  const clearScenario = useCallback(() => {
    setScenario(null);
    pushAssistant("Simulacion desactivada. Valores originales restaurados.");
    setQuickActions(MAIN_ACTIONS);
  }, [pushAssistant]);

  const runQuickAction = useCallback(
    (actionId: AssistantQuickActionId) => {
      if (actionId === "optimize" || actionId === "auto") {
        pushAssistant("Elige una preferencia para ajustar la inversion.");
        setQuickActions(PREFERENCE_ACTIONS);
        return;
      }
      if (actionId === "pref_balance") {
        applyScenario("balance");
        return;
      }
      if (actionId === "pref_seguridad") {
        applyScenario("seguridad");
        return;
      }
      if (actionId === "pref_costo") {
        applyScenario("costo");
        return;
      }
      if (actionId === "pref_rapidez") {
        applyScenario("rapidez");
        return;
      }
      if (actionId === "suggest") {
        pushAssistant(suggestionsMessage());
        return;
      }
      if (actionId === "report") {
        const source = scenario ?? baseSummary;
        pushAssistant(reportMessage(source, !!scenario));
        return;
      }
      if (actionId === "support") {
        pushAssistant(`Contacto de soporte: ${SUPPORT_PHONE}`);
        return;
      }
      if (actionId === "reset") {
        clearScenario();
      }
    },
    [applyScenario, baseSummary, clearScenario, pushAssistant, scenario],
  );

  const processTextInput = useCallback(
    (rawText: string) => {
      const text = String(rawText || "").trim();
      if (!text) return;
      const normalized = text.toLowerCase();
      const preference = resolvePreferenceFromText(normalized);

      if (preference) {
        applyScenario(preference);
        return;
      }

      if (includesAny(normalized, ["optimizar", "automatizar"])) {
        pushAssistant("Elige una preferencia para ajustar la inversion.");
        setQuickActions(PREFERENCE_ACTIONS);
        return;
      }
      if (includesAny(normalized, ["sugerencia", "sugerencias"])) {
        pushAssistant(suggestionsMessage());
        return;
      }
      if (includesAny(normalized, ["reporte", "reportes"])) {
        const source = scenario ?? baseSummary;
        pushAssistant(reportMessage(source, !!scenario));
        return;
      }
      if (includesAny(normalized, ["soporte", "contacto"])) {
        pushAssistant(`Contacto de soporte: ${SUPPORT_PHONE}`);
        return;
      }
      if (includesAny(normalized, ["restaurar", "reset"])) {
        clearScenario();
        return;
      }
      pushAssistant("Soy una demo local. Usa los botones para acciones rapidas.");
    },
    [applyScenario, baseSummary, clearScenario, pushAssistant, scenario],
  );

  const submitInput = useCallback(() => {
    const value = input.trim();
    if (!value) return;
    pushUser(value);
    setInput("");
    processTextInput(value);
  }, [input, processTextInput, pushUser]);

  const toggleOpen = useCallback(() => {
    setIsOpen((previous) => !previous);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const activeSummary = scenario ?? baseSummary;
  const status = scenario ? `Simulacion activa (${preferenceLabel(selectedPreference)})` : "Simulacion desactivada";

  return {
    isOpen,
    status,
    input,
    messages,
    quickActions,
    isSimulationActive: !!scenario,
    activeSummary,
    setInput,
    toggleOpen,
    close,
    submitInput,
    runQuickAction,
  };
}

