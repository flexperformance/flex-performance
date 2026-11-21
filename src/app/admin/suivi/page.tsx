"use client";

import { useEffect, useState } from "react";
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase";

interface Vehicle {
  id: string;
  token: string;
  client_name: string;
  vehicle: string;
  plate: string;
  phone: string;
  mileage: string;
  current_step: number;
  estimated_time: string;
  notes: string;
  included_services: string;
  price: string; // Prix de la prestation (saisi directement en TTC)
  invoice_number?: string; // Numéro de facture séquentiel (ex: FACT-2026-0001), attribué à la 1ère génération
  created_at?: string;
}

// Le mot de passe admin est désormais vérifié côté serveur uniquement
// (voir /api/admin/login) : il n'apparaît plus dans le code ou le bundle client.
const MAX_LOGIN_ATTEMPTS = 5; // valeur d'affichage ; la limite réelle est appliquée côté serveur
const LOCKOUT_DURATION_MS = 60 * 1000; // 1 minute, valeur par défaut avant réponse serveur
const TVA_RATE = 0.20; // TVA 20% — les prix saisis dans l'admin sont désormais en TTC
const INVOICE_PREFIX = "FACT"; // Préfixe des numéros de facture (ex: FACT-2026-0001)

const formatEuro = (n: number) =>
  n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

const DEFAULT_PRESET_SERVICES = [
  "Diagnostic Électronique + Optimisation Moteur",
  "Reprogrammation Stage 1 + Diagnostic Complet",
  "Conversion Flexfuel E85 + Optimisation Cartographie",
  "Suppression FAP / EGR + Diagnostic Électronique",
  "Optimisation Boîte de Vitesses (TCU) + Moteur",
  "Recherche de panne avancée & Réparation Faisceau"
];

