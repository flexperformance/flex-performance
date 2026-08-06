"use client";

import { useEffect, useRef, useState } from "react";

type Role = "user" | "assistant";
interface ChatMessage {
  role: Role;
  content: string;
}

const BUSINESS = {
  name: "FLEX PERFORMANCE",
  phoneDisplay: "06 99 18 93 63",
  whatsappUrl:
    "https://wa.me/33699189363?text=Bonjour%20Flex%20Performance%2C%20je%20souhaite%20des%20renseignements%20pour%20une%20prestation.",
};

const GREETING =
  "⚡ **SYSTEM ONLINE** — Assistant Technique FLEX PERFORMANCE.\nSpécialiste en cartographie moteur (Stage 1/2, E85 Flexfuel, Bench/Boot Mode) & diagnostic électronique avancé (DTC, lecture ECU).\n\nIndiquez votre véhicule ou votre code défaut pour commencer.";

const READY_QUESTIONS = [
  "💻 Gains Stage 1 / E85 sur mon véhicule",
  "🔍 Diagnostic & lecture de codes DTC",
  "⚡ Reprog sur table (Bench / Boot Mode)",
  "🧪 Test de réversibilité cartographie",
  "📅 Prise de RDV atelier",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: GREETING }]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.body) throw new Error("Erreur de flux");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: copy[copy.length - 1].content + chunk,
          };
          return copy;
        });
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            "⚠️ **ERR_CONNECT** — Connexion interrompue. Contactez directement l'atelier au " +
            BUSINESS.phoneDisplay +
            " ou via WhatsApp.",
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6 font-sans">
      {/* BOUTONS FLOTTANTS */}
      <div className="flex flex-col items-end gap-3">
        {/* WHATSAPP */}
        <a
          href={BUSINESS.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Discuter sur WhatsApp"
          className="bg-emerald-500/80 hover:bg-emerald-400 text-slate-950 p-3 rounded-full shadow-lg shadow-emerald-500/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-emerald-400/50 hover:shadow-xl cursor-pointer"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>

        {/* BOUTON DÉCLENCHEUR IA */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Ouvrir l'assistant AI Flex Performance"
          className="relative group bg-slate-950/80 hover:bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl shadow-cyan-950/30 transition-all duration-300 hover:scale-105 hover:shadow-cyan-400/40 hover:shadow-2xl cursor-pointer flex items-center justify-center border border-cyan-500/30 hover:border-cyan-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-cyan-400/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <svg className="w-5 h-5 stroke-cyan-400 group-hover:stroke-cyan-200 fill-none relative z-10 transition-transform group-hover:rotate-12" viewBox="0 0 24 24" strokeWidth="1.8">
            <rect x="5" y="5" width="14" height="14" rx="2" />
            <path d="M9 9h6v6H9z" />
            <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" strokeLinecap="round" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_6px_#22d3ee] animate-pulse" />
        </button>
      </div>

      {/* PANNEAU DE CHAT IA */}
      {open && (
        <div className="fixed bottom-36 right-4 left-4 md:left-auto md:bottom-22 md:right-6 w-[calc(100vw-2rem)] md:w-[380px] h-[500px] max-h-[calc(100dvh-120px)] bg-slate-950/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-[0_0_35px_rgba(6,182,212,0.15)] flex flex-col overflow-hidden z-50 text-slate-100 animate-in fade-in slide-in-from-bottom-3 duration-200">
          
          {/* HEADER */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 flex items-center gap-3 border-b border-cyan-500/20 relative shrink-0">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
            
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                <rect x="5" y="5" width="14" height="14" rx="2" />
                <path d="M9 9h6v6H9z" fill="currentColor" fillOpacity="0.4" />
                <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" strokeLinecap="round" />
              </svg>
            </div>
            
            <div className="flex-1 min-w-0">
              <span className="text-xs font-black tracking-wider uppercase bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent block truncate">
                FLEX PERFORMANCE AI
              </span>
              <span className="text-[9px] text-cyan-400/80 font-mono tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_#22d3ee] animate-pulse" /> ECU_LINK // ONLINE
              </span>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-cyan-300 p-1 rounded-lg hover:bg-slate-900 transition-colors"
            >
              <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* ZONE DES MESSAGES */}
          <div ref={bodyRef} className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-3 text-[13px] leading-relaxed">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] p-3 rounded-xl whitespace-pre-wrap shadow-sm ${
                  m.role === "user"
                    ? "self-end bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-br-none font-medium"
                    : "self-start bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none"
                }`}
              >
                {m.content || (loading && i === messages.length - 1 ? (
                  <span className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" /> Analyse en cours...
                  </span>
                ) : "")}
              </div>
            ))}

            {messages.length === 1 && (
              <div className="mt-1 space-y-1.5">
                <p className="text-[9px] font-bold text-cyan-400/70 tracking-widest uppercase px-1 font-mono">
                  // REQUÊTES FRÉQUENTES
                </p>
                <div className="flex flex-col gap-1.5">
                  {READY_QUESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-left text-xs bg-slate-900/90 hover:bg-slate-800 border border-slate-800/80 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 p-2.5 rounded-xl transition-all duration-150 flex items-center justify-between group cursor-pointer"
                    >
                      <span>{s}</span>
                      <span className="text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity font-mono">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CHAMP DE SAISIE */}
          <div className="p-3 bg-slate-900/90 border-t border-cyan-500/10 flex gap-2 items-center shrink-0">
            <input
              type="text"
              placeholder="Posez votre question technique..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all flex items-center justify-center shadow-md shadow-cyan-500/20 cursor-pointer hover:scale-105"
            >
              <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}