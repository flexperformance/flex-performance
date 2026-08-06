import {
  BoltIcon,
  CheckIcon,
  ChipIcon,
  FuelIcon,
  GaugeIcon,
  PulseIcon,
  ShieldIcon,
  WrenchIcon,
} from "./Icons";
import { Reveal, SectionTag } from "./ui";

const SERVICES = [
  {
    icon: GaugeIcon,
    title: "Reprogrammation Stage 1",
    desc: "Optimisation logicielle du calculateur sans aucune modification mécanique. Gains de puissance et de couple dans les limites de fiabilité constructeur.",
    tag: "Le plus demandé",
  },
  {
    icon: BoltIcon,
    title: "Reprogrammation Stage 2",
    desc: "Pour véhicules préparés : admission, intercooler, échappement sport. Cartographie spécifique développée sur banc de puissance.",
    tag: null,
  },
  {
    icon: PulseIcon,
    title: "Diagnostic électronique",
    desc: "Valise multimarque professionnelle : lecture et effacement des codes défauts, contrôle des paramètres moteur, rapport détaillé remis.",
    tag: null,
  },
  {
    icon: FuelIcon,
    title: "Conversion E85 / FlexFuel",
    desc: "Reprogrammation bioéthanol pour rouler à l'E85 en toute sécurité : ajustement des richesses, départs à froid optimisés.",
    tag: "Jusqu'à -40% / plein",
  },
  {
    icon: ChipIcon,
    title: "Solutions FAP / EGR / AdBlue",
    desc: "Diagnostic des systèmes de dépollution et désactivation logicielle réservée à un usage hors route ou compétition.",
    tag: null,
  },
  {
    icon: ShieldIcon,
    title: "Pop & Bang / Vmax / Start-Stop",
    desc: "Désactivation start-stop, déblocage Vmax, burbles au lâcher de gaz : personnalisation du caractère de votre véhicule.",
    tag: null,
  },
];

const BRANDS = [
  "Audi",
  "BMW",
  "Mercedes",
  "Volkswagen",
  "Peugeot",
  "Renault",
  "Citroën",
  "Ford",
  "Opel",
  "Alfa Romeo",
  "Seat",
  "Skoda",
  "Toyota",
  "Hyundai",
];

const DIAG_POINTS = [
  "Lecture des codes défauts moteur, boîte, ABS, airbag",
  "Contrôle des paramètres en temps réel (pression turbo, lambda, EGT)",
  "Test des actionneurs et des capteurs",
  "Rapport complet + préconisations remis par e-mail",
];

export default function Services() {
  return (
    <section id="services" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mb-14 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionTag>Nos prestations</SectionTag>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl">
              L'électronique moteur,
              <br />
              <span className="text-flux-2">sans compromis.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-mute">
            Chaque intervention commence par un diagnostic complet. Nous ne modifions
            jamais un calculateur sans nous être assurés de l'état mécanique du véhicule.
          </p>
        </Reveal>

        <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 60}>
              <article className="group relative h-full bg-ink-2 p-7 transition-colors duration-300 hover:bg-panel">
                <div
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-flux-deep to-flux transition-transform duration-500 group-hover:scale-x-100"
                  aria-hidden="true"
                />
                <div className="mb-5 flex items-center justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center border border-line bg-panel text-flux transition-colors group-hover:border-flux/50">
                    <s.icon className="h-6 w-6" />
                  </span>
                  {s.tag && (
                    <span className="border border-flux/30 bg-flux/10 px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-flux-2">
                      {s.tag}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-snow">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mute">{s.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* bandeau diagnostic */}
        <Reveal delay={120}>
          <div className="mt-16 grid overflow-hidden border border-line bg-panel lg:grid-cols-2">
            <div className="relative min-h-[280px]">
              <img
                src="https://images.pexels.com/photos/4116198/pexels-photo-4116198.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                alt="Technicien FLEX Performance effectuant un diagnostic à la valise"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-panel/80" aria-hidden="true" />
            </div>
            <div className="p-8 sm:p-10">
              <span className="inline-flex items-center gap-2 font-display text-[11px] font-semibold uppercase tracking-[0.3em] text-flux-2">
                <WrenchIcon className="h-4 w-4" /> Diagnostic approfondi
              </span>
              <h3 className="mt-4 font-display text-2xl font-bold uppercase leading-snug tracking-tight sm:text-3xl">
                Un voyant allumé ?
                <br />
                Un moteur qui manque de souffle ?
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-mute">
                Avant toute reprogrammation — ou simplement pour comprendre un
                comportement anormal — nous passons votre véhicule à la valise
                multimarque et analysons plus de 40 paramètres moteurs.
              </p>
              <ul className="mt-6 space-y-3">
                {DIAG_POINTS.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-snow/90">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-ok" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>

      {/* marques compatibles */}
      <div className="mt-20 border-y border-line bg-ink-2 py-6">
        <p className="mb-4 text-center font-display text-[11px] font-semibold uppercase tracking-[0.32em] text-mute-2">
          Toutes marques & motorisations — essence, diesel, hybride
        </p>
        <div className="relative overflow-hidden" aria-hidden="true">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-2 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-2 to-transparent" />
          <div className="flex w-max animate-marquee items-center gap-12 px-6">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span
                key={`${b}-${i}`}
                className="font-display text-xl font-semibold uppercase italic tracking-wider text-mute-2 transition-colors hover:text-snow"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