export default function AdminSuiviPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [inputPassword, setInputPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [stepFilter, setStepFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "price_desc" | "price_asc" | "client">("recent");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const [showArchives, setShowArchives] = useState(false);
  const [archiveDateFrom, setArchiveDateFrom] = useState("");
  const [archiveDateTo, setArchiveDateTo] = useState("");

  const [newToken, setNewToken] = useState("");
  const [newClient, setNewClient] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newVehicle, setNewVehicle] = useState("");
  const [newPlate, setNewPlate] = useState("");
  const [newMileage, setNewMileage] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newHour, setNewHour] = useState("09");
  const [newMinute, setNewMinute] = useState("00");
  const [newNotes, setNewNotes] = useState("");
  const [newPrice, setNewPrice] = useState(""); // État prix d'ajout (TTC)
  
  const [newIncludedServices, setNewIncludedServices] = useState("Diagnostic Électronique • Optimisation Moteur");

  const [presetServicesList, setPresetServicesList] = useState<string[]>(DEFAULT_PRESET_SERVICES);
  const [newPresetInput, setNewPresetInput] = useState("");
  const [showServicesManager, setShowServicesManager] = useState(false);

  useEffect(() => {
    // La session admin est vérifiée côté serveur via un cookie httpOnly
    // (voir /api/admin/session) : le mot de passe n'est jamais exposé au client.
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => setIsAuthenticated(!!data.authenticated))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setCheckingSession(false));

    const savedPresets = localStorage.getItem("flex_preset_services_list");
    if (savedPresets) {
      try {
        setPresetServicesList(JSON.parse(savedPresets));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchVehicles();
      generateRandomToken();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lockedUntil && Date.now() < lockedUntil) {
      const secondsLeft = Math.ceil((lockedUntil - Date.now()) / 1000);
      setAuthError(`Trop de tentatives. Réessayez dans ${secondsLeft}s.`);
      return;
    }

    setLoggingIn(true);
    setAuthError("");
    try {
      // Le mot de passe est vérifié côté serveur (route /api/admin/login) :
      // il n'est jamais comparé ni stocké côté client.
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: inputPassword }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        setInputPassword("");
        setLoginAttempts(0);
        setLockedUntil(null);
      } else if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        setLockedUntil(Date.now() + (data.retryAfterMs || LOCKOUT_DURATION_MS));
        setAuthError("Trop de tentatives échouées. Compte temporairement verrouillé.");
      } else if (res.status === 401) {
        const nextAttempts = loginAttempts + 1;
        setLoginAttempts(nextAttempts);
        setAuthError(`Mot de passe incorrect. (${nextAttempts}/${MAX_LOGIN_ATTEMPTS} tentatives)`);
      } else if (res.status === 404) {
        setAuthError("Route /api/admin/login introuvable (404) — vérifie que route.ts est bien placé dans src/app/api/admin/login/.");
      } else {
        const data = await res.json().catch(() => ({}));
        setAuthError(`Erreur serveur (${res.status}) : ${data.error || "cause inconnue — vérifie les variables d'environnement."}`);
      }
    } catch (err) {
      setAuthError("Erreur réseau, réessayez.");
    }
    setLoggingIn(false);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (err) {
      console.error(err);
    }
    setIsAuthenticated(false);
  };

  const notify = (text: string, type: "success" | "error" = "success", durationMs = 3500) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), durationMs);
  };

  const generateRandomToken = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setNewToken(`F${randomNum}`);
  };

  const fetchVehicles = async () => {
    setLoadingVehicles(true);
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/vehicles?select=*&order=created_at.desc`, {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setVehicles(data);
      } else {
        notify("Impossible de charger les dossiers.", "error", 4000);
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      notify("Erreur réseau lors du chargement des dossiers.", "error", 4000);
    }
    setLoadingVehicles(false);
  };

  const sendWhatsAppMessage = (phone: string, clientName: string, token: string, vehicleModel: string, isReady: boolean = false, isRecovered: boolean = false) => {
    let cleanPhone = phone.replace(/\s+/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "+33" + cleanPhone.slice(1);
    }

    const baseUrl = window.location.origin;
    const nameFormatted = clientName || "Client";

    let text = "";
    if (isRecovered) {
      text = encodeURIComponent(
        `Bonjour *${nameFormatted}*, 🏁\n\n` +
        `Nous vous confirmons que votre *${vehicleModel}* a bien été récupéré.\n\n` +
        `Encore un grand merci d'avoir choisi Flex Performance. Bonne route !`
      );
    } else if (isReady) {
      text = encodeURIComponent(
        `Bonjour *${nameFormatted}*, ✨\n\n` +
        `Excellente nouvelle : les prestations sur votre *${vehicleModel}* sont terminées.\n\n` +
        `Votre véhicule est fin prêt. Nous vous attendons à l'atelier !\n\n` +
        `L'équipe Flex Performance.`
      );
    } else {
      text = encodeURIComponent(
        `Bonjour *${nameFormatted}*, 🏎️\n\n` +
        `Prise en charge validée pour votre *${vehicleModel}* chez Flex Performance.\n\n` +
        `Suivez l'avancement de vos prestations en temps réel ici :\n` +
        `🌐 ${baseUrl}/suivi?token=${token}\n` +
        `🔑 Code unique : *${token}*\n\n` +
        `À très vite.`
      );
    }

    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToken || !newVehicle) return;

    const formattedToken = newToken.trim().toUpperCase().replace(/[-]/g, "");
    const clientToSave = newClient.trim() || "Client";
    const timeFormatted = `${newHour}h${newMinute}`;
    const combinedTime = (newDate || timeFormatted) ? `${newDate} à ${timeFormatted}`.trim() : "En cours";
    const mileageFormatted = newMileage ? `${newMileage.trim()} km` : "Non renseigné";
    const priceFormatted = newPrice ? (newPrice.includes("€") ? newPrice.trim() : `${newPrice.trim()} €`) : "";

    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/vehicles`, {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          token: formattedToken,
          client_name: clientToSave,
          phone: newPhone || "",
          vehicle: newVehicle,
          plate: newPlate || "XX-000-XX",
          mileage: mileageFormatted,
          current_step: 1,
          estimated_time: combinedTime,
          notes: newNotes || "Véhicule pris en charge à l'atelier.",
          included_services: newIncludedServices || "Diagnostic Électronique • Optimisation Moteur",
          price: priceFormatted,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        notify(`Erreur : ${errData.message || "Impossible d'ajouter"}`, "error", 5000);
      } else {
        notify(`Dossier ${formattedToken} créé avec succès !`, "success", 5000);

        if (newPhone) {
          sendWhatsAppMessage(newPhone, clientToSave, formattedToken, newVehicle, false, false);
        }

        setNewClient("");
        setNewPhone("");
        setNewVehicle("");
        setNewPlate("");
        setNewMileage("");
        setNewDate("");
        setNewHour("09");
        setNewMinute("00");
        setNewNotes("");
        setNewPrice("");
        setNewIncludedServices("Diagnostic Électronique • Optimisation Moteur");
        generateRandomToken();
        fetchVehicles();
      }
    } catch (err) {
      notify("Erreur réseau lors de l'ajout.", "error", 5000);
    }
  };

  const handleUpdate = async (token: string, newStep: string, notes: string, servicesVal: string, dateVal: string, hourVal: string, minuteVal: string, mileageVal: string, priceVal: string, phone: string, clientName: string, vehicleModel: string) => {
    const timeFormatted = `${hourVal}h${minuteVal}`;
    const combinedTime = (dateVal || timeFormatted) ? `${dateVal} à ${timeFormatted}`.trim() : "En cours";
    const formattedPrice = priceVal ? (priceVal.includes("€") ? priceVal.trim() : `${priceVal.trim()} €`) : "";

    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/vehicles?token=eq.${token}`, {
        method: "PATCH",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_step: Number(newStep),
          notes: notes,
          included_services: servicesVal,
          estimated_time: combinedTime,
          mileage: mileageVal,
          price: formattedPrice,
        }),
      });

      if (res.ok) {
        notify(`Dossier ${token} mis à jour avec succès !`);
        fetchVehicles();

        if (Number(newStep) === 5 && phone) {
          if (window.confirm("Véhicule PRÊT. Envoyer un WhatsApp au client ?")) {
            sendWhatsAppMessage(phone, clientName, token, vehicleModel, true, false);
          }
        } else if (Number(newStep) === 6 && phone) {
          if (window.confirm("Véhicule RÉCUPÉRÉ (archives). Envoyer un WhatsApp ?")) {
            sendWhatsAppMessage(phone, clientName, token, vehicleModel, false, true);
          }
        }
      } else {
        notify("Erreur lors de la mise à jour.", "error");
      }
    } catch (err) {
      notify("Erreur réseau lors de la mise à jour.", "error");
    }
  };

  const handleDelete = async (token: string) => {
    if (!window.confirm(`Supprimer définitivement le dossier ${token} ?`)) return;

    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/vehicles?token=eq.${token}`, {
        method: "DELETE",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      });

      if (res.ok) {
        notify(`Dossier ${token} supprimé.`);
        fetchVehicles();
      } else {
        notify("Erreur lors de la suppression.", "error");
      }
    } catch (err) {
      notify("Erreur réseau.", "error");
    }
  };

  // FICHE ATELIER : PRIX TTC, POLICE AGRANDIE ET FOND BLANC[cite: 1]
  const handlePrintVehicleTicket = (v: Vehicle) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Veuillez autoriser les pop-ups pour imprimer la fiche.");
      return;
    }

    // Le prix saisi dans l'admin est directement en TTC[cite: 1]
    const priceTTC = parsePriceToNumber(v.price);
    const hasPrice = priceTTC > 0;

    printWindow.document.write(`
      <html>
        <head>
          <title>Ordre de Mission - ${v.token} - ${v.vehicle}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');
            
            @page {
              size: A4;
              margin: 15mm;
            }

            body { 
              font-family: 'Outfit', sans-serif; 
              padding: 0; 
              color: #000000; 
              margin: 0 auto; 
              background: #ffffff !important; 
              -webkit-print-color-adjust: exact; 
              font-size: 15px;
            }
            html { background: #ffffff !important; }

            .ticket-container { 
              width: 100%;
              min-height: 260mm;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              background: #ffffff !important; 
            }

            .header-top { 
              text-align: center; 
              border-bottom: 2px solid #000000; 
              padding-bottom: 18px; 
              margin-bottom: 22px; 
              background: #ffffff !important;
            }

            /* Logo SVG centré et agrandi */
            .logo-img { 
              max-height: 140px; 
              width: auto; 
              display: block; 
              margin: 0 auto 10px auto; 
              object-fit: contain;
              background: transparent !important;
            }

            /* Sous-titre centré en bas du logo */
            .logo-subtitle {
              font-size: 13px;
              color: #222222;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 16px;
            }

            .header-info-bar { 
              display: flex; 
              justify-content: space-between; 
              align-items: center; 
              background: #ffffff !important; 
              padding: 12px 18px; 
              border-bottom: 2px solid #000000; 
            }

            .company-tag { 
              font-size: 13px; 
              text-transform: uppercase; 
              letter-spacing: 1.5px; 
              font-weight: 800; 
              color: #000000; 
            }

            .order-badge { 
              font-family: 'JetBrains Mono', monospace; 
              background: #ffffff !important; 
              color: #000000; 
              padding: 6px 16px; 
              font-size: 18px; 
              font-weight: 700; 
              border: 2px solid #000000;
              border-radius: 4px; 
            }

            .section-box { 
              margin-bottom: 22px; 
              background: #ffffff !important;
            }

            .section-title { 
              font-size: 12px; 
              font-family: 'JetBrains Mono', monospace; 
              text-transform: uppercase; 
              color: #000000; 
              font-weight: 800; 
              margin-bottom: 10px; 
              letter-spacing: 1px; 
              border-left: 4px solid #000000; 
              padding-left: 10px; 
            }

            .grid-specs { 
              display: grid; 
              grid-template-columns: repeat(3, 1fr); 
              gap: 12px; 
            }

            .spec-card { 
              background: #ffffff !important; 
              border-bottom: 1px solid #94a3b8;
              padding: 10px 4px; 
            }

            .spec-card.span-2 { 
              grid-column: span 2; 
            }

            .spec-card label { 
              display: block; 
              font-size: 11px; 
              text-transform: uppercase; 
              color: #475569; 
              font-weight: 700; 
              margin-bottom: 4px; 
            }

            .spec-card span { 
              font-size: 15px; 
              font-weight: 700; 
              color: #000000; 
            }

            .services-highlight { 
              background: #ffffff !important; 
              border-bottom: 1px solid #94a3b8;
              padding: 12px 4px; 
              font-size: 15px; 
              font-weight: 700; 
              color: #000000; 
            }

            .notes-box { 
              background: #ffffff !important; 
              border: 1px dashed #64748b;
              padding: 14px; 
              border-radius: 6px; 
              font-size: 13px; 
              min-height: 60px; 
              color: #000000; 
              font-weight: 500;
            }

            .signatures-row { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 20px; 
              margin-top: 25px; 
              border-top: 1px solid #000000; 
              padding-top: 20px; 
              background: #ffffff !important;
            }

            .sig-box { 
              height: 80px; 
              background: #ffffff !important; 
              border: 1px solid #94a3b8;
              border-radius: 6px; 
              padding: 10px; 
              font-size: 11px; 
              color: #475569; 
              text-transform: uppercase; 
              font-weight: 700; 
            }

            .ticket-footer { 
              text-align: center; 
              font-size: 11px; 
              margin-top: 20px; 
              color: #475569; 
              font-family: 'JetBrains Mono', monospace; 
              border-top: 1px solid #cbd5e1;
              padding-top: 12px;
              background: #ffffff !important;
            }
          </style>
        </head>
        <body>
          <div class="ticket-container">
            <div>
              <div class="header-top">
                <img src="/LOGO.svg" alt="Flex Performance" class="logo-img" />
                <div class="logo-subtitle">Optimisation & Électronique Automobile</div>
                <div class="header-info-bar">
                  <span class="company-tag">Ordre de Mission Atelier</span>
                  <div class="order-badge">Dossier : ${v.token}</div>
                </div>
              </div>

              <div class="section-box">
                <div class="section-title">Informations Client & Véhicule</div>
                <div class="grid-specs">
                  <div class="spec-card span-2"><label>Nom du Client</label><span>${v.client_name}</span></div>
                  <div class="spec-card"><label>Téléphone</label><span>${v.phone || "Non renseigné"}</span></div>
                  <div class="spec-card span-2"><label>Modèle du Véhicule</label><span>${v.vehicle}</span></div>
                  <div class="spec-card"><label>Immatriculation</label><span style="font-family: 'JetBrains Mono', monospace; color: #000000;">${v.plate}</span></div>
                  <div class="spec-card"><label>Kilométrage</label><span>${v.mileage || "Non renseigné"}</span></div>
                  <div class="spec-card"><label>Prix Prestation (TTC)</label><span style="color: #000000; font-family: 'JetBrains Mono', monospace;">${hasPrice ? formatEuro(priceTTC) : (v.price || "Sur devis")}</span></div>
                </div>
              </div>

              <div class="section-box">
                <div class="section-title">Prestations Commandées</div>
                <div class="services-highlight">⚡ ${v.included_services}</div>
              </div>

              <div class="section-box">
                <div class="section-title">Consignes & Notes Techniques Atelier</div>
                <div class="notes-box">${v.notes || "Aucune consigne particulière."}</div>
              </div>
            </div>

            <div>
              <div class="signatures-row">
                <div class="sig-box">Signature du Client :</div>
                <div class="sig-box">Visa / Signature Technicien :</div>
              </div>

              <div class="ticket-footer">FLEX PERFORMANCE — Document généré le ${new Date().toLocaleDateString('fr-FR')}</div>
            </div>
          </div>

          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // GÉNÉRATEUR DE FACTURE CLIENT OFFICIEL
  const handlePrintInvoice = async (v: Vehicle) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Veuillez autoriser les pop-ups pour afficher la facture.");
      return;
    }
    printWindow.document.write(`<html><body style="font-family:sans-serif;padding:40px;color:#334155;">Génération de la facture…</body></html>`);

    const invoiceNumber = await ensureInvoiceNumber(v);

    // Le prix saisi dans l'admin est désormais en TTC : on calcule le HT et la TVA 20% en arrière
    const priceTTC = parsePriceToNumber(v.price);
    const hasPrice = priceTTC > 0;
    const priceHT = priceTTC / (1 + TVA_RATE);
    const montantTVA = priceTTC - priceHT;
    const montantTTC = priceTTC;

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Facture ${invoiceNumber} - ${v.client_name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
            @page {
              size: A4;
              margin: 12mm 15mm;
            }
            body {
              font-family: 'Outfit', sans-serif;
              color: #000000;
              margin: 0;
              padding: 0;
              background: #ffffff;
              -webkit-print-color-adjust: exact;
              position: relative;
              min-height: 250mm;
            }
            .invoice-content {
              padding-bottom: 70px;
            }
            .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000000; padding-bottom: 20px; margin-bottom: 30px; }
            
            /* Bloc Logo et sous-titre centré en bas du logo */
            .logo-block { text-align: left; }
            .logo-img { 
              max-height: 130px; 
              width: auto; 
              object-fit: contain; 
              background: transparent;
              display: block;
              margin: 0 auto;
            }
            .logo-subtitle {
              font-size: 11px;
              color: #333333;
              margin-top: 8px;
              font-weight: 600;
              text-align: center;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }

            .invoice-title-block { text-align: right; }
            .invoice-title { font-size: 28px; font-weight: 800; text-transform: uppercase; color: #000000; letter-spacing: -0.5px; margin: 0; }
            .invoice-number { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #000000; font-weight: 700; margin-top: 4px; }
            .invoice-meta { font-size: 12px; color: #333333; margin-top: 2px; }
            .client-garage-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 35px; }
            .box-info { background: #f8fafc; border: 1px solid #cbd5e1; padding: 20px; border-radius: 8px; }
            .box-info h3 { font-size: 10px; text-transform: uppercase; font-family: 'JetBrains Mono', monospace; color: #475569; margin-top: 0; margin-bottom: 10px; letter-spacing: 1.5px; font-weight: 700; }
            .box-info p { margin: 4px 0; font-size: 13px; font-weight: 600; color: #000000; }
            .table-container { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .table-container th { background: #000000; color: #ffffff; text-align: left; padding: 14px 18px; font-size: 11px; text-transform: uppercase; font-family: 'JetBrains Mono', monospace; letter-spacing: 1px; font-weight: 700; }
            .table-container th:last-child { text-align: right; }
            .table-container td { padding: 18px; border-bottom: 1px solid #cbd5e1; font-size: 13px; font-weight: 600; color: #000000; }
            .table-container td:last-child { text-align: right; font-family: 'JetBrains Mono', monospace; color: #000000; font-weight: 700; }
            .total-section { display: flex; justify-content: flex-end; margin-bottom: 40px; }
            .total-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 20px 24px; border-radius: 8px; min-width: 280px; }
            .total-row { display: flex; justify-content: space-between; gap: 40px; font-size: 13px; color: #475569; font-weight: 600; margin-bottom: 8px; }
            .total-row span:last-child { font-family: 'JetBrains Mono', monospace; color: #000000; }
            .total-row-final { border-top: 2px solid #000000; padding-top: 12px; margin-top: 10px; display: flex; justify-content: space-between; align-items: center; }
            .total-row-final label { font-size: 11px; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; color: #000000; font-weight: 800; letter-spacing: 1px; }
            .total-row-final span { font-size: 20px; font-weight: 900; color: #000000; font-family: 'JetBrains Mono', monospace; }
            .invoice-footer { position: absolute; bottom: 0; left: 0; right: 0; text-align: center; border-top: 1px solid #cbd5e1; padding-top: 16px; font-size: 10px; color: #475569; font-family: 'JetBrains Mono', monospace; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="invoice-content">
            <div class="invoice-header">
              <div class="logo-block">
                <img src="/LOGO.svg" alt="Flex Performance" class="logo-img" />
                <div class="logo-subtitle">Optimisation & Électronique Automobile</div>
              </div>
              <div class="invoice-title-block">
                <h1 class="invoice-title">Facture</h1>
                <div class="invoice-number">${invoiceNumber}</div>
                <div class="invoice-meta">Réf Dossier : ${v.token}</div>
                <div class="invoice-meta">Date : ${new Date().toLocaleDateString('fr-FR')}</div>
              </div>
            </div>

            <div class="client-garage-grid">
              <div class="box-info">
                <h3>Émetteur</h3>
                <p><strong>Flex Performance</strong></p>
                <p style="color: #475569; font-weight: 500; font-size: 12px;">Atelier d'Optimisation Moteur & Diag</p>
                <p style="color: #000000; font-weight: 600; font-size: 12px; margin-top: 6px;">flexperformance.fr</p>
              </div>
              <div class="box-info">
                <h3>Facturé à</h3>
                <p><strong>${v.client_name}</strong></p>
                <p style="color: #475569; font-weight: 500; font-size: 12px; margin-top: 4px;">Véhicule : <strong style="color: #000000;">${v.vehicle}</strong></p>
                <p style="color: #475569; font-weight: 500; font-size: 12px;">Immatriculation : <span style="font-family: 'JetBrains Mono', monospace; color: #000000; font-weight: 700;">${v.plate}</span></p>
                <p style="color: #475569; font-weight: 500; font-size: 12px;">Kilométrage : ${v.mileage || "Non renseigné"}</p>
              </div>
            </div>

            <table class="table-container">
              <thead>
                <tr>
                  <th>Description des Prestations</th>
                  <th style="text-align: right;">Montant HT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong style="font-size: 14px; color: #000000;">${v.vehicle}</strong><br/>
                    <span style="font-size: 12px; color: #475569; font-weight: 500; margin-top: 4px; display: inline-block;">Prestations : ${v.included_services}</span>
                  </td>
                  <td>${hasPrice ? formatEuro(priceHT) : "Sur devis"}</td>
                </tr>
              </tbody>
            </table>

            ${hasPrice ? `
            <div class="total-section">
              <div class="total-box">
                <div class="total-row">
                  <span>Total HT</span><span>${formatEuro(priceHT)}</span>
                </div>
                <div class="total-row">
                  <span>TVA (20%)</span><span>${formatEuro(montantTVA)}</span>
                </div>
                <div class="total-row-final">
                  <label>Total TTC</label>
                  <span>${formatEuro(montantTTC)}</span>
                </div>
              </div>
            </div>
            ` : `
            <div class="total-section">
              <div class="total-box" style="text-align: right;">
                <div class="total-row-final" style="justify-content: space-between;">
                  <label>Total Net à Payer</label>
                  <span style="font-size: 16px;">Sur devis</span>
                </div>
              </div>
            </div>
            `}
          </div>

          <div class="invoice-footer">
            <strong>FLEX PERFORMANCE</strong> — Optimisation & Électronique Automobile — SIRET : [Votre Numéro SIRET] — RCS [Votre Ville]<br/>
            Merci de votre confiance. Pour toute question, contactez-nous directement.
          </div>

          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExportCSV = () => {
    if (vehicles.length === 0) {
      notify("Aucun dossier à exporter.", "error");
      return;
    }

    const headers = [
      "N° Facture", "Token", "Client", "Téléphone", "Véhicule", "Plaque",
      "Kilométrage", "Étape", "Date/Heure prévue", "Prestations",
      "Prix HT", "TVA (20%)", "Prix TTC", "Notes",
    ];

    const escapeCsv = (value: string) => `"${(value || "").replace(/"/g, '""')}"`;

    const rows = vehicles.map((v) => {
      const ttcNum = parsePriceToNumber(v.price);
      const htNum = ttcNum > 0 ? ttcNum / (1 + TVA_RATE) : 0;
      const tvaNum = ttcNum > 0 ? ttcNum - htNum : 0;
      const ht = htNum > 0 ? formatEuro(htNum) : "";
      const tva = tvaNum > 0 ? formatEuro(tvaNum) : "";
      const ttc = ttcNum > 0 ? formatEuro(ttcNum) : "";
      return [
        v.invoice_number || "", v.token, v.client_name, v.phone, v.vehicle, v.plate,
        v.mileage, String(v.current_step), v.estimated_time,
        v.included_services, ht, tva, ttc, v.notes,
      ].map(escapeCsv).join(";");
    });

    const csvContent = "\uFEFF" + [headers.map(escapeCsv).join(";"), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `flex-performance-dossiers-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddPresetService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetInput.trim()) return;
    const updated = [newPresetInput.trim(), ...presetServicesList];
    setPresetServicesList(updated);
    localStorage.setItem("flex_preset_services_list", JSON.stringify(updated));
    setNewPresetInput("");
    notify("Modèle de prestation ajouté !");
  };

  const handleDeletePresetService = (idxToRemove: number) => {
    const updated = presetServicesList.filter((_, idx) => idx !== idxToRemove);
    setPresetServicesList(updated);
    localStorage.setItem("flex_preset_services_list", JSON.stringify(updated));
    notify("Modèle supprimé.");
  };

  const parsePriceToNumber = (price: string) => {
    if (!price) return 0;
    const cleaned = price.replace(/[^0-9,.-]/g, "").replace(",", ".");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  // Génère le prochain numéro de facture séquentiel de l'année en cours
  // (ex: FACT-2026-0001, FACT-2026-0002...) à partir des numéros déjà attribués.
  // La numérotation redémarre à 0001 chaque nouvelle année civile.
  const getNextInvoiceNumber = (allVehicles: Vehicle[]) => {
    const year = new Date().getFullYear();
    const yearPrefix = `${INVOICE_PREFIX}-${year}-`;
    let maxSeq = 0;
    allVehicles.forEach((v) => {
      if (v.invoice_number && v.invoice_number.startsWith(yearPrefix)) {
        const seq = parseInt(v.invoice_number.slice(yearPrefix.length), 10);
        if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
      }
    });
    return `${yearPrefix}${String(maxSeq + 1).padStart(4, "0")}`;
  };

  // Récupère le numéro de facture existant d'un véhicule, ou en attribue un
  // nouveau et le persiste en base (une facture ne change jamais de numéro
  // une fois émise, même si on la réimprime).
  const ensureInvoiceNumber = async (v: Vehicle): Promise<string> => {
    if (v.invoice_number) return v.invoice_number;

    const invoiceNumber = getNextInvoiceNumber(vehicles);

    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/vehicles?token=eq.${v.token}`, {
        method: "PATCH",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invoice_number: invoiceNumber }),
      });
      if (res.ok) {
        setVehicles((prev) =>
          prev.map((veh) => (veh.token === v.token ? { ...veh, invoice_number: invoiceNumber } : veh))
        );
      } else {
        notify(
          "Impossible d'enregistrer le numéro de facture (colonne invoice_number manquante dans Supabase ?).",
          "error",
          6000
        );
      }
    } catch (err) {
      notify("Erreur réseau lors de l'attribution du numéro de facture.", "error", 6000);
    }

    return invoiceNumber;
  };

  const searchedVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.vehicle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      v.client_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      v.token.toLowerCase().includes(searchFilter.toLowerCase()) ||
      v.plate.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStep = stepFilter === null ? true : v.current_step === stepFilter;

    return matchesSearch && matchesStep;
  });

  const sortVehicles = (list: Vehicle[]) => {
    const sorted = [...list];
    switch (sortBy) {
      case "price_desc":
        return sorted.sort((a, b) => parsePriceToNumber(b.price) - parsePriceToNumber(a.price));
      case "price_asc":
        return sorted.sort((a, b) => parsePriceToNumber(a.price) - parsePriceToNumber(b.price));
      case "client":
        return sorted.sort((a, b) => a.client_name.localeCompare(b.client_name, "fr"));
      case "recent":
      default:
        return sorted; // déjà trié par created_at desc via la requête Supabase
    }
  };

  const activeVehicles = sortVehicles(searchedVehicles.filter((v) => v.current_step < 6));
  const archivedVehicles = sortVehicles(
    searchedVehicles
      .filter((v) => v.current_step === 6)
      .filter((v) => {
        if (!archiveDateFrom && !archiveDateTo) return true;
        const datePart = v.estimated_time ? v.estimated_time.split(" à ")[0] : "";
        if (!datePart) return true;
        if (archiveDateFrom && datePart < archiveDateFrom) return false;
        if (archiveDateTo && datePart > archiveDateTo) return false;
        return true;
      })
  );

  const statsTotalActive = vehicles.filter(v => v.current_step < 6).length;
  const statsReady = vehicles.filter(v => v.current_step === 5).length;
  const statsArchived = vehicles.filter(v => v.current_step === 6).length;

  const statsRevenueArchivedTTC = vehicles
    .filter((v) => v.current_step === 6)
    .reduce((total, v) => total + parsePriceToNumber(v.price), 0);
  const statsRevenueArchivedHT = statsRevenueArchivedTTC / (1 + TVA_RATE);
  const statsAvgTicketTTC = statsArchived > 0 ? statsRevenueArchivedTTC / statsArchived : 0;

  const hours = Array.from({ length: 15 }, (_, i) => String(i + 8).padStart(2, "0"));
  const minutes = ["00", "15", "30", "45"];

  if (checkingSession) {
    return (
      <main className="min-h-screen pt-[160px] pb-20 px-6 max-w-xl mx-auto text-snow flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-flux/30 border-t-flux rounded-full animate-spin" />
        <p className="text-xs font-mono text-mute uppercase tracking-widest">Vérification de la session…</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen pt-[160px] pb-20 px-6 max-w-xl mx-auto text-snow flex flex-col justify-center">
        <div className="border border-flux/40 bg-panel/90 p-10 rounded-3xl shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="text-center mb-10">
            <span className="text-xs font-mono font-bold text-flux uppercase tracking-widest bg-flux/15 border border-flux/30 px-4 py-1.5 rounded-full">Sécurité Atelier</span>
            <h1 className="font-display text-3xl font-black uppercase mt-4">Espace Administrateur</h1>
            <p className="text-sm text-mute mt-2">Authentification requise pour gérer l'atelier.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              placeholder="Mot de passe admin"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              required
              autoFocus
              className="w-full bg-ink-2 border border-line px-5 py-4 rounded-2xl text-sm text-snow focus:outline-none focus:border-flux transition-all shadow-inner"
            />
            {authError && <p className="text-red-400 text-sm font-display uppercase tracking-wider">{authError}</p>}
            <button
              type="submit"
              disabled={loggingIn || (!!lockedUntil && Date.now() < lockedUntil)}
              className="w-full bg-flux text-ink font-display text-sm font-bold uppercase py-4 rounded-2xl hover:bg-white transition-all cursor-pointer tracking-wider shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loggingIn ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  const renderVehicleCard = (v: Vehicle) => {
    const parts = v.estimated_time ? v.estimated_time.split(" à ") : ["", ""];
    const defaultDate = parts[0] || "";
    const rawTime = parts[1] || "";
    
    let defaultHour = "09";
    let defaultMinute = "00";
    if (rawTime) {
      const cleanedTime = rawTime.replace("h", ":");
      const timeSplit = cleanedTime.split(":");
      if (timeSplit[0]) defaultHour = timeSplit[0].padStart(2, "0");
      if (timeSplit[1]) defaultMinute = timeSplit[1].replace(/[^0-9]/g, "").padStart(2, "0").slice(0, 2);
    }

    const isArchived = v.current_step === 6;

    return (
      <div key={v.id || v.token} className={`border ${isArchived ? 'border-line/40 bg-panel/50 opacity-90' : 'border-line bg-panel/90'} p-8 rounded-3xl grid gap-8 lg:grid-cols-4 items-center shadow-xl backdrop-blur-md`}>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block bg-flux/15 border border-flux/30 px-4 py-1.5 rounded-xl text-sm font-mono text-flux font-black shadow-sm">
              {v.token}
            </span>
            {isArchived && (
              <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg">
                Archivé
              </span>
            )}
            {v.current_step === 5 && (
              <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg animate-pulse">
                Prêt
              </span>
            )}
          </div>
          <h3 className="font-display text-lg font-black uppercase tracking-wide text-white">{v.vehicle}</h3>
          <p className="text-sm text-mute mt-2">Client : <strong className="text-snow">{v.client_name}</strong> <span className="font-mono text-flux">({v.plate})</span></p>
          <p className="text-xs font-mono text-flux-2 mt-1">odometer : <span className="text-snow">{v.mileage || "Non renseigné"}</span></p>
          <p className="text-xs font-mono text-emerald-400 font-bold mt-1">
            💰 Tarif TTC : <span className="text-snow">{v.price || "Non renseigné"}</span>
            {parsePriceToNumber(v.price) > 0 && (
              <span className="text-mute font-normal"> ({formatEuro(parsePriceToNumber(v.price) / (1 + TVA_RATE))} HT)</span>
            )}
          </p>
          {v.invoice_number && (
            <p className="text-[11px] font-mono text-mute mt-1">🧾 Facture : <span className="text-snow">{v.invoice_number}</span></p>
          )}
          {v.phone && <p className="text-xs font-mono text-flux-2 mt-1">📱 {v.phone}</p>}
        </div>

        <div>
          <label className="block text-xs uppercase font-mono text-mute mb-2 font-bold tracking-wider">Étape actuelle</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const selectEl = document.getElementById(`step-${v.token}`) as HTMLSelectElement;
                if (selectEl && Number(selectEl.value) > 1) {
                  selectEl.value = String(Number(selectEl.value) - 1);
                }
              }}
              className="bg-ink-2 border border-line px-3 py-4 rounded-2xl hover:border-flux text-xs font-bold cursor-pointer text-mute hover:text-snow transition-all"
              title="Reculer d'une étape"
            >
              ◀
            </button>

            <select
              defaultValue={v.current_step}
              id={`step-${v.token}`}
              className="w-full bg-ink-2 border border-line px-4 py-4 rounded-2xl text-sm text-snow focus:outline-none focus:border-flux cursor-pointer font-medium text-center"
            >
              <option value="1">1. Réceptionné</option>
              <option value="2">2. Diagnostic en cours</option>
              <option value="3">3. Cartographie & Reprog</option>
              <option value="4">4. Tests sur route</option>
              <option value="5">5. Prêt à récupérer</option>
              <option value="6">6. Véhicule récupéré (Archives)</option>
            </select>

            <button
              type="button"
              onClick={() => {
                const selectEl = document.getElementById(`step-${v.token}`) as HTMLSelectElement;
                if (selectEl && Number(selectEl.value) < 6) {
                  selectEl.value = String(Number(selectEl.value) + 1);
                }
              }}
              className="bg-ink-2 border border-line px-3 py-4 rounded-2xl hover:border-flux text-xs font-bold cursor-pointer text-flux transition-all"
              title="Avancer d'une étape"
            >
              ▶
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-xs uppercase font-mono text-flux font-bold tracking-wider">⚡ Prestations Incluses & Prix</label>
          
          <select
            onChange={(e) => {
              if (e.target.value) {
                const servicesInput = document.getElementById(`services-${v.token}`) as HTMLInputElement;
                if (servicesInput) {
                  servicesInput.value = e.target.value;
                }
                e.target.value = "";
              }
            }}
            className="w-full bg-ink-2 border border-line px-3 py-2 rounded-xl text-xs text-mute focus:outline-none focus:border-flux cursor-pointer"
          >
            <option value="">⚡ Insérer un pack prédéfini...</option>
            {presetServicesList.map((preset, idx) => (
              <option key={idx} value={preset} className="bg-ink-2 text-snow">{preset}</option>
            ))}
          </select>

          <input
            type="text"
            defaultValue={v.included_services || "Diagnostic Électronique • Optimisation Moteur"}
            id={`services-${v.token}`}
            className="w-full bg-ink-2 border border-flux/50 px-4 py-3 rounded-2xl text-xs text-snow font-medium focus:outline-none focus:border-flux shadow-inner"
            placeholder="Ex: Diagnostic Électronique • Optimisation Moteur"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              defaultValue={v.mileage || ""}
              id={`mileage-${v.token}`}
              className="bg-ink-2 border border-line px-3 py-3 rounded-2xl text-xs text-snow focus:outline-none focus:border-flux shadow-inner"
              placeholder="Km (ex: 142000)"
            />
            <input
              type="text"
              defaultValue={v.price || ""}
              id={`price-${v.token}`}
              className="bg-ink-2 border border-emerald-500/50 px-3 py-3 rounded-2xl text-xs text-snow focus:outline-none focus:border-emerald-400 shadow-inner font-mono font-bold"
              placeholder="Prix TTC (ex: 450 €)"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <input
              type="date"
              defaultValue={defaultDate}
              id={`date-${v.token}`}
              className="col-span-2 bg-ink-2 border border-line px-2 py-3 rounded-2xl text-xs text-snow focus:outline-none focus:border-flux shadow-inner cursor-pointer"
            />
            <div className="flex items-center gap-1 bg-ink-2 border border-line px-1.5 py-2 rounded-2xl shadow-inner">
              <select
                defaultValue={defaultHour}
                id={`hour-${v.token}`}
                className="bg-transparent text-xs font-mono text-snow focus:outline-none cursor-pointer w-full text-center"
              >
                {hours.map((h) => (
                  <option key={h} value={h} className="bg-ink-2 text-snow">{h}h</option>
                ))}
              </select>
              <span className="text-mute">:</span>
              <select
                defaultValue={defaultMinute}
                id={`minute-${v.token}`}
                className="bg-transparent text-xs font-mono text-snow focus:outline-none cursor-pointer w-full text-center"
              >
                {minutes.map((m) => (
                  <option key={m} value={m} className="bg-ink-2 text-snow">{m}</option>
                ))}
              </select>
            </div>
          </div>

          <input
            type="text"
            defaultValue={v.notes}
            id={`notes-${v.token}`}
            className="w-full bg-ink-2 border border-line px-4 py-3 rounded-2xl text-xs text-snow focus:outline-none focus:border-flux shadow-inner"
            placeholder="Note libre atelier"
          />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              const stepEl = (document.getElementById(`step-${v.token}`) as HTMLSelectElement).value;
              const servicesEl = (document.getElementById(`services-${v.token}`) as HTMLInputElement).value;
              const dateEl = (document.getElementById(`date-${v.token}`) as HTMLInputElement).value;
              const hourEl = (document.getElementById(`hour-${v.token}`) as HTMLSelectElement).value;
              const minuteEl = (document.getElementById(`minute-${v.token}`) as HTMLSelectElement).value;
              const mileageEl = (document.getElementById(`mileage-${v.token}`) as HTMLInputElement).value;
              const priceEl = (document.getElementById(`price-${v.token}`) as HTMLInputElement).value;
              const notesEl = (document.getElementById(`notes-${v.token}`) as HTMLInputElement).value;
              handleUpdate(v.token, stepEl, notesEl, servicesEl, dateEl, hourEl, minuteEl, mileageEl, priceEl, v.phone, v.client_name, v.vehicle);
            }}
            className="w-full bg-snow text-ink font-display text-sm font-extrabold uppercase py-3.5 rounded-2xl hover:bg-flux transition-all cursor-pointer shadow-md tracking-wider flex items-center justify-center gap-2"
          >
            <span className="text-lg">💾</span>
            <span>Mettre à jour</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handlePrintVehicleTicket(v)}
              className="bg-ink-2 border border-line text-snow font-display text-[11px] font-bold uppercase py-2.5 rounded-2xl hover:border-flux transition-all cursor-pointer tracking-wider flex items-center justify-center gap-1.5"
              title="Imprimer l'ordre de mission atelier"
            >
              <span>🖨️</span>
              <span>Atelier</span>
            </button>
            <button
              onClick={() => handlePrintInvoice(v)}
              className="bg-emerald-600/20 border border-emerald-500/50 text-emerald-300 font-display text-[11px] font-bold uppercase py-2.5 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all cursor-pointer tracking-wider flex items-center justify-center gap-1.5"
              title="Générer la facture client"
            >
              <span>🧾</span>
              <span>Facture</span>
            </button>
          </div>
          
          {v.phone && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => sendWhatsAppMessage(v.phone, v.client_name, v.token, v.vehicle, false, false)}
                className="bg-green-600/15 border border-green-500/40 text-snow font-display text-xs font-bold uppercase py-3 rounded-2xl hover:bg-green-600 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="text-xl">📱</span> <span>Code</span>
              </button>
              <button
                onClick={() => sendWhatsAppMessage(v.phone, v.client_name, v.token, v.vehicle, true, false)}
                className="bg-blue-600/15 border border-blue-500/40 text-snow font-display text-xs font-bold uppercase py-3 rounded-2xl hover:bg-blue-600 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="text-xl">✅</span> <span>Prêt</span>
              </button>
            </div>
          )}

          <button
            onClick={() => handleDelete(v.token)}
            className="w-full bg-red-500/10 border border-red-500/30 text-red-400 font-display text-xs font-bold uppercase py-2.5 rounded-2xl hover:bg-red-500 hover:text-white transition-all cursor-pointer tracking-wider flex items-center justify-center gap-2"
          >
            <span className="text-base">🗑️</span>
            <span>Supprimer</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen pt-[120px] pb-24 px-6 max-w-7xl mx-auto text-snow selection:bg-flux selection:text-ink">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
        <div>
          <span className="text-xs font-mono font-bold text-flux uppercase tracking-widest bg-flux/15 border border-flux/30 px-4 py-1.5 rounded-full">Dashboard Pro XXL</span>
          <h1 className="font-display text-4xl font-black uppercase mt-3 tracking-tight">Gestion des Prestations Client</h1>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {message && (
            <div
              className={`px-5 py-3 rounded-2xl text-sm font-display uppercase tracking-wider shadow-lg border ${
                messageType === "error"
                  ? "bg-red-500/20 border-red-500 text-red-200"
                  : "bg-flux/20 border-flux text-snow"
              }`}
            >
              {message}
            </div>
          )}
          <button
            onClick={() => setShowServicesManager(!showServicesManager)}
            className="bg-flux/20 border border-flux text-flux font-display text-xs font-bold uppercase px-5 py-3 rounded-2xl hover:bg-flux hover:text-ink transition-all cursor-pointer tracking-wider flex items-center gap-2"
          >
            <span>⚙️</span> <span>Gérer mes packs ({presetServicesList.length})</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-panel border border-line text-snow font-display text-xs font-bold uppercase px-5 py-3 rounded-2xl hover:border-flux hover:text-flux transition-all cursor-pointer tracking-wider flex items-center gap-2"
            title="Exporter tous les dossiers en CSV (compta / Excel)"
          >
            <span>📊</span> <span>Export CSV</span>
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-display uppercase px-5 py-3 rounded-2xl hover:bg-red-500 hover:text-white transition-all cursor-pointer tracking-wider"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        <div className="bg-panel/90 border border-flux/30 p-5 rounded-3xl backdrop-blur-md flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] font-mono text-mute uppercase tracking-widest block mb-1">En cours en atelier</span>
            <span className="text-3xl font-display font-black text-flux">{statsTotalActive}</span>
          </div>
          <span className="text-3xl p-3 bg-flux/10 rounded-2xl border border-flux/20">🏎️</span>
        </div>

        <div className="bg-panel/90 border border-emerald-500/30 p-5 rounded-3xl backdrop-blur-md flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] font-mono text-mute uppercase tracking-widest block mb-1">Prêts à récupérer</span>
            <span className="text-3xl font-display font-black text-emerald-400">{statsReady}</span>
          </div>
          <span className="text-3xl p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">✨</span>
        </div>

        <div className="bg-panel/90 border border-line p-5 rounded-3xl backdrop-blur-md flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] font-mono text-mute uppercase tracking-widest block mb-1">Dossiers Archivés</span>
            <span className="text-3xl font-display font-black text-snow">{statsArchived}</span>
          </div>
          <span className="text-3xl p-3 bg-ink-2 rounded-2xl border border-line">📂</span>
        </div>

        <div className="bg-panel/90 border border-emerald-500/30 p-5 rounded-3xl backdrop-blur-md flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] font-mono text-mute uppercase tracking-widest block mb-1">CA Archivé TTC / HT</span>
            <span className="text-lg font-display font-black text-emerald-400 font-mono block">{formatEuro(statsRevenueArchivedTTC)} TTC</span>
            <span className="text-xs font-mono text-mute">{formatEuro(statsRevenueArchivedHT)} HT</span>
          </div>
          <span className="text-3xl p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">💰</span>
        </div>

        <div className="bg-panel/90 border border-line p-5 rounded-3xl backdrop-blur-md flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] font-mono text-mute uppercase tracking-widest block mb-1">Panier Moyen (TTC)</span>
            <span className="text-2xl font-display font-black text-snow font-mono">{formatEuro(statsAvgTicketTTC)}</span>
          </div>
          <span className="text-3xl p-3 bg-ink-2 rounded-2xl border border-line">📈</span>
        </div>
      </div>

      {showServicesManager && (
        <div className="mb-14 border border-flux/50 bg-panel/95 p-8 rounded-3xl shadow-2xl backdrop-blur-xl animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold uppercase text-flux flex items-center gap-3">
              <span>🛠️</span> Configurer les packs de prestations affichés chez le client
            </h2>
            <button
              onClick={() => setShowServicesManager(false)}
              className="text-mute hover:text-snow text-sm font-mono cursor-pointer"
            >
              ✕ Fermer
            </button>
          </div>
          <p className="text-xs text-mute mb-6">
            Définissez ici vos libellés de prestations combinées. Vous pourrez les sélectionner en 1 clic pour chaque véhicule.
          </p>

          <form onSubmit={handleAddPresetService} className="flex flex-col sm:flex-row gap-3 mb-8">
            <input
              type="text"
              placeholder="Nouveau pack (ex: Diagnostic Électronique • Optimisation Moteur)..."
              value={newPresetInput}
              onChange={(e) => setNewPresetInput(e.target.value)}
              className="w-full bg-ink-2 border border-line px-5 py-3 rounded-2xl text-xs text-snow focus:outline-none focus:border-flux shadow-inner"
            />
            <button
              type="submit"
              className="bg-flux text-ink font-display text-xs font-bold uppercase px-6 py-3 rounded-2xl hover:bg-white transition-all cursor-pointer tracking-wider shrink-0"
            >
              Ajouter au catalogue
            </button>
          </form>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-h-80 overflow-y-auto pr-2">
            {presetServicesList.map((preset, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 bg-ink-2 border border-line/70 p-4 rounded-2xl text-xs text-snow shadow-sm">
                <span className="line-clamp-2">{preset}</span>
                <button
                  type="button"
                  onClick={() => handleDeletePresetService(idx)}
                  className="text-red-400 hover:text-red-300 p-1.5 rounded-xl hover:bg-red-500/10 transition-all cursor-pointer shrink-0 font-bold"
                  title="Supprimer ce pack"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-14 border border-flux/40 bg-panel/90 p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <h2 className="font-display text-lg font-bold uppercase text-flux mb-8 flex items-center gap-3 tracking-wide">
          <span className="text-2xl">⚡</span> Enregistrer un nouveau véhicule & ses prestations incluses
        </h2>

        <form onSubmit={handleAddVehicle} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex gap-3">
            <input
              type="text"
              value={newToken}
              onChange={(e) => setNewToken(e.target.value)}
              required
              className="w-full bg-ink-2 border border-flux/60 px-5 py-4 rounded-2xl text-sm text-flux uppercase font-mono font-bold focus:outline-none focus:border-flux shadow-inner"
            />
            <button
              type="button"
              onClick={generateRandomToken}
              className="bg-line px-5 py-4 rounded-2xl text-lg hover:bg-flux hover:text-ink transition-all font-display uppercase cursor-pointer flex items-center justify-center"
              title="Générer un autre code"
            >
              🔄
            </button>
          </div>

          <input
            type="text"
            placeholder="Nom du client (ex: Thomas M.)"
            value={newClient}
            onChange={(e) => setNewClient(e.target.value)}
            className="bg-ink-2 border border-line px-5 py-4 rounded-2xl text-sm text-snow placeholder-mute focus:outline-none focus:border-flux shadow-inner"
          />

          <input
            type="tel"
            placeholder="Téléphone (ex: 0612345678)"
            value={newPhone}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9+]/g, "");
              setNewPhone(raw);
            }}
            className="bg-ink-2 border border-line px-5 py-4 rounded-2xl text-sm text-snow placeholder-mute focus:outline-none focus:border-flux shadow-inner"
          />

          <input
            type="text"
            placeholder="Modèle voiture (ex: Audi S3 Stage 1)"
            value={newVehicle}
            onChange={(e) => setNewVehicle(e.target.value)}
            required
            className="bg-ink-2 border border-line px-5 py-4 rounded-2xl text-sm text-snow placeholder-mute focus:outline-none focus:border-flux shadow-inner"
          />

          <input
            type="text"
            placeholder="Plaque (ex: AB-123-CD)"
            value={newPlate}
            onChange={(e) => setNewPlate(e.target.value)}
            className="bg-ink-2 border border-line px-5 py-4 rounded-2xl text-sm text-snow uppercase placeholder-mute focus:outline-none focus:border-flux shadow-inner"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Kilométrage (ex: 142000 km)"
              value={newMileage}
              onChange={(e) => setNewMileage(e.target.value)}
              className="bg-ink-2 border border-line px-4 py-4 rounded-2xl text-sm text-snow placeholder-mute focus:outline-none focus:border-flux shadow-inner"
            />
            <input
              type="text"
              placeholder="Prix TTC (ex: 450 €)"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="bg-ink-2 border border-emerald-500/50 px-4 py-4 rounded-2xl text-sm text-snow placeholder-mute focus:outline-none focus:border-emerald-400 shadow-inner font-mono font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-3">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="bg-ink-2 border border-line px-4 py-4 rounded-2xl text-sm text-snow focus:outline-none focus:border-flux shadow-inner cursor-pointer"
            />
            <div className="flex items-center gap-1.5 bg-ink-2 border border-line px-3 py-2 rounded-2xl shadow-inner">
              <span className="text-base text-flux font-mono">⌚</span>
              <select
                value={newHour}
                onChange={(e) => setNewHour(e.target.value)}
                className="bg-transparent text-sm font-mono text-snow focus:outline-none cursor-pointer w-full text-center"
              >
                {hours.map((h) => (
                  <option key={h} value={h} className="bg-ink-2 text-snow">{h}h</option>
                ))}
              </select>
              <span className="text-mute">:</span>
              <select
                value={newMinute}
                onChange={(e) => setNewMinute(e.target.value)}
                className="bg-transparent text-sm font-mono text-snow focus:outline-none cursor-pointer w-full text-center"
              >
                {minutes.map((m) => (
                  <option key={m} value={m} className="bg-ink-2 text-snow">{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-3 space-y-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase font-mono text-flux font-bold tracking-wider">⚡ Prestations incluses affichées sur la page client</label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    setNewIncludedServices(e.target.value);
                    e.target.value = "";
                  }
                }}
                className="w-full bg-ink-2 border border-line px-4 py-3 rounded-2xl text-xs text-snow focus:outline-none focus:border-flux cursor-pointer"
              >
                <option value="">⚡ Choisir un pack prédéfini...</option>
                {presetServicesList.map((preset, idx) => (
                  <option key={idx} value={preset} className="bg-ink-2 text-snow">{preset}</option>
                ))}
              </select>
            </div>

            <input
              type="text"
              placeholder="Ex: Diagnostic Électronique • Optimisation Moteur"
              value={newIncludedServices}
              onChange={(e) => setNewIncludedServices(e.target.value)}
              className="w-full bg-ink-2 border border-flux/50 px-5 py-4 rounded-2xl text-sm text-snow font-medium focus:outline-none focus:border-flux shadow-inner"
            />

            <input
              type="text"
              placeholder="Note atelier complémentaire (optionnel)"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full bg-ink-2 border border-line px-5 py-4 rounded-2xl text-sm text-snow placeholder-mute focus:outline-none focus:border-flux mb-6 shadow-inner"
            />

            <button
              type="submit"
              className="w-full bg-flux text-ink font-display text-sm font-extrabold uppercase py-5 rounded-2xl hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-3 tracking-wider shadow-xl"
            >
              <span className="text-xl">⚡</span>
              <span>Créer le dossier & Envoyer le code WhatsApp VIP</span>
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide">
          Véhicules en cours en atelier ({activeVehicles.length})
        </h2>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            <button
              onClick={() => setStepFilter(null)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase cursor-pointer transition-all whitespace-nowrap ${
                stepFilter === null ? "bg-flux text-ink shadow-md" : "bg-panel border border-line text-mute hover:text-snow"
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setStepFilter(1)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase cursor-pointer transition-all whitespace-nowrap ${
                stepFilter === 1 ? "bg-flux text-ink shadow-md" : "bg-panel border border-line text-mute hover:text-snow"
              }`}
            >
              1. Réception
            </button>
            <button
              onClick={() => setStepFilter(2)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase cursor-pointer transition-all whitespace-nowrap ${
                stepFilter === 2 ? "bg-flux text-ink shadow-md" : "bg-panel border border-line text-mute hover:text-snow"
              }`}
            >
              2. Diag
            </button>
            <button
              onClick={() => setStepFilter(3)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase cursor-pointer transition-all whitespace-nowrap ${
                stepFilter === 3 ? "bg-flux text-ink shadow-md" : "bg-panel border border-line text-mute hover:text-snow"
              }`}
            >
              3. Reprog
            </button>
            <button
              onClick={() => setStepFilter(5)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase cursor-pointer transition-all whitespace-nowrap ${
                stepFilter === 5 ? "bg-emerald-500 text-ink shadow-md" : "bg-panel border border-line text-mute hover:text-mute"
              }`}
            >
              5. Prêts
            </button>
          </div>

          <input
            type="text"
            placeholder="Filtrer par nom, modèle, plaque..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full sm:w-72 bg-panel border border-line px-4 py-3 rounded-2xl text-xs text-snow placeholder-mute focus:outline-none focus:border-flux shadow-inner"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-full sm:w-auto bg-panel border border-line px-4 py-3 rounded-2xl text-xs text-snow focus:outline-none focus:border-flux shadow-inner cursor-pointer"
            title="Trier la liste"
          >
            <option value="recent">Tri : Plus récents</option>
            <option value="price_desc">Tri : Prix décroissant</option>
            <option value="price_asc">Tri : Prix croissant</option>
            <option value="client">Tri : Nom du client (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="space-y-6 mb-16">
        {loadingVehicles ? (
          <div className="border border-line bg-panel/50 p-12 rounded-3xl text-center text-mute text-sm tracking-wider uppercase font-mono flex items-center justify-center gap-3">
            <span className="w-4 h-4 border-2 border-flux/30 border-t-flux rounded-full animate-spin inline-block" />
            Chargement des dossiers…
          </div>
        ) : activeVehicles.length === 0 ? (
          <div className="border border-line bg-panel/50 p-12 rounded-3xl text-center text-mute text-sm tracking-wider uppercase font-mono">
            Aucun véhicule ne correspond à vos critères en atelier.
          </div>
        ) : (
          activeVehicles.map(renderVehicleCard)
        )}
      </div>

      <div className="border-t border-line pt-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-xl">📂</span>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wide">
              Archives - Véhicules Récupérés ({archivedVehicles.length})
            </h2>
          </div>
          <button
            onClick={() => setShowArchives(!showArchives)}
            className="bg-panel border border-line px-5 py-3 rounded-xl text-xs font-display uppercase tracking-wider text-flux hover:border-flux transition-all cursor-pointer"
          >
            {showArchives ? "Masquer les archives" : "Afficher les archives"}
          </button>
        </div>

        {showArchives && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-panel/50 border border-line/60 p-4 rounded-2xl">
              <span className="text-xs font-mono text-mute uppercase tracking-wider shrink-0">📅 Filtrer par date :</span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={archiveDateFrom}
                  onChange={(e) => setArchiveDateFrom(e.target.value)}
                  className="bg-ink-2 border border-line px-3 py-2 rounded-xl text-xs text-snow focus:outline-none focus:border-flux"
                />
                <span className="text-mute text-xs">à</span>
                <input
                  type="date"
                  value={archiveDateTo}
                  onChange={(e) => setArchiveDateTo(e.target.value)}
                  className="bg-ink-2 border border-line px-3 py-2 rounded-xl text-xs text-snow focus:outline-none focus:border-flux"
                />
              </div>
              {(archiveDateFrom || archiveDateTo) && (
                <button
                  onClick={() => { setArchiveDateFrom(""); setArchiveDateTo(""); }}
                  className="text-xs text-red-400 hover:text-red-300 font-mono underline cursor-pointer"
                >
                  Réinitialiser
                </button>
              )}
            </div>
            {archivedVehicles.length === 0 ? (
              <div className="border border-line/50 bg-panel/30 p-10 rounded-3xl text-center text-mute text-xs tracking-wider uppercase font-mono">
                Aucune archive pour le moment.
              </div>
            ) : (
              archivedVehicles.map(renderVehicleCard)
            )}
          </div>
        )}
      </div>
    </main>
  );
}