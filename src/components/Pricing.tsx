import { BoltIcon, CheckIcon } from "./Icons";
import { Reveal, SectionTag, SkewButton } from "./ui";

const PLANS = [
  {
    name: "Diagnostic complet",
    desc: "L'état de santé électronique de votre véhicule, noir sur blanc.",
    features: [
      "Lecture & effacement codes défauts",
      "Contrôle 40+ paramètres moteur",
      "Test batterie & système de charge",
      "Rapport PDF envoyé par e-mail",
      "Devis reprogrammation déduit si réalisé",
    ],
    highlight: false,
  },
  {
    name: "Stage 1",
    desc: "Le meilleur rapport gain / fiabilité, sans toucher à la mécanique.",
    features: [
      "Jusqu'à +25% puissance & couple",
      "Diagnostic préalable inclus",
      "Sauvegarde d'origine archivée",
      "Essai routier & rapport avant/après",
      "Retour à l'origine gratuit à vie",
      "Suivi & ajustements offerts",
    ],
    highlight: true,
  },
  {
    name: "Stage 2 / E85",
    desc: "Cartographie spécifique pour véhicules préparés ou conversion E85.",
    features: [
      "Développement sur mesure / sur banc",
      "Conversion bioéthanol E85 incluse",
      "Gestion départs à froid E85",
      "Options : pop & bang, Vmax, AdBlue",
      "Sauvegarde d'origine archivée",
      "Suivi & ajustements offerts",
    ],
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="tarifs" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <div className="flex justify-center">
            <SectionTag>Devis gratuit</SectionTag>
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Chaque projet mérite
            <br className="hidden sm:block" /> son devis <span className="text-flux-2">sur mesure</span>.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-mute sm:text-base">
            Nous ne publions pas de grille tarifaire : chaque motorisation, équipement et
            usage est différent. Décrivez-nous votre véhicule et recevez un chiffrage
            exact, gratuit et sans engagement.
          </p>
        </Reveal>

        {/* bannière prix d'appel */}
        <Reveal delay={80}>
          <div className="relative mx-auto mb-12 flex max-w-3xl flex-col items-center justify-between gap-5 overflow-hidden border border-flux/40 bg-gradient-to-r from-flux/15 via-panel to-panel px-8 py-7 sm:flex-row">
            <div className="diag-stripes pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
            <div className="relative flex items-center gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center border border-flux/50 bg-flux/10 text-flux-2">
                <BoltIcon className="h-6 w-6" />
              </span>
              <p className="font-display text-lg font-semibold uppercase leading-snug tracking-wide text-snow sm:text-xl">
                Prestations
                <br className="sm:hidden" /> à partir de{" "}
                <span className="bg-gradient-to-r from-flux-2 to-flux bg-clip-text text-transparent">
                  100 €
                </span>
              </p>
            </div>
            <p className="relative max-w-[260px] text-center text-xs leading-relaxed text-mute sm:text-right">
              Selon la prestation et la motorisation. Tarif exact confirmé gratuitement
              avant toute intervention.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 90}>
              <article
                className={`relative flex h-full flex-col border p-8 transition-transform duration-300 hover:-translate-y-1.5 ${
                  plan.highlight
                    ? "border-flux/60 bg-gradient-to-b from-flux/12 to-panel shadow-[0_24px_60px_-24px_rgba(47,123,255,0.45)]"
                    : "border-line bg-panel"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 -skew-x-[10deg] bg-gradient-to-r from-flux-deep to-flux px-4 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                    <span className="inline-block skew-x-[10deg]">Le plus demandé</span>
                  </span>
                )}
                <h3 className="font-display text-lg font-semibold uppercase tracking-[0.14em] text-snow">
                  {plan.name}
                </h3>
                <p className="mt-2 min-h-10 text-sm text-mute">{plan.desc}</p>
                <p className="mt-6 inline-flex w-fit -skew-x-[10deg] border border-line-2 bg-ink-2 px-4 py-2 font-display text-sm font-semibold uppercase tracking-[0.18em] text-flux-2">
                  <span className="inline-block skew-x-[10deg]">Sur devis</span>
                </p>
                <ul className="mt-7 flex-1 space-y-3 border-t border-line pt-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-snow/90">
                      <CheckIcon
                        className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlight ? "text-flux-2" : "text-ok"}`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <SkewButton
                    href="#rdv"
                    variant={plan.highlight ? "primary" : "ghost"}
                    className="w-full"
                  >
                    Demander un devis
                  </SkewButton>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-10 text-center text-xs text-mute-2">
            Paiement sur place après essai et validation — CB, espèces ou virement.
            Facture fournie. Véhicule de courtoisie disponible sur demande.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
