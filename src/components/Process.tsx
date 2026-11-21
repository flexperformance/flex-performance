import { CalendarIcon, ChipIcon, GaugeIcon, PulseIcon } from "./Icons";
import { Reveal, SectionTag } from "./ui";

const STEPS = [
  {
    icon: PulseIcon,
    title: "Diagnostic préalable",
    desc: "Contrôle complet du véhicule à la valise : codes défauts, paramètres moteur, essai routier. Un moteur en mauvaise santé n'est pas reprogrammé.",
    time: "~30 min",
  },
  {
    icon: ChipIcon,
    title: "Sauvegarde d'origine",
    desc: "Lecture et archivage sécurisé de votre cartographie constructeur. Le retour à l'origine reste possible à tout moment, gratuitement.",
    time: "~20 min",
  },
  {
    icon: GaugeIcon,
    title: "Reprogrammation sur mesure",
    desc: "Écriture de la cartographie optimisée, adaptée à votre motorisation, votre carburant et votre usage — jamais de fichier générique.",
    time: "~45 min",
  },
  {
    icon: CalendarIcon,
    title: "Essai & validation",
    desc: "Essai routier de contrôle, vérification des paramètres en charge et remise du rapport avant/après avec vos nouveaux chiffres.",
    time: "~20 min",
  },
];

export default function Process() {
  return (
    <section id="process" className="relative overflow-hidden py-24 lg:py-32">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <div className="flex justify-center">
            <SectionTag>Notre Process</SectionTag>
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Une intervention propre,
            <br className="hidden sm:block" /> tracée et <span className="text-flux-2">réversible</span>.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-mute sm:text-base">
            Comptez 2 heures sur place pour une reprogrammation complète, diagnostic
            et essai compris. Vous repartez avec le rapport détaillé de l'intervention.
          </p>
        </Reveal>

        <ol className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 90} as="li">
              <div className="group relative h-full bg-ink-2 p-7 transition-colors hover:bg-panel">
                <span
                  className="text-outline pointer-events-none absolute right-4 top-2 font-display text-6xl font-bold italic"
                  aria-hidden="true"
                >
                  0{i + 1}
                </span>
                <span className="relative inline-flex h-12 w-12 items-center justify-center border border-line bg-panel text-flux transition-all group-hover:border-flux/50 group-hover:text-flux-2">
                  <step.icon className="h-6 w-6" />
                </span>
                <h3 className="relative mt-5 font-display text-base font-semibold uppercase tracking-wide text-snow">
                  {step.title}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-mute">{step.desc}</p>
                <p className="relative mt-5 inline-flex items-center gap-2 border-t border-line pt-3 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-flux-2">
                  {step.time}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
