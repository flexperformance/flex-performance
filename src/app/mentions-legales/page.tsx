import Link from "next/link";

export const metadata = {
  title: "Mentions Légales — FLEX Performance",
  description: "Mentions légales de la SAS FIRST CAR exploitant la marque et l'enseigne FLEX Performance.",
};

export default function MentionsLegales() {
  return (
    <main className="min-h-screen bg-ink-2 text-snow py-16 px-5">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Bouton Retour */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-mute-2 hover:text-flux transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Retour à l'accueil
          </Link>
        </div>

        {/* Titre principal */}
        <header className="border-b border-line pb-6">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Mentions Légales
          </h1>
          <p className="mt-2 text-sm text-mute-2">
            En vigueur au {new Date().toLocaleDateString("fr-FR")}
          </p>
        </header>

        {/* Sections juridiques */}
        <div className="space-y-8 text-sm leading-relaxed text-mute-2">
          
          {/* Section 1 : Éditeur du site */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-snow">1. Éditeur du site</h2>
            <p>
              Le présent site web est édité et exploité sous l'enseigne et la marque commerciale <strong>FLEX Performance</strong> par la société :
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Raison sociale :</strong> SAS FIRST CAR</li>
              <li><strong>Nom commercial / Enseigne :</strong> FLEX Performance</li>
              <li><strong>Forme juridique :</strong> Société par Actions Simplifiée (SAS) au capital social de 1 000,00 €</li>
              <li><strong>Siège social :</strong> 3 Avenue Jean Jaurès, 77177 Brou-sur-Chantereine, France</li>
              <li><strong>Numéro SIREN :</strong> 935 056 259</li>
              <li><strong>Numéro SIRET (siège) :</strong> 935 056 259 00010</li>
              <li><strong>RCS / RNE :</strong> Immatriculée au Registre National des Entreprises (RNE) sous le n° 935 056 259</li>
              <li><strong>Numéro de TVA Intracommunautaire :</strong> FR84 935 056 259</li>
              <li><strong>Code NAF / APE :</strong> 45.11Z (Commerce de voitures et de véhicules automobiles légers)</li>
              <li><strong>Téléphone :</strong> 06 99 18 93 63</li>
              <li><strong>Adresse e-mail :</strong> contact@flexperformance.fr</li>
            </ul>
          </section>

          {/* Section 2 : Hébergement & Domaine */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-snow">2. Hébergement & Nom de domaine</h2>
            <p>
              <strong>Hébergeur du site :</strong><br />
              Le site internet est hébergé par la société <strong>Vercel Inc.</strong><br />
              Adresse : 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br />
              Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-flux hover:underline">https://vercel.com</a>
            </p>
            <p>
              <strong>Gestion du nom de domaine :</strong><br />
              Le nom de domaine est réservé auprès de la société <strong>OVH SAS</strong><br />
              Adresse : 2 rue Kellermann, 59100 Roubaix, France<br />
              Site web : <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer" className="text-flux hover:underline">https://www.ovhcloud.com</a>
            </p>
          </section>

          {/* Section 3 : Propriété intellectuelle */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-snow">3. Propriété intellectuelle & Marque</h2>
            <p>
              L’ensemble des éléments constituant le site (nom commercial <strong>FLEX Performance</strong>, logos, chartes graphiques, textes, visuels, développements) sont la propriété exclusive de la <strong>SAS FIRST CAR</strong>.
            </p>
            <p>
              Toute reproduction, modification, distribution ou exploitation de tout ou partie du contenu sans l'autorisation écrite préalable de la <strong>SAS FIRST CAR</strong> est strictly interdite et constitue une contrefaçon sanctionnée par le Code de la propriété intellectuelle.
            </p>
          </section>

          {/* Section 4 : Avertissement réglementaire */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-snow">4. Avertissement spécifique — Reprogrammation & Optimisation</h2>
            <p>
              Les prestations de reprogrammation moteur, de modification de cartographie électronique ou de suppression de systèmes antipollution effectuées par la <strong>SAS FIRST CAR (FLEX Performance)</strong> peuvent modifier les spécifications d’homologation d’un véhicule.
            </p>
            <p>
              Le client est expressément informé que certaines modifications rendent le véhicule non conforme pour un usage sur voie publique et peuvent nécessiter une réception à titre isolé (RTI) auprès de la DREAL, ou réserver l'usage du véhicule exclusivement à la compétition/circuit fermé.
            </p>
          </section>

          {/* Section 5 : Données personnelles */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-snow">5. Protection des données (RGPD)</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD), les informations collectées lors des demandes de rendez-vous ou de devis sont exclusivement traitées par la <strong>SAS FIRST CAR</strong> aux fins de gestion client.
            </p>
            <p>
              Vous bénéficiez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ce droit, adressez votre demande par e-mail à : <a href="mailto:contact@flexperformance.fr" className="text-flux hover:underline">contact@flexperformance.fr</a>.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}