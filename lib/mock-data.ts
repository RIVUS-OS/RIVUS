// ============================================================================
// RIVUS OS â€” UNIFIED MOCK DATA LAYER
// lib/mock-data.ts
// Jedan izvor istine za cijeli sustav. Sve stranice importaju odavde.
// ============================================================================

// â”€â”€â”€ TYPES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type Sector = "nekretnine" | "energetika" | "turizam" | "agro" | "infrastruktura" | "tech";

export type SpvPhase =
  | "Kreirano"
  | "CORE pregled"
  | "Vertikale aktivne"
  | "Strukturirano"
  | "Financiranje"
  | "Aktivna gradnja"
  | "ZavrÅ¡eno";

export type SpvStatus = "aktivan" | "blokiran" | "u_izradi" | "na_cekanju" | "zavrsen";

export interface Spv {
  id: string;
  name: string;
  address: string;
  city: string;
  sector: Sector;
  sectorLabel: string;
  phase: SpvPhase;
  status: SpvStatus;
  statusLabel: string;
  oib: string;
  founded: string;
  owner: string;
  accountantId: string | null;
  bankId: string;
  estimatedProfit: number;
  totalBudget: number;
  completionDate: string | null;
  blockReason: string | null;
  units?: number;
  area?: number;
  description: string;
}

export interface Vertical {
  id: string;
  name: string;
  type: string;
  commission: number;
  sectors: Sector[];
  active: boolean;
  statusLabel: string;
  contact: string;
  email: string;
  phone: string;
  ndaSigned: boolean;
  ndaDate: string | null;
  assignedSpvs: string[];
}

export interface Accountant {
  id: string;
  name: string;
  coversEntities: string[];
  coversSpvs: string[];
  pricePerMonth: number;
  contact: string;
  email: string;
  status: string;
  contractDate: string | null;
}

export interface Bank {
  id: string;
  name: string;
  spvs: string[];
  relationshipType: string;
  contact: string;
  status: string;
  evaluationPending: string | null;
}

export interface Invoice {
  id: string;
  number: string;
  type: "izdani" | "primljeni";
  date: string;
  dueDate: string;
  client: string;
  clientId: string;
  spvId: string | null;
  description: string;
  netAmount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  status: "plaÄ‡en" | "Äeka" | "kasni" | "storniran";
  paidDate: string | null;
  category: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  credit: number;
  debit: number;
  balance: number;
  invoiceRef: string | null;
  spvId: string | null;
  category: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  spvId: string;
  assignedTo: string;
  assignedRole: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "otvoren" | "u_tijeku" | "zavrÅ¡en" | "blokiran" | "eskaliran";
  createdDate: string;
  dueDate: string;
  completedDate: string | null;
  category: string;
}

export interface Document {
  id: string;
  name: string;
  type: "mandatory" | "ugovor" | "dozvola" | "elaborat" | "izvjeÅ¡taj" | "certifikat" | "ostalo";
  spvId: string;
  uploadedBy: string;
  uploadDate: string;
  status: "odobren" | "Äeka_pregled" | "odbijen" | "istekao" | "nedostaje";
  version: number;
  fileSize: string;
  mandatory: boolean;
  category: string;
}

export interface Decision {
  id: string;
  title: string;
  spvId: string;
  requestedBy: string;
  decidedBy: string | null;
  status: "odobreno" | "odbijeno" | "na_Äekanju";
  date: string;
  decidedDate: string | null;
  description: string;
  category: string;
}

export interface TokRequest {
  id: string;
  title: string;
  spvId: string;
  requestedBy: string;
  assignedTo: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "otvoren" | "u_tijeku" | "rijeÅ¡en" | "eskaliran" | "zatvoren";
  createdDate: string;
  dueDate: string;
  resolvedDate: string | null;
  slaHours: number;
  slaBreached: boolean;
  category: string;
  description: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  spvId: string | null;
  entityType: string;
  entityId: string;
  details: string;
  category: "lifecycle" | "document" | "approval" | "billing" | "assignment" | "block" | "task" | "tok";
}

export interface Contract {
  id: string;
  number: string;
  type: "CORE-SPV" | "CORE-vertikala" | "CORE-banka" | "CORE-knjigovodja" | "NDA";
  partyA: string;
  partyB: string;
  partyBId: string;
  startDate: string;
  endDate: string;
  services: string;
  monthlyFee: number | null;
  commissionPercent: number | null;
  status: "aktivan" | "istjeÄe" | "istekao" | "u_pripremi";
}

export interface PdvQuarter {
  quarter: string;
  year: number;
  inputVat: number;
  outputVat: number;
  difference: number;
  status: "plaÄ‡eno" | "u_pripremi" | "dospjelo";
  dueDate: string;
}

export interface PnlMonth {
  month: string;
  monthNum: number;
  year: number;
  revenue: number;
  expenses: number;
  net: number;
  margin: number;
  revenueBreakdown: {
    platformFees: number;
    brandLicence: number;
    pmServices: number;
    successFees: number;
    verticalCommissions: number;
  };
}

// â”€â”€â”€ SECTORS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const SECTORS: Record<Sector, { label: string; icon: string; color: string }> = {
  nekretnine: { label: "Nekretnine", icon: "ðŸ—ï¸", color: "blue" },
  energetika: { label: "Energetika", icon: "âš¡", color: "yellow" },
  turizam: { label: "Turizam", icon: "ðŸ¨", color: "teal" },
  agro: { label: "Agro", icon: "ðŸŒ¾", color: "green" },
  infrastruktura: { label: "Infrastruktura", icon: "ðŸ­", color: "gray" },
  tech: { label: "Tech", icon: "ðŸ’»", color: "purple" },
};

// â”€â”€â”€ SPV-ovi (10) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const SPVS: Spv[] = [
  {
    id: "SAN-01",
    name: "Å andora Petefija 4",
    address: "Å andora Petefija 4",
    city: "Subotica",
    sector: "nekretnine",
    sectorLabel: "ðŸ—ï¸ Nekretnine",
    phase: "Aktivna gradnja",
    status: "aktivan",
    statusLabel: "Aktivan",
    oib: "12345678901",
    founded: "15.03.2025.",
    owner: "Jurke MariÄiÄ‡",
    accountantId: "ACC-01",
    bankId: "BANK-01",
    estimatedProfit: 65000,
    totalBudget: 280000,
    completionDate: "30.09.2026.",
    blockReason: null,
    units: 4,
    area: 320,
    description: "Stambena zgrada, 4 jedinice, centar grada",
  },
  {
    id: "SAN-02",
    name: "Vukovarska 12",
    address: "Vukovarska 12",
    city: "Osijek",
    sector: "nekretnine",
    sectorLabel: "ðŸ—ï¸ Nekretnine",
    phase: "Strukturirano",
    status: "aktivan",
    statusLabel: "Aktivan",
    oib: "23456789012",
    founded: "01.06.2025.",
    owner: "Jurke MariÄiÄ‡",
    accountantId: "ACC-01",
    bankId: "BANK-01",
    estimatedProfit: 45000,
    totalBudget: 190000,
    completionDate: "15.03.2027.",
    blockReason: null,
    units: 6,
    area: 480,
    description: "Stambeno-poslovni objekt, 6 jedinica",
  },
  {
    id: "SOL-01",
    name: "Solarna Baranja",
    address: "Industrijska zona bb",
    city: "Beli Manastir",
    sector: "energetika",
    sectorLabel: "âš¡ Energetika",
    phase: "Financiranje",
    status: "blokiran",
    statusLabel: "Blokiran",
    oib: "34567890123",
    founded: "10.09.2025.",
    owner: "Jurke MariÄiÄ‡",
    accountantId: "ACC-02",
    bankId: "BANK-02",
    estimatedProfit: 120000,
    totalBudget: 450000,
    completionDate: "01.06.2027.",
    blockReason: "Nedostaje elaborat zaÅ¡tite okoliÅ¡a â€” mandatory dokument za fazu Financiranje",
    units: undefined,
    area: 5000,
    description: "Solarna elektrana 500kW, na poljoprivrednom zemljiÅ¡tu",
  },
  {
    id: "TUR-01",
    name: "Vila Maestral",
    address: "Obala 22",
    city: "Makarska",
    sector: "turizam",
    sectorLabel: "ðŸ¨ Turizam",
    phase: "CORE pregled",
    status: "u_izradi",
    statusLabel: "U izradi",
    oib: "45678901234",
    founded: "20.11.2025.",
    owner: "Jurke MariÄiÄ‡",
    accountantId: "ACC-04",
    bankId: "BANK-03",
    estimatedProfit: 95000,
    totalBudget: 380000,
    completionDate: null,
    blockReason: null,
    units: 8,
    area: 420,
    description: "Boutique apartmani, 8 jedinica, 50m od mora",
  },
  {
    id: "AGR-01",
    name: "Slavonska farma",
    address: "Ruralna cesta 5",
    city: "Äakovo",
    sector: "agro",
    sectorLabel: "ðŸŒ¾ Agro",
    phase: "Kreirano",
    status: "na_cekanju",
    statusLabel: "Na Äekanju",
    oib: "56789012345",
    founded: "05.01.2026.",
    owner: "Jurke MariÄiÄ‡",
    accountantId: null,
    bankId: "BANK-01",
    estimatedProfit: 35000,
    totalBudget: 120000,
    completionDate: null,
    blockReason: null,
    area: 15000,
    description: "OPG projekt â€” uzgoj lavande i preraÄ‘ivaÄka linija",
  },
  {
    id: "SAN-03",
    name: "Strossmayerova 15",
    address: "Strossmayerova 15",
    city: "Osijek",
    sector: "nekretnine",
    sectorLabel: "ðŸ—ï¸ Nekretnine",
    phase: "ZavrÅ¡eno",
    status: "zavrsen",
    statusLabel: "ZavrÅ¡en",
    oib: "67890123456",
    founded: "01.02.2024.",
    owner: "Jurke MariÄiÄ‡",
    accountantId: "ACC-01",
    bankId: "BANK-01",
    estimatedProfit: 52000,
    totalBudget: 210000,
    completionDate: "15.11.2025.",
    blockReason: null,
    units: 3,
    area: 240,
    description: "ZavrÅ¡en projekt â€” 3 stana, sve prodano",
  },
  {
    id: "TUR-02",
    name: "Glamping Plitvice",
    address: "Jezera bb",
    city: "PlitviÄka Jezera",
    sector: "turizam",
    sectorLabel: "ðŸ¨ Turizam",
    phase: "ZavrÅ¡eno",
    status: "zavrsen",
    statusLabel: "ZavrÅ¡en",
    oib: "78901234567",
    founded: "15.04.2024.",
    owner: "Jurke MariÄiÄ‡",
    accountantId: "ACC-04",
    bankId: "BANK-03",
    estimatedProfit: 78000,
    totalBudget: 290000,
    completionDate: "01.10.2025.",
    blockReason: null,
    units: 12,
    area: 2000,
    description: "Glamping resort â€” 12 jedinica, sezona 2025. uspjeÅ¡na",
  },
  {
    id: "INF-01",
    name: "LogistiÄki centar OS",
    address: "Gospodarska zona 3",
    city: "Osijek",
    sector: "infrastruktura",
    sectorLabel: "ðŸ­ Infrastruktura",
    phase: "Vertikale aktivne",
    status: "aktivan",
    statusLabel: "Aktivan",
    oib: "89012345678",
    founded: "01.07.2025.",
    owner: "Jurke MariÄiÄ‡",
    accountantId: "ACC-02",
    bankId: "BANK-02",
    estimatedProfit: 180000,
    totalBudget: 750000,
    completionDate: "01.12.2027.",
    blockReason: null,
    area: 8000,
    description: "LogistiÄko-distribucijski centar, 8.000mÂ²",
  },
  {
    id: "SOL-02",
    name: "EV Hub Osijek",
    address: "TehnoloÅ¡ki park 1",
    city: "Osijek",
    sector: "energetika",
    sectorLabel: "âš¡ Energetika",
    phase: "Kreirano",
    status: "na_cekanju",
    statusLabel: "Na Äekanju",
    oib: "90123456789",
    founded: "10.02.2026.",
    owner: "Jurke MariÄiÄ‡",
    accountantId: null,
    bankId: "BANK-02",
    estimatedProfit: 40000,
    totalBudget: 160000,
    completionDate: null,
    blockReason: null,
    description: "MreÅ¾a EV punjaÄa â€” 6 lokacija u Osijeku. Nema dodijeljenog knjigovoÄ‘u.",
  },
  {
    id: "TEC-01",
    name: "Smart Building OS",
    address: "IT Park 7",
    city: "Osijek",
    sector: "tech",
    sectorLabel: "ðŸ’» Tech",
    phase: "CORE pregled",
    status: "u_izradi",
    statusLabel: "U izradi",
    oib: "01234567890",
    founded: "01.12.2025.",
    owner: "Jurke MariÄiÄ‡",
    accountantId: "ACC-02",
    bankId: "BANK-02",
    estimatedProfit: 55000,
    totalBudget: 200000,
    completionDate: null,
    blockReason: null,
    description: "IoT sustav za upravljanje zgradama â€” pilot projekt",
  },
];

// â”€â”€â”€ VERTIKALE (12) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const VERTICALS: Vertical[] = [
  {
    id: "VER-01", name: "Arhitekt Studio d.o.o.", type: "Projektiranje", commission: 8,
    sectors: ["nekretnine", "turizam"], active: true, statusLabel: "Aktivan",
    contact: "Marko Horvat", email: "marko@arhitektstudio.hr", phone: "+385 91 111 1111",
    ndaSigned: true, ndaDate: "01.02.2026.", assignedSpvs: ["SAN-01", "SAN-02", "TUR-02", "SAN-03"],
  },
  {
    id: "VER-02", name: "Geodet Plus d.o.o.", type: "Geodezija", commission: 10,
    sectors: ["nekretnine", "infrastruktura"], active: true, statusLabel: "Aktivan",
    contact: "Ivan KovaÄeviÄ‡", email: "ivan@geodetplus.hr", phone: "+385 91 222 2222",
    ndaSigned: true, ndaDate: "10.01.2026.", assignedSpvs: ["SAN-01", "SAN-02", "INF-01", "SAN-03"],
  },
  {
    id: "VER-03", name: "Pravo & Savjet d.o.o.", type: "Pravni", commission: 12,
    sectors: ["nekretnine", "energetika", "turizam", "agro", "infrastruktura", "tech"], active: true, statusLabel: "Aktivan",
    contact: "Ana JuriÄ‡", email: "ana@pravoIsavjet.hr", phone: "+385 91 333 3333",
    ndaSigned: true, ndaDate: "15.12.2025.", assignedSpvs: ["SAN-01", "SAN-02", "SOL-01", "TUR-01", "INF-01", "TEC-01"],
  },
  {
    id: "VER-04", name: "Statika Pro d.o.o.", type: "Konstrukcije", commission: 8,
    sectors: ["nekretnine", "infrastruktura"], active: true, statusLabel: "Aktivan",
    contact: "Petar BabiÄ‡", email: "petar@statikapro.hr", phone: "+385 91 444 4444",
    ndaSigned: true, ndaDate: "01.03.2025.", assignedSpvs: ["SAN-01", "SAN-03", "INF-01"],
  },
  {
    id: "VER-05", name: "GreenEnergy Consult", type: "Energetski certifikati", commission: 10,
    sectors: ["energetika", "nekretnine"], active: true, statusLabel: "Aktivan",
    contact: "Luka Å imiÄ‡", email: "luka@greenenergy.hr", phone: "+385 91 555 5555",
    ndaSigned: true, ndaDate: "20.01.2026.", assignedSpvs: ["SOL-01", "SOL-02", "SAN-01"],
  },
  {
    id: "VER-06", name: "Agro Savjetovanje d.o.o.", type: "Agronomija", commission: 10,
    sectors: ["agro"], active: true, statusLabel: "Aktivan",
    contact: "Tomislav MatiÄ‡", email: "tomi@agrosavjet.hr", phone: "+385 91 666 6666",
    ndaSigned: true, ndaDate: "10.02.2026.", assignedSpvs: ["AGR-01"],
  },
  {
    id: "VER-07", name: "TuristPlan d.o.o.", type: "Turizam konzalting", commission: 8,
    sectors: ["turizam"], active: false, statusLabel: "NDA potpisan",
    contact: "Maja PeriÄ‡", email: "maja@turistplan.hr", phone: "+385 91 777 7777",
    ndaSigned: true, ndaDate: "01.02.2026.", assignedSpvs: [],
  },
  {
    id: "VER-08", name: "BuildControl d.o.o.", type: "Nadzor gradnje", commission: 8,
    sectors: ["nekretnine", "infrastruktura"], active: true, statusLabel: "Aktivan",
    contact: "DraÅ¾en KneÅ¾eviÄ‡", email: "drazen@buildcontrol.hr", phone: "+385 91 888 8888",
    ndaSigned: true, ndaDate: "01.04.2025.", assignedSpvs: ["SAN-01", "SAN-03", "TUR-02"],
  },
  {
    id: "VER-09", name: "Digital Systems d.o.o.", type: "IoT / Smart sustavi", commission: 12,
    sectors: ["tech", "energetika"], active: false, statusLabel: "NDA potpisan",
    contact: "Filip Rade", email: "filip@digitalsys.hr", phone: "+385 91 999 9999",
    ndaSigned: true, ndaDate: "15.01.2026.", assignedSpvs: [],
  },
  {
    id: "VER-10", name: "EcoPermit d.o.o.", type: "OkoliÅ¡ne dozvole", commission: 10,
    sectors: ["energetika", "agro", "infrastruktura"], active: true, statusLabel: "Aktivan",
    contact: "Sara VukoviÄ‡", email: "sara@ecopermit.hr", phone: "+385 91 100 1001",
    ndaSigned: true, ndaDate: "05.01.2026.", assignedSpvs: ["SOL-01", "AGR-01", "INF-01"],
  },
  {
    id: "VER-11", name: "FinanceAdvisors d.o.o.", type: "Financijsko savjetovanje", commission: 12,
    sectors: ["nekretnine", "energetika", "turizam", "agro", "infrastruktura", "tech"], active: true, statusLabel: "Aktivan",
    contact: "Robert IliÄ‡", email: "robert@finadvisors.hr", phone: "+385 91 100 1002",
    ndaSigned: true, ndaDate: "01.01.2026.", assignedSpvs: ["SAN-01", "SOL-01", "INF-01", "TEC-01"],
  },
  {
    id: "VER-12", name: "MarketingPro d.o.o.", type: "Prodaja / marketing", commission: 8,
    sectors: ["nekretnine", "turizam"], active: false, statusLabel: "Pregovori",
    contact: "Nina ÄuriÄ‡", email: "nina@marketingpro.hr", phone: "+385 91 100 1003",
    ndaSigned: false, ndaDate: null, assignedSpvs: [],
  },
];

// â”€â”€â”€ KNJIGOVOÄE (4) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const ACCOUNTANTS: Accountant[] = [
  {
    id: "ACC-01", name: "RaÄunovodstvo Sigma d.o.o.",
    coversEntities: ["CORE d.o.o.", "RIVUS Holding d.o.o."],
    coversSpvs: ["SAN-01", "SAN-02", "SAN-03"],
    pricePerMonth: 350, contact: "Ivana Novak", email: "ivana@sigma-rn.hr",
    status: "aktivan", contractDate: "01.01.2026.",
  },
  {
    id: "ACC-02", name: "Financa Plus d.o.o.",
    coversEntities: [],
    coversSpvs: ["SOL-01", "INF-01", "TEC-01"],
    pricePerMonth: 250, contact: "Mirela TadiÄ‡", email: "mirela@financaplus.hr",
    status: "aktivan", contractDate: "01.10.2025.",
  },
  {
    id: "ACC-03", name: "OPG Knjige d.o.o.",
    coversEntities: [],
    coversSpvs: [],
    pricePerMonth: 150, contact: "Josip BariÄ‡", email: "josip@opgknjige.hr",
    status: "ugovor_u_pripremi", contractDate: null,
  },
  {
    id: "ACC-04", name: "TuristBooks d.o.o.",
    coversEntities: [],
    coversSpvs: ["TUR-01", "TUR-02"],
    pricePerMonth: 200, contact: "Lana PetroviÄ‡", email: "lana@turistbooks.hr",
    status: "aktivan", contractDate: "15.04.2024.",
  },
];

// â”€â”€â”€ BANKE (3) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const BANKS: Bank[] = [
  {
    id: "BANK-01", name: "PBZ",
    spvs: ["SAN-01", "SAN-02", "SAN-03", "AGR-01"],
    relationshipType: "Kredit + Å¾iro",
    contact: "Mario Novak", status: "aktivan", evaluationPending: null,
  },
  {
    id: "BANK-02", name: "Erste",
    spvs: ["SOL-01", "INF-01", "SOL-02", "TEC-01"],
    relationshipType: "Kredit + Å¾iro",
    contact: "Katarina Å imuniÄ‡", status: "aktivan", evaluationPending: null,
  },
  {
    id: "BANK-03", name: "OTP",
    spvs: ["TUR-01", "TUR-02"],
    relationshipType: "Å½iro + kredit evaluacija",
    contact: "Denis Miler", status: "aktivan", evaluationPending: "TUR-01",
  },
];

