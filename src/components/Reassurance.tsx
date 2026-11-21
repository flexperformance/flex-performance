export default function Reassurance() {
  return (
    <section className="py-8 px-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Carte 1 : Cartographies sur mesure */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center hover:border-cyan-500/50 transition-all">
          <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center text-xl mb-4 font-bold border border-cyan-500/20">
            ⚙️
          </div>
          <h4 className="text-white font-bold text-base mb-2">Cartographies sur mesure</h4>
          <p className="text-slate-400 text-xs leading-relaxed">
            Développement personnalisé et adapté à votre véhicule. Aucun fichier générique "off" low-cost pré-programmé.
          </p>
        </div>

        {/* Carte 2 : Garantie & Écriture sécurisée */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center hover:border-emerald-500/50 transition-all">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center text-xl mb-4 font-bold border border-emerald-500/20">
            🛡️
          </div>
          <h4 className="text-white font-bold text-base mb-2">Garantie & Écriture sécurisée</h4>
          <p className="text-slate-400 text-xs leading-relaxed">
            Garantie logicielle sur nos prestations et protocoles d'écriture hautement sécurisés via matériel professionnel.
          </p>
        </div>

        {/* Carte 3 : Diagnostic complet inclus */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center hover:border-amber-500/50 transition-all">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center text-xl mb-4 font-bold border border-amber-500/20">
            🔍
          </div>
          <h4 className="text-white font-bold text-base mb-2">Diagnostic complet inclus</h4>
          <p className="text-slate-400 text-xs leading-relaxed">
            Scan électronique complet et vérification des paramètres vitaux du moteur avant toute intervention en atelier.
          </p>
        </div>

      </div>
    </section>
  );
}