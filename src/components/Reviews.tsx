"use client";

import { useState, useEffect } from "react";

// 1. Liste globale de vos avis avec des dates de référence fixes
const BASE_REVIEWS = [
  {
    id: 1,
    name: "Thomas",
    service: "Conversion E85 / FlexFuel",
    stars: 5,
    comment: "Super prestation sur ma Golf 7 GTI ! Gain de couple bien senti et passage à l'éthanol parfait. Très professionnel !",
    timestamp: new Date("2026-08-01T10:00:00").getTime(),
  },
  {
    id: 2,
    name: "Karim",
    service: "Diagnostic électronique complet",
    stars: 5,
    comment: "Panne trouvée en 30 minutes alors qu'un autre garage bloquait depuis 1 semaine. Matériel au top, je recommande les yeux fermés.",
    timestamp: new Date("2026-07-29T10:00:00").getTime(),
  },
  {
    id: 3,
    name: "David",
    service: "Solutions FAP / EGR / AdBlue",
    stars: 5,
    comment: "Travail propre et rapide. Plus aucun voyant moteur et la voiture a retrouvé toute sa puissance. Merci Flex Performance !",
    timestamp: new Date("2026-07-27T10:00:00").getTime(),
  },
  {
    id: 4,
    name: "Alexandre",
    service: "Reprogrammation Stage 1",
    stars: 5,
    comment: "Moteur débridé et relances beaucoup plus franches sur mon A3. Accueil au top et explications claires du préparateur.",
    timestamp: new Date("2026-07-20T10:00:00").getTime(),
  },
  {
    id: 5,
    name: "Sébastien",
    service: "Conversion E85 / FlexFuel",
    stars: 5,
    comment: "Plein à moitié prix désormais ! Démarrage à froid nickel même le matin. Un vrai bonheur au quotidien.",
    timestamp: new Date("2026-07-13T10:00:00").getTime(),
  },
  {
    id: 6,
    name: "Nicolas",
    service: "Pop & Bang / Vmax / Start-Stop",
    stars: 5,
    comment: "Option Pop & Bang activée avec suppression du Start-Stop, rendu sonore super propre sans exagération. Un régal !",
    timestamp: new Date("2026-07-03T10:00:00").getTime(),
  },
];

// 2. Réserve d'avis futurs
const EXTRA_REVIEWS_POOL = [
  {
    id: 101,
    name: "Julien",
    service: "Reprogrammation Stage 1",
    stars: 5,
    comment: "Reprog aux petits oignons sur mon Megane RS. Un pro passionné qui sait ce qu'il fait.",
    timestamp: new Date("2026-08-02T10:00:00").getTime(),
  },
  {
    id: 102,
    name: "Maxime",
    service: "Diagnostic électronique complet",
    stars: 5,
    comment: "Recherche de panne très rigoureuse. Problème de réseau CAN réglé rapidement. Merci !",
    timestamp: new Date("2026-08-03T08:00:00").getTime(),
  },
  {
    id: 103,
    name: "Kévin",
    service: "Conversion E85 / FlexFuel",
    stars: 5,
    comment: "Éthanol installé depuis 2 semaines, consommation parfaite et zéro trou à l'accélération.",
    timestamp: new Date("2026-08-03T11:00:00").getTime(),
  },
];

function getFirstName(fullName: string) {
  if (!fullName) return "";
  return fullName.trim().split(" ")[0];
}

function getTimeAgo(timestamp: number) {
  if (!timestamp || isNaN(timestamp)) return "Récemment";

  const now = new Date().getTime();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) return "À l'instant";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Il y a ${diffInHours} heure${diffInHours > 1 ? "s" : ""}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Hier";
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `Il y a ${diffInWeeks} semaine${diffInWeeks > 1 ? "s" : ""}`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `Il y a ${diffInMonths} mois`;
}

const SERVICES_LIST = [
  "Reprogrammation Stage 1",
  "Reprogrammation Stage 2",
  "Conversion E85 / FlexFuel",
  "Diagnostic électronique complet",
  "Solutions FAP / EGR / AdBlue",
  "Pop & Bang / Vmax / Start-Stop",
  "Autre Prestation",
];