// â”€â”€â”€ IZDANI RAÄŒUNI (30) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const ISSUED_INVOICES: Invoice[] = [
  // SAN-01 â€” Aktivan, gradnja
  { id: "II-01", number: "IR-2026-001", type: "izdani", date: "15.02.2026.", dueDate: "01.03.2026.", client: "SPV SAN-01", clientId: "SAN-01", spvId: "SAN-01", description: "Platform fee â€” veljaÄa 2026.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaÄ‡en", paidDate: "18.02.2026.", category: "platform_fee" },
  { id: "II-02", number: "IR-2026-002", type: "izdani", date: "15.02.2026.", dueDate: "01.03.2026.", client: "SPV SAN-01", clientId: "SAN-01", spvId: "SAN-01", description: "Brand licenca â€” veljaÄa 2026.", netAmount: 160, vatRate: 25, vatAmount: 40, totalAmount: 200, status: "plaÄ‡en", paidDate: "18.02.2026.", category: "brand_licence" },
  { id: "II-03", number: "IR-2026-003", type: "izdani", date: "05.02.2026.", dueDate: "20.02.2026.", client: "SPV SAN-01", clientId: "SAN-01", spvId: "SAN-01", description: "PM usluga â€” veljaÄa 2026.", netAmount: 2000, vatRate: 25, vatAmount: 500, totalAmount: 2500, status: "kasni", paidDate: null, category: "pm_service" },
  { id: "II-04", number: "IR-2026-004", type: "izdani", date: "15.01.2026.", dueDate: "31.01.2026.", client: "SPV SAN-01", clientId: "SAN-01", spvId: "SAN-01", description: "Platform fee â€” sijeÄanj 2026.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaÄ‡en", paidDate: "28.01.2026.", category: "platform_fee" },
  { id: "II-05", number: "IR-2026-005", type: "izdani", date: "15.01.2026.", dueDate: "31.01.2026.", client: "SPV SAN-01", clientId: "SAN-01", spvId: "SAN-01", description: "Brand licenca â€” sijeÄanj 2026.", netAmount: 160, vatRate: 25, vatAmount: 40, totalAmount: 200, status: "plaÄ‡en", paidDate: "25.01.2026.", category: "brand_licence" },

  // SAN-02 â€” Aktivan, strukturirano
  { id: "II-06", number: "IR-2026-006", type: "izdani", date: "15.02.2026.", dueDate: "01.03.2026.", client: "SPV SAN-02", clientId: "SAN-02", spvId: "SAN-02", description: "Platform fee â€” veljaÄa 2026.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaÄ‡en", paidDate: "20.02.2026.", category: "platform_fee" },
  { id: "II-07", number: "IR-2026-007", type: "izdani", date: "15.02.2026.", dueDate: "01.03.2026.", client: "SPV SAN-02", clientId: "SAN-02", spvId: "SAN-02", description: "Brand licenca â€” veljaÄa 2026.", netAmount: 160, vatRate: 25, vatAmount: 40, totalAmount: 200, status: "Äeka", paidDate: null, category: "brand_licence" },
  { id: "II-08", number: "IR-2026-008", type: "izdani", date: "15.01.2026.", dueDate: "31.01.2026.", client: "SPV SAN-02", clientId: "SAN-02", spvId: "SAN-02", description: "Platform fee â€” sijeÄanj 2026.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaÄ‡en", paidDate: "29.01.2026.", category: "platform_fee" },

  // SOL-01 â€” Blokiran
  { id: "II-09", number: "IR-2026-009", type: "izdani", date: "15.02.2026.", dueDate: "01.03.2026.", client: "SPV SOL-01", clientId: "SOL-01", spvId: "SOL-01", description: "Platform fee â€” veljaÄa 2026.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "Äeka", paidDate: null, category: "platform_fee" },
  { id: "II-10", number: "IR-2026-010", type: "izdani", date: "10.01.2026.", dueDate: "25.01.2026.", client: "SPV SOL-01", clientId: "SOL-01", spvId: "SOL-01", description: "Platform fee â€” sijeÄanj 2026.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "kasni", paidDate: null, category: "platform_fee" },

  // TUR-01 â€” U izradi
  { id: "II-11", number: "IR-2026-011", type: "izdani", date: "01.02.2026.", dueDate: "15.02.2026.", client: "SPV TUR-01", clientId: "TUR-01", spvId: "TUR-01", description: "CORE pregled â€” inicijalna analiza", netAmount: 800, vatRate: 25, vatAmount: 200, totalAmount: 1000, status: "plaÄ‡en", paidDate: "14.02.2026.", category: "pm_service" },

  // INF-01 â€” Aktivan
  { id: "II-12", number: "IR-2026-012", type: "izdani", date: "15.02.2026.", dueDate: "01.03.2026.", client: "SPV INF-01", clientId: "INF-01", spvId: "INF-01", description: "Platform fee â€” veljaÄa 2026.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaÄ‡en", paidDate: "19.02.2026.", category: "platform_fee" },
  { id: "II-13", number: "IR-2026-013", type: "izdani", date: "15.02.2026.", dueDate: "01.03.2026.", client: "SPV INF-01", clientId: "INF-01", spvId: "INF-01", description: "Brand licenca â€” veljaÄa 2026.", netAmount: 160, vatRate: 25, vatAmount: 40, totalAmount: 200, status: "Äeka", paidDate: null, category: "brand_licence" },
  { id: "II-14", number: "IR-2026-014", type: "izdani", date: "15.01.2026.", dueDate: "31.01.2026.", client: "SPV INF-01", clientId: "INF-01", spvId: "INF-01", description: "Platform fee â€” sijeÄanj 2026.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaÄ‡en", paidDate: "30.01.2026.", category: "platform_fee" },

  // Vertikala provizije
  { id: "II-15", number: "IR-2026-015", type: "izdani", date: "10.02.2026.", dueDate: "25.02.2026.", client: "Arhitekt Studio d.o.o.", clientId: "VER-01", spvId: "SAN-01", description: "Provizija 8% â€” projektiranje SAN-01", netAmount: 960, vatRate: 25, vatAmount: 240, totalAmount: 1200, status: "plaÄ‡en", paidDate: "22.02.2026.", category: "vertical_commission" },
  { id: "II-16", number: "IR-2026-016", type: "izdani", date: "10.02.2026.", dueDate: "25.02.2026.", client: "Geodet Plus d.o.o.", clientId: "VER-02", spvId: "SAN-01", description: "Provizija 10% â€” geodezija SAN-01", netAmount: 680, vatRate: 25, vatAmount: 170, totalAmount: 850, status: "plaÄ‡en", paidDate: "24.02.2026.", category: "vertical_commission" },
  { id: "II-17", number: "IR-2026-017", type: "izdani", date: "20.01.2026.", dueDate: "05.02.2026.", client: "Arhitekt Studio d.o.o.", clientId: "VER-01", spvId: "SAN-02", description: "Provizija 8% â€” projektiranje SAN-02", netAmount: 760, vatRate: 25, vatAmount: 190, totalAmount: 950, status: "kasni", paidDate: null, category: "vertical_commission" },

  // TUR-02 â€” ZavrÅ¡en (success fee!)
  { id: "II-18", number: "IR-2025-048", type: "izdani", date: "15.11.2025.", dueDate: "30.11.2025.", client: "SPV TUR-02", clientId: "TUR-02", spvId: "TUR-02", description: "Success fee â€” 10% neto profita", netAmount: 6240, vatRate: 25, vatAmount: 1560, totalAmount: 7800, status: "plaÄ‡en", paidDate: "28.11.2025.", category: "success_fee" },
  { id: "II-19", number: "IR-2025-042", type: "izdani", date: "01.10.2025.", dueDate: "15.10.2025.", client: "SPV TUR-02", clientId: "TUR-02", spvId: "TUR-02", description: "Platform fee â€” zavrÅ¡ni mjesec", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaÄ‡en", paidDate: "12.10.2025.", category: "platform_fee" },

  // SAN-03 â€” ZavrÅ¡en (success fee!)
  { id: "II-20", number: "IR-2025-038", type: "izdani", date: "20.11.2025.", dueDate: "05.12.2025.", client: "SPV SAN-03", clientId: "SAN-03", spvId: "SAN-03", description: "Success fee â€” 10% neto profita", netAmount: 4160, vatRate: 25, vatAmount: 1040, totalAmount: 5200, status: "plaÄ‡en", paidDate: "03.12.2025.", category: "success_fee" },

  // Stariji raÄuni za historiju (2025)
  { id: "II-21", number: "IR-2025-030", type: "izdani", date: "15.10.2025.", dueDate: "31.10.2025.", client: "SPV SAN-01", clientId: "SAN-01", spvId: "SAN-01", description: "Platform fee â€” listopad 2025.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaÄ‡en", paidDate: "28.10.2025.", category: "platform_fee" },
  { id: "II-22", number: "IR-2025-031", type: "izdani", date: "15.11.2025.", dueDate: "30.11.2025.", client: "SPV SAN-01", clientId: "SAN-01", spvId: "SAN-01", description: "Platform fee â€” studeni 2025.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaÄ‡en", paidDate: "27.11.2025.", category: "platform_fee" },
  { id: "II-23", number: "IR-2025-032", type: "izdani", date: "15.12.2025.", dueDate: "31.12.2025.", client: "SPV SAN-01", clientId: "SAN-01", spvId: "SAN-01", description: "Platform fee â€” prosinac 2025.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaÄ‡en", paidDate: "29.12.2025.", category: "platform_fee" },
  { id: "II-24", number: "IR-2025-033", type: "izdani", date: "15.09.2025.", dueDate: "30.09.2025.", client: "SPV SAN-03", clientId: "SAN-03", spvId: "SAN-03", description: "Platform fee â€” rujan 2025.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaÄ‡en", paidDate: "25.09.2025.", category: "platform_fee" },

  // Stornirani
  { id: "II-25", number: "IR-2025-035", type: "izdani", date: "01.10.2025.", dueDate: "15.10.2025.", client: "SPV SAN-02", clientId: "SAN-02", spvId: "SAN-02", description: "Dupli raÄun â€” stornirano", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "storniran", paidDate: null, category: "platform_fee" },

  // TEC-01 â€” U izradi
  { id: "II-26", number: "IR-2026-018", type: "izdani", date: "01.02.2026.", dueDate: "15.02.2026.", client: "SPV TEC-01", clientId: "TEC-01", spvId: "TEC-01", description: "CORE pregled â€” inicijalna analiza", netAmount: 800, vatRate: 25, vatAmount: 200, totalAmount: 1000, status: "plaÄ‡en", paidDate: "13.02.2026.", category: "pm_service" },

  // Dodatni vertikala raÄuni
  { id: "II-27", number: "IR-2026-019", type: "izdani", date: "05.02.2026.", dueDate: "20.02.2026.", client: "BuildControl d.o.o.", clientId: "VER-08", spvId: "SAN-01", description: "Provizija 8% â€” nadzor gradnje SAN-01", netAmount: 1440, vatRate: 25, vatAmount: 360, totalAmount: 1800, status: "plaÄ‡en", paidDate: "19.02.2026.", category: "vertical_commission" },
  { id: "II-28", number: "IR-2026-020", type: "izdani", date: "08.02.2026.", dueDate: "23.02.2026.", client: "EcoPermit d.o.o.", clientId: "VER-10", spvId: "SOL-01", description: "Provizija 10% â€” okoliÅ¡na dozvola SOL-01", netAmount: 480, vatRate: 25, vatAmount: 120, totalAmount: 600, status: "Äeka", paidDate: null, category: "vertical_commission" },
  { id: "II-29", number: "IR-2026-021", type: "izdani", date: "12.02.2026.", dueDate: "27.02.2026.", client: "Pravo & Savjet d.o.o.", clientId: "VER-03", spvId: "INF-01", description: "Provizija 12% â€” pravne usluge INF-01", netAmount: 1200, vatRate: 25, vatAmount: 300, totalAmount: 1500, status: "Äeka", paidDate: null, category: "vertical_commission" },
  { id: "II-30", number: "IR-2025-045", type: "izdani", date: "01.12.2025.", dueDate: "15.12.2025.", client: "BuildControl d.o.o.", clientId: "VER-08", spvId: "TUR-02", description: "Provizija 8% â€” nadzor TUR-02 finalni", netAmount: 2000, vatRate: 25, vatAmount: 500, totalAmount: 2500, status: "plaÄ‡en", paidDate: "14.12.2025.", category: "vertical_commission" },
];

// â”€â”€â”€ PRIMLJENI RAÄŒUNI (20) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const RECEIVED_INVOICES: Invoice[] = [
  { id: "RI-01", number: "UR-2026-001", type: "primljeni", date: "18.02.2026.", dueDate: "05.03.2026.", client: "Pravo & Savjet d.o.o.", clientId: "VER-03", spvId: null, description: "Pravna usluga â€” NKD analiza", netAmount: 600, vatRate: 25, vatAmount: 150, totalAmount: 750, status: "plaÄ‡en", paidDate: "20.02.2026.", category: "pravni" },
  { id: "RI-02", number: "UR-2026-002", type: "primljeni", date: "12.02.2026.", dueDate: "28.02.2026.", client: "Vercel Inc.", clientId: "EXT-01", spvId: null, description: "Hosting â€” veljaÄa 2026.", netAmount: 20, vatRate: 0, vatAmount: 0, totalAmount: 20, status: "plaÄ‡en", paidDate: "12.02.2026.", category: "it" },
  { id: "RI-03", number: "UR-2026-003", type: "primljeni", date: "10.02.2026.", dueDate: "25.02.2026.", client: "Supabase Inc.", clientId: "EXT-02", spvId: null, description: "Pro plan â€” veljaÄa 2026.", netAmount: 25, vatRate: 0, vatAmount: 0, totalAmount: 25, status: "plaÄ‡en", paidDate: "10.02.2026.", category: "it" },
  { id: "RI-04", number: "UR-2026-004", type: "primljeni", date: "05.02.2026.", dueDate: "20.02.2026.", client: "Geodet Plus d.o.o.", clientId: "VER-02", spvId: "SAN-01", description: "Geodetski elaborat â€” SAN-01", netAmount: 2800, vatRate: 25, vatAmount: 700, totalAmount: 3500, status: "plaÄ‡en", paidDate: "18.02.2026.", category: "geodezija" },
  { id: "RI-05", number: "UR-2026-005", type: "primljeni", date: "01.02.2026.", dueDate: "15.02.2026.", client: "Statika Pro d.o.o.", clientId: "VER-04", spvId: "SAN-01", description: "StatiÄki proraÄun â€” SAN-01", netAmount: 3200, vatRate: 25, vatAmount: 800, totalAmount: 4000, status: "plaÄ‡en", paidDate: "14.02.2026.", category: "konstrukcije" },
  { id: "RI-06", number: "UR-2026-006", type: "primljeni", date: "20.01.2026.", dueDate: "05.02.2026.", client: "Arhitekt Studio d.o.o.", clientId: "VER-01", spvId: "SAN-01", description: "Idejni projekt â€” SAN-01", netAmount: 4800, vatRate: 25, vatAmount: 1200, totalAmount: 6000, status: "plaÄ‡en", paidDate: "03.02.2026.", category: "projektiranje" },
  { id: "RI-07", number: "UR-2026-007", type: "primljeni", date: "15.02.2026.", dueDate: "01.03.2026.", client: "RaÄunovodstvo Sigma d.o.o.", clientId: "ACC-01", spvId: null, description: "Knjigovodstvo â€” veljaÄa 2026.", netAmount: 280, vatRate: 25, vatAmount: 70, totalAmount: 350, status: "Äeka", paidDate: null, category: "knjigovodstvo" },
  { id: "RI-08", number: "UR-2026-008", type: "primljeni", date: "15.02.2026.", dueDate: "01.03.2026.", client: "Financa Plus d.o.o.", clientId: "ACC-02", spvId: null, description: "Knjigovodstvo â€” veljaÄa 2026.", netAmount: 200, vatRate: 25, vatAmount: 50, totalAmount: 250, status: "Äeka", paidDate: null, category: "knjigovodstvo" },
  { id: "RI-09", number: "UR-2026-009", type: "primljeni", date: "15.02.2026.", dueDate: "01.03.2026.", client: "TuristBooks d.o.o.", clientId: "ACC-04", spvId: null, description: "Knjigovodstvo â€” veljaÄa 2026.", netAmount: 160, vatRate: 25, vatAmount: 40, totalAmount: 200, status: "Äeka", paidDate: null, category: "knjigovodstvo" },
  { id: "RI-10", number: "UR-2026-010", type: "primljeni", date: "08.02.2026.", dueDate: "23.02.2026.", client: "EcoPermit d.o.o.", clientId: "VER-10", spvId: "SOL-01", description: "Elaborat okoliÅ¡a â€” SOL-01 (nedovrÅ¡en)", netAmount: 3200, vatRate: 25, vatAmount: 800, totalAmount: 4000, status: "Äeka", paidDate: null, category: "okoliÅ¡" },
  { id: "RI-11", number: "UR-2026-011", type: "primljeni", date: "01.02.2026.", dueDate: "15.02.2026.", client: "BuildControl d.o.o.", clientId: "VER-08", spvId: "SAN-01", description: "Nadzor gradnje â€” veljaÄa 2026.", netAmount: 2400, vatRate: 25, vatAmount: 600, totalAmount: 3000, status: "plaÄ‡en", paidDate: "14.02.2026.", category: "nadzor" },
  { id: "RI-12", number: "UR-2025-080", type: "primljeni", date: "15.12.2025.", dueDate: "31.12.2025.", client: "RaÄunovodstvo Sigma d.o.o.", clientId: "ACC-01", spvId: null, description: "Knjigovodstvo â€” prosinac 2025.", netAmount: 280, vatRate: 25, vatAmount: 70, totalAmount: 350, status: "plaÄ‡en", paidDate: "28.12.2025.", category: "knjigovodstvo" },
  { id: "RI-13", number: "UR-2025-075", type: "primljeni", date: "01.11.2025.", dueDate: "15.11.2025.", client: "Arhitekt Studio d.o.o.", clientId: "VER-01", spvId: "SAN-02", description: "Idejni projekt â€” SAN-02", netAmount: 3800, vatRate: 25, vatAmount: 950, totalAmount: 4750, status: "plaÄ‡en", paidDate: "14.11.2025.", category: "projektiranje" },
  { id: "RI-14", number: "UR-2025-070", type: "primljeni", date: "15.10.2025.", dueDate: "31.10.2025.", client: "GreenEnergy Consult", clientId: "VER-05", spvId: "SOL-01", description: "Energetski audit â€” SOL-01", netAmount: 2400, vatRate: 25, vatAmount: 600, totalAmount: 3000, status: "plaÄ‡en", paidDate: "29.10.2025.", category: "energetika" },
  { id: "RI-15", number: "UR-2025-065", type: "primljeni", date: "01.10.2025.", dueDate: "15.10.2025.", client: "FinanceAdvisors d.o.o.", clientId: "VER-11", spvId: "SOL-01", description: "Financijski model â€” SOL-01", netAmount: 1600, vatRate: 25, vatAmount: 400, totalAmount: 2000, status: "plaÄ‡en", paidDate: "14.10.2025.", category: "financije" },
  { id: "RI-16", number: "UR-2026-012", type: "primljeni", date: "10.02.2026.", dueDate: "25.02.2026.", client: "Pravo & Savjet d.o.o.", clientId: "VER-03", spvId: "INF-01", description: "Due diligence â€” INF-01", netAmount: 2000, vatRate: 25, vatAmount: 500, totalAmount: 2500, status: "Äeka", paidDate: null, category: "pravni" },
  { id: "RI-17", number: "UR-2026-013", type: "primljeni", date: "01.01.2026.", dueDate: "15.01.2026.", client: "Vercel Inc.", clientId: "EXT-01", spvId: null, description: "Hosting â€” sijeÄanj 2026.", netAmount: 20, vatRate: 0, vatAmount: 0, totalAmount: 20, status: "plaÄ‡en", paidDate: "01.01.2026.", category: "it" },
  { id: "RI-18", number: "UR-2026-014", type: "primljeni", date: "01.01.2026.", dueDate: "15.01.2026.", client: "Supabase Inc.", clientId: "EXT-02", spvId: null, description: "Pro plan â€” sijeÄanj 2026.", netAmount: 25, vatRate: 0, vatAmount: 0, totalAmount: 25, status: "plaÄ‡en", paidDate: "01.01.2026.", category: "it" },
  { id: "RI-19", number: "UR-2025-082", type: "primljeni", date: "20.12.2025.", dueDate: "05.01.2026.", client: "Agro Savjetovanje d.o.o.", clientId: "VER-06", spvId: "AGR-01", description: "Inicijalna analiza â€” AGR-01", netAmount: 800, vatRate: 25, vatAmount: 200, totalAmount: 1000, status: "plaÄ‡en", paidDate: "03.01.2026.", category: "agronomija" },
  { id: "RI-20", number: "UR-2026-015", type: "primljeni", date: "15.02.2026.", dueDate: "01.03.2026.", client: "Digital Systems d.o.o.", clientId: "VER-09", spvId: "TEC-01", description: "IoT konzultacije â€” TEC-01", netAmount: 1200, vatRate: 25, vatAmount: 300, totalAmount: 1500, status: "Äeka", paidDate: null, category: "tech" },
];

// â”€â”€â”€ TRANSAKCIJE Å½IRO (42) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function buildTransactions(): Transaction[] {
  const txs: Omit<Transaction, "balance">[] = [
    // VeljaÄa 2026
    { id: "TX-42", date: "20.02.2026.", description: "SPV SAN-01 â€” platform fee veljaÄa", credit: 300, debit: 0, invoiceRef: "IR-2026-001", spvId: "SAN-01", category: "prihod" },
    { id: "TX-41", date: "20.02.2026.", description: "SPV SAN-02 â€” platform fee veljaÄa", credit: 300, debit: 0, invoiceRef: "IR-2026-006", spvId: "SAN-02", category: "prihod" },
    { id: "TX-40", date: "20.02.2026.", description: "Pravo & Savjet â€” NKD analiza", credit: 0, debit: 750, invoiceRef: "UR-2026-001", spvId: null, category: "rashod" },
    { id: "TX-39", date: "19.02.2026.", description: "SPV INF-01 â€” platform fee veljaÄa", credit: 300, debit: 0, invoiceRef: "IR-2026-012", spvId: "INF-01", category: "prihod" },
    { id: "TX-38", date: "19.02.2026.", description: "BuildControl â€” nadzor SAN-01 veljaÄa", credit: 0, debit: 1800, invoiceRef: "IR-2026-019", spvId: "SAN-01", category: "rashod" },
    { id: "TX-37", date: "18.02.2026.", description: "SPV SAN-01 â€” brand licenca veljaÄa", credit: 200, debit: 0, invoiceRef: "IR-2026-002", spvId: "SAN-01", category: "prihod" },
    { id: "TX-36", date: "18.02.2026.", description: "Geodet Plus â€” elaborat SAN-01", credit: 0, debit: 3500, invoiceRef: "UR-2026-004", spvId: "SAN-01", category: "rashod" },
    { id: "TX-35", date: "14.02.2026.", description: "SPV TUR-01 â€” CORE pregled", credit: 1000, debit: 0, invoiceRef: "IR-2026-011", spvId: "TUR-01", category: "prihod" },
    { id: "TX-34", date: "14.02.2026.", description: "Statika Pro â€” statika SAN-01", credit: 0, debit: 4000, invoiceRef: "UR-2026-005", spvId: "SAN-01", category: "rashod" },
    { id: "TX-33", date: "14.02.2026.", description: "BuildControl â€” nadzor SAN-01", credit: 0, debit: 3000, invoiceRef: "UR-2026-011", spvId: "SAN-01", category: "rashod" },
    { id: "TX-32", date: "13.02.2026.", description: "SPV TEC-01 â€” CORE pregled", credit: 1000, debit: 0, invoiceRef: "IR-2026-018", spvId: "TEC-01", category: "prihod" },
    { id: "TX-31", date: "12.02.2026.", description: "Vercel â€” hosting veljaÄa", credit: 0, debit: 20, invoiceRef: "UR-2026-002", spvId: null, category: "rashod" },
    { id: "TX-30", date: "10.02.2026.", description: "Supabase â€” Pro plan veljaÄa", credit: 0, debit: 25, invoiceRef: "UR-2026-003", spvId: null, category: "rashod" },
    { id: "TX-29", date: "03.02.2026.", description: "Arhitekt Studio â€” idejni SAN-01", credit: 0, debit: 6000, invoiceRef: "UR-2026-006", spvId: "SAN-01", category: "rashod" },

    // SijeÄanj 2026
    { id: "TX-28", date: "30.01.2026.", description: "SPV INF-01 â€” platform fee sijeÄanj", credit: 300, debit: 0, invoiceRef: "IR-2026-014", spvId: "INF-01", category: "prihod" },
    { id: "TX-27", date: "29.01.2026.", description: "SPV SAN-02 â€” platform fee sijeÄanj", credit: 300, debit: 0, invoiceRef: "IR-2026-008", spvId: "SAN-02", category: "prihod" },
    { id: "TX-26", date: "28.01.2026.", description: "SPV SAN-01 â€” platform fee sijeÄanj", credit: 300, debit: 0, invoiceRef: "IR-2026-004", spvId: "SAN-01", category: "prihod" },
    { id: "TX-25", date: "25.01.2026.", description: "SPV SAN-01 â€” brand licenca sijeÄanj", credit: 200, debit: 0, invoiceRef: "IR-2026-005", spvId: "SAN-01", category: "prihod" },
    { id: "TX-24", date: "15.01.2026.", description: "RaÄunovodstvo Sigma â€” sijeÄanj", credit: 0, debit: 350, invoiceRef: null, spvId: null, category: "rashod" },
    { id: "TX-23", date: "10.01.2026.", description: "Financa Plus â€” sijeÄanj", credit: 0, debit: 250, invoiceRef: null, spvId: null, category: "rashod" },
    { id: "TX-22", date: "03.01.2026.", description: "Agro Savjetovanje â€” analiza AGR-01", credit: 0, debit: 1000, invoiceRef: "UR-2025-082", spvId: "AGR-01", category: "rashod" },
    { id: "TX-21", date: "01.01.2026.", description: "Vercel â€” hosting sijeÄanj", credit: 0, debit: 20, invoiceRef: "UR-2026-013", spvId: null, category: "rashod" },
    { id: "TX-20", date: "01.01.2026.", description: "Supabase â€” Pro plan sijeÄanj", credit: 0, debit: 25, invoiceRef: "UR-2026-014", spvId: null, category: "rashod" },

    // Prosinac 2025
    { id: "TX-19", date: "29.12.2025.", description: "SPV SAN-01 â€” platform fee prosinac", credit: 300, debit: 0, invoiceRef: "IR-2025-032", spvId: "SAN-01", category: "prihod" },
    { id: "TX-18", date: "28.12.2025.", description: "RaÄunovodstvo Sigma â€” prosinac", credit: 0, debit: 350, invoiceRef: "UR-2025-080", spvId: null, category: "rashod" },
    { id: "TX-17", date: "14.12.2025.", description: "BuildControl â€” nadzor TUR-02 finalni", credit: 0, debit: 2500, invoiceRef: null, spvId: "TUR-02", category: "rashod" },
    { id: "TX-16", date: "03.12.2025.", description: "SPV SAN-03 â€” success fee", credit: 5200, debit: 0, invoiceRef: "IR-2025-038", spvId: "SAN-03", category: "prihod" },

    // Studeni 2025
    { id: "TX-15", date: "28.11.2025.", description: "SPV TUR-02 â€” success fee", credit: 7800, debit: 0, invoiceRef: "IR-2025-048", spvId: "TUR-02", category: "prihod" },
    { id: "TX-14", date: "27.11.2025.", description: "SPV SAN-01 â€” platform fee studeni", credit: 300, debit: 0, invoiceRef: "IR-2025-031", spvId: "SAN-01", category: "prihod" },
    { id: "TX-13", date: "14.11.2025.", description: "Arhitekt Studio â€” idejni SAN-02", credit: 0, debit: 4750, invoiceRef: "UR-2025-075", spvId: "SAN-02", category: "rashod" },

    // Listopad 2025
    { id: "TX-12", date: "29.10.2025.", description: "GreenEnergy â€” audit SOL-01", credit: 0, debit: 3000, invoiceRef: "UR-2025-070", spvId: "SOL-01", category: "rashod" },
    { id: "TX-11", date: "28.10.2025.", description: "SPV SAN-01 â€” platform fee listopad", credit: 300, debit: 0, invoiceRef: "IR-2025-030", spvId: "SAN-01", category: "prihod" },
    { id: "TX-10", date: "14.10.2025.", description: "FinanceAdvisors â€” model SOL-01", credit: 0, debit: 2000, invoiceRef: "UR-2025-065", spvId: "SOL-01", category: "rashod" },
    { id: "TX-09", date: "12.10.2025.", description: "SPV TUR-02 â€” platform fee", credit: 300, debit: 0, invoiceRef: "IR-2025-042", spvId: "TUR-02", category: "prihod" },

    // Rujan 2025
    { id: "TX-08", date: "25.09.2025.", description: "SPV SAN-03 â€” platform fee rujan", credit: 300, debit: 0, invoiceRef: "IR-2025-033", spvId: "SAN-03", category: "prihod" },
    { id: "TX-07", date: "15.09.2025.", description: "IT troÅ¡kovi â€” rujan", credit: 0, debit: 45, invoiceRef: null, spvId: null, category: "rashod" },

    // Kolovoz 2025
    { id: "TX-06", date: "28.08.2025.", description: "SPV SAN-01 â€” platform fee kolovoz", credit: 300, debit: 0, invoiceRef: null, spvId: "SAN-01", category: "prihod" },
    { id: "TX-05", date: "15.08.2025.", description: "IT troÅ¡kovi â€” kolovoz", credit: 0, debit: 45, invoiceRef: null, spvId: null, category: "rashod" },

    // Srpanj 2025
    { id: "TX-04", date: "28.07.2025.", description: "SPV SAN-01 â€” platform fee srpanj", credit: 300, debit: 0, invoiceRef: null, spvId: "SAN-01", category: "prihod" },
    { id: "TX-03", date: "15.07.2025.", description: "IT troÅ¡kovi â€” srpanj", credit: 0, debit: 45, invoiceRef: null, spvId: null, category: "rashod" },

    // Lipanj 2025 â€” poÄetak
    { id: "TX-02", date: "15.06.2025.", description: "OsnivaÄki troÅ¡kovi CORE d.o.o.", credit: 0, debit: 1500, invoiceRef: null, spvId: null, category: "rashod" },
    { id: "TX-01", date: "01.06.2025.", description: "Uplata temeljnog kapitala", credit: 2500, debit: 0, invoiceRef: null, spvId: null, category: "kapital" },
  ];

  // IzraÄunaj running balance (od najstarijeg)
  const sorted = [...txs].reverse();
  let balance = 0;
  const withBalance: Transaction[] = sorted.map((tx) => {
    balance += tx.credit - tx.debit;
    return { ...tx, balance: Math.round(balance * 100) / 100 };
  });
  return withBalance.reverse();
}

export const TRANSACTIONS: Transaction[] = buildTransactions();

// â”€â”€â”€ ZADACI (25) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const TASKS: Task[] = [
  { id: "TSK-01", title: "Ishoditi graÄ‘evinsku dozvolu", description: "Predati zahtjev za graÄ‘evinsku dozvolu na nadleÅ¾no tijelo", spvId: "SAN-01", assignedTo: "Jurke MariÄiÄ‡", assignedRole: "PM", priority: "critical", status: "u_tijeku", createdDate: "01.01.2026.", dueDate: "28.02.2026.", completedDate: null, category: "dozvole" },
  { id: "TSK-02", title: "Ugovoriti izvoÄ‘aÄa radova", description: "Odabir izvoÄ‘aÄa i potpisivanje ugovora", spvId: "SAN-01", assignedTo: "Jurke MariÄiÄ‡", assignedRole: "PM", priority: "high", status: "otvoren", createdDate: "15.01.2026.", dueDate: "15.03.2026.", completedDate: null, category: "gradnja" },
  { id: "TSK-03", title: "Glavni projekt â€” revizija", description: "Revizija glavnog projekta od ovlaÅ¡tenog revidenta", spvId: "SAN-01", assignedTo: "Arhitekt Studio d.o.o.", assignedRole: "Vertikala", priority: "high", status: "zavrÅ¡en", createdDate: "01.12.2025.", dueDate: "31.01.2026.", completedDate: "28.01.2026.", category: "projektiranje" },
  { id: "TSK-04", title: "Geodetski elaborat â€” finalni", description: "ZavrÅ¡etak geodetskog elaborata za katastar", spvId: "SAN-01", assignedTo: "Geodet Plus d.o.o.", assignedRole: "Vertikala", priority: "medium", status: "zavrÅ¡en", createdDate: "15.11.2025.", dueDate: "15.01.2026.", completedDate: "10.01.2026.", category: "geodezija" },
  { id: "TSK-05", title: "Pripremiti financijski model", description: "Detaljan financijski model za banku", spvId: "SAN-02", assignedTo: "FinanceAdvisors d.o.o.", assignedRole: "Vertikala", priority: "high", status: "u_tijeku", createdDate: "01.02.2026.", dueDate: "01.03.2026.", completedDate: null, category: "financije" },
  { id: "TSK-06", title: "DOSTAVITI ELABORAT OKOLIÅ A", description: "Mandatory dokument za fazu Financiranje â€” BLOKIRA PROJEKT", spvId: "SOL-01", assignedTo: "EcoPermit d.o.o.", assignedRole: "Vertikala", priority: "critical", status: "blokiran", createdDate: "15.01.2026.", dueDate: "10.02.2026.", completedDate: null, category: "okoliÅ¡" },
  { id: "TSK-07", title: "Energetski certifikat", description: "IshoÄ‘enje energetskog certifikata", spvId: "SOL-01", assignedTo: "GreenEnergy Consult", assignedRole: "Vertikala", priority: "high", status: "otvoren", createdDate: "01.02.2026.", dueDate: "15.03.2026.", completedDate: null, category: "energetika" },
  { id: "TSK-08", title: "CORE pregled â€” Vila Maestral", description: "Kompletna analiza projekta za odobrenje", spvId: "TUR-01", assignedTo: "Jurke MariÄiÄ‡", assignedRole: "CORE", priority: "high", status: "u_tijeku", createdDate: "20.11.2025.", dueDate: "01.03.2026.", completedDate: null, category: "pregled" },
  { id: "TSK-09", title: "Kredit evaluacija â€” OTP", description: "Pripremiti dokumentaciju za OTP kredit", spvId: "TUR-01", assignedTo: "FinanceAdvisors d.o.o.", assignedRole: "Vertikala", priority: "medium", status: "otvoren", createdDate: "01.02.2026.", dueDate: "31.03.2026.", completedDate: null, category: "financije" },
  { id: "TSK-10", title: "Analiza trÅ¾iÅ¡ta lavande", description: "TrÅ¾iÅ¡na analiza za OPG lavanda projekt", spvId: "AGR-01", assignedTo: "Agro Savjetovanje d.o.o.", assignedRole: "Vertikala", priority: "medium", status: "zavrÅ¡en", createdDate: "05.01.2026.", dueDate: "05.02.2026.", completedDate: "01.02.2026.", category: "analiza" },
  { id: "TSK-11", title: "Due diligence â€” zemljiÅ¡te", description: "Pravna analiza vlasniÄkih odnosa", spvId: "INF-01", assignedTo: "Pravo & Savjet d.o.o.", assignedRole: "Vertikala", priority: "high", status: "u_tijeku", createdDate: "01.02.2026.", dueDate: "28.02.2026.", completedDate: null, category: "pravni" },
  { id: "TSK-12", title: "Idejni projekt â€” skladiÅ¡te", description: "Idejno rjeÅ¡enje logistiÄkog centra", spvId: "INF-01", assignedTo: "Arhitekt Studio d.o.o.", assignedRole: "Vertikala", priority: "high", status: "otvoren", createdDate: "10.02.2026.", dueDate: "31.03.2026.", completedDate: null, category: "projektiranje" },
  { id: "TSK-13", title: "Dodijeli knjigovoÄ‘u â€” SOL-02", description: "SPV nema dodijeljenog knjigovoÄ‘u!", spvId: "SOL-02", assignedTo: "Jurke MariÄiÄ‡", assignedRole: "CORE", priority: "high", status: "otvoren", createdDate: "10.02.2026.", dueDate: "28.02.2026.", completedDate: null, category: "admin" },
  { id: "TSK-14", title: "CORE pregled â€” Smart Building", description: "Analiza IoT pilot projekta", spvId: "TEC-01", assignedTo: "Jurke MariÄiÄ‡", assignedRole: "CORE", priority: "medium", status: "u_tijeku", createdDate: "01.12.2025.", dueDate: "15.03.2026.", completedDate: null, category: "pregled" },
  { id: "TSK-15", title: "Zatvaranje â€” finalna dokumentacija SAN-03", description: "Kompletirati zavrÅ¡nu dokumentaciju", spvId: "SAN-03", assignedTo: "Jurke MariÄiÄ‡", assignedRole: "PM", priority: "low", status: "zavrÅ¡en", createdDate: "01.11.2025.", dueDate: "15.12.2025.", completedDate: "10.12.2025.", category: "zatvaranje" },
  { id: "TSK-16", title: "Zatvaranje â€” finalna dokumentacija TUR-02", description: "Kompletirati zavrÅ¡nu dokumentaciju glamping", spvId: "TUR-02", assignedTo: "Jurke MariÄiÄ‡", assignedRole: "PM", priority: "low", status: "zavrÅ¡en", createdDate: "01.10.2025.", dueDate: "01.12.2025.", completedDate: "28.11.2025.", category: "zatvaranje" },
  { id: "TSK-17", title: "Priprema NKD izmjene", description: "Priprema dokumentacije za NKD 2025 migraciju", spvId: "SAN-01", assignedTo: "Pravo & Savjet d.o.o.", assignedRole: "Vertikala", priority: "medium", status: "otvoren", createdDate: "15.02.2026.", dueDate: "31.03.2026.", completedDate: null, category: "pravni" },
  { id: "TSK-18", title: "Uplata temeljnog kapitala CORE", description: "Deponirati temeljni kapital na raÄun CORE d.o.o.", spvId: "SAN-01", assignedTo: "Jurke MariÄiÄ‡", assignedRole: "CORE", priority: "critical", status: "eskaliran", createdDate: "12.12.2025.", dueDate: "12.01.2026.", completedDate: null, category: "admin" },
  { id: "TSK-19", title: "OkoliÅ¡na dozvola â€” INF-01", description: "Ishoditi okoliÅ¡nu dozvolu za industrijsku zonu", spvId: "INF-01", assignedTo: "EcoPermit d.o.o.", assignedRole: "Vertikala", priority: "high", status: "u_tijeku", createdDate: "01.02.2026.", dueDate: "30.04.2026.", completedDate: null, category: "okoliÅ¡" },
  { id: "TSK-20", title: "Katastar â€” provjera Äestica", description: "Provjera Äestice i granica", spvId: "AGR-01", assignedTo: "Geodet Plus d.o.o.", assignedRole: "Vertikala", priority: "low", status: "otvoren", createdDate: "10.02.2026.", dueDate: "31.03.2026.", completedDate: null, category: "geodezija" },
  { id: "TSK-21", title: "D&O polica â€” CORE", description: "Ugovoriti D&O osiguranje za direktora", spvId: "SAN-01", assignedTo: "Jurke MariÄiÄ‡", assignedRole: "CORE", priority: "medium", status: "otvoren", createdDate: "01.02.2026.", dueDate: "31.03.2026.", completedDate: null, category: "admin" },
  { id: "TSK-22", title: "IoT specifikacija senzora", description: "Definirati listu senzora za pilot zgradu", spvId: "TEC-01", assignedTo: "Digital Systems d.o.o.", assignedRole: "Vertikala", priority: "medium", status: "otvoren", createdDate: "15.02.2026.", dueDate: "31.03.2026.", completedDate: null, category: "tech" },
  { id: "TSK-23", title: "Prodaja stanova â€” SAN-01", description: "Marketing i prodaja 4 stambene jedinice", spvId: "SAN-01", assignedTo: "Jurke MariÄiÄ‡", assignedRole: "PM", priority: "high", status: "otvoren", createdDate: "01.02.2026.", dueDate: "30.06.2026.", completedDate: null, category: "prodaja" },
  { id: "TSK-24", title: "EV lokacije â€” mapping", description: "Mapiranje 6 potencijalnih lokacija", spvId: "SOL-02", assignedTo: "Jurke MariÄiÄ‡", assignedRole: "PM", priority: "low", status: "otvoren", createdDate: "15.02.2026.", dueDate: "30.04.2026.", completedDate: null, category: "analiza" },
  { id: "TSK-25", title: "Nadzor â€” proljetna inspekcija SAN-01", description: "Kontrola kvalitete proljetnih radova", spvId: "SAN-01", assignedTo: "BuildControl d.o.o.", assignedRole: "Vertikala", priority: "medium", status: "otvoren", createdDate: "18.02.2026.", dueDate: "15.04.2026.", completedDate: null, category: "nadzor" },
];

