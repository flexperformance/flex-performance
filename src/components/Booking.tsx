"use client";

import { useState, useEffect, type FormEvent } from "react";
import {
  AlertIcon,
  CalendarIcon,
  CarIcon,
  CheckIcon,
  CloseIcon,
} from "./Icons";
import { Reveal, SectionTag, SkewButton } from "./ui";

const SERVICE_OPTIONS = [
  "Reprogrammation Stage 1",
  "Reprogrammation Stage 2",
  "Conversion E85 / FlexFuel",
  "Diagnostic électronique complet",
  "Solutions FAP / EGR / AdBlue",
  "Pop & Bang / Vmax / Start-Stop",
  "Autre demande / conseil",
];

type FormState = {
  name: string;
  phone: string;
  email: string;
  brand: string;
  model: string;
  engine: string;
  service: string;
  preferredDate: string;
  message: string;
};

const EMPTY: FormState = {
  name: "",
  phone: "",
  email: "",
  brand: "",
  model: "",
  engine: "",
  service: "",
  preferredDate: "",
  message: "",
};

type Status = "idle" | "submitting" | "success" | "error";

const inputCls =
  "w-full border border-line bg-ink-2 px-4 py-3 text-sm text-snow placeholder:text-mute-2 transition-colors focus:border-flux focus:outline-none focus:ring-1 focus:ring-flux/40";

function labelCls(error?: string) {
  return `mb-1.5 block font-display text-[11px] font-semibold uppercase tracking-[0.2em] ${
    error ? "text-bad" : "text-mute"
  }`;
}

export default function Booking() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [toast, setToast] = useState<{ kind: "ok" | "bad"; text: string } | null>(null);

  const set = (key: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };
useEffect(() => {
    const handleSelectVehicle = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (!customEvent.detail) return;

      const { brand, model, engine } = customEvent.detail;

      // Met à jour les champs du formulaire avec les infos du simulateur
      setForm((prev) => ({
        ...prev,
        brand: brand || prev.brand,
        model: model || prev.model,
        engine: engine || prev.engine,
        service: "Reprogrammation Stage 1",
      }));

      // Scroll fluide vers le formulaire
      const element = document.getElementById("booking") || document.getElementById("rdv");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("selectVehicle", handleSelectVehicle);
    return () => window.removeEventListener("selectVehicle", handleSelectVehicle);
  }, []);

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) e.name = "Votre nom est requis";
    if (!/^[+0-9 ().-]{8,}$/.test(form.phone.trim())) e.phone = "Téléphone invalide";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "E-mail invalide";
    if (form.brand.trim().length < 2) e.brand = "Marque requise";
    if (form.model.trim().length < 1) e.model = "Modèle requis";
    if (!form.service) e.service = "Choisissez une prestation";
    if (form.preferredDate) {
      const d = new Date(form.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (d < today) e.preferredDate = "La date doit être à venir";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const showToast = (kind: "ok" | "bad", text: string) => {
    setToast({ kind, text });
    window.setTimeout(() => setToast(null), 4500);
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (status === "submitting") return;
    if (!validate()) {
      showToast("bad", "Certains champs sont incomplets, vérifiez le formulaire.");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        access_key: "5a8222ef-e0df-4b5c-87ad-e0df863cd4b8",
        ...form
      }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message ?? "Erreur serveur");
      setStatus("success");
      showToast("ok", "Votre demande a bien été envoyée. Nous vous recontactons sous 24h.");
    } catch {
      setStatus("error");
      showToast("bad", "Impossible d'envoyer la demande. Réessayez ou appelez-nous.");
    }
  };

  const reset = () => {
    setForm(EMPTY);
    setErrors({});
    setReference(null);
    setStatus("idle");
  };

  return (
    <section id="rdv" className="relative overflow-hidden py-24 lg:py-32">
      <div
        className="pointer-events-none absolute bottom-0 left-[-10%] h-[480px] w-[480px] rounded-full bg-flux/10 blur-[140px]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <Reveal>
          <SectionTag>Prise de rendez-vous</SectionTag>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl">
            Réservez votre
            <br />
            <span className="text-flux-2">créneau atelier.</span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-mute sm:text-base">
            Décrivez votre véhicule et votre projet : nous confirmons le créneau, le
            tarif exact et les gains estimés par téléphone ou e-mail sous 24 h ouvrées.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              "Devis gratuit et sans engagement",
              "Confirmation du créneau sous 24 h ouvrées",
              "Atelier à Brou-sur-Chantereine (77)",
              "Déplacement gratuit dans un rayon de 10 km",
              "Urgence diagnostic : créneau le jour même selon dispo",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm text-snow/90">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center border border-ok/40 bg-ok/10 text-ok">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                {t}
              </li>
            ))}
          </ul>

        </Reveal>

        <Reveal delay={120}>
          <div className="border border-line bg-panel p-6 sm:p-8">
            {status === "success" && reference ? (
              <div className="flex h-full flex-col items-start justify-center py-6">
                <span className="inline-flex h-14 w-14 items-center justify-center border border-ok/40 bg-ok/10 text-ok">
                  <CheckIcon className="h-7 w-7" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold uppercase tracking-tight text-snow">
                  Demande envoyée !
                </h3>
                <p className="mt-2 text-sm text-mute">
                  Votre référence de dossier :
                </p>
                <p className="mt-1 inline-block border border-flux/40 bg-flux/10 px-3 py-1.5 font-display text-lg font-bold tracking-[0.18em] text-flux-2">
                  {reference}
                </p>
                <div className="mt-6 w-full space-y-2 border-t border-line pt-5 text-sm">
                  <p className="flex justify-between gap-4">
                    <span className="text-mute">Véhicule</span>
                    <span className="text-right font-medium text-snow">
                      {form.brand} {form.model} {form.engine && `· ${form.engine}`}
                    </span>
                  </p>
                  <p className="flex justify-between gap-4">
                    <span className="text-mute">Prestation</span>
                    <span className="text-right font-medium text-snow">{form.service}</span>
                  </p>
                  {form.preferredDate && (
                    <p className="flex justify-between gap-4">
                      <span className="text-mute">Date souhaitée</span>
                      <span className="text-right font-medium text-snow">
                        {new Date(form.preferredDate).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                  )}
                </div>
                <p className="mt-5 text-sm leading-relaxed text-mute">
                  Nous vous recontactons au <span className="text-snow">{form.phone}</span> sous
                  24 h ouvrées pour confirmer le créneau et le tarif exact.
                </p>
                <div className="mt-7">
                  <SkewButton variant="ghost" onClick={reset}>
                    Envoyer une autre demande
                  </SkewButton>
                </div>
              </div>
            ) : (
               <form onSubmit={onSubmit}>
                <input type="hidden" name="access_key" value="5a8222ef-e0df-4b5c-87ad-e0df863cd4b8" />
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="bk-name" className={labelCls(errors.name)}>
                      Nom & prénom *
                    </label>
                    <input
                      id="bk-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => set("name")(e.target.value)}
                      placeholder="Alexandre Martin"
                      className={`${inputCls} ${errors.name ? "border-bad" : ""}`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-bad">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="bk-phone" className={labelCls(errors.phone)}>
                      Téléphone *
                    </label>
                    <input
                      id="bk-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => set("phone")(e.target.value)}
                      placeholder="06 99 19 93 63"
                      className={`${inputCls} ${errors.phone ? "border-bad" : ""}`}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-bad">{errors.phone}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="bk-email" className={labelCls(errors.email)}>
                      E-mail *
                    </label>
                    <input
                      id="bk-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => set("email")(e.target.value)}
                      placeholder="vous@exemple.fr"
                      className={`${inputCls} ${errors.email ? "border-bad" : ""}`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-bad">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="bk-brand" className={labelCls(errors.brand)}>
                      Marque *
                    </label>
                    <input
                      id="bk-brand"
                      name="brand"
                      type="text"
                      value={form.brand}
                      onChange={(e) => set("brand")(e.target.value)}
                      placeholder="Volkswagen"
                      className={`${inputCls} ${errors.brand ? "border-bad" : ""}`}
                    />
                    {errors.brand && <p className="mt-1 text-xs text-bad">{errors.brand}</p>}
                  </div>
                  <div>
                    <label htmlFor="bk-model" className={labelCls(errors.model)}>
                      Modèle *
                    </label>
                    <input
                      id="bk-model"
                      name="model"
                      type="text"
                      value={form.model}
                      onChange={(e) => set("model")(e.target.value)}
                      placeholder="Golf 7 GTD"
                      className={`${inputCls} ${errors.model ? "border-bad" : ""}`}
                    />
                    {errors.model && <p className="mt-1 text-xs text-bad">{errors.model}</p>}
                  </div>
                  <div>
                    <label htmlFor="bk-engine" className={labelCls()}>
                      Motorisation
                    </label>
                    <input
                      id="bk-engine"
                      name="engine"
                      type="text"
                      value={form.engine}
                      onChange={(e) => set("engine")(e.target.value)}
                      placeholder="2.0 TDI 184 cv"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label htmlFor="bk-date" className={labelCls(errors.preferredDate)}>
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarIcon className="h-3.5 w-3.5" /> Date souhaitée
                      </span>
                    </label>
                    <input
                      id="bk-date"
                      name="date"
                      type="date"
                      value={form.preferredDate}
                      onChange={(e) => set("preferredDate")(e.target.value)}
                      className={`${inputCls} ${errors.preferredDate ? "border-bad" : ""}`}
                    />
                    {errors.preferredDate && (
                      <p className="mt-1 text-xs text-bad">{errors.preferredDate}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="bk-service" className={labelCls(errors.service)}>
                      <span className="inline-flex items-center gap-1.5">
                        <CarIcon className="h-3.5 w-3.5" /> Prestation souhaitée *
                      </span>
                    </label>
                    <select
                      id="bk-service"
                      name="service"
                      value={form.service}
                      onChange={(e) => set("service")(e.target.value)}
                      className={`${inputCls} appearance-none ${errors.service ? "border-bad" : ""} ${
                        form.service ? "" : "text-mute-2"
                      }`}
                    >
                      <option value="" disabled>
                        Sélectionnez une prestation…
                      </option>
                      {SERVICE_OPTIONS.map((s) => (
                        <option key={s} value={s} className="text-snow">
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors.service && <p className="mt-1 text-xs text-bad">{errors.service}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="bk-message" className={labelCls()}>
                      Précisions (modifications déjà installées, symptômes…)
                    </label>
                    <textarea
                      id="bk-message"
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={(e) => set("message")(e.target.value)}
                      placeholder="Ex : ligne d'échappement sport déjà montée, voyant moteur allumé depuis 2 semaines…"
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                </div>

                {status === "error" && (
                  <p className="mt-5 flex items-start gap-2.5 border border-bad/40 bg-bad/10 px-4 py-3 text-sm text-bad">
                    <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
                    L'envoi a échoué. Vérifiez votre connexion ou appelez-nous au 06 99 18 93 63.
                  </p>
                )}

                <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-xs text-mute-2">
                    * Champs obligatoires. Vos données servent uniquement à traiter votre demande.
                  </p>
                  <SkewButton type="submit" disabled={status === "submitting"}>
                    {status === "submitting" ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Envoi en cours…
                      </>
                    ) : (
                      "Envoyer ma demande"
                    )}
                  </SkewButton>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>

      {/* toast */}
      {toast && (
        <div
          role="status"
          className={`toast-in fixed bottom-6 right-6 z-[60] flex max-w-sm items-start gap-3 border px-5 py-4 shadow-2xl shadow-black/50 backdrop-blur ${
            toast.kind === "ok"
              ? "border-ok/40 bg-[#0d1a15]/95 text-snow"
              : "border-bad/40 bg-[#1c0f10]/95 text-snow"
          }`}
        >
          {toast.kind === "ok" ? (
            <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-ok" />
          ) : (
            <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-bad" />
          )}
          <p className="text-sm leading-snug">{toast.text}</p>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Fermer la notification"
            className="ml-1 text-mute transition-colors hover:text-snow"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
}
