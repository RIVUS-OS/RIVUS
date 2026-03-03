"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function CoreCompanyPostavkePage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("core_settings");
  const writeDisabled = isSafe || isLockdown || isForensic;

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "CORE_COMPANY_SETTINGS_VIEW", entity_type: "core_settings", details: { context: "core_doo_postavke" } });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const companyData = {
    naziv: "RIVUS CORE d.o.o.",
    oib: "12345678901",
    adresa: "Ulica primjer 1, 21000 Split",
    nkd_primary: "66.19.0 — Ostale pomocne djelatnosti u financijskim uslugama",
    nkd_secondary: "64.99.0 — Ostale financijske usluge, osim osiguranja i mirovinskih fondova",
    kontakt_email: "info@rivus.hr",
    kontakt_tel: "+385 21 123 456",
    osnovan: "2025-06-15",
    direktor: "Jurke Maricic",
  };

  const bankAccounts = [
    { naziv: "Ziro racun (EUR)", banka: "PBZ d.d.", iban: "HR12 2340 0091 1234 5678 9", aktivan: true },
    { naziv: "Devizni racun (USD)", banka: "PBZ d.d.", iban: "HR12 2340 0091 1234 5679 0", aktivan: true },
  ];

  const accountingConfig = {
    servis: "MIT Knjigovodstvo",
    kontakt: "info@mit-knjig.hr",
    nda_status: "Aktivan (do 01.07.2026.)",
    dpa_status: "Aktivan (do 01.07.2026.)",
  };

  const fields = [
    { label: "Naziv", value: companyData.naziv },
    { label: "OIB", value: companyData.oib },
    { label: "Adresa", value: companyData.adresa },
    { label: "NKD (primarni)", value: companyData.nkd_primary },
    { label: "NKD (sekundarni)", value: companyData.nkd_secondary },
    { label: "Email", value: companyData.kontakt_email },
    { label: "Telefon", value: companyData.kontakt_tel },
    { label: "Osnovan", value: companyData.osnovan },
    { label: "Direktor", value: companyData.direktor },
  ];

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — izmjene onemogucene.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div>
        <h1 className="text-[22px] font-bold text-black">CORE d.o.o. — Postavke</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Konfiguracija firme, bankovni racuni, knjigovodstvo</p>
      </div>

      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[12px] text-blue-700">NKD sifra mora biti ispravna: 66.19.0 + 64.99.0 za RIVUS CORE. Sensitive changes zahtijevaju confirmation modal + audit log (A1).</div>

      {/* Company Info */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Podaci o firmi</div>
        <div className="divide-y divide-gray-50">
          {fields.map(f => (
            <div key={f.label} className="flex items-center px-4 py-2.5">
              <div className="w-40 text-[12px] text-black/50 font-medium">{f.label}</div>
              <div className="text-[12px] text-black font-medium flex-1">{f.value}</div>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-gray-100">
          <button disabled={writeDisabled} className={`px-4 py-2 rounded-lg text-[13px] font-semibold ${writeDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"}`}>Uredi podatke</button>
        </div>
      </div>

      {/* Bank Accounts */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Bankovni racuni</div>
        <div className="divide-y divide-gray-50">
          {bankAccounts.map(b => (
            <div key={b.iban} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-[13px] font-medium text-black">{b.naziv}</div>
                <div className="text-[11px] text-black/50">{b.banka} | {b.iban}</div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">Aktivan</span>
            </div>
          ))}
        </div>
      </div>

      {/* Accounting Config */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Knjigovodstveni servis</div>
        <div className="divide-y divide-gray-50">
          {[
            { label: "Servis", value: accountingConfig.servis },
            { label: "Kontakt", value: accountingConfig.kontakt },
            { label: "NDA status", value: accountingConfig.nda_status },
            { label: "DPA status", value: accountingConfig.dpa_status },
          ].map(f => (
            <div key={f.label} className="flex items-center px-4 py-2.5">
              <div className="w-40 text-[12px] text-black/50 font-medium">{f.label}</div>
              <div className="text-[12px] text-black font-medium">{f.value}</div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