// â”€â”€â”€ DOKUMENTI (30) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const DOCUMENTS: Document[] = [
  // SAN-01 â€” komplet
  { id: "DOC-01", name: "GraÄ‘evinska dozvola", type: "dozvola", spvId: "SAN-01", uploadedBy: "Jurke MariÄiÄ‡", uploadDate: "15.01.2026.", status: "odobren", version: 2, fileSize: "2.4 MB", mandatory: true, category: "dozvole" },
  { id: "DOC-02", name: "Glavni projekt", type: "elaborat", spvId: "SAN-01", uploadedBy: "Arhitekt Studio d.o.o.", uploadDate: "28.01.2026.", status: "odobren", version: 3, fileSize: "45.2 MB", mandatory: true, category: "projektiranje" },
  { id: "DOC-03", name: "Geodetski elaborat", type: "elaborat", spvId: "SAN-01", uploadedBy: "Geodet Plus d.o.o.", uploadDate: "10.01.2026.", status: "odobren", version: 1, fileSize: "8.1 MB", mandatory: true, category: "geodezija" },
  { id: "DOC-04", name: "StatiÄki proraÄun", type: "elaborat", spvId: "SAN-01", uploadedBy: "Statika Pro d.o.o.", uploadDate: "20.01.2026.", status: "odobren", version: 2, fileSize: "12.3 MB", mandatory: true, category: "konstrukcije" },
  { id: "DOC-05", name: "CORE-SPV ugovor SAN-01", type: "ugovor", spvId: "SAN-01", uploadedBy: "Jurke MariÄiÄ‡", uploadDate: "01.01.2026.", status: "odobren", version: 1, fileSize: "0.8 MB", mandatory: true, category: "ugovori" },
  { id: "DOC-06", name: "Energetski certifikat", type: "certifikat", spvId: "SAN-01", uploadedBy: "GreenEnergy Consult", uploadDate: "05.02.2026.", status: "odobren", version: 1, fileSize: "1.2 MB", mandatory: false, category: "energetika" },

  // SAN-02
  { id: "DOC-07", name: "Idejni projekt", type: "elaborat", spvId: "SAN-02", uploadedBy: "Arhitekt Studio d.o.o.", uploadDate: "14.11.2025.", status: "odobren", version: 1, fileSize: "28.5 MB", mandatory: true, category: "projektiranje" },
  { id: "DOC-08", name: "CORE-SPV ugovor SAN-02", type: "ugovor", spvId: "SAN-02", uploadedBy: "Jurke MariÄiÄ‡", uploadDate: "15.01.2026.", status: "odobren", version: 1, fileSize: "0.8 MB", mandatory: true, category: "ugovori" },
  { id: "DOC-09", name: "Financijski model", type: "izvjeÅ¡taj", spvId: "SAN-02", uploadedBy: "FinanceAdvisors d.o.o.", uploadDate: "15.02.2026.", status: "Äeka_pregled", version: 1, fileSize: "3.2 MB", mandatory: true, category: "financije" },

  // SOL-01 â€” BLOKIRAN: nedostaje mandatory
  { id: "DOC-10", name: "Energetski audit", type: "elaborat", spvId: "SOL-01", uploadedBy: "GreenEnergy Consult", uploadDate: "29.10.2025.", status: "odobren", version: 1, fileSize: "5.4 MB", mandatory: true, category: "energetika" },
  { id: "DOC-11", name: "Elaborat zaÅ¡tite okoliÅ¡a", type: "elaborat", spvId: "SOL-01", uploadedBy: "", uploadDate: "", status: "nedostaje", version: 0, fileSize: "", mandatory: true, category: "okoliÅ¡" },
  { id: "DOC-12", name: "Financijski model SOL-01", type: "izvjeÅ¡taj", spvId: "SOL-01", uploadedBy: "FinanceAdvisors d.o.o.", uploadDate: "14.10.2025.", status: "odobren", version: 2, fileSize: "4.1 MB", mandatory: true, category: "financije" },

  // TUR-01
  { id: "DOC-13", name: "Lokacijska dozvola â€” Vila Maestral", type: "dozvola", spvId: "TUR-01", uploadedBy: "Jurke MariÄiÄ‡", uploadDate: "01.12.2025.", status: "Äeka_pregled", version: 1, fileSize: "1.8 MB", mandatory: true, category: "dozvole" },
  { id: "DOC-14", name: "Projektni zadatak â€” TUR-01", type: "elaborat", spvId: "TUR-01", uploadedBy: "Jurke MariÄiÄ‡", uploadDate: "25.11.2025.", status: "odobren", version: 1, fileSize: "2.1 MB", mandatory: false, category: "projektiranje" },

  // AGR-01
  { id: "DOC-15", name: "Analiza trÅ¾iÅ¡ta lavande", type: "izvjeÅ¡taj", spvId: "AGR-01", uploadedBy: "Agro Savjetovanje d.o.o.", uploadDate: "01.02.2026.", status: "odobren", version: 1, fileSize: "6.7 MB", mandatory: false, category: "analiza" },
  { id: "DOC-16", name: "Katastarski izvadak â€” AGR-01", type: "ostalo", spvId: "AGR-01", uploadedBy: "Jurke MariÄiÄ‡", uploadDate: "10.01.2026.", status: "odobren", version: 1, fileSize: "0.3 MB", mandatory: true, category: "katastar" },

  // SAN-03 â€” ZavrÅ¡en, sve odobreno
  { id: "DOC-17", name: "Uporabna dozvola â€” SAN-03", type: "dozvola", spvId: "SAN-03", uploadedBy: "Jurke MariÄiÄ‡", uploadDate: "10.11.2025.", status: "odobren", version: 1, fileSize: "1.5 MB", mandatory: true, category: "dozvole" },
  { id: "DOC-18", name: "ZavrÅ¡ni izvjeÅ¡taj â€” SAN-03", type: "izvjeÅ¡taj", spvId: "SAN-03", uploadedBy: "Jurke MariÄiÄ‡", uploadDate: "15.11.2025.", status: "odobren", version: 1, fileSize: "4.2 MB", mandatory: true, category: "izvjeÅ¡taji" },
  { id: "DOC-19", name: "Kupoprodajni ugovori (3x) â€” SAN-03", type: "ugovor", spvId: "SAN-03", uploadedBy: "Pravo & Savjet d.o.o.", uploadDate: "01.10.2025.", status: "odobren", version: 1, fileSize: "2.8 MB", mandatory: true, category: "ugovori" },

  // TUR-02 â€” ZavrÅ¡en
  { id: "DOC-20", name: "Uporabna dozvola â€” Glamping", type: "dozvola", spvId: "TUR-02", uploadedBy: "Jurke MariÄiÄ‡", uploadDate: "15.09.2025.", status: "odobren", version: 1, fileSize: "1.1 MB", mandatory: true, category: "dozvole" },
  { id: "DOC-21", name: "ZavrÅ¡ni izvjeÅ¡taj â€” TUR-02", type: "izvjeÅ¡taj", spvId: "TUR-02", uploadedBy: "Jurke MariÄiÄ‡", uploadDate: "01.10.2025.", status: "odobren", version: 1, fileSize: "5.6 MB", mandatory: true, category: "izvjeÅ¡taji" },

  // INF-01
  { id: "DOC-22", name: "Lokacijska informacija â€” INF-01", type: "dozvola", spvId: "INF-01", uploadedBy: "Jurke MariÄiÄ‡", uploadDate: "15.07.2025.", status: "odobren", version: 1, fileSize: "0.9 MB", mandatory: true, category: "dozvole" },
  { id: "DOC-23", name: "Due diligence report â€” INF-01", type: "izvjeÅ¡taj", spvId: "INF-01", uploadedBy: "Pravo & Savjet d.o.o.", uploadDate: "18.02.2026.", status: "Äeka_pregled", version: 1, fileSize: "7.3 MB", mandatory: true, category: "pravni" },

  // TEC-01
  { id: "DOC-24", name: "IoT specifikacija â€” draft", type: "elaborat", spvId: "TEC-01", uploadedBy: "Digital Systems d.o.o.", uploadDate: "10.02.2026.", status: "Äeka_pregled", version: 1, fileSize: "3.8 MB", mandatory: false, category: "tech" },

  // NDA-ovi
  { id: "DOC-25", name: "NDA â€” Geodet Plus", type: "ugovor", spvId: "SAN-01", uploadedBy: "Jurke MariÄiÄ‡", uploadDate: "10.01.2026.", status: "odobren", version: 1, fileSize: "0.4 MB", mandatory: false, category: "nda" },
  { id: "DOC-26", name: "NDA â€” Arhitekt Studio", type: "ugovor", spvId: "SAN-01", uploadedBy: "Jurke MariÄiÄ‡", uploadDate: "01.02.2026.", status: "odobren", version: 1, fileSize: "0.4 MB", mandatory: false, category: "nda" },
  { id: "DOC-27", name: "NDA â€” EcoPermit", type: "ugovor", spvId: "SOL-01", uploadedBy: "Jurke MariÄiÄ‡", uploadDate: "05.01.2026.", status: "odobren", version: 1, fileSize: "0.4 MB", mandatory: false, category: "nda" },

  // SOL-02 â€” minimalno
  { id: "DOC-28", name: "Projektni brief â€” EV Hub", type: "ostalo", spvId: "SOL-02", uploadedBy: "Jurke MariÄiÄ‡", uploadDate: "10.02.2026.", status: "odobren", version: 1, fileSize: "1.2 MB", mandatory: false, category: "analiza" },

  // CORE dokumenti
  { id: "DOC-29", name: "RIVUS CORE Arhitektura v1.1", type: "izvjeÅ¡taj", spvId: "SAN-01", uploadedBy: "Jurke MariÄiÄ‡", uploadDate: "21.02.2026.", status: "odobren", version: 2, fileSize: "0.6 MB", mandatory: false, category: "sustav" },
  { id: "DOC-30", name: "GDPR politika â€” draft", type: "ostalo", spvId: "SAN-01", uploadedBy: "Pravo & Savjet d.o.o.", uploadDate: "10.02.2026.", status: "Äeka_pregled", version: 1, fileSize: "1.8 MB", mandatory: false, category: "pravni" },
];

// â”€â”€â”€ ODLUKE (15) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const DECISIONS: Decision[] = [
  { id: "DEC-01", title: "Odobrenje glavnog projekta SAN-01", spvId: "SAN-01", requestedBy: "Arhitekt Studio d.o.o.", decidedBy: "Jurke MariÄiÄ‡", status: "odobreno", date: "25.01.2026.", decidedDate: "28.01.2026.", description: "Glavni projekt odobren nakon revizije", category: "projektiranje" },
  { id: "DEC-02", title: "Odobrenje izvoÄ‘aÄa â€” SAN-01", spvId: "SAN-01", requestedBy: "Jurke MariÄiÄ‡", decidedBy: null, status: "na_Äekanju", date: "18.02.2026.", decidedDate: null, description: "ÄŒeka se odabir izvoÄ‘aÄa iz 3 ponude", category: "gradnja" },
  { id: "DEC-03", title: "Aktivacija vertikale â€” Arhitekt Studio na SAN-02", spvId: "SAN-02", requestedBy: "Jurke MariÄiÄ‡", decidedBy: "Jurke MariÄiÄ‡", status: "odobreno", date: "01.11.2025.", decidedDate: "01.11.2025.", description: "Aktivacija projektiranja za SAN-02", category: "vertikale" },
  { id: "DEC-04", title: "Blokada SOL-01 â€” nedostaje mandatory", spvId: "SOL-01", requestedBy: "CORE sustav", decidedBy: "Jurke MariÄiÄ‡", status: "odobreno", date: "10.02.2026.", decidedDate: "10.02.2026.", description: "Automatska blokada â€” nedostaje elaborat okoliÅ¡a", category: "compliance" },
  { id: "DEC-05", title: "Odobrenje financijskog modela SOL-01", spvId: "SOL-01", requestedBy: "FinanceAdvisors d.o.o.", decidedBy: "Jurke MariÄiÄ‡", status: "odobreno", date: "12.10.2025.", decidedDate: "14.10.2025.", description: "Model odobren za prezentaciju banci", category: "financije" },
  { id: "DEC-06", title: "PrihvaÄ‡anje CORE pregleda â€” TUR-01", spvId: "TUR-01", requestedBy: "Jurke MariÄiÄ‡", decidedBy: null, status: "na_Äekanju", date: "01.02.2026.", decidedDate: null, description: "CORE pregled u tijeku â€” Äeka finalnu evaluaciju", category: "pregled" },
  { id: "DEC-07", title: "Odobrenje success fee â€” TUR-02", spvId: "TUR-02", requestedBy: "Jurke MariÄiÄ‡", decidedBy: "Jurke MariÄiÄ‡", status: "odobreno", date: "10.11.2025.", decidedDate: "15.11.2025.", description: "Success fee 10% od neto profita odobren", category: "billing" },
  { id: "DEC-08", title: "Odobrenje success fee â€” SAN-03", spvId: "SAN-03", requestedBy: "Jurke MariÄiÄ‡", decidedBy: "Jurke MariÄiÄ‡", status: "odobreno", date: "15.11.2025.", decidedDate: "20.11.2025.", description: "Success fee 10% od neto profita odobren", category: "billing" },
  { id: "DEC-09", title: "Odbijanje ponude izvoÄ‘aÄa B â€” SAN-01", spvId: "SAN-01", requestedBy: "Jurke MariÄiÄ‡", decidedBy: "Jurke MariÄiÄ‡", status: "odbijeno", date: "15.02.2026.", decidedDate: "18.02.2026.", description: "Cijena previsoka za opseg radova", category: "gradnja" },
  { id: "DEC-10", title: "Aktivacija vertikale â€” EcoPermit na INF-01", spvId: "INF-01", requestedBy: "Jurke MariÄiÄ‡", decidedBy: "Jurke MariÄiÄ‡", status: "odobreno", date: "01.02.2026.", decidedDate: "01.02.2026.", description: "OkoliÅ¡na dozvola potrebna za industrijsku zonu", category: "vertikale" },
  { id: "DEC-11", title: "CORE pregled â€” Smart Building", spvId: "TEC-01", requestedBy: "Jurke MariÄiÄ‡", decidedBy: null, status: "na_Äekanju", date: "01.12.2025.", decidedDate: null, description: "IoT pilot projekt â€” Äeka tehniÄku evaluaciju", category: "pregled" },
  { id: "DEC-12", title: "Odobrenje lokacijske dozvole TUR-01", spvId: "TUR-01", requestedBy: "Jurke MariÄiÄ‡", decidedBy: null, status: "na_Äekanju", date: "15.02.2026.", decidedDate: null, description: "Lokacijska dozvola Äeka pregled", category: "dozvole" },
  { id: "DEC-13", title: "Zatvaranje projekta SAN-03", spvId: "SAN-03", requestedBy: "Jurke MariÄiÄ‡", decidedBy: "Jurke MariÄiÄ‡", status: "odobreno", date: "15.11.2025.", decidedDate: "15.11.2025.", description: "Projekt zavrÅ¡en â€” svi stanovi prodani", category: "zatvaranje" },
  { id: "DEC-14", title: "Zatvaranje projekta TUR-02", spvId: "TUR-02", requestedBy: "Jurke MariÄiÄ‡", decidedBy: "Jurke MariÄiÄ‡", status: "odobreno", date: "01.10.2025.", decidedDate: "01.10.2025.", description: "Glamping resort zavrÅ¡en â€” sezona uspjeÅ¡na", category: "zatvaranje" },
  { id: "DEC-15", title: "Odobrenje due diligence â€” INF-01", spvId: "INF-01", requestedBy: "Pravo & Savjet d.o.o.", decidedBy: null, status: "na_Äekanju", date: "18.02.2026.", decidedDate: null, description: "Due diligence report Äeka pregled", category: "pravni" },
];

// â”€â”€â”€ TOK ZAHTJEVI (20) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const TOK_REQUESTS: TokRequest[] = [
  { id: "TOK-01", title: "Deblokiraj SOL-01", spvId: "SOL-01", requestedBy: "Jurke MariÄiÄ‡", assignedTo: "EcoPermit d.o.o.", priority: "critical", status: "otvoren", createdDate: "10.02.2026.", dueDate: "20.02.2026.", resolvedDate: null, slaHours: 48, slaBreached: true, category: "blokada", description: "Hitno dostaviti elaborat okoliÅ¡a" },
  { id: "TOK-02", title: "Naplata IR-2026-003 â€” SAN-01 PM", spvId: "SAN-01", requestedBy: "CORE sustav", assignedTo: "Jurke MariÄiÄ‡", priority: "high", status: "otvoren", createdDate: "20.02.2026.", dueDate: "25.02.2026.", resolvedDate: null, slaHours: 72, slaBreached: false, category: "naplata", description: "PM raÄun kasni â€” kontaktirati SPV vlasnika" },
  { id: "TOK-03", title: "Naplata IR-2026-010 â€” SOL-01", spvId: "SOL-01", requestedBy: "CORE sustav", assignedTo: "Jurke MariÄiÄ‡", priority: "high", status: "eskaliran", createdDate: "25.01.2026.", dueDate: "01.02.2026.", resolvedDate: null, slaHours: 72, slaBreached: true, category: "naplata", description: "Platform fee sijeÄanj â€” 26 dana kaÅ¡njenje" },
  { id: "TOK-04", title: "Naplata IR-2026-017 â€” Arhitekt SAN-02", spvId: "SAN-02", requestedBy: "CORE sustav", assignedTo: "Jurke MariÄiÄ‡", priority: "medium", status: "otvoren", createdDate: "05.02.2026.", dueDate: "15.02.2026.", resolvedDate: null, slaHours: 72, slaBreached: true, category: "naplata", description: "Vertikala provizija kasni 15 dana" },
  { id: "TOK-05", title: "Dodijeli knjigovoÄ‘u â€” SOL-02", spvId: "SOL-02", requestedBy: "CORE sustav", assignedTo: "Jurke MariÄiÄ‡", priority: "high", status: "otvoren", createdDate: "10.02.2026.", dueDate: "28.02.2026.", resolvedDate: null, slaHours: 168, slaBreached: false, category: "assignment", description: "SPV bez knjigovoÄ‘e â€” compliance risk" },
  { id: "TOK-06", title: "Dodijeli knjigovoÄ‘u â€” AGR-01", spvId: "AGR-01", requestedBy: "CORE sustav", assignedTo: "Jurke MariÄiÄ‡", priority: "medium", status: "otvoren", createdDate: "15.02.2026.", dueDate: "15.03.2026.", resolvedDate: null, slaHours: 168, slaBreached: false, category: "assignment", description: "OPG Knjige u pregovorima â€” potreban ugovor" },
  { id: "TOK-07", title: "Pregled lokacijske dozvole â€” TUR-01", spvId: "TUR-01", requestedBy: "Jurke MariÄiÄ‡", assignedTo: "Pravo & Savjet d.o.o.", priority: "medium", status: "u_tijeku", createdDate: "01.02.2026.", dueDate: "15.02.2026.", resolvedDate: null, slaHours: 120, slaBreached: true, category: "pregled", description: "Pravna provjera lokacijske dozvole" },
  { id: "TOK-08", title: "Kredit evaluacija OTP â€” TUR-01", spvId: "TUR-01", requestedBy: "Jurke MariÄiÄ‡", assignedTo: "FinanceAdvisors d.o.o.", priority: "medium", status: "u_tijeku", createdDate: "01.02.2026.", dueDate: "31.03.2026.", resolvedDate: null, slaHours: 720, slaBreached: false, category: "financije", description: "Priprema dokumentacije za OTP kredit" },
  { id: "TOK-09", title: "NKD migracija â€” analiza", spvId: "SAN-01", requestedBy: "Jurke MariÄiÄ‡", assignedTo: "Pravo & Savjet d.o.o.", priority: "high", status: "u_tijeku", createdDate: "15.02.2026.", dueDate: "15.03.2026.", resolvedDate: null, slaHours: 168, slaBreached: false, category: "compliance", description: "NKD 2007â†’2025 migracija â€” potrebni novi kodovi" },
  { id: "TOK-10", title: "Odobrenje due diligence INF-01", spvId: "INF-01", requestedBy: "Pravo & Savjet d.o.o.", assignedTo: "Jurke MariÄiÄ‡", priority: "high", status: "otvoren", createdDate: "18.02.2026.", dueDate: "28.02.2026.", resolvedDate: null, slaHours: 72, slaBreached: false, category: "pregled", description: "Due diligence report Äeka CORE odobrenje" },

  // RijeÅ¡eni
  { id: "TOK-11", title: "Revizija glavnog projekta SAN-01", spvId: "SAN-01", requestedBy: "Arhitekt Studio d.o.o.", assignedTo: "Jurke MariÄiÄ‡", priority: "high", status: "rijeÅ¡en", createdDate: "01.12.2025.", dueDate: "31.01.2026.", resolvedDate: "28.01.2026.", slaHours: 720, slaBreached: false, category: "pregled", description: "Revizija odobrena" },
  { id: "TOK-12", title: "Finalizacija success fee TUR-02", spvId: "TUR-02", requestedBy: "Jurke MariÄiÄ‡", assignedTo: "RaÄunovodstvo Sigma d.o.o.", priority: "medium", status: "rijeÅ¡en", createdDate: "01.11.2025.", dueDate: "15.11.2025.", resolvedDate: "15.11.2025.", slaHours: 168, slaBreached: false, category: "billing", description: "Success fee obraÄunat i fakturiran" },
  { id: "TOK-13", title: "Zatvaranje SAN-03 â€” sve dokumentacija", spvId: "SAN-03", requestedBy: "Jurke MariÄiÄ‡", assignedTo: "Pravo & Savjet d.o.o.", priority: "medium", status: "zatvoren", createdDate: "01.11.2025.", dueDate: "15.12.2025.", resolvedDate: "10.12.2025.", slaHours: 720, slaBreached: false, category: "zatvaranje", description: "Projekt zatvoren â€” sva dokumentacija kompletna" },
  { id: "TOK-14", title: "Zatvaranje TUR-02 â€” finalna sezona", spvId: "TUR-02", requestedBy: "Jurke MariÄiÄ‡", assignedTo: "TuristBooks d.o.o.", priority: "medium", status: "zatvoren", createdDate: "01.10.2025.", dueDate: "01.12.2025.", resolvedDate: "28.11.2025.", slaHours: 720, slaBreached: false, category: "zatvaranje", description: "Glamping projekt zatvoren â€” sezona uspjeÅ¡na" },
  { id: "TOK-15", title: "Aktivacija GreenEnergy na SAN-01", spvId: "SAN-01", requestedBy: "Jurke MariÄiÄ‡", assignedTo: "GreenEnergy Consult", priority: "low", status: "rijeÅ¡en", createdDate: "15.01.2026.", dueDate: "05.02.2026.", resolvedDate: "05.02.2026.", slaHours: 168, slaBreached: false, category: "assignment", description: "Energetski certifikat dodijeljen" },
  { id: "TOK-16", title: "Naplata IR-2025-048 â€” TUR-02 stari", spvId: "TUR-02", requestedBy: "CORE sustav", assignedTo: "Jurke MariÄiÄ‡", priority: "medium", status: "rijeÅ¡en", createdDate: "01.12.2025.", dueDate: "15.12.2025.", resolvedDate: "28.11.2025.", slaHours: 72, slaBreached: false, category: "naplata", description: "Success fee naplaÄ‡en" },

  // JoÅ¡ par otvorenih
  { id: "TOK-17", title: "Pregled IoT specifikacije â€” TEC-01", spvId: "TEC-01", requestedBy: "Digital Systems d.o.o.", assignedTo: "Jurke MariÄiÄ‡", priority: "medium", status: "otvoren", createdDate: "15.02.2026.", dueDate: "01.03.2026.", resolvedDate: null, slaHours: 120, slaBreached: false, category: "pregled", description: "IoT specifikacija Äeka CORE pregled" },
  { id: "TOK-18", title: "D&O polica â€” upit osiguravateljima", spvId: "SAN-01", requestedBy: "Jurke MariÄiÄ‡", assignedTo: "Pravo & Savjet d.o.o.", priority: "low", status: "otvoren", createdDate: "01.02.2026.", dueDate: "31.03.2026.", resolvedDate: null, slaHours: 720, slaBreached: false, category: "admin", description: "Potrebna D&O polica 400-800 EUR godiÅ¡nje" },
  { id: "TOK-19", title: "GDPR politika â€” finalizacija", spvId: "SAN-01", requestedBy: "Pravo & Savjet d.o.o.", assignedTo: "Jurke MariÄiÄ‡", priority: "medium", status: "otvoren", createdDate: "10.02.2026.", dueDate: "31.03.2026.", resolvedDate: null, slaHours: 336, slaBreached: false, category: "compliance", description: "GDPR politika u draftu â€” Äeka finalizaciju" },
  { id: "TOK-20", title: "Financijski model SAN-02 â€” pregled", spvId: "SAN-02", requestedBy: "FinanceAdvisors d.o.o.", assignedTo: "Jurke MariÄiÄ‡", priority: "high", status: "otvoren", createdDate: "15.02.2026.", dueDate: "01.03.2026.", resolvedDate: null, slaHours: 72, slaBreached: false, category: "pregled", description: "Financijski model Äeka CORE odobrenje" },
];

