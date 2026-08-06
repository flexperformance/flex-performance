"use client";

import { useState } from "react";
import { ChevronDownIcon } from "./Icons";
import { Reveal, SectionTag } from "./ui";

const FAQ = [
  {
    q: "La reprogrammation est-elle fiable pour mon moteur ?",
    a: "Oui, à condition qu'elle soit réalisée dans les tolérances mécaniques du moteur. Nos cartographies Stage 1 restent dans les marges de sécurité constructeur (pression turbo, température, richesse). Chaque véhicule est diagnostiqué avant intervention : si un défaut est détecté, nous ne reprogrammons pas.",
  },
  {
    q: "Est-ce réversible si je revends mon véhicule ?",
    a: "Absolument. Votre cartographie d'origine est archivée de façon sécurisée lors de l'intervention. Le retour à l'origine est gratuit, à vie, et peut être fait à distance ou sur place en moins de 30 minutes.",
  },
  {
    q: "Que dit la législation sur la reprogrammation ?",
    a: "Une reprogrammation qui respecte les normes d'émissions reste légale. En revanche, la suppression de FAP/EGR ou AdBlue est réservée aux véhicules destinés à un usage hors route ou compétition : nous vous informerons toujours des implications (contrôle technique, assurance) avant toute intervention de ce type.",
  },
  {
    q: "Combien de temps faut-il prévoir sur place ?",
    a: "Comptez environ 2 heures pour une reprogrammation Stage 1 : diagnostic préalable, sauvegarde, écriture, essai routier et rapport. Une conversion E85 ou un Stage 2 peut nécessiter une demi-journée selon les préparations.",
  },
  {
    q: "Ma garantie constructeur est-elle impactée ?",
    a: "Une reprogrammation peut être détectée par le constructeur lors d'un passage en concession. Nous proposons une option « détection réduite » et le retour à l'origine gratuit avant tout passage en garantie. Nos interventions n'altèrent jamais le compteur de flash du calculateur.",
  },
  {
    q: "Quels gains réels puis-je attendre ?",
    a: "Sur un diesel moderne, comptez +20 à +30% de couple et +15 à +25% de puissance en Stage 1. Sur un essence turbo, les gains sont similaires. Au-delà des chiffres, c'est surtout l'agrément qui change : reprises franches, moins de trous à l'accélération, et souvent une consommation en baisse à conduite égale.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <Reveal>
          <SectionTag>Questions fréquentes</SectionTag>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl">
            Tout ce qu'il faut savoir
            <span className="text-flux-2"> avant de passer.</span>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-mute">
            Une question plus précise sur votre motorisation ? Envoyez-nous votre
            demande de rendez-vous en précisant marque, modèle et motorisation :
            nous répondons sous 24 h ouvrées avec les gains estimés et le tarif exact.
          </p>
          <a
            href="#rdv"
            className="mt-7 inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.16em] text-flux-2 transition-colors hover:text-snow"
          >
            Obtenir mon devis gratuit →
          </a>
        </Reveal>

        <div className="divide-y divide-line border border-line bg-panel">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 40}>
                <div>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-panel-2"
                  >
                    <span className="font-display text-sm font-semibold uppercase tracking-wide text-snow sm:text-base">
                      {item.q}
                    </span>
                    <ChevronDownIcon
                      className={`h-5 w-5 shrink-0 text-flux transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div className={`acc-body ${isOpen ? "open" : ""}`}>
                    <div className="acc-inner">
                      <p className="px-6 pb-6 text-sm leading-relaxed text-mute">{item.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
