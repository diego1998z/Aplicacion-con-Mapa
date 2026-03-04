import { useEffect, useRef } from "react";
import type { FormEvent } from "react";
import type { InvestmentAssistantController } from "./useInvestmentAssistant";

type InvestmentAssistantProps = {
  controller: InvestmentAssistantController;
};

export function InvestmentAssistant({ controller }: InvestmentAssistantProps) {
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    body.scrollTop = body.scrollHeight;
  }, [controller.messages]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    controller.submitInput();
  }

  return (
    <div className="fixed bottom-4 right-4 z-[1300] flex items-end justify-end">
      {controller.isOpen ? (
        <section className="w-[min(420px,calc(100vw-24px))] rounded-[16px] border border-[#d6deea] bg-white shadow-[0_24px_52px_rgba(16,23,38,0.26)]">
          <header className="flex items-start justify-between gap-2 border-b border-[#e5e9f2] px-4 py-3">
            <div>
              <p className="text-sm font-extrabold text-ink">Asistente de inversion</p>
              <p className="text-xs font-semibold text-[#6b778c]">{controller.status}</p>
            </div>
            <button type="button" className="cta-ghost cta-ghost-sm" onClick={controller.close}>
              Cerrar
            </button>
          </header>

          <div ref={bodyRef} className="max-h-[46vh] min-h-[160px] space-y-2 overflow-y-auto px-3 py-3">
            {controller.messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <p
                  className={`max-w-[92%] whitespace-pre-line rounded-[12px] px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-[#1d70b8] text-white"
                      : "border border-[#e5e9f2] bg-[#f8fbff] text-ink"
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-[#e5e9f2] px-3 py-2">
            <div className="mb-2 flex flex-wrap gap-2">
              {controller.quickActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  className="rounded-full border border-[#d6deea] bg-[#f8fbff] px-3 py-[7px] text-xs font-extrabold text-ink transition hover:border-[#1d70b8] hover:text-[#1d70b8]"
                  onClick={() => controller.runQuickAction(action.id)}
                >
                  {action.label}
                </button>
              ))}
            </div>

            <form className="flex items-center gap-2" onSubmit={onSubmit}>
              <input
                className="field-input py-[9px]"
                placeholder="Escribe tu consulta..."
                value={controller.input}
                onChange={(event) => controller.setInput(event.target.value)}
              />
              <button type="submit" className="cta h-[42px] min-w-[88px] px-3 py-0">
                Enviar
              </button>
            </form>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        className={`ml-3 grid h-12 w-12 place-items-center rounded-full text-sm font-black text-white shadow-[0_10px_25px_rgba(15,23,42,0.35)] transition ${
          controller.isSimulationActive ? "bg-[#15803d]" : "bg-[#0c426a]"
        }`}
        onClick={controller.toggleOpen}
        aria-expanded={controller.isOpen}
        aria-label="Abrir asistente AI"
      >
        AI
      </button>
    </div>
  );
}