// â”€â”€â”€ ACTIVITY LOG (50) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const ACTIVITY_LOG: ActivityLog[] = [
  { id: "AL-50", timestamp: "21.02.2026. 14:30", action: "Dokument uploadiran", actor: "Jurke MariÄiÄ‡", spvId: "SAN-01", entityType: "document", entityId: "DOC-29", details: "RIVUS CORE Arhitektura v1.1 uploadirana", category: "document" },
  { id: "AL-49", timestamp: "20.02.2026. 16:00", action: "RaÄun plaÄ‡en", actor: "SPV SAN-02", spvId: "SAN-02", entityType: "invoice", entityId: "II-06", details: "IR-2026-006 â€” platform fee veljaÄa plaÄ‡en", category: "billing" },
  { id: "AL-48", timestamp: "20.02.2026. 15:00", action: "RaÄun plaÄ‡en", actor: "SPV SAN-01", spvId: "SAN-01", entityType: "invoice", entityId: "II-01", details: "IR-2026-001 â€” platform fee veljaÄa plaÄ‡en", category: "billing" },
  { id: "AL-47", timestamp: "20.02.2026. 10:00", action: "Rashod plaÄ‡en", actor: "CORE d.o.o.", spvId: null, entityType: "invoice", entityId: "RI-01", details: "Pravo & Savjet â€” NKD analiza 750 EUR", category: "billing" },
  { id: "AL-46", timestamp: "19.02.2026. 14:00", action: "RaÄun plaÄ‡en", actor: "SPV INF-01", spvId: "INF-01", entityType: "invoice", entityId: "II-12", details: "IR-2026-012 â€” platform fee veljaÄa plaÄ‡en", category: "billing" },
  { id: "AL-45", timestamp: "19.02.2026. 11:00", action: "Provizija plaÄ‡ena", actor: "BuildControl d.o.o.", spvId: "SAN-01", entityType: "invoice", entityId: "II-27", details: "IR-2026-019 â€” nadzor provizija 1.800 EUR", category: "billing" },
  { id: "AL-44", timestamp: "18.02.2026. 16:00", action: "Due diligence uploadiran", actor: "Pravo & Savjet d.o.o.", spvId: "INF-01", entityType: "document", entityId: "DOC-23", details: "Due diligence report Äeka pregled", category: "document" },
  { id: "AL-43", timestamp: "18.02.2026. 14:00", action: "Zadatak kreiran", actor: "Jurke MariÄiÄ‡", spvId: "SAN-01", entityType: "task", entityId: "TSK-25", details: "Nadzor proljetna inspekcija SAN-01", category: "task" },
  { id: "AL-42", timestamp: "18.02.2026. 10:00", action: "Odluka â€” odbijeno", actor: "Jurke MariÄiÄ‡", spvId: "SAN-01", entityType: "decision", entityId: "DEC-09", details: "Ponuda izvoÄ‘aÄa B odbijena â€” cijena previsoka", category: "approval" },
  { id: "AL-41", timestamp: "15.02.2026. 16:00", action: "Financijski model uploadiran", actor: "FinanceAdvisors d.o.o.", spvId: "SAN-02", entityType: "document", entityId: "DOC-09", details: "Financijski model SAN-02 â€” Äeka pregled", category: "document" },
  { id: "AL-40", timestamp: "15.02.2026. 14:00", action: "TOK zahtjev kreiran", actor: "CORE sustav", spvId: "SAN-02", entityType: "tok", entityId: "TOK-20", details: "Financijski model Äeka CORE odobrenje", category: "tok" },
  { id: "AL-39", timestamp: "15.02.2026. 12:00", action: "Zadatak kreiran", actor: "Jurke MariÄiÄ‡", spvId: "SAN-01", entityType: "task", entityId: "TSK-17", details: "NKD migracija â€” priprema dokumentacije", category: "task" },
  { id: "AL-38", timestamp: "15.02.2026. 10:00", action: "RaÄuni izdani (batch)", actor: "CORE sustav", spvId: null, entityType: "invoice", entityId: "batch-feb", details: "6 raÄuna izdano za veljaÄa 2026", category: "billing" },
  { id: "AL-37", timestamp: "14.02.2026. 14:00", action: "RaÄun plaÄ‡en", actor: "SPV TUR-01", spvId: "TUR-01", entityType: "invoice", entityId: "II-11", details: "CORE pregled â€” inicijalna analiza 1.000 EUR", category: "billing" },
  { id: "AL-36", timestamp: "13.02.2026. 16:00", action: "RaÄun plaÄ‡en", actor: "SPV TEC-01", spvId: "TEC-01", entityType: "invoice", entityId: "II-26", details: "CORE pregled TEC-01 â€” 1.000 EUR", category: "billing" },
  { id: "AL-35", timestamp: "10.02.2026. 16:00", action: "BLOKADA AKTIVIRANA", actor: "CORE sustav", spvId: "SOL-01", entityType: "lifecycle", entityId: "SOL-01", details: "SPV SOL-01 blokiran â€” nedostaje elaborat okoliÅ¡a", category: "block" },
  { id: "AL-34", timestamp: "10.02.2026. 15:00", action: "Odluka â€” blokada odobrena", actor: "Jurke MariÄiÄ‡", spvId: "SOL-01", entityType: "decision", entityId: "DEC-04", details: "Mandatory dokument nedostaje â€” blokada potvrÄ‘ena", category: "approval" },
  { id: "AL-33", timestamp: "10.02.2026. 14:00", action: "IoT specifikacija uploadirana", actor: "Digital Systems d.o.o.", spvId: "TEC-01", entityType: "document", entityId: "DOC-24", details: "Draft specifikacija â€” Äeka pregled", category: "document" },
  { id: "AL-32", timestamp: "10.02.2026. 10:00", action: "TOK â€” dodijeli knjigovoÄ‘u SOL-02", actor: "CORE sustav", spvId: "SOL-02", entityType: "tok", entityId: "TOK-05", details: "SPV bez knjigovoÄ‘e â€” compliance risk", category: "tok" },
  { id: "AL-31", timestamp: "05.02.2026. 16:00", action: "Energetski certifikat uploadiran", actor: "GreenEnergy Consult", spvId: "SAN-01", entityType: "document", entityId: "DOC-06", details: "Certifikat odobren za SAN-01", category: "document" },
  { id: "AL-30", timestamp: "05.02.2026. 14:00", action: "TOK rijeÅ¡en â€” GreenEnergy aktiviran", actor: "GreenEnergy Consult", spvId: "SAN-01", entityType: "tok", entityId: "TOK-15", details: "Energetski certifikat dodijeljen na SAN-01", category: "assignment" },
  { id: "AL-29", timestamp: "01.02.2026. 14:00", action: "Analiza trÅ¾iÅ¡ta zavrÅ¡ena", actor: "Agro Savjetovanje d.o.o.", spvId: "AGR-01", entityType: "task", entityId: "TSK-10", details: "TrÅ¾iÅ¡na analiza lavande â€” zavrÅ¡ena", category: "task" },
  { id: "AL-28", timestamp: "01.02.2026. 10:00", action: "Vertikala aktivirana â€” EcoPermit na INF-01", actor: "Jurke MariÄiÄ‡", spvId: "INF-01", entityType: "decision", entityId: "DEC-10", details: "OkoliÅ¡na dozvola za industrijsku zonu", category: "assignment" },
  { id: "AL-27", timestamp: "28.01.2026. 16:00", action: "Glavni projekt odobren", actor: "Jurke MariÄiÄ‡", spvId: "SAN-01", entityType: "decision", entityId: "DEC-01", details: "Revizija proÅ¡la â€” projekt odobren v3", category: "approval" },
  { id: "AL-26", timestamp: "28.01.2026. 10:00", action: "Zadatak zavrÅ¡en â€” revizija", actor: "Arhitekt Studio d.o.o.", spvId: "SAN-01", entityType: "task", entityId: "TSK-03", details: "Revizija glavnog projekta zavrÅ¡ena", category: "task" },
  { id: "AL-25", timestamp: "15.01.2026. 14:00", action: "RaÄuni izdani (batch)", actor: "CORE sustav", spvId: null, entityType: "invoice", entityId: "batch-jan", details: "5 raÄuna izdano za sijeÄanj 2026", category: "billing" },
  { id: "AL-24", timestamp: "10.01.2026. 10:00", action: "Geodetski elaborat zavrÅ¡en", actor: "Geodet Plus d.o.o.", spvId: "SAN-01", entityType: "task", entityId: "TSK-04", details: "Elaborat predan â€” faza geodezija gotova", category: "task" },
  { id: "AL-23", timestamp: "05.01.2026. 10:00", action: "SPV AGR-01 kreiran", actor: "Jurke MariÄiÄ‡", spvId: "AGR-01", entityType: "lifecycle", entityId: "AGR-01", details: "Novi SPV â€” Slavonska farma, sektor Agro", category: "lifecycle" },
  { id: "AL-22", timestamp: "01.01.2026. 10:00", action: "CORE-SPV ugovor potpisan", actor: "Jurke MariÄiÄ‡", spvId: "SAN-01", entityType: "document", entityId: "DOC-05", details: "Ugovor SAN-01 aktiviran za 2026.", category: "document" },
  { id: "AL-21", timestamp: "15.12.2025. 14:00", action: "NDA potpisan â€” Pravo & Savjet", actor: "Jurke MariÄiÄ‡", spvId: null, entityType: "document", entityId: "DOC-NDA-03", details: "NDA za sve sektore", category: "document" },
  { id: "AL-20", timestamp: "10.12.2025. 16:00", action: "Projekt SAN-03 zatvoren", actor: "Jurke MariÄiÄ‡", spvId: "SAN-03", entityType: "lifecycle", entityId: "SAN-03", details: "Faza: ZavrÅ¡eno â€” svi stanovi prodani", category: "lifecycle" },
  { id: "AL-19", timestamp: "03.12.2025. 10:00", action: "Success fee SAN-03 plaÄ‡en", actor: "SPV SAN-03", spvId: "SAN-03", entityType: "invoice", entityId: "II-20", details: "5.200 EUR â€” 10% neto profita", category: "billing" },
  { id: "AL-18", timestamp: "28.11.2025. 16:00", action: "Projekt TUR-02 zatvoren", actor: "Jurke MariÄiÄ‡", spvId: "TUR-02", entityType: "lifecycle", entityId: "TUR-02", details: "Faza: ZavrÅ¡eno â€” sezona uspjeÅ¡na", category: "lifecycle" },
  { id: "AL-17", timestamp: "28.11.2025. 14:00", action: "Success fee TUR-02 plaÄ‡en", actor: "SPV TUR-02", spvId: "TUR-02", entityType: "invoice", entityId: "II-18", details: "7.800 EUR â€” 10% neto profita", category: "billing" },
  { id: "AL-16", timestamp: "20.11.2025. 10:00", action: "SPV TUR-01 kreiran", actor: "Jurke MariÄiÄ‡", spvId: "TUR-01", entityType: "lifecycle", entityId: "TUR-01", details: "Novi SPV â€” Vila Maestral, sektor Turizam", category: "lifecycle" },
  { id: "AL-15", timestamp: "15.11.2025. 14:00", action: "Faza promjena: ZavrÅ¡eno â€” SAN-03", actor: "CORE sustav", spvId: "SAN-03", entityType: "lifecycle", entityId: "SAN-03", details: "Lifecycle: Aktivna gradnja â†’ ZavrÅ¡eno", category: "lifecycle" },
  { id: "AL-14", timestamp: "14.11.2025. 10:00", action: "Idejni projekt SAN-02 uploadiran", actor: "Arhitekt Studio d.o.o.", spvId: "SAN-02", entityType: "document", entityId: "DOC-07", details: "28.5 MB â€” odobren", category: "document" },
  { id: "AL-13", timestamp: "01.11.2025. 10:00", action: "Vertikala aktivirana â€” Arhitekt na SAN-02", actor: "Jurke MariÄiÄ‡", spvId: "SAN-02", entityType: "decision", entityId: "DEC-03", details: "Projektiranje za SAN-02", category: "assignment" },
  { id: "AL-12", timestamp: "01.10.2025. 16:00", action: "Faza promjena: ZavrÅ¡eno â€” TUR-02", actor: "CORE sustav", spvId: "TUR-02", entityType: "lifecycle", entityId: "TUR-02", details: "Lifecycle: Aktivna gradnja â†’ ZavrÅ¡eno", category: "lifecycle" },
  { id: "AL-11", timestamp: "10.09.2025. 10:00", action: "SPV SOL-01 kreiran", actor: "Jurke MariÄiÄ‡", spvId: "SOL-01", entityType: "lifecycle", entityId: "SOL-01", details: "Novi SPV â€” Solarna Baranja, sektor Energetika", category: "lifecycle" },
  { id: "AL-10", timestamp: "01.07.2025. 10:00", action: "SPV INF-01 kreiran", actor: "Jurke MariÄiÄ‡", spvId: "INF-01", entityType: "lifecycle", entityId: "INF-01", details: "Novi SPV â€” LogistiÄki centar OS", category: "lifecycle" },
  { id: "AL-09", timestamp: "01.06.2025. 10:00", action: "SPV SAN-02 kreiran", actor: "Jurke MariÄiÄ‡", spvId: "SAN-02", entityType: "lifecycle", entityId: "SAN-02", details: "Novi SPV â€” Vukovarska 12", category: "lifecycle" },
  { id: "AL-08", timestamp: "15.04.2024. 10:00", action: "SPV TUR-02 kreiran", actor: "Jurke MariÄiÄ‡", spvId: "TUR-02", entityType: "lifecycle", entityId: "TUR-02", details: "Novi SPV â€” Glamping Plitvice", category: "lifecycle" },
  { id: "AL-07", timestamp: "15.03.2025. 10:00", action: "SPV SAN-01 kreiran", actor: "Jurke MariÄiÄ‡", spvId: "SAN-01", entityType: "lifecycle", entityId: "SAN-01", details: "Novi SPV â€” Å andora Petefija 4", category: "lifecycle" },
  { id: "AL-06", timestamp: "01.02.2024. 10:00", action: "SPV SAN-03 kreiran", actor: "Jurke MariÄiÄ‡", spvId: "SAN-03", entityType: "lifecycle", entityId: "SAN-03", details: "Novi SPV â€” Strossmayerova 15", category: "lifecycle" },
  { id: "AL-05", timestamp: "01.06.2025. 08:00", action: "CORE d.o.o. osnovan", actor: "Jurke MariÄiÄ‡", spvId: null, entityType: "lifecycle", entityId: "CORE", details: "Temeljni kapital 2.500 EUR uplaÄ‡en", category: "lifecycle" },
  { id: "AL-04", timestamp: "12.12.2025. 10:00", action: "RIVUS Holding osnovan", actor: "Jurke MariÄiÄ‡", spvId: null, entityType: "lifecycle", entityId: "HOLDING", details: "Brand guardian i IP holder", category: "lifecycle" },
  { id: "AL-03", timestamp: "01.12.2025. 10:00", action: "SPV TEC-01 kreiran", actor: "Jurke MariÄiÄ‡", spvId: "TEC-01", entityType: "lifecycle", entityId: "TEC-01", details: "Novi SPV â€” Smart Building OS", category: "lifecycle" },
  { id: "AL-02", timestamp: "10.02.2026. 10:00", action: "SPV SOL-02 kreiran", actor: "Jurke MariÄiÄ‡", spvId: "SOL-02", entityType: "lifecycle", entityId: "SOL-02", details: "Novi SPV â€” EV Hub Osijek", category: "lifecycle" },
  { id: "AL-01", timestamp: "21.02.2026. 16:00", action: "Safety framing labels aÅ¾urirani", actor: "CORE sustav", spvId: null, entityType: "lifecycle", entityId: "CORE", details: "Financije(management), PDV(simulacija), Bilanca(informativna)", category: "lifecycle" },
];

// â”€â”€â”€ UGOVORI (18) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const CONTRACTS: Contract[] = [
  // CORE-SPV
  { id: "CON-01", number: "UG-2026-001", type: "CORE-SPV", partyA: "CORE d.o.o.", partyB: "SPV SAN-01", partyBId: "SAN-01", startDate: "01.01.2026.", endDate: "31.12.2026.", services: "Brand + Platform + PM", monthlyFee: 3000, commissionPercent: 10, status: "aktivan" },
  { id: "CON-02", number: "UG-2026-002", type: "CORE-SPV", partyA: "CORE d.o.o.", partyB: "SPV SAN-02", partyBId: "SAN-02", startDate: "15.01.2026.", endDate: "31.12.2026.", services: "Brand + Platform", monthlyFee: 500, commissionPercent: 10, status: "aktivan" },
  { id: "CON-03", number: "UG-2025-015", type: "CORE-SPV", partyA: "CORE d.o.o.", partyB: "SPV SOL-01", partyBId: "SOL-01", startDate: "10.09.2025.", endDate: "01.06.2027.", services: "Brand + Platform", monthlyFee: 500, commissionPercent: 10, status: "aktivan" },
  { id: "CON-04", number: "UG-2025-020", type: "CORE-SPV", partyA: "CORE d.o.o.", partyB: "SPV INF-01", partyBId: "INF-01", startDate: "01.07.2025.", endDate: "01.12.2027.", services: "Brand + Platform", monthlyFee: 500, commissionPercent: 10, status: "aktivan" },
  { id: "CON-05", number: "UG-2025-008", type: "CORE-SPV", partyA: "CORE d.o.o.", partyB: "SPV SAN-03", partyBId: "SAN-03", startDate: "01.02.2024.", endDate: "15.11.2025.", services: "Brand + Platform + PM", monthlyFee: 0, commissionPercent: 10, status: "istekao" },
  { id: "CON-06", number: "UG-2024-003", type: "CORE-SPV", partyA: "CORE d.o.o.", partyB: "SPV TUR-02", partyBId: "TUR-02", startDate: "15.04.2024.", endDate: "01.10.2025.", services: "Brand + Platform + PM", monthlyFee: 0, commissionPercent: 10, status: "istekao" },

  // CORE-Vertikale
  { id: "CON-07", number: "UG-2026-003", type: "CORE-vertikala", partyA: "CORE d.o.o.", partyB: "Arhitekt Studio d.o.o.", partyBId: "VER-01", startDate: "01.02.2026.", endDate: "01.02.2027.", services: "Projektiranje â€” provizija 8%", monthlyFee: null, commissionPercent: 8, status: "aktivan" },
  { id: "CON-08", number: "UG-2026-004", type: "CORE-vertikala", partyA: "CORE d.o.o.", partyB: "Geodet Plus d.o.o.", partyBId: "VER-02", startDate: "10.01.2026.", endDate: "10.01.2027.", services: "Geodezija â€” provizija 10%", monthlyFee: null, commissionPercent: 10, status: "aktivan" },
  { id: "CON-09", number: "UG-2025-022", type: "CORE-vertikala", partyA: "CORE d.o.o.", partyB: "Pravo & Savjet d.o.o.", partyBId: "VER-03", startDate: "15.12.2025.", endDate: "15.12.2026.", services: "Pravni â€” provizija 12%", monthlyFee: null, commissionPercent: 12, status: "aktivan" },
  { id: "CON-10", number: "UG-2025-005", type: "CORE-vertikala", partyA: "CORE d.o.o.", partyB: "BuildControl d.o.o.", partyBId: "VER-08", startDate: "01.04.2025.", endDate: "01.04.2026.", services: "Nadzor â€” provizija 8%", monthlyFee: null, commissionPercent: 8, status: "istjeÄe" },

  // CORE-KnjigovoÄ‘e
  { id: "CON-11", number: "UG-2026-005", type: "CORE-knjigovodja", partyA: "CORE d.o.o.", partyB: "RaÄunovodstvo Sigma d.o.o.", partyBId: "ACC-01", startDate: "01.01.2026.", endDate: "31.12.2026.", services: "CORE + Holding + SAN-01/02/03", monthlyFee: 350, commissionPercent: null, status: "aktivan" },
  { id: "CON-12", number: "UG-2025-018", type: "CORE-knjigovodja", partyA: "CORE d.o.o.", partyB: "Financa Plus d.o.o.", partyBId: "ACC-02", startDate: "01.10.2025.", endDate: "30.09.2026.", services: "SOL-01 + INF-01 + TEC-01", monthlyFee: 250, commissionPercent: null, status: "aktivan" },
  { id: "CON-13", number: "UG-2024-001", type: "CORE-knjigovodja", partyA: "CORE d.o.o.", partyB: "TuristBooks d.o.o.", partyBId: "ACC-04", startDate: "15.04.2024.", endDate: "15.04.2026.", services: "TUR-01 + TUR-02", monthlyFee: 200, commissionPercent: null, status: "istjeÄe" },

  // NDA-ovi
  { id: "CON-14", number: "NDA-001", type: "NDA", partyA: "CORE d.o.o.", partyB: "Geodet Plus d.o.o.", partyBId: "VER-02", startDate: "10.01.2026.", endDate: "10.01.2028.", services: "NDA â€” 2 godine", monthlyFee: null, commissionPercent: null, status: "aktivan" },
  { id: "CON-15", number: "NDA-002", type: "NDA", partyA: "CORE d.o.o.", partyB: "Arhitekt Studio d.o.o.", partyBId: "VER-01", startDate: "01.02.2026.", endDate: "01.02.2028.", services: "NDA â€” 2 godine", monthlyFee: null, commissionPercent: null, status: "aktivan" },
  { id: "CON-16", number: "NDA-003", type: "NDA", partyA: "CORE d.o.o.", partyB: "EcoPermit d.o.o.", partyBId: "VER-10", startDate: "05.01.2026.", endDate: "05.01.2028.", services: "NDA â€” 2 godine", monthlyFee: null, commissionPercent: null, status: "aktivan" },
  { id: "CON-17", number: "NDA-004", type: "NDA", partyA: "CORE d.o.o.", partyB: "TuristPlan d.o.o.", partyBId: "VER-07", startDate: "01.02.2026.", endDate: "01.02.2028.", services: "NDA â€” 2 godine", monthlyFee: null, commissionPercent: null, status: "aktivan" },
  { id: "CON-18", number: "NDA-005", type: "NDA", partyA: "CORE d.o.o.", partyB: "Digital Systems d.o.o.", partyBId: "VER-09", startDate: "15.01.2026.", endDate: "15.01.2028.", services: "NDA â€” 2 godine", monthlyFee: null, commissionPercent: null, status: "aktivan" },
];

// â”€â”€â”€ PDV KVARTALI â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const PDV_QUARTERS: PdvQuarter[] = [
  { quarter: "Q1 2026", year: 2026, inputVat: 4120, outputVat: 2950, difference: 1170, status: "u_pripremi", dueDate: "20.04.2026." },
  { quarter: "Q4 2025", year: 2025, inputVat: 3850, outputVat: 2680, difference: 1170, status: "plaÄ‡eno", dueDate: "20.01.2026." },
  { quarter: "Q3 2025", year: 2025, inputVat: 2100, outputVat: 1450, difference: 650, status: "plaÄ‡eno", dueDate: "20.10.2025." },
  { quarter: "Q2 2025", year: 2025, inputVat: 980, outputVat: 320, difference: 660, status: "plaÄ‡eno", dueDate: "20.07.2025." },
];

// â”€â”€â”€ P&L PO MJESECIMA (12 mjeseci) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const PNL_MONTHS: PnlMonth[] = [
  { month: "VeljaÄa 2026.", monthNum: 2, year: 2026, revenue: 9350, expenses: 5870, net: 3480, margin: 37.2,
    revenueBreakdown: { platformFees: 1200, brandLicence: 400, pmServices: 2500, successFees: 0, verticalCommissions: 5250 } },
  { month: "SijeÄanj 2026.", monthNum: 1, year: 2026, revenue: 5100, expenses: 4645, net: 455, margin: 8.9,
    revenueBreakdown: { platformFees: 900, brandLicence: 200, pmServices: 2500, successFees: 0, verticalCommissions: 1500 } },
  { month: "Prosinac 2025.", monthNum: 12, year: 2025, revenue: 6100, expenses: 3200, net: 2900, margin: 47.5,
    revenueBreakdown: { platformFees: 300, brandLicence: 0, pmServices: 0, successFees: 5200, verticalCommissions: 600 } },
  { month: "Studeni 2025.", monthNum: 11, year: 2025, revenue: 8900, expenses: 5050, net: 3850, margin: 43.3,
    revenueBreakdown: { platformFees: 300, brandLicence: 0, pmServices: 0, successFees: 7800, verticalCommissions: 800 } },
  { month: "Listopad 2025.", monthNum: 10, year: 2025, revenue: 1400, expenses: 5300, net: -3900, margin: -278.6,
    revenueBreakdown: { platformFees: 600, brandLicence: 0, pmServices: 0, successFees: 0, verticalCommissions: 800 } },
  { month: "Rujan 2025.", monthNum: 9, year: 2025, revenue: 600, expenses: 345, net: 255, margin: 42.5,
    revenueBreakdown: { platformFees: 300, brandLicence: 0, pmServices: 0, successFees: 0, verticalCommissions: 300 } },
  { month: "Kolovoz 2025.", monthNum: 8, year: 2025, revenue: 300, expenses: 45, net: 255, margin: 85.0,
    revenueBreakdown: { platformFees: 300, brandLicence: 0, pmServices: 0, successFees: 0, verticalCommissions: 0 } },
  { month: "Srpanj 2025.", monthNum: 7, year: 2025, revenue: 300, expenses: 45, net: 255, margin: 85.0,
    revenueBreakdown: { platformFees: 300, brandLicence: 0, pmServices: 0, successFees: 0, verticalCommissions: 0 } },
  { month: "Lipanj 2025.", monthNum: 6, year: 2025, revenue: 0, expenses: 1500, net: -1500, margin: 0,
    revenueBreakdown: { platformFees: 0, brandLicence: 0, pmServices: 0, successFees: 0, verticalCommissions: 0 } },
];

// â”€â”€â”€ HELPER FUNCTIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// SPV helpers
export const getSpvById = (id: string) => SPVS.find((s) => s.id === id);
export const getSpvsByStatus = (status: SpvStatus) => SPVS.filter((s) => s.status === status);
export const getSpvsBySector = (sector: Sector) => SPVS.filter((s) => s.sector === sector);
export const getSpvsByPhase = (phase: SpvPhase) => SPVS.filter((s) => s.phase === phase);
export const getActiveSpvs = () => SPVS.filter((s) => s.status === "aktivan" || s.status === "blokiran");
export const getBlockedSpvs = () => SPVS.filter((s) => s.status === "blokiran");

// Invoice helpers
export const getIssuedBySpv = (spvId: string) => ISSUED_INVOICES.filter((i) => i.spvId === spvId);
export const getReceivedBySpv = (spvId: string) => RECEIVED_INVOICES.filter((i) => i.spvId === spvId);
export const getUnpaidIssued = () => ISSUED_INVOICES.filter((i) => i.status === "Äeka" || i.status === "kasni");
export const getOverdueIssued = () => ISSUED_INVOICES.filter((i) => i.status === "kasni");
export const getInvoicesByCategory = (cat: string) => ISSUED_INVOICES.filter((i) => i.category === cat);

// Transaction helpers
export const getTransactionsBySpv = (spvId: string) => TRANSACTIONS.filter((t) => t.spvId === spvId);
export const getCurrentBalance = () => TRANSACTIONS[0]?.balance ?? 0;
export const getMonthTransactions = (month: number, year: number) =>
  TRANSACTIONS.filter((t) => {
    const parts = t.date.split(".");
    return parseInt(parts[1]) === month && parseInt(parts[2]) === year;
  });

// Vertical helpers
export const getActiveVerticals = () => VERTICALS.filter((v) => v.active);
export const getVerticalsBySpv = (spvId: string) => VERTICALS.filter((v) => v.assignedSpvs.includes(spvId));
export const getVerticalById = (id: string) => VERTICALS.find((v) => v.id === id);

// Accountant helpers
export const getAccountantBySpv = (spvId: string) => ACCOUNTANTS.find((a) => a.coversSpvs.includes(spvId));
export const getSpvsWithoutAccountant = () => SPVS.filter((s) => !s.accountantId);

// Task helpers
export const getTasksBySpv = (spvId: string) => TASKS.filter((t) => t.spvId === spvId);
export const getOpenTasks = () => TASKS.filter((t) => t.status === "otvoren" || t.status === "u_tijeku");
export const getBlockedTasks = () => TASKS.filter((t) => t.status === "blokiran" || t.status === "eskaliran");
export const getCriticalTasks = () => TASKS.filter((t) => t.priority === "critical");

// Document helpers
export const getDocsBySpv = (spvId: string) => DOCUMENTS.filter((d) => d.spvId === spvId);
export const getMandatoryDocs = (spvId: string) => DOCUMENTS.filter((d) => d.spvId === spvId && d.mandatory);
export const getMissingDocs = () => DOCUMENTS.filter((d) => d.status === "nedostaje");
export const getPendingDocs = () => DOCUMENTS.filter((d) => d.status === "Äeka_pregled");

// Decision helpers
export const getPendingDecisions = () => DECISIONS.filter((d) => d.status === "na_Äekanju");
export const getDecisionsBySpv = (spvId: string) => DECISIONS.filter((d) => d.spvId === spvId);

// TOK helpers
export const getOpenTokRequests = () => TOK_REQUESTS.filter((t) => t.status === "otvoren" || t.status === "u_tijeku" || t.status === "eskaliran");
export const getEscalatedTok = () => TOK_REQUESTS.filter((t) => t.status === "eskaliran");
export const getSlaBreached = () => TOK_REQUESTS.filter((t) => t.slaBreached);
export const getTokBySpv = (spvId: string) => TOK_REQUESTS.filter((t) => t.spvId === spvId);

// Activity helpers
export const getRecentActivity = (n: number = 10) => ACTIVITY_LOG.slice(0, n);
export const getActivityBySpv = (spvId: string) => ACTIVITY_LOG.filter((a) => a.spvId === spvId);
export const getActivityByCategory = (cat: ActivityLog["category"]) => ACTIVITY_LOG.filter((a) => a.category === cat);

// Contract helpers
export const getActiveContracts = () => CONTRACTS.filter((c) => c.status === "aktivan");
export const getExpiringContracts = () => CONTRACTS.filter((c) => c.status === "istjeÄe");
export const getContractsByType = (type: Contract["type"]) => CONTRACTS.filter((c) => c.type === type);

// Aggregate helpers
export const getPentagonSummary = () => ({
  totalSpvs: SPVS.length,
  active: SPVS.filter((s) => s.status === "aktivan").length,
  blocked: SPVS.filter((s) => s.status === "blokiran").length,
  inProgress: SPVS.filter((s) => s.status === "u_izradi").length,
  waiting: SPVS.filter((s) => s.status === "na_cekanju").length,
  completed: SPVS.filter((s) => s.status === "zavrsen").length,
  sectors: Array.from(new Set(SPVS.map((s) => s.sector))).length,
  totalBudget: SPVS.reduce((sum, s) => sum + s.totalBudget, 0),
  totalEstimatedProfit: SPVS.reduce((sum, s) => sum + s.estimatedProfit, 0),
});

export const getFinanceSummary = () => {
  const totalRevenue = PNL_MONTHS.reduce((sum, m) => sum + m.revenue, 0);
  const totalExpenses = PNL_MONTHS.reduce((sum, m) => sum + m.expenses, 0);
  const unpaid = getUnpaidIssued().reduce((sum, i) => sum + i.totalAmount, 0);
  const overdue = getOverdueIssued().reduce((sum, i) => sum + i.totalAmount, 0);
  return {
    totalRevenue,
    totalExpenses,
    netResult: totalRevenue - totalExpenses,
    currentBalance: getCurrentBalance(),
    unpaidInvoices: unpaid,
    overdueInvoices: overdue,
    activeContracts: getActiveContracts().length,
  };
};

export const getComplianceSummary = () => ({
  missingDocs: getMissingDocs().length,
  pendingDocs: getPendingDocs().length,
  blockedSpvs: getBlockedSpvs().length,
  slaBreached: getSlaBreached().length,
  escalatedTok: getEscalatedTok().length,
  spvsWithoutAccountant: getSpvsWithoutAccountant().length,
  pendingDecisions: getPendingDecisions().length,
});

// Format helpers
export const formatEur = (amount: number) =>
  amount.toLocaleString("hr-HR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " EUR";

export const formatDate = (dateStr: string) => dateStr;