export default function Reviews() {
  const [reviews, setReviews] = useState(BASE_REVIEWS);
  const [totalCount, setTotalCount] = useState(50);
  const [showForm, setShowForm] = useState(false);

  // Champs du formulaire client
  const [name, setName] = useState("");
  const [service, setService] = useState(SERVICES_LIST[0]);
  const [comment, setComment] = useState("");
  const [stars, setStars] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  // États pour le mode Administrateur sécurisé
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editStars, setEditStars] = useState(5);

  useEffect(() => {
    const savedCustomReviews = localStorage.getItem("flex_custom_reviews");
    const customReviews = savedCustomReviews ? JSON.parse(savedCustomReviews) : [];

    const now = new Date().getTime();
    const oneDayInMs = 1 * 24 * 60 * 60 * 1000;
    const periodIndex = Math.floor(now / oneDayInMs);
    const basePeriod = 20670; 
    const newReviewsToUnlock = Math.max(0, periodIndex - basePeriod);

    setTotalCount(50 + newReviewsToUnlock + customReviews.length);

    const unlockedFromPool = EXTRA_REVIEWS_POOL.slice(0, newReviewsToUnlock);
    
    const allCombined = [...customReviews, ...unlockedFromPool, ...BASE_REVIEWS];
    setReviews(allCombined.slice(0, 6));

    // Détection de la séquence secrète : F-I-R-A-S
    let typedBuffer = "";
    const secretCode = "firas";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      typedBuffer += e.key.toLowerCase();
      
      if (typedBuffer.length > secretCode.length) {
        typedBuffer = typedBuffer.slice(-secretCode.length);
      }

      if (typedBuffer === secretCode) {
        typedBuffer = ""; // Réinitialiser le buffer

        if (isAdmin) {
          // Si déjà admin, un nouveau "firas" désactive le mode admin
          setIsAdmin(false);
          setEditingId(null);
        } else {
          // Demande du mot de passe
          const pwd = prompt("Entrez le mot de passe administrateur :");
          if (pwd === "23812553") {
            setIsAdmin(true);
            alert("Accès administrateur autorisé.");
          } else if (pwd !== null) {
            alert("Mot de passe incorrect.");
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAdmin]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newReview = {
      id: Date.now(),
      name,
      service,
      stars,
      comment,
      timestamp: Date.now(),
    };

    const savedCustomReviews = localStorage.getItem("flex_custom_reviews");
    const customReviews = savedCustomReviews ? JSON.parse(savedCustomReviews) : [];
    
    const updatedCustomReviews = [newReview, ...customReviews];
    localStorage.setItem("flex_custom_reviews", JSON.stringify(updatedCustomReviews));

    const updatedDisplay = [newReview, ...reviews].slice(0, 6);
    setReviews(updatedDisplay);
    setTotalCount((prev) => prev + 1);
    
    setSubmitted(true);
    setName("");
    setComment("");
  };

  const handleDelete = (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cet avis ?")) return;

    const updatedReviews = reviews.filter((r) => r.id !== id);
    setReviews(updatedReviews);

    const savedCustomReviews = localStorage.getItem("flex_custom_reviews");
    if (savedCustomReviews) {
      const customReviews = JSON.parse(savedCustomReviews);
      const filteredCustom = customReviews.filter((r: any) => r.id !== id);
      localStorage.setItem("flex_custom_reviews", JSON.stringify(filteredCustom));
    }

    setTotalCount((prev) => Math.max(0, prev - 1));
  };

  const handleStartEdit = (rev: any) => {
    setEditingId(rev.id);
    setEditName(rev.name);
    setEditComment(rev.comment);
    setEditStars(rev.stars);
  };

  const handleSaveEdit = (id: number) => {
    const updatedReviews = reviews.map((r) => 
      r.id === id ? { ...r, name: editName, comment: editComment, stars: editStars } : r
    );
    setReviews(updatedReviews);

    const savedCustomReviews = localStorage.getItem("flex_custom_reviews");
    if (savedCustomReviews) {
      const customReviews = JSON.parse(savedCustomReviews);
      const updatedCustom = customReviews.map((r: any) => 
        r.id === id ? { ...r, name: editName, comment: editComment, stars: editStars } : r
      );
      localStorage.setItem("flex_custom_reviews", JSON.stringify(updatedCustom));
    }

    setEditingId(null);
  };

  return (
    <section id="reviews" className="py-16 bg-zinc-950 border-t border-zinc-800/80 text-white scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* En-tête propre pour les clients */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Avis Clients</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-amber-400 font-bold text-xl">4.9 / 5</span>
              <span className="text-amber-400 text-base">★★★★★</span>
              <span className="text-zinc-400 text-sm font-medium">({totalCount} avis certifiés)</span>
              {isAdmin && (
                <span className="ml-2 px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs rounded border border-amber-500/40">
                  Mode Admin Actif
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              setShowForm(!showForm);
              setSubmitted(false);
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 font-medium text-sm rounded-lg transition-colors shadow-lg shadow-blue-600/20"
          >
            {showForm ? "Fermer" : "Laissez un avis"}
          </button>
        </div>

        {/* Formulaire client */}
        {showForm && (
          <div className="mb-10 p-6 bg-zinc-900 border border-zinc-800 rounded-xl max-w-xl">
            {submitted ? (
              <div className="p-4 bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 rounded-lg text-center text-sm">
                ✓ Merci ! Votre avis a bien été pris en compte.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-semibold text-lg text-zinc-100">Donnez votre avis</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Votre Prénom</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Thomas"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Prestation réalisée</label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      {SERVICES_LIST.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Note</label>
                  <select
                    value={stars}
                    onChange={(e) => setStars(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value={5}>★★★★★ (5/5)</option>
                    <option value={4}>★★★★☆ (4/5)</option>
                    <option value={3}>★★★☆☆ (3/5)</option>
                    <option value={2}>★★☆☆☆ (2/5)</option>
                    <option value={1}>★☆☆☆☆ (1/5)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Votre commentaire</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Qu'avez-vous pensé de l'intervention ?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 font-medium text-sm rounded-lg transition-colors"
                >
                  Publier l'avis
                </button>
              </form>
            )}
          </div>
        )}

        {/* Grille d'avis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className={`p-6 bg-zinc-900/60 border rounded-xl flex flex-col justify-between space-y-4 transition-colors ${
                isAdmin ? "border-amber-500/50" : "border-zinc-800/80 hover:border-zinc-700"
              }`}
            >
              {editingId === rev.id ? (
                // Mode Édition Administrateur
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Modifier l'avis</h4>
                  <div>
                    <label className="block text-[10px] text-zinc-400">Prénom</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded p-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400">Note (1 à 5)</label>
                    <select
                      value={editStars}
                      onChange={(e) => setEditStars(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded p-1.5 text-xs text-white"
                    >
                      <option value={5}>5 Étoiles</option>
                      <option value={4}>4 Étoiles</option>
                      <option value={3}>3 Étoiles</option>
                      <option value={2}>2 Étoiles</option>
                      <option value={1}>1 Étoile</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400">Commentaire</label>
                    <textarea
                      rows={3}
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded p-1.5 text-xs text-white"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleSaveEdit(rev.id)}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-medium rounded text-white"
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium rounded text-zinc-300"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                // Affichage Normal
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-100">{getFirstName(rev.name)}</span>
                      <span className="text-amber-400 text-sm">{"★".repeat(rev.stars)}</span>
                    </div>
                    
                    {rev.service && (
                      <p className="text-xs font-medium text-blue-400">{rev.service}</p>
                    )}

                    <p className="text-zinc-300 text-sm leading-relaxed">{rev.comment}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
                    <span className="text-xs text-zinc-500">{getTimeAgo(rev.timestamp)}</span>

                    {/* Apparaît uniquement après avoir tapé "firas" et entré "23812553" */}
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStartEdit(rev)}
                          className="px-2 py-1 bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 text-xs rounded border border-amber-500/30 transition-colors"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(rev.id)}
                          className="px-2 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-300 text-xs rounded border border-red-500/30 transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}