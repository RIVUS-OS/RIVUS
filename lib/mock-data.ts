// ============================================================================
// RIVUS OS — UNIFIED MOCK DATA LAYER
// lib/mock-data.ts
// Jedan izvor istine za cijeli sustav. Sve stranice importaju odavde.
// ============================================================================

// ─── TYPES ──────────────────────────────────────────────────────────────────

export type Sector = "nekretnine" | "energetika" | "turizam" | "agro" | "infrastruktura" | "tech";

export type SpvPhase =
  | "Kreirano"
  | "CORE pregled"
  | "Vertikale aktivne"
  | "Strukturirano"
  | "Financiranje"
  | "Aktivna gradnja"
  | "Završeno";

export type SpvStatus = "aktivan" | "blokiran" | "u_izradi" | "na_cekanju" | "zavrsen";

export interface Spv {
  id: string;
  code?: string;
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
  lifecycle_stage?: string;
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
  status: "plaćen" | "čeka" | "kasni" | "storniran";
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
  status: "otvoren" | "u_tijeku" | "završen" | "blokiran" | "eskaliran";
  createdDate: string;
  dueDate: string;
  completedDate: string | null;
  category: string;
}

export interface Document {
  id: string;
  name: string;
  type: "mandatory" | "ugovor" | "dozvola" | "elaborat" | "izvještaj" | "certifikat" | "ostalo";
  spvId: string;
  uploadedBy: string;
  uploadDate: string;
  status: "odobren" | "čeka_pregled" | "odbijen" | "istekao" | "nedostaje";
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
  status: "odobreno" | "odbijeno" | "na_čekanju";
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
  status: "otvoren" | "u_tijeku" | "riješen" | "eskaliran" | "zatvoren";
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
  status: "aktivan" | "istječe" | "istekao" | "u_pripremi";
}

export interface PdvQuarter {
  quarter: string;
  year: number;
  inputVat: number;
  outputVat: number;
  difference: number;
  status: "plaćeno" | "u_pripremi" | "dospjelo";
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

// ─── SECTORS ────────────────────────────────────────────────────────────────

export const SECTORS: Record<Sector, { label: string; icon: string; color: string }> = {
  nekretnine: { label: "Nekretnine", icon: "🏗️", color: "blue" },
  energetika: { label: "Energetika", icon: "⚡", color: "yellow" },
  turizam: { label: "Turizam", icon: "🏨", color: "teal" },
  agro: { label: "Agro", icon: "🌾", color: "green" },
  infrastruktura: { label: "Infrastruktura", icon: "🏭", color: "gray" },
  tech: { label: "Tech", icon: "💻", color: "purple" },
};

// ─── SPV-ovi (10) ───────────────────────────────────────────────────────────

export const SPVS: Spv[] = [
  {
    id: "SAN-01",
    code: "ŠAN-01",
    name: "Šandora Petefija 4",
    address: "Šandora Petefija 4",
    city: "Subotica",
    sector: "nekretnine",
    sectorLabel: "🏗️ Nekretnine",
    phase: "Aktivna gradnja",
    status: "aktivan",
    statusLabel: "Aktivan",
    oib: "12345678901",
    founded: "15.03.2025.",
    owner: "Jurke Maričić",
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
    code: "VUK-02",
    name: "Vukovarska 12",
    address: "Vukovarska 12",
    city: "Osijek",
    sector: "nekretnine",
    sectorLabel: "🏗️ Nekretnine",
    phase: "Strukturirano",
    status: "aktivan",
    statusLabel: "Aktivan",
    oib: "23456789012",
    founded: "01.06.2025.",
    owner: "Jurke Maričić",
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
    code: "SOL-03",
    name: "Solarna Baranja",
    address: "Industrijska zona bb",
    city: "Beli Manastir",
    sector: "energetika",
    sectorLabel: "⚡ Energetika",
    phase: "Financiranje",
    status: "blokiran",
    statusLabel: "Blokiran",
    oib: "34567890123",
    founded: "10.09.2025.",
    owner: "Jurke Maričić",
    accountantId: "ACC-02",
    bankId: "BANK-02",
    estimatedProfit: 120000,
    totalBudget: 450000,
    completionDate: "01.06.2027.",
    blockReason: "Nedostaje elaborat zaštite okoliša — mandatory dokument za fazu Financiranje",
    units: undefined,
    area: 5000,
    description: "Solarna elektrana 500kW, na poljoprivrednom zemljištu",
  },
  {
    id: "TUR-01",
    code: "VIL-04",
    name: "Vila Maestral",
    address: "Obala 22",
    city: "Makarska",
    sector: "turizam",
    sectorLabel: "🏨 Turizam",
    phase: "CORE pregled",
    status: "u_izradi",
    statusLabel: "U izradi",
    oib: "45678901234",
    founded: "20.11.2025.",
    owner: "Jurke Maričić",
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
    code: "SLA-05",
    name: "Slavonska farma",
    address: "Ruralna cesta 5",
    city: "Đakovo",
    sector: "agro",
    sectorLabel: "🌾 Agro",
    phase: "Kreirano",
    status: "na_cekanju",
    statusLabel: "Na čekanju",
    oib: "56789012345",
    founded: "05.01.2026.",
    owner: "Jurke Maričić",
    accountantId: null,
    bankId: "BANK-01",
    estimatedProfit: 35000,
    totalBudget: 120000,
    completionDate: null,
    blockReason: null,
    area: 15000,
    description: "OPG projekt — uzgoj lavande i prerađivačka linija",
  },
  {
    id: "SAN-03",
    code: "STR-06",
    name: "Strossmayerova 15",
    address: "Strossmayerova 15",
    city: "Osijek",
    sector: "nekretnine",
    sectorLabel: "🏗️ Nekretnine",
    phase: "Završeno",
    status: "zavrsen",
    statusLabel: "Završen",
    oib: "67890123456",
    founded: "01.02.2024.",
    owner: "Jurke Maričić",
    accountantId: "ACC-01",
    bankId: "BANK-01",
    estimatedProfit: 52000,
    totalBudget: 210000,
    completionDate: "15.11.2025.",
    blockReason: null,
    units: 3,
    area: 240,
    description: "Završen projekt — 3 stana, sve prodano",
  },
  {
    id: "TUR-02",
    code: "GLA-07",
    name: "Glamping Plitvice",
    address: "Jezera bb",
    city: "Plitvička Jezera",
    sector: "turizam",
    sectorLabel: "🏨 Turizam",
    phase: "Završeno",
    status: "zavrsen",
    statusLabel: "Završen",
    oib: "78901234567",
    founded: "15.04.2024.",
    owner: "Jurke Maričić",
    accountantId: "ACC-04",
    bankId: "BANK-03",
    estimatedProfit: 78000,
    totalBudget: 290000,
    completionDate: "01.10.2025.",
    blockReason: null,
    units: 12,
    area: 2000,
    description: "Glamping resort — 12 jedinica, sezona 2025. uspješna",
  },
  {
    id: "INF-01",
    code: "LOG-08",
    name: "Logistički centar OS",
    address: "Gospodarska zona 3",
    city: "Osijek",
    sector: "infrastruktura",
    sectorLabel: "🏭 Infrastruktura",
    phase: "Vertikale aktivne",
    status: "aktivan",
    statusLabel: "Aktivan",
    oib: "89012345678",
    founded: "01.07.2025.",
    owner: "Jurke Maričić",
    accountantId: "ACC-02",
    bankId: "BANK-02",
    estimatedProfit: 180000,
    totalBudget: 750000,
    completionDate: "01.12.2027.",
    blockReason: null,
    area: 8000,
    description: "Logističko-distribucijski centar, 8.000m²",
  },
  {
    id: "SOL-02",
    code: "EVH-09",
    name: "EV Hub Osijek",
    address: "Tehnološki park 1",
    city: "Osijek",
    sector: "energetika",
    sectorLabel: "⚡ Energetika",
    phase: "Kreirano",
    status: "na_cekanju",
    statusLabel: "Na čekanju",
    oib: "90123456789",
    founded: "10.02.2026.",
    owner: "Jurke Maričić",
    accountantId: null,
    bankId: "BANK-02",
    estimatedProfit: 40000,
    totalBudget: 160000,
    completionDate: null,
    blockReason: null,
    description: "Mreža EV punjača — 6 lokacija u Osijeku. Nema dodijeljenog knjigovođu.",
  },
  {
    id: "TEC-01",
    code: "SMA-10",
    name: "Smart Building OS",
    address: "IT Park 7",
    city: "Osijek",
    sector: "tech",
    sectorLabel: "💻 Tech",
    phase: "CORE pregled",
    status: "u_izradi",
    statusLabel: "U izradi",
    oib: "01234567890",
    founded: "01.12.2025.",
    owner: "Jurke Maričić",
    accountantId: "ACC-02",
    bankId: "BANK-02",
    estimatedProfit: 55000,
    totalBudget: 200000,
    completionDate: null,
    blockReason: null,
    description: "IoT sustav za upravljanje zgradama — pilot projekt",
  },
];

// ─── VERTIKALE (12) ─────────────────────────────────────────────────────────

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
    contact: "Ivan Kovačević", email: "ivan@geodetplus.hr", phone: "+385 91 222 2222",
    ndaSigned: true, ndaDate: "10.01.2026.", assignedSpvs: ["SAN-01", "SAN-02", "INF-01", "SAN-03"],
  },
  {
    id: "VER-03", name: "Pravo & Savjet d.o.o.", type: "Pravni", commission: 12,
    sectors: ["nekretnine", "energetika", "turizam", "agro", "infrastruktura", "tech"], active: true, statusLabel: "Aktivan",
    contact: "Ana Jurić", email: "ana@pravoIsavjet.hr", phone: "+385 91 333 3333",
    ndaSigned: true, ndaDate: "15.12.2025.", assignedSpvs: ["SAN-01", "SAN-02", "SOL-01", "TUR-01", "INF-01", "TEC-01"],
  },
  {
    id: "VER-04", name: "Statika Pro d.o.o.", type: "Konstrukcije", commission: 8,
    sectors: ["nekretnine", "infrastruktura"], active: true, statusLabel: "Aktivan",
    contact: "Petar Babić", email: "petar@statikapro.hr", phone: "+385 91 444 4444",
    ndaSigned: true, ndaDate: "01.03.2025.", assignedSpvs: ["SAN-01", "SAN-03", "INF-01"],
  },
  {
    id: "VER-05", name: "GreenEnergy Consult", type: "Energetski certifikati", commission: 10,
    sectors: ["energetika", "nekretnine"], active: true, statusLabel: "Aktivan",
    contact: "Luka Šimić", email: "luka@greenenergy.hr", phone: "+385 91 555 5555",
    ndaSigned: true, ndaDate: "20.01.2026.", assignedSpvs: ["SOL-01", "SOL-02", "SAN-01"],
  },
  {
    id: "VER-06", name: "Agro Savjetovanje d.o.o.", type: "Agronomija", commission: 10,
    sectors: ["agro"], active: true, statusLabel: "Aktivan",
    contact: "Tomislav Matić", email: "tomi@agrosavjet.hr", phone: "+385 91 666 6666",
    ndaSigned: true, ndaDate: "10.02.2026.", assignedSpvs: ["AGR-01"],
  },
  {
    id: "VER-07", name: "TuristPlan d.o.o.", type: "Turizam konzalting", commission: 8,
    sectors: ["turizam"], active: false, statusLabel: "NDA potpisan",
    contact: "Maja Perić", email: "maja@turistplan.hr", phone: "+385 91 777 7777",
    ndaSigned: true, ndaDate: "01.02.2026.", assignedSpvs: [],
  },
  {
    id: "VER-08", name: "BuildControl d.o.o.", type: "Nadzor gradnje", commission: 8,
    sectors: ["nekretnine", "infrastruktura"], active: true, statusLabel: "Aktivan",
    contact: "Dražen Knežević", email: "drazen@buildcontrol.hr", phone: "+385 91 888 8888",
    ndaSigned: true, ndaDate: "01.04.2025.", assignedSpvs: ["SAN-01", "SAN-03", "TUR-02"],
  },
  {
    id: "VER-09", name: "Digital Systems d.o.o.", type: "IoT / Smart sustavi", commission: 12,
    sectors: ["tech", "energetika"], active: false, statusLabel: "NDA potpisan",
    contact: "Filip Rade", email: "filip@digitalsys.hr", phone: "+385 91 999 9999",
    ndaSigned: true, ndaDate: "15.01.2026.", assignedSpvs: [],
  },
  {
    id: "VER-10", name: "EcoPermit d.o.o.", type: "Okolišne dozvole", commission: 10,
    sectors: ["energetika", "agro", "infrastruktura"], active: true, statusLabel: "Aktivan",
    contact: "Sara Vuković", email: "sara@ecopermit.hr", phone: "+385 91 100 1001",
    ndaSigned: true, ndaDate: "05.01.2026.", assignedSpvs: ["SOL-01", "AGR-01", "INF-01"],
  },
  {
    id: "VER-11", name: "FinanceAdvisors d.o.o.", type: "Financijsko savjetovanje", commission: 12,
    sectors: ["nekretnine", "energetika", "turizam", "agro", "infrastruktura", "tech"], active: true, statusLabel: "Aktivan",
    contact: "Robert Ilić", email: "robert@finadvisors.hr", phone: "+385 91 100 1002",
    ndaSigned: true, ndaDate: "01.01.2026.", assignedSpvs: ["SAN-01", "SOL-01", "INF-01", "TEC-01"],
  },
  {
    id: "VER-12", name: "MarketingPro d.o.o.", type: "Prodaja / marketing", commission: 8,
    sectors: ["nekretnine", "turizam"], active: false, statusLabel: "Pregovori",
    contact: "Nina Đurić", email: "nina@marketingpro.hr", phone: "+385 91 100 1003",
    ndaSigned: false, ndaDate: null, assignedSpvs: [],
  },
];

// ─── KNJIGOVOĐE (4) ─────────────────────────────────────────────────────────

export const ACCOUNTANTS: Accountant[] = [
  {
    id: "ACC-01", name: "Računovodstvo Sigma d.o.o.",
    coversEntities: ["CORE d.o.o.", "RIVUS Holding d.o.o."],
    coversSpvs: ["SAN-01", "SAN-02", "SAN-03"],
    pricePerMonth: 350, contact: "Ivana Novak", email: "ivana@sigma-rn.hr",
    status: "aktivan", contractDate: "01.01.2026.",
  },
  {
    id: "ACC-02", name: "Financa Plus d.o.o.",
    coversEntities: [],
    coversSpvs: ["SOL-01", "INF-01", "TEC-01"],
    pricePerMonth: 250, contact: "Mirela Tadić", email: "mirela@financaplus.hr",
    status: "aktivan", contractDate: "01.10.2025.",
  },
  {
    id: "ACC-03", name: "OPG Knjige d.o.o.",
    coversEntities: [],
    coversSpvs: [],
    pricePerMonth: 150, contact: "Josip Barić", email: "josip@opgknjige.hr",
    status: "ugovor_u_pripremi", contractDate: null,
  },
  {
    id: "ACC-04", name: "TuristBooks d.o.o.",
    coversEntities: [],
    coversSpvs: ["TUR-01", "TUR-02"],
    pricePerMonth: 200, contact: "Lana Petrović", email: "lana@turistbooks.hr",
    status: "aktivan", contractDate: "15.04.2024.",
  },
];

// ─── BANKE (3) ──────────────────────────────────────────────────────────────

export const BANKS: Bank[] = [
  {
    id: "BANK-01", name: "PBZ",
    spvs: ["SAN-01", "SAN-02", "SAN-03", "AGR-01"],
    relationshipType: "Kredit + žiro",
    contact: "Mario Novak", status: "aktivan", evaluationPending: null,
  },
  {
    id: "BANK-02", name: "Erste",
    spvs: ["SOL-01", "INF-01", "SOL-02", "TEC-01"],
    relationshipType: "Kredit + žiro",
    contact: "Katarina Šimunić", status: "aktivan", evaluationPending: null,
  },
  {
    id: "BANK-03", name: "OTP",
    spvs: ["TUR-01", "TUR-02"],
    relationshipType: "Žiro + kredit evaluacija",
    contact: "Denis Miler", status: "aktivan", evaluationPending: "TUR-01",
  },
];

// ─── IZDANI RAČUNI (30) ─────────────────────────────────────────────────────

export const ISSUED_INVOICES: Invoice[] = [
  // SAN-01 — Aktivan, gradnja
  { id: "II-01", number: "IR-2026-001", type: "izdani", date: "15.02.2026.", dueDate: "01.03.2026.", client: "SPV SAN-01", clientId: "SAN-01", spvId: "SAN-01", description: "Platform fee — veljača 2026.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaćen", paidDate: "18.02.2026.", category: "platform_fee" },
  { id: "II-02", number: "IR-2026-002", type: "izdani", date: "15.02.2026.", dueDate: "01.03.2026.", client: "SPV SAN-01", clientId: "SAN-01", spvId: "SAN-01", description: "Brand licenca — veljača 2026.", netAmount: 160, vatRate: 25, vatAmount: 40, totalAmount: 200, status: "plaćen", paidDate: "18.02.2026.", category: "brand_licence" },
  { id: "II-03", number: "IR-2026-003", type: "izdani", date: "05.02.2026.", dueDate: "20.02.2026.", client: "SPV SAN-01", clientId: "SAN-01", spvId: "SAN-01", description: "PM usluga — veljača 2026.", netAmount: 2000, vatRate: 25, vatAmount: 500, totalAmount: 2500, status: "kasni", paidDate: null, category: "pm_service" },
  { id: "II-04", number: "IR-2026-004", type: "izdani", date: "15.01.2026.", dueDate: "31.01.2026.", client: "SPV SAN-01", clientId: "SAN-01", spvId: "SAN-01", description: "Platform fee — siječanj 2026.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaćen", paidDate: "28.01.2026.", category: "platform_fee" },
  { id: "II-05", number: "IR-2026-005", type: "izdani", date: "15.01.2026.", dueDate: "31.01.2026.", client: "SPV SAN-01", clientId: "SAN-01", spvId: "SAN-01", description: "Brand licenca — siječanj 2026.", netAmount: 160, vatRate: 25, vatAmount: 40, totalAmount: 200, status: "plaćen", paidDate: "25.01.2026.", category: "brand_licence" },

  // SAN-02 — Aktivan, strukturirano
  { id: "II-06", number: "IR-2026-006", type: "izdani", date: "15.02.2026.", dueDate: "01.03.2026.", client: "SPV SAN-02", clientId: "SAN-02", spvId: "SAN-02", description: "Platform fee — veljača 2026.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaćen", paidDate: "20.02.2026.", category: "platform_fee" },
  { id: "II-07", number: "IR-2026-007", type: "izdani", date: "15.02.2026.", dueDate: "01.03.2026.", client: "SPV SAN-02", clientId: "SAN-02", spvId: "SAN-02", description: "Brand licenca — veljača 2026.", netAmount: 160, vatRate: 25, vatAmount: 40, totalAmount: 200, status: "čeka", paidDate: null, category: "brand_licence" },
  { id: "II-08", number: "IR-2026-008", type: "izdani", date: "15.01.2026.", dueDate: "31.01.2026.", client: "SPV SAN-02", clientId: "SAN-02", spvId: "SAN-02", description: "Platform fee — siječanj 2026.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaćen", paidDate: "29.01.2026.", category: "platform_fee" },

  // SOL-01 — Blokiran
  { id: "II-09", number: "IR-2026-009", type: "izdani", date: "15.02.2026.", dueDate: "01.03.2026.", client: "SPV SOL-01", clientId: "SOL-01", spvId: "SOL-01", description: "Platform fee — veljača 2026.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "čeka", paidDate: null, category: "platform_fee" },
  { id: "II-10", number: "IR-2026-010", type: "izdani", date: "10.01.2026.", dueDate: "25.01.2026.", client: "SPV SOL-01", clientId: "SOL-01", spvId: "SOL-01", description: "Platform fee — siječanj 2026.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "kasni", paidDate: null, category: "platform_fee" },

  // TUR-01 — U izradi
  { id: "II-11", number: "IR-2026-011", type: "izdani", date: "01.02.2026.", dueDate: "15.02.2026.", client: "SPV TUR-01", clientId: "TUR-01", spvId: "TUR-01", description: "CORE pregled — inicijalna analiza", netAmount: 800, vatRate: 25, vatAmount: 200, totalAmount: 1000, status: "plaćen", paidDate: "14.02.2026.", category: "pm_service" },

  // INF-01 — Aktivan
  { id: "II-12", number: "IR-2026-012", type: "izdani", date: "15.02.2026.", dueDate: "01.03.2026.", client: "SPV INF-01", clientId: "INF-01", spvId: "INF-01", description: "Platform fee — veljača 2026.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaćen", paidDate: "19.02.2026.", category: "platform_fee" },
  { id: "II-13", number: "IR-2026-013", type: "izdani", date: "15.02.2026.", dueDate: "01.03.2026.", client: "SPV INF-01", clientId: "INF-01", spvId: "INF-01", description: "Brand licenca — veljača 2026.", netAmount: 160, vatRate: 25, vatAmount: 40, totalAmount: 200, status: "čeka", paidDate: null, category: "brand_licence" },
  { id: "II-14", number: "IR-2026-014", type: "izdani", date: "15.01.2026.", dueDate: "31.01.2026.", client: "SPV INF-01", clientId: "INF-01", spvId: "INF-01", description: "Platform fee — siječanj 2026.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaćen", paidDate: "30.01.2026.", category: "platform_fee" },

  // Vertikala provizije
  { id: "II-15", number: "IR-2026-015", type: "izdani", date: "10.02.2026.", dueDate: "25.02.2026.", client: "Arhitekt Studio d.o.o.", clientId: "VER-01", spvId: "SAN-01", description: "Provizija 8% — projektiranje SAN-01", netAmount: 960, vatRate: 25, vatAmount: 240, totalAmount: 1200, status: "plaćen", paidDate: "22.02.2026.", category: "vertical_commission" },
  { id: "II-16", number: "IR-2026-016", type: "izdani", date: "10.02.2026.", dueDate: "25.02.2026.", client: "Geodet Plus d.o.o.", clientId: "VER-02", spvId: "SAN-01", description: "Provizija 10% — geodezija SAN-01", netAmount: 680, vatRate: 25, vatAmount: 170, totalAmount: 850, status: "plaćen", paidDate: "24.02.2026.", category: "vertical_commission" },
  { id: "II-17", number: "IR-2026-017", type: "izdani", date: "20.01.2026.", dueDate: "05.02.2026.", client: "Arhitekt Studio d.o.o.", clientId: "VER-01", spvId: "SAN-02", description: "Provizija 8% — projektiranje SAN-02", netAmount: 760, vatRate: 25, vatAmount: 190, totalAmount: 950, status: "kasni", paidDate: null, category: "vertical_commission" },

  // TUR-02 — Završen (success fee!)
  { id: "II-18", number: "IR-2025-048", type: "izdani", date: "15.11.2025.", dueDate: "30.11.2025.", client: "SPV TUR-02", clientId: "TUR-02", spvId: "TUR-02", description: "Success fee — 10% neto profita", netAmount: 6240, vatRate: 25, vatAmount: 1560, totalAmount: 7800, status: "plaćen", paidDate: "28.11.2025.", category: "success_fee" },
  { id: "II-19", number: "IR-2025-042", type: "izdani", date: "01.10.2025.", dueDate: "15.10.2025.", client: "SPV TUR-02", clientId: "TUR-02", spvId: "TUR-02", description: "Platform fee — završni mjesec", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaćen", paidDate: "12.10.2025.", category: "platform_fee" },

  // SAN-03 — Završen (success fee!)
  { id: "II-20", number: "IR-2025-038", type: "izdani", date: "20.11.2025.", dueDate: "05.12.2025.", client: "SPV SAN-03", clientId: "SAN-03", spvId: "SAN-03", description: "Success fee — 10% neto profita", netAmount: 4160, vatRate: 25, vatAmount: 1040, totalAmount: 5200, status: "plaćen", paidDate: "03.12.2025.", category: "success_fee" },

  // Stariji računi za historiju (2025)
  { id: "II-21", number: "IR-2025-030", type: "izdani", date: "15.10.2025.", dueDate: "31.10.2025.", client: "SPV SAN-01", clientId: "SAN-01", spvId: "SAN-01", description: "Platform fee — listopad 2025.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaćen", paidDate: "28.10.2025.", category: "platform_fee" },
  { id: "II-22", number: "IR-2025-031", type: "izdani", date: "15.11.2025.", dueDate: "30.11.2025.", client: "SPV SAN-01", clientId: "SAN-01", spvId: "SAN-01", description: "Platform fee — studeni 2025.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaćen", paidDate: "27.11.2025.", category: "platform_fee" },
  { id: "II-23", number: "IR-2025-032", type: "izdani", date: "15.12.2025.", dueDate: "31.12.2025.", client: "SPV SAN-01", clientId: "SAN-01", spvId: "SAN-01", description: "Platform fee — prosinac 2025.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaćen", paidDate: "29.12.2025.", category: "platform_fee" },
  { id: "II-24", number: "IR-2025-033", type: "izdani", date: "15.09.2025.", dueDate: "30.09.2025.", client: "SPV SAN-03", clientId: "SAN-03", spvId: "SAN-03", description: "Platform fee — rujan 2025.", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "plaćen", paidDate: "25.09.2025.", category: "platform_fee" },

  // Stornirani
  { id: "II-25", number: "IR-2025-035", type: "izdani", date: "01.10.2025.", dueDate: "15.10.2025.", client: "SPV SAN-02", clientId: "SAN-02", spvId: "SAN-02", description: "Dupli račun — stornirano", netAmount: 240, vatRate: 25, vatAmount: 60, totalAmount: 300, status: "storniran", paidDate: null, category: "platform_fee" },

  // TEC-01 — U izradi
  { id: "II-26", number: "IR-2026-018", type: "izdani", date: "01.02.2026.", dueDate: "15.02.2026.", client: "SPV TEC-01", clientId: "TEC-01", spvId: "TEC-01", description: "CORE pregled — inicijalna analiza", netAmount: 800, vatRate: 25, vatAmount: 200, totalAmount: 1000, status: "plaćen", paidDate: "13.02.2026.", category: "pm_service" },

  // Dodatni vertikala računi
  { id: "II-27", number: "IR-2026-019", type: "izdani", date: "05.02.2026.", dueDate: "20.02.2026.", client: "BuildControl d.o.o.", clientId: "VER-08", spvId: "SAN-01", description: "Provizija 8% — nadzor gradnje SAN-01", netAmount: 1440, vatRate: 25, vatAmount: 360, totalAmount: 1800, status: "plaćen", paidDate: "19.02.2026.", category: "vertical_commission" },
  { id: "II-28", number: "IR-2026-020", type: "izdani", date: "08.02.2026.", dueDate: "23.02.2026.", client: "EcoPermit d.o.o.", clientId: "VER-10", spvId: "SOL-01", description: "Provizija 10% — okolišna dozvola SOL-01", netAmount: 480, vatRate: 25, vatAmount: 120, totalAmount: 600, status: "čeka", paidDate: null, category: "vertical_commission" },
  { id: "II-29", number: "IR-2026-021", type: "izdani", date: "12.02.2026.", dueDate: "27.02.2026.", client: "Pravo & Savjet d.o.o.", clientId: "VER-03", spvId: "INF-01", description: "Provizija 12% — pravne usluge INF-01", netAmount: 1200, vatRate: 25, vatAmount: 300, totalAmount: 1500, status: "čeka", paidDate: null, category: "vertical_commission" },
  { id: "II-30", number: "IR-2025-045", type: "izdani", date: "01.12.2025.", dueDate: "15.12.2025.", client: "BuildControl d.o.o.", clientId: "VER-08", spvId: "TUR-02", description: "Provizija 8% — nadzor TUR-02 finalni", netAmount: 2000, vatRate: 25, vatAmount: 500, totalAmount: 2500, status: "plaćen", paidDate: "14.12.2025.", category: "vertical_commission" },
];

// ─── PRIMLJENI RAČUNI (20) ──────────────────────────────────────────────────

export const RECEIVED_INVOICES: Invoice[] = [
  { id: "RI-01", number: "UR-2026-001", type: "primljeni", date: "18.02.2026.", dueDate: "05.03.2026.", client: "Pravo & Savjet d.o.o.", clientId: "VER-03", spvId: null, description: "Pravna usluga — NKD analiza", netAmount: 600, vatRate: 25, vatAmount: 150, totalAmount: 750, status: "plaćen", paidDate: "20.02.2026.", category: "pravni" },
  { id: "RI-02", number: "UR-2026-002", type: "primljeni", date: "12.02.2026.", dueDate: "28.02.2026.", client: "Vercel Inc.", clientId: "EXT-01", spvId: null, description: "Hosting — veljača 2026.", netAmount: 20, vatRate: 0, vatAmount: 0, totalAmount: 20, status: "plaćen", paidDate: "12.02.2026.", category: "it" },
  { id: "RI-03", number: "UR-2026-003", type: "primljeni", date: "10.02.2026.", dueDate: "25.02.2026.", client: "Supabase Inc.", clientId: "EXT-02", spvId: null, description: "Pro plan — veljača 2026.", netAmount: 25, vatRate: 0, vatAmount: 0, totalAmount: 25, status: "plaćen", paidDate: "10.02.2026.", category: "it" },
  { id: "RI-04", number: "UR-2026-004", type: "primljeni", date: "05.02.2026.", dueDate: "20.02.2026.", client: "Geodet Plus d.o.o.", clientId: "VER-02", spvId: "SAN-01", description: "Geodetski elaborat — SAN-01", netAmount: 2800, vatRate: 25, vatAmount: 700, totalAmount: 3500, status: "plaćen", paidDate: "18.02.2026.", category: "geodezija" },
  { id: "RI-05", number: "UR-2026-005", type: "primljeni", date: "01.02.2026.", dueDate: "15.02.2026.", client: "Statika Pro d.o.o.", clientId: "VER-04", spvId: "SAN-01", description: "Statički proračun — SAN-01", netAmount: 3200, vatRate: 25, vatAmount: 800, totalAmount: 4000, status: "plaćen", paidDate: "14.02.2026.", category: "konstrukcije" },
  { id: "RI-06", number: "UR-2026-006", type: "primljeni", date: "20.01.2026.", dueDate: "05.02.2026.", client: "Arhitekt Studio d.o.o.", clientId: "VER-01", spvId: "SAN-01", description: "Idejni projekt — SAN-01", netAmount: 4800, vatRate: 25, vatAmount: 1200, totalAmount: 6000, status: "plaćen", paidDate: "03.02.2026.", category: "projektiranje" },
  { id: "RI-07", number: "UR-2026-007", type: "primljeni", date: "15.02.2026.", dueDate: "01.03.2026.", client: "Računovodstvo Sigma d.o.o.", clientId: "ACC-01", spvId: null, description: "Knjigovodstvo — veljača 2026.", netAmount: 280, vatRate: 25, vatAmount: 70, totalAmount: 350, status: "čeka", paidDate: null, category: "knjigovodstvo" },
  { id: "RI-08", number: "UR-2026-008", type: "primljeni", date: "15.02.2026.", dueDate: "01.03.2026.", client: "Financa Plus d.o.o.", clientId: "ACC-02", spvId: null, description: "Knjigovodstvo — veljača 2026.", netAmount: 200, vatRate: 25, vatAmount: 50, totalAmount: 250, status: "čeka", paidDate: null, category: "knjigovodstvo" },
  { id: "RI-09", number: "UR-2026-009", type: "primljeni", date: "15.02.2026.", dueDate: "01.03.2026.", client: "TuristBooks d.o.o.", clientId: "ACC-04", spvId: null, description: "Knjigovodstvo — veljača 2026.", netAmount: 160, vatRate: 25, vatAmount: 40, totalAmount: 200, status: "čeka", paidDate: null, category: "knjigovodstvo" },
  { id: "RI-10", number: "UR-2026-010", type: "primljeni", date: "08.02.2026.", dueDate: "23.02.2026.", client: "EcoPermit d.o.o.", clientId: "VER-10", spvId: "SOL-01", description: "Elaborat okoliša — SOL-01 (nedovršen)", netAmount: 3200, vatRate: 25, vatAmount: 800, totalAmount: 4000, status: "čeka", paidDate: null, category: "okoliš" },
  { id: "RI-11", number: "UR-2026-011", type: "primljeni", date: "01.02.2026.", dueDate: "15.02.2026.", client: "BuildControl d.o.o.", clientId: "VER-08", spvId: "SAN-01", description: "Nadzor gradnje — veljača 2026.", netAmount: 2400, vatRate: 25, vatAmount: 600, totalAmount: 3000, status: "plaćen", paidDate: "14.02.2026.", category: "nadzor" },
  { id: "RI-12", number: "UR-2025-080", type: "primljeni", date: "15.12.2025.", dueDate: "31.12.2025.", client: "Računovodstvo Sigma d.o.o.", clientId: "ACC-01", spvId: null, description: "Knjigovodstvo — prosinac 2025.", netAmount: 280, vatRate: 25, vatAmount: 70, totalAmount: 350, status: "plaćen", paidDate: "28.12.2025.", category: "knjigovodstvo" },
  { id: "RI-13", number: "UR-2025-075", type: "primljeni", date: "01.11.2025.", dueDate: "15.11.2025.", client: "Arhitekt Studio d.o.o.", clientId: "VER-01", spvId: "SAN-02", description: "Idejni projekt — SAN-02", netAmount: 3800, vatRate: 25, vatAmount: 950, totalAmount: 4750, status: "plaćen", paidDate: "14.11.2025.", category: "projektiranje" },
  { id: "RI-14", number: "UR-2025-070", type: "primljeni", date: "15.10.2025.", dueDate: "31.10.2025.", client: "GreenEnergy Consult", clientId: "VER-05", spvId: "SOL-01", description: "Energetski audit — SOL-01", netAmount: 2400, vatRate: 25, vatAmount: 600, totalAmount: 3000, status: "plaćen", paidDate: "29.10.2025.", category: "energetika" },
  { id: "RI-15", number: "UR-2025-065", type: "primljeni", date: "01.10.2025.", dueDate: "15.10.2025.", client: "FinanceAdvisors d.o.o.", clientId: "VER-11", spvId: "SOL-01", description: "Financijski model — SOL-01", netAmount: 1600, vatRate: 25, vatAmount: 400, totalAmount: 2000, status: "plaćen", paidDate: "14.10.2025.", category: "financije" },
  { id: "RI-16", number: "UR-2026-012", type: "primljeni", date: "10.02.2026.", dueDate: "25.02.2026.", client: "Pravo & Savjet d.o.o.", clientId: "VER-03", spvId: "INF-01", description: "Due diligence — INF-01", netAmount: 2000, vatRate: 25, vatAmount: 500, totalAmount: 2500, status: "čeka", paidDate: null, category: "pravni" },
  { id: "RI-17", number: "UR-2026-013", type: "primljeni", date: "01.01.2026.", dueDate: "15.01.2026.", client: "Vercel Inc.", clientId: "EXT-01", spvId: null, description: "Hosting — siječanj 2026.", netAmount: 20, vatRate: 0, vatAmount: 0, totalAmount: 20, status: "plaćen", paidDate: "01.01.2026.", category: "it" },
  { id: "RI-18", number: "UR-2026-014", type: "primljeni", date: "01.01.2026.", dueDate: "15.01.2026.", client: "Supabase Inc.", clientId: "EXT-02", spvId: null, description: "Pro plan — siječanj 2026.", netAmount: 25, vatRate: 0, vatAmount: 0, totalAmount: 25, status: "plaćen", paidDate: "01.01.2026.", category: "it" },
  { id: "RI-19", number: "UR-2025-082", type: "primljeni", date: "20.12.2025.", dueDate: "05.01.2026.", client: "Agro Savjetovanje d.o.o.", clientId: "VER-06", spvId: "AGR-01", description: "Inicijalna analiza — AGR-01", netAmount: 800, vatRate: 25, vatAmount: 200, totalAmount: 1000, status: "plaćen", paidDate: "03.01.2026.", category: "agronomija" },
  { id: "RI-20", number: "UR-2026-015", type: "primljeni", date: "15.02.2026.", dueDate: "01.03.2026.", client: "Digital Systems d.o.o.", clientId: "VER-09", spvId: "TEC-01", description: "IoT konzultacije — TEC-01", netAmount: 1200, vatRate: 25, vatAmount: 300, totalAmount: 1500, status: "čeka", paidDate: null, category: "tech" },
];

// ─── TRANSAKCIJE ŽIRO (42) ──────────────────────────────────────────────────

function buildTransactions(): Transaction[] {
  const txs: Omit<Transaction, "balance">[] = [
    // Veljača 2026
    { id: "TX-42", date: "20.02.2026.", description: "SPV SAN-01 — platform fee veljača", credit: 300, debit: 0, invoiceRef: "IR-2026-001", spvId: "SAN-01", category: "prihod" },
    { id: "TX-41", date: "20.02.2026.", description: "SPV SAN-02 — platform fee veljača", credit: 300, debit: 0, invoiceRef: "IR-2026-006", spvId: "SAN-02", category: "prihod" },
    { id: "TX-40", date: "20.02.2026.", description: "Pravo & Savjet — NKD analiza", credit: 0, debit: 750, invoiceRef: "UR-2026-001", spvId: null, category: "rashod" },
    { id: "TX-39", date: "19.02.2026.", description: "SPV INF-01 — platform fee veljača", credit: 300, debit: 0, invoiceRef: "IR-2026-012", spvId: "INF-01", category: "prihod" },
    { id: "TX-38", date: "19.02.2026.", description: "BuildControl — nadzor SAN-01 veljača", credit: 0, debit: 1800, invoiceRef: "IR-2026-019", spvId: "SAN-01", category: "rashod" },
    { id: "TX-37", date: "18.02.2026.", description: "SPV SAN-01 — brand licenca veljača", credit: 200, debit: 0, invoiceRef: "IR-2026-002", spvId: "SAN-01", category: "prihod" },
    { id: "TX-36", date: "18.02.2026.", description: "Geodet Plus — elaborat SAN-01", credit: 0, debit: 3500, invoiceRef: "UR-2026-004", spvId: "SAN-01", category: "rashod" },
    { id: "TX-35", date: "14.02.2026.", description: "SPV TUR-01 — CORE pregled", credit: 1000, debit: 0, invoiceRef: "IR-2026-011", spvId: "TUR-01", category: "prihod" },
    { id: "TX-34", date: "14.02.2026.", description: "Statika Pro — statika SAN-01", credit: 0, debit: 4000, invoiceRef: "UR-2026-005", spvId: "SAN-01", category: "rashod" },
    { id: "TX-33", date: "14.02.2026.", description: "BuildControl — nadzor SAN-01", credit: 0, debit: 3000, invoiceRef: "UR-2026-011", spvId: "SAN-01", category: "rashod" },
    { id: "TX-32", date: "13.02.2026.", description: "SPV TEC-01 — CORE pregled", credit: 1000, debit: 0, invoiceRef: "IR-2026-018", spvId: "TEC-01", category: "prihod" },
    { id: "TX-31", date: "12.02.2026.", description: "Vercel — hosting veljača", credit: 0, debit: 20, invoiceRef: "UR-2026-002", spvId: null, category: "rashod" },
    { id: "TX-30", date: "10.02.2026.", description: "Supabase — Pro plan veljača", credit: 0, debit: 25, invoiceRef: "UR-2026-003", spvId: null, category: "rashod" },
    { id: "TX-29", date: "03.02.2026.", description: "Arhitekt Studio — idejni SAN-01", credit: 0, debit: 6000, invoiceRef: "UR-2026-006", spvId: "SAN-01", category: "rashod" },

    // Siječanj 2026
    { id: "TX-28", date: "30.01.2026.", description: "SPV INF-01 — platform fee siječanj", credit: 300, debit: 0, invoiceRef: "IR-2026-014", spvId: "INF-01", category: "prihod" },
    { id: "TX-27", date: "29.01.2026.", description: "SPV SAN-02 — platform fee siječanj", credit: 300, debit: 0, invoiceRef: "IR-2026-008", spvId: "SAN-02", category: "prihod" },
    { id: "TX-26", date: "28.01.2026.", description: "SPV SAN-01 — platform fee siječanj", credit: 300, debit: 0, invoiceRef: "IR-2026-004", spvId: "SAN-01", category: "prihod" },
    { id: "TX-25", date: "25.01.2026.", description: "SPV SAN-01 — brand licenca siječanj", credit: 200, debit: 0, invoiceRef: "IR-2026-005", spvId: "SAN-01", category: "prihod" },
    { id: "TX-24", date: "15.01.2026.", description: "Računovodstvo Sigma — siječanj", credit: 0, debit: 350, invoiceRef: null, spvId: null, category: "rashod" },
    { id: "TX-23", date: "10.01.2026.", description: "Financa Plus — siječanj", credit: 0, debit: 250, invoiceRef: null, spvId: null, category: "rashod" },
    { id: "TX-22", date: "03.01.2026.", description: "Agro Savjetovanje — analiza AGR-01", credit: 0, debit: 1000, invoiceRef: "UR-2025-082", spvId: "AGR-01", category: "rashod" },
    { id: "TX-21", date: "01.01.2026.", description: "Vercel — hosting siječanj", credit: 0, debit: 20, invoiceRef: "UR-2026-013", spvId: null, category: "rashod" },
    { id: "TX-20", date: "01.01.2026.", description: "Supabase — Pro plan siječanj", credit: 0, debit: 25, invoiceRef: "UR-2026-014", spvId: null, category: "rashod" },

    // Prosinac 2025
    { id: "TX-19", date: "29.12.2025.", description: "SPV SAN-01 — platform fee prosinac", credit: 300, debit: 0, invoiceRef: "IR-2025-032", spvId: "SAN-01", category: "prihod" },
    { id: "TX-18", date: "28.12.2025.", description: "Računovodstvo Sigma — prosinac", credit: 0, debit: 350, invoiceRef: "UR-2025-080", spvId: null, category: "rashod" },
    { id: "TX-17", date: "14.12.2025.", description: "BuildControl — nadzor TUR-02 finalni", credit: 0, debit: 2500, invoiceRef: null, spvId: "TUR-02", category: "rashod" },
    { id: "TX-16", date: "03.12.2025.", description: "SPV SAN-03 — success fee", credit: 5200, debit: 0, invoiceRef: "IR-2025-038", spvId: "SAN-03", category: "prihod" },

    // Studeni 2025
    { id: "TX-15", date: "28.11.2025.", description: "SPV TUR-02 — success fee", credit: 7800, debit: 0, invoiceRef: "IR-2025-048", spvId: "TUR-02", category: "prihod" },
    { id: "TX-14", date: "27.11.2025.", description: "SPV SAN-01 — platform fee studeni", credit: 300, debit: 0, invoiceRef: "IR-2025-031", spvId: "SAN-01", category: "prihod" },
    { id: "TX-13", date: "14.11.2025.", description: "Arhitekt Studio — idejni SAN-02", credit: 0, debit: 4750, invoiceRef: "UR-2025-075", spvId: "SAN-02", category: "rashod" },

    // Listopad 2025
    { id: "TX-12", date: "29.10.2025.", description: "GreenEnergy — audit SOL-01", credit: 0, debit: 3000, invoiceRef: "UR-2025-070", spvId: "SOL-01", category: "rashod" },
    { id: "TX-11", date: "28.10.2025.", description: "SPV SAN-01 — platform fee listopad", credit: 300, debit: 0, invoiceRef: "IR-2025-030", spvId: "SAN-01", category: "prihod" },
    { id: "TX-10", date: "14.10.2025.", description: "FinanceAdvisors — model SOL-01", credit: 0, debit: 2000, invoiceRef: "UR-2025-065", spvId: "SOL-01", category: "rashod" },
    { id: "TX-09", date: "12.10.2025.", description: "SPV TUR-02 — platform fee", credit: 300, debit: 0, invoiceRef: "IR-2025-042", spvId: "TUR-02", category: "prihod" },

    // Rujan 2025
    { id: "TX-08", date: "25.09.2025.", description: "SPV SAN-03 — platform fee rujan", credit: 300, debit: 0, invoiceRef: "IR-2025-033", spvId: "SAN-03", category: "prihod" },
    { id: "TX-07", date: "15.09.2025.", description: "IT troškovi — rujan", credit: 0, debit: 45, invoiceRef: null, spvId: null, category: "rashod" },

    // Kolovoz 2025
    { id: "TX-06", date: "28.08.2025.", description: "SPV SAN-01 — platform fee kolovoz", credit: 300, debit: 0, invoiceRef: null, spvId: "SAN-01", category: "prihod" },
    { id: "TX-05", date: "15.08.2025.", description: "IT troškovi — kolovoz", credit: 0, debit: 45, invoiceRef: null, spvId: null, category: "rashod" },

    // Srpanj 2025
    { id: "TX-04", date: "28.07.2025.", description: "SPV SAN-01 — platform fee srpanj", credit: 300, debit: 0, invoiceRef: null, spvId: "SAN-01", category: "prihod" },
    { id: "TX-03", date: "15.07.2025.", description: "IT troškovi — srpanj", credit: 0, debit: 45, invoiceRef: null, spvId: null, category: "rashod" },

    // Lipanj 2025 — početak
    { id: "TX-02", date: "15.06.2025.", description: "Osnivački troškovi CORE d.o.o.", credit: 0, debit: 1500, invoiceRef: null, spvId: null, category: "rashod" },
    { id: "TX-01", date: "01.06.2025.", description: "Uplata temeljnog kapitala", credit: 2500, debit: 0, invoiceRef: null, spvId: null, category: "kapital" },
  ];

  // Izračunaj running balance (od najstarijeg)
  const sorted = [...txs].reverse();
  let balance = 0;
  const withBalance: Transaction[] = sorted.map((tx) => {
    balance += tx.credit - tx.debit;
    return { ...tx, balance: Math.round(balance * 100) / 100 };
  });
  return withBalance.reverse();
}

export const TRANSACTIONS: Transaction[] = buildTransactions();

// ─── ZADACI (25) ────────────────────────────────────────────────────────────

export const TASKS: Task[] = [
  { id: "TSK-01", title: "Ishoditi građevinsku dozvolu", description: "Predati zahtjev za građevinsku dozvolu na nadležno tijelo", spvId: "SAN-01", assignedTo: "Jurke Maričić", assignedRole: "PM", priority: "critical", status: "u_tijeku", createdDate: "01.01.2026.", dueDate: "28.02.2026.", completedDate: null, category: "dozvole" },
  { id: "TSK-02", title: "Ugovoriti izvođača radova", description: "Odabir izvođača i potpisivanje ugovora", spvId: "SAN-01", assignedTo: "Jurke Maričić", assignedRole: "PM", priority: "high", status: "otvoren", createdDate: "15.01.2026.", dueDate: "15.03.2026.", completedDate: null, category: "gradnja" },
  { id: "TSK-03", title: "Glavni projekt — revizija", description: "Revizija glavnog projekta od ovlaštenog revidenta", spvId: "SAN-01", assignedTo: "Arhitekt Studio d.o.o.", assignedRole: "Vertikala", priority: "high", status: "završen", createdDate: "01.12.2025.", dueDate: "31.01.2026.", completedDate: "28.01.2026.", category: "projektiranje" },
  { id: "TSK-04", title: "Geodetski elaborat — finalni", description: "Završetak geodetskog elaborata za katastar", spvId: "SAN-01", assignedTo: "Geodet Plus d.o.o.", assignedRole: "Vertikala", priority: "medium", status: "završen", createdDate: "15.11.2025.", dueDate: "15.01.2026.", completedDate: "10.01.2026.", category: "geodezija" },
  { id: "TSK-05", title: "Pripremiti financijski model", description: "Detaljan financijski model za banku", spvId: "SAN-02", assignedTo: "FinanceAdvisors d.o.o.", assignedRole: "Vertikala", priority: "high", status: "u_tijeku", createdDate: "01.02.2026.", dueDate: "01.03.2026.", completedDate: null, category: "financije" },
  { id: "TSK-06", title: "DOSTAVITI ELABORAT OKOLIŠA", description: "Mandatory dokument za fazu Financiranje — BLOKIRA PROJEKT", spvId: "SOL-01", assignedTo: "EcoPermit d.o.o.", assignedRole: "Vertikala", priority: "critical", status: "blokiran", createdDate: "15.01.2026.", dueDate: "10.02.2026.", completedDate: null, category: "okoliš" },
  { id: "TSK-07", title: "Energetski certifikat", description: "Ishođenje energetskog certifikata", spvId: "SOL-01", assignedTo: "GreenEnergy Consult", assignedRole: "Vertikala", priority: "high", status: "otvoren", createdDate: "01.02.2026.", dueDate: "15.03.2026.", completedDate: null, category: "energetika" },
  { id: "TSK-08", title: "CORE pregled — Vila Maestral", description: "Kompletna analiza projekta za odobrenje", spvId: "TUR-01", assignedTo: "Jurke Maričić", assignedRole: "CORE", priority: "high", status: "u_tijeku", createdDate: "20.11.2025.", dueDate: "01.03.2026.", completedDate: null, category: "pregled" },
  { id: "TSK-09", title: "Kredit evaluacija — OTP", description: "Pripremiti dokumentaciju za OTP kredit", spvId: "TUR-01", assignedTo: "FinanceAdvisors d.o.o.", assignedRole: "Vertikala", priority: "medium", status: "otvoren", createdDate: "01.02.2026.", dueDate: "31.03.2026.", completedDate: null, category: "financije" },
  { id: "TSK-10", title: "Analiza tržišta lavande", description: "Tržišna analiza za OPG lavanda projekt", spvId: "AGR-01", assignedTo: "Agro Savjetovanje d.o.o.", assignedRole: "Vertikala", priority: "medium", status: "završen", createdDate: "05.01.2026.", dueDate: "05.02.2026.", completedDate: "01.02.2026.", category: "analiza" },
  { id: "TSK-11", title: "Due diligence — zemljište", description: "Pravna analiza vlasničkih odnosa", spvId: "INF-01", assignedTo: "Pravo & Savjet d.o.o.", assignedRole: "Vertikala", priority: "high", status: "u_tijeku", createdDate: "01.02.2026.", dueDate: "28.02.2026.", completedDate: null, category: "pravni" },
  { id: "TSK-12", title: "Idejni projekt — skladište", description: "Idejno rješenje logističkog centra", spvId: "INF-01", assignedTo: "Arhitekt Studio d.o.o.", assignedRole: "Vertikala", priority: "high", status: "otvoren", createdDate: "10.02.2026.", dueDate: "31.03.2026.", completedDate: null, category: "projektiranje" },
  { id: "TSK-13", title: "Dodijeli knjigovođu — SOL-02", description: "SPV nema dodijeljenog knjigovođu!", spvId: "SOL-02", assignedTo: "Jurke Maričić", assignedRole: "CORE", priority: "high", status: "otvoren", createdDate: "10.02.2026.", dueDate: "28.02.2026.", completedDate: null, category: "admin" },
  { id: "TSK-14", title: "CORE pregled — Smart Building", description: "Analiza IoT pilot projekta", spvId: "TEC-01", assignedTo: "Jurke Maričić", assignedRole: "CORE", priority: "medium", status: "u_tijeku", createdDate: "01.12.2025.", dueDate: "15.03.2026.", completedDate: null, category: "pregled" },
  { id: "TSK-15", title: "Zatvaranje — finalna dokumentacija SAN-03", description: "Kompletirati završnu dokumentaciju", spvId: "SAN-03", assignedTo: "Jurke Maričić", assignedRole: "PM", priority: "low", status: "završen", createdDate: "01.11.2025.", dueDate: "15.12.2025.", completedDate: "10.12.2025.", category: "zatvaranje" },
  { id: "TSK-16", title: "Zatvaranje — finalna dokumentacija TUR-02", description: "Kompletirati završnu dokumentaciju glamping", spvId: "TUR-02", assignedTo: "Jurke Maričić", assignedRole: "PM", priority: "low", status: "završen", createdDate: "01.10.2025.", dueDate: "01.12.2025.", completedDate: "28.11.2025.", category: "zatvaranje" },
  { id: "TSK-17", title: "Priprema NKD izmjene", description: "Priprema dokumentacije za NKD 2025 migraciju", spvId: "SAN-01", assignedTo: "Pravo & Savjet d.o.o.", assignedRole: "Vertikala", priority: "medium", status: "otvoren", createdDate: "15.02.2026.", dueDate: "31.03.2026.", completedDate: null, category: "pravni" },
  { id: "TSK-18", title: "Uplata temeljnog kapitala CORE", description: "Deponirati temeljni kapital na račun CORE d.o.o.", spvId: "SAN-01", assignedTo: "Jurke Maričić", assignedRole: "CORE", priority: "critical", status: "eskaliran", createdDate: "12.12.2025.", dueDate: "12.01.2026.", completedDate: null, category: "admin" },
  { id: "TSK-19", title: "Okolišna dozvola — INF-01", description: "Ishoditi okolišnu dozvolu za industrijsku zonu", spvId: "INF-01", assignedTo: "EcoPermit d.o.o.", assignedRole: "Vertikala", priority: "high", status: "u_tijeku", createdDate: "01.02.2026.", dueDate: "30.04.2026.", completedDate: null, category: "okoliš" },
  { id: "TSK-20", title: "Katastar — provjera čestica", description: "Provjera čestice i granica", spvId: "AGR-01", assignedTo: "Geodet Plus d.o.o.", assignedRole: "Vertikala", priority: "low", status: "otvoren", createdDate: "10.02.2026.", dueDate: "31.03.2026.", completedDate: null, category: "geodezija" },
  { id: "TSK-21", title: "D&O polica — CORE", description: "Ugovoriti D&O osiguranje za direktora", spvId: "SAN-01", assignedTo: "Jurke Maričić", assignedRole: "CORE", priority: "medium", status: "otvoren", createdDate: "01.02.2026.", dueDate: "31.03.2026.", completedDate: null, category: "admin" },
  { id: "TSK-22", title: "IoT specifikacija senzora", description: "Definirati listu senzora za pilot zgradu", spvId: "TEC-01", assignedTo: "Digital Systems d.o.o.", assignedRole: "Vertikala", priority: "medium", status: "otvoren", createdDate: "15.02.2026.", dueDate: "31.03.2026.", completedDate: null, category: "tech" },
  { id: "TSK-23", title: "Prodaja stanova — SAN-01", description: "Marketing i prodaja 4 stambene jedinice", spvId: "SAN-01", assignedTo: "Jurke Maričić", assignedRole: "PM", priority: "high", status: "otvoren", createdDate: "01.02.2026.", dueDate: "30.06.2026.", completedDate: null, category: "prodaja" },
  { id: "TSK-24", title: "EV lokacije — mapping", description: "Mapiranje 6 potencijalnih lokacija", spvId: "SOL-02", assignedTo: "Jurke Maričić", assignedRole: "PM", priority: "low", status: "otvoren", createdDate: "15.02.2026.", dueDate: "30.04.2026.", completedDate: null, category: "analiza" },
  { id: "TSK-25", title: "Nadzor — proljetna inspekcija SAN-01", description: "Kontrola kvalitete proljetnih radova", spvId: "SAN-01", assignedTo: "BuildControl d.o.o.", assignedRole: "Vertikala", priority: "medium", status: "otvoren", createdDate: "18.02.2026.", dueDate: "15.04.2026.", completedDate: null, category: "nadzor" },
];

// ─── DOKUMENTI (30) ─────────────────────────────────────────────────────────

export const DOCUMENTS: Document[] = [
  // SAN-01 — komplet
  { id: "DOC-01", name: "Građevinska dozvola", type: "dozvola", spvId: "SAN-01", uploadedBy: "Jurke Maričić", uploadDate: "15.01.2026.", status: "odobren", version: 2, fileSize: "2.4 MB", mandatory: true, category: "dozvole" },
  { id: "DOC-02", name: "Glavni projekt", type: "elaborat", spvId: "SAN-01", uploadedBy: "Arhitekt Studio d.o.o.", uploadDate: "28.01.2026.", status: "odobren", version: 3, fileSize: "45.2 MB", mandatory: true, category: "projektiranje" },
  { id: "DOC-03", name: "Geodetski elaborat", type: "elaborat", spvId: "SAN-01", uploadedBy: "Geodet Plus d.o.o.", uploadDate: "10.01.2026.", status: "odobren", version: 1, fileSize: "8.1 MB", mandatory: true, category: "geodezija" },
  { id: "DOC-04", name: "Statički proračun", type: "elaborat", spvId: "SAN-01", uploadedBy: "Statika Pro d.o.o.", uploadDate: "20.01.2026.", status: "odobren", version: 2, fileSize: "12.3 MB", mandatory: true, category: "konstrukcije" },
  { id: "DOC-05", name: "CORE-SPV ugovor SAN-01", type: "ugovor", spvId: "SAN-01", uploadedBy: "Jurke Maričić", uploadDate: "01.01.2026.", status: "odobren", version: 1, fileSize: "0.8 MB", mandatory: true, category: "ugovori" },
  { id: "DOC-06", name: "Energetski certifikat", type: "certifikat", spvId: "SAN-01", uploadedBy: "GreenEnergy Consult", uploadDate: "05.02.2026.", status: "odobren", version: 1, fileSize: "1.2 MB", mandatory: false, category: "energetika" },

  // SAN-02
  { id: "DOC-07", name: "Idejni projekt", type: "elaborat", spvId: "SAN-02", uploadedBy: "Arhitekt Studio d.o.o.", uploadDate: "14.11.2025.", status: "odobren", version: 1, fileSize: "28.5 MB", mandatory: true, category: "projektiranje" },
  { id: "DOC-08", name: "CORE-SPV ugovor SAN-02", type: "ugovor", spvId: "SAN-02", uploadedBy: "Jurke Maričić", uploadDate: "15.01.2026.", status: "odobren", version: 1, fileSize: "0.8 MB", mandatory: true, category: "ugovori" },
  { id: "DOC-09", name: "Financijski model", type: "izvještaj", spvId: "SAN-02", uploadedBy: "FinanceAdvisors d.o.o.", uploadDate: "15.02.2026.", status: "čeka_pregled", version: 1, fileSize: "3.2 MB", mandatory: true, category: "financije" },

  // SOL-01 — BLOKIRAN: nedostaje mandatory
  { id: "DOC-10", name: "Energetski audit", type: "elaborat", spvId: "SOL-01", uploadedBy: "GreenEnergy Consult", uploadDate: "29.10.2025.", status: "odobren", version: 1, fileSize: "5.4 MB", mandatory: true, category: "energetika" },
  { id: "DOC-11", name: "Elaborat zaštite okoliša", type: "elaborat", spvId: "SOL-01", uploadedBy: "", uploadDate: "", status: "nedostaje", version: 0, fileSize: "", mandatory: true, category: "okoliš" },
  { id: "DOC-12", name: "Financijski model SOL-01", type: "izvještaj", spvId: "SOL-01", uploadedBy: "FinanceAdvisors d.o.o.", uploadDate: "14.10.2025.", status: "odobren", version: 2, fileSize: "4.1 MB", mandatory: true, category: "financije" },

  // TUR-01
  { id: "DOC-13", name: "Lokacijska dozvola — Vila Maestral", type: "dozvola", spvId: "TUR-01", uploadedBy: "Jurke Maričić", uploadDate: "01.12.2025.", status: "čeka_pregled", version: 1, fileSize: "1.8 MB", mandatory: true, category: "dozvole" },
  { id: "DOC-14", name: "Projektni zadatak — TUR-01", type: "elaborat", spvId: "TUR-01", uploadedBy: "Jurke Maričić", uploadDate: "25.11.2025.", status: "odobren", version: 1, fileSize: "2.1 MB", mandatory: false, category: "projektiranje" },

  // AGR-01
  { id: "DOC-15", name: "Analiza tržišta lavande", type: "izvještaj", spvId: "AGR-01", uploadedBy: "Agro Savjetovanje d.o.o.", uploadDate: "01.02.2026.", status: "odobren", version: 1, fileSize: "6.7 MB", mandatory: false, category: "analiza" },
  { id: "DOC-16", name: "Katastarski izvadak — AGR-01", type: "ostalo", spvId: "AGR-01", uploadedBy: "Jurke Maričić", uploadDate: "10.01.2026.", status: "odobren", version: 1, fileSize: "0.3 MB", mandatory: true, category: "katastar" },

  // SAN-03 — Završen, sve odobreno
  { id: "DOC-17", name: "Uporabna dozvola — SAN-03", type: "dozvola", spvId: "SAN-03", uploadedBy: "Jurke Maričić", uploadDate: "10.11.2025.", status: "odobren", version: 1, fileSize: "1.5 MB", mandatory: true, category: "dozvole" },
  { id: "DOC-18", name: "Završni izvještaj — SAN-03", type: "izvještaj", spvId: "SAN-03", uploadedBy: "Jurke Maričić", uploadDate: "15.11.2025.", status: "odobren", version: 1, fileSize: "4.2 MB", mandatory: true, category: "izvještaji" },
  { id: "DOC-19", name: "Kupoprodajni ugovori (3x) — SAN-03", type: "ugovor", spvId: "SAN-03", uploadedBy: "Pravo & Savjet d.o.o.", uploadDate: "01.10.2025.", status: "odobren", version: 1, fileSize: "2.8 MB", mandatory: true, category: "ugovori" },

  // TUR-02 — Završen
  { id: "DOC-20", name: "Uporabna dozvola — Glamping", type: "dozvola", spvId: "TUR-02", uploadedBy: "Jurke Maričić", uploadDate: "15.09.2025.", status: "odobren", version: 1, fileSize: "1.1 MB", mandatory: true, category: "dozvole" },
  { id: "DOC-21", name: "Završni izvještaj — TUR-02", type: "izvještaj", spvId: "TUR-02", uploadedBy: "Jurke Maričić", uploadDate: "01.10.2025.", status: "odobren", version: 1, fileSize: "5.6 MB", mandatory: true, category: "izvještaji" },

  // INF-01
  { id: "DOC-22", name: "Lokacijska informacija — INF-01", type: "dozvola", spvId: "INF-01", uploadedBy: "Jurke Maričić", uploadDate: "15.07.2025.", status: "odobren", version: 1, fileSize: "0.9 MB", mandatory: true, category: "dozvole" },
  { id: "DOC-23", name: "Due diligence report — INF-01", type: "izvještaj", spvId: "INF-01", uploadedBy: "Pravo & Savjet d.o.o.", uploadDate: "18.02.2026.", status: "čeka_pregled", version: 1, fileSize: "7.3 MB", mandatory: true, category: "pravni" },

  // TEC-01
  { id: "DOC-24", name: "IoT specifikacija — draft", type: "elaborat", spvId: "TEC-01", uploadedBy: "Digital Systems d.o.o.", uploadDate: "10.02.2026.", status: "čeka_pregled", version: 1, fileSize: "3.8 MB", mandatory: false, category: "tech" },

  // NDA-ovi
  { id: "DOC-25", name: "NDA — Geodet Plus", type: "ugovor", spvId: "SAN-01", uploadedBy: "Jurke Maričić", uploadDate: "10.01.2026.", status: "odobren", version: 1, fileSize: "0.4 MB", mandatory: false, category: "nda" },
  { id: "DOC-26", name: "NDA — Arhitekt Studio", type: "ugovor", spvId: "SAN-01", uploadedBy: "Jurke Maričić", uploadDate: "01.02.2026.", status: "odobren", version: 1, fileSize: "0.4 MB", mandatory: false, category: "nda" },
  { id: "DOC-27", name: "NDA — EcoPermit", type: "ugovor", spvId: "SOL-01", uploadedBy: "Jurke Maričić", uploadDate: "05.01.2026.", status: "odobren", version: 1, fileSize: "0.4 MB", mandatory: false, category: "nda" },

  // SOL-02 — minimalno
  { id: "DOC-28", name: "Projektni brief — EV Hub", type: "ostalo", spvId: "SOL-02", uploadedBy: "Jurke Maričić", uploadDate: "10.02.2026.", status: "odobren", version: 1, fileSize: "1.2 MB", mandatory: false, category: "analiza" },

  // CORE dokumenti
  { id: "DOC-29", name: "RIVUS CORE Arhitektura v1.1", type: "izvještaj", spvId: "SAN-01", uploadedBy: "Jurke Maričić", uploadDate: "21.02.2026.", status: "odobren", version: 2, fileSize: "0.6 MB", mandatory: false, category: "sustav" },
  { id: "DOC-30", name: "GDPR politika — draft", type: "ostalo", spvId: "SAN-01", uploadedBy: "Pravo & Savjet d.o.o.", uploadDate: "10.02.2026.", status: "čeka_pregled", version: 1, fileSize: "1.8 MB", mandatory: false, category: "pravni" },
];

// ─── ODLUKE (15) ────────────────────────────────────────────────────────────

export const DECISIONS: Decision[] = [
  { id: "DEC-01", title: "Odobrenje glavnog projekta SAN-01", spvId: "SAN-01", requestedBy: "Arhitekt Studio d.o.o.", decidedBy: "Jurke Maričić", status: "odobreno", date: "25.01.2026.", decidedDate: "28.01.2026.", description: "Glavni projekt odobren nakon revizije", category: "projektiranje" },
  { id: "DEC-02", title: "Odobrenje izvođača — SAN-01", spvId: "SAN-01", requestedBy: "Jurke Maričić", decidedBy: null, status: "na_čekanju", date: "18.02.2026.", decidedDate: null, description: "Čeka se odabir izvođača iz 3 ponude", category: "gradnja" },
  { id: "DEC-03", title: "Aktivacija vertikale — Arhitekt Studio na SAN-02", spvId: "SAN-02", requestedBy: "Jurke Maričić", decidedBy: "Jurke Maričić", status: "odobreno", date: "01.11.2025.", decidedDate: "01.11.2025.", description: "Aktivacija projektiranja za SAN-02", category: "vertikale" },
  { id: "DEC-04", title: "Blokada SOL-01 — nedostaje mandatory", spvId: "SOL-01", requestedBy: "CORE sustav", decidedBy: "Jurke Maričić", status: "odobreno", date: "10.02.2026.", decidedDate: "10.02.2026.", description: "Automatska blokada — nedostaje elaborat okoliša", category: "compliance" },
  { id: "DEC-05", title: "Odobrenje financijskog modela SOL-01", spvId: "SOL-01", requestedBy: "FinanceAdvisors d.o.o.", decidedBy: "Jurke Maričić", status: "odobreno", date: "12.10.2025.", decidedDate: "14.10.2025.", description: "Model odobren za prezentaciju banci", category: "financije" },
  { id: "DEC-06", title: "Prihvaćanje CORE pregleda — TUR-01", spvId: "TUR-01", requestedBy: "Jurke Maričić", decidedBy: null, status: "na_čekanju", date: "01.02.2026.", decidedDate: null, description: "CORE pregled u tijeku — čeka finalnu evaluaciju", category: "pregled" },
  { id: "DEC-07", title: "Odobrenje success fee — TUR-02", spvId: "TUR-02", requestedBy: "Jurke Maričić", decidedBy: "Jurke Maričić", status: "odobreno", date: "10.11.2025.", decidedDate: "15.11.2025.", description: "Success fee 10% od neto profita odobren", category: "billing" },
  { id: "DEC-08", title: "Odobrenje success fee — SAN-03", spvId: "SAN-03", requestedBy: "Jurke Maričić", decidedBy: "Jurke Maričić", status: "odobreno", date: "15.11.2025.", decidedDate: "20.11.2025.", description: "Success fee 10% od neto profita odobren", category: "billing" },
  { id: "DEC-09", title: "Odbijanje ponude izvođača B — SAN-01", spvId: "SAN-01", requestedBy: "Jurke Maričić", decidedBy: "Jurke Maričić", status: "odbijeno", date: "15.02.2026.", decidedDate: "18.02.2026.", description: "Cijena previsoka za opseg radova", category: "gradnja" },
  { id: "DEC-10", title: "Aktivacija vertikale — EcoPermit na INF-01", spvId: "INF-01", requestedBy: "Jurke Maričić", decidedBy: "Jurke Maričić", status: "odobreno", date: "01.02.2026.", decidedDate: "01.02.2026.", description: "Okolišna dozvola potrebna za industrijsku zonu", category: "vertikale" },
  { id: "DEC-11", title: "CORE pregled — Smart Building", spvId: "TEC-01", requestedBy: "Jurke Maričić", decidedBy: null, status: "na_čekanju", date: "01.12.2025.", decidedDate: null, description: "IoT pilot projekt — čeka tehničku evaluaciju", category: "pregled" },
  { id: "DEC-12", title: "Odobrenje lokacijske dozvole TUR-01", spvId: "TUR-01", requestedBy: "Jurke Maričić", decidedBy: null, status: "na_čekanju", date: "15.02.2026.", decidedDate: null, description: "Lokacijska dozvola čeka pregled", category: "dozvole" },
  { id: "DEC-13", title: "Zatvaranje projekta SAN-03", spvId: "SAN-03", requestedBy: "Jurke Maričić", decidedBy: "Jurke Maričić", status: "odobreno", date: "15.11.2025.", decidedDate: "15.11.2025.", description: "Projekt završen — svi stanovi prodani", category: "zatvaranje" },
  { id: "DEC-14", title: "Zatvaranje projekta TUR-02", spvId: "TUR-02", requestedBy: "Jurke Maričić", decidedBy: "Jurke Maričić", status: "odobreno", date: "01.10.2025.", decidedDate: "01.10.2025.", description: "Glamping resort završen — sezona uspješna", category: "zatvaranje" },
  { id: "DEC-15", title: "Odobrenje due diligence — INF-01", spvId: "INF-01", requestedBy: "Pravo & Savjet d.o.o.", decidedBy: null, status: "na_čekanju", date: "18.02.2026.", decidedDate: null, description: "Due diligence report čeka pregled", category: "pravni" },
];

// ─── TOK ZAHTJEVI (20) ─────────────────────────────────────────────────────

export const TOK_REQUESTS: TokRequest[] = [
  { id: "TOK-01", title: "Deblokiraj SOL-01", spvId: "SOL-01", requestedBy: "Jurke Maričić", assignedTo: "EcoPermit d.o.o.", priority: "critical", status: "otvoren", createdDate: "10.02.2026.", dueDate: "20.02.2026.", resolvedDate: null, slaHours: 48, slaBreached: true, category: "blokada", description: "Hitno dostaviti elaborat okoliša" },
  { id: "TOK-02", title: "Naplata IR-2026-003 — SAN-01 PM", spvId: "SAN-01", requestedBy: "CORE sustav", assignedTo: "Jurke Maričić", priority: "high", status: "otvoren", createdDate: "20.02.2026.", dueDate: "25.02.2026.", resolvedDate: null, slaHours: 72, slaBreached: false, category: "naplata", description: "PM račun kasni — kontaktirati SPV vlasnika" },
  { id: "TOK-03", title: "Naplata IR-2026-010 — SOL-01", spvId: "SOL-01", requestedBy: "CORE sustav", assignedTo: "Jurke Maričić", priority: "high", status: "eskaliran", createdDate: "25.01.2026.", dueDate: "01.02.2026.", resolvedDate: null, slaHours: 72, slaBreached: true, category: "naplata", description: "Platform fee siječanj — 26 dana kašnjenje" },
  { id: "TOK-04", title: "Naplata IR-2026-017 — Arhitekt SAN-02", spvId: "SAN-02", requestedBy: "CORE sustav", assignedTo: "Jurke Maričić", priority: "medium", status: "otvoren", createdDate: "05.02.2026.", dueDate: "15.02.2026.", resolvedDate: null, slaHours: 72, slaBreached: true, category: "naplata", description: "Vertikala provizija kasni 15 dana" },
  { id: "TOK-05", title: "Dodijeli knjigovođu — SOL-02", spvId: "SOL-02", requestedBy: "CORE sustav", assignedTo: "Jurke Maričić", priority: "high", status: "otvoren", createdDate: "10.02.2026.", dueDate: "28.02.2026.", resolvedDate: null, slaHours: 168, slaBreached: false, category: "assignment", description: "SPV bez knjigovođe — compliance risk" },
  { id: "TOK-06", title: "Dodijeli knjigovođu — AGR-01", spvId: "AGR-01", requestedBy: "CORE sustav", assignedTo: "Jurke Maričić", priority: "medium", status: "otvoren", createdDate: "15.02.2026.", dueDate: "15.03.2026.", resolvedDate: null, slaHours: 168, slaBreached: false, category: "assignment", description: "OPG Knjige u pregovorima — potreban ugovor" },
  { id: "TOK-07", title: "Pregled lokacijske dozvole — TUR-01", spvId: "TUR-01", requestedBy: "Jurke Maričić", assignedTo: "Pravo & Savjet d.o.o.", priority: "medium", status: "u_tijeku", createdDate: "01.02.2026.", dueDate: "15.02.2026.", resolvedDate: null, slaHours: 120, slaBreached: true, category: "pregled", description: "Pravna provjera lokacijske dozvole" },
  { id: "TOK-08", title: "Kredit evaluacija OTP — TUR-01", spvId: "TUR-01", requestedBy: "Jurke Maričić", assignedTo: "FinanceAdvisors d.o.o.", priority: "medium", status: "u_tijeku", createdDate: "01.02.2026.", dueDate: "31.03.2026.", resolvedDate: null, slaHours: 720, slaBreached: false, category: "financije", description: "Priprema dokumentacije za OTP kredit" },
  { id: "TOK-09", title: "NKD migracija — analiza", spvId: "SAN-01", requestedBy: "Jurke Maričić", assignedTo: "Pravo & Savjet d.o.o.", priority: "high", status: "u_tijeku", createdDate: "15.02.2026.", dueDate: "15.03.2026.", resolvedDate: null, slaHours: 168, slaBreached: false, category: "compliance", description: "NKD 2007→2025 migracija — potrebni novi kodovi" },
  { id: "TOK-10", title: "Odobrenje due diligence INF-01", spvId: "INF-01", requestedBy: "Pravo & Savjet d.o.o.", assignedTo: "Jurke Maričić", priority: "high", status: "otvoren", createdDate: "18.02.2026.", dueDate: "28.02.2026.", resolvedDate: null, slaHours: 72, slaBreached: false, category: "pregled", description: "Due diligence report čeka CORE odobrenje" },

  // Riješeni
  { id: "TOK-11", title: "Revizija glavnog projekta SAN-01", spvId: "SAN-01", requestedBy: "Arhitekt Studio d.o.o.", assignedTo: "Jurke Maričić", priority: "high", status: "riješen", createdDate: "01.12.2025.", dueDate: "31.01.2026.", resolvedDate: "28.01.2026.", slaHours: 720, slaBreached: false, category: "pregled", description: "Revizija odobrena" },
  { id: "TOK-12", title: "Finalizacija success fee TUR-02", spvId: "TUR-02", requestedBy: "Jurke Maričić", assignedTo: "Računovodstvo Sigma d.o.o.", priority: "medium", status: "riješen", createdDate: "01.11.2025.", dueDate: "15.11.2025.", resolvedDate: "15.11.2025.", slaHours: 168, slaBreached: false, category: "billing", description: "Success fee obračunat i fakturiran" },
  { id: "TOK-13", title: "Zatvaranje SAN-03 — sve dokumentacija", spvId: "SAN-03", requestedBy: "Jurke Maričić", assignedTo: "Pravo & Savjet d.o.o.", priority: "medium", status: "zatvoren", createdDate: "01.11.2025.", dueDate: "15.12.2025.", resolvedDate: "10.12.2025.", slaHours: 720, slaBreached: false, category: "zatvaranje", description: "Projekt zatvoren — sva dokumentacija kompletna" },
  { id: "TOK-14", title: "Zatvaranje TUR-02 — finalna sezona", spvId: "TUR-02", requestedBy: "Jurke Maričić", assignedTo: "TuristBooks d.o.o.", priority: "medium", status: "zatvoren", createdDate: "01.10.2025.", dueDate: "01.12.2025.", resolvedDate: "28.11.2025.", slaHours: 720, slaBreached: false, category: "zatvaranje", description: "Glamping projekt zatvoren — sezona uspješna" },
  { id: "TOK-15", title: "Aktivacija GreenEnergy na SAN-01", spvId: "SAN-01", requestedBy: "Jurke Maričić", assignedTo: "GreenEnergy Consult", priority: "low", status: "riješen", createdDate: "15.01.2026.", dueDate: "05.02.2026.", resolvedDate: "05.02.2026.", slaHours: 168, slaBreached: false, category: "assignment", description: "Energetski certifikat dodijeljen" },
  { id: "TOK-16", title: "Naplata IR-2025-048 — TUR-02 stari", spvId: "TUR-02", requestedBy: "CORE sustav", assignedTo: "Jurke Maričić", priority: "medium", status: "riješen", createdDate: "01.12.2025.", dueDate: "15.12.2025.", resolvedDate: "28.11.2025.", slaHours: 72, slaBreached: false, category: "naplata", description: "Success fee naplaćen" },

  // Još par otvorenih
  { id: "TOK-17", title: "Pregled IoT specifikacije — TEC-01", spvId: "TEC-01", requestedBy: "Digital Systems d.o.o.", assignedTo: "Jurke Maričić", priority: "medium", status: "otvoren", createdDate: "15.02.2026.", dueDate: "01.03.2026.", resolvedDate: null, slaHours: 120, slaBreached: false, category: "pregled", description: "IoT specifikacija čeka CORE pregled" },
  { id: "TOK-18", title: "D&O polica — upit osiguravateljima", spvId: "SAN-01", requestedBy: "Jurke Maričić", assignedTo: "Pravo & Savjet d.o.o.", priority: "low", status: "otvoren", createdDate: "01.02.2026.", dueDate: "31.03.2026.", resolvedDate: null, slaHours: 720, slaBreached: false, category: "admin", description: "Potrebna D&O polica 400-800 EUR godišnje" },
  { id: "TOK-19", title: "GDPR politika — finalizacija", spvId: "SAN-01", requestedBy: "Pravo & Savjet d.o.o.", assignedTo: "Jurke Maričić", priority: "medium", status: "otvoren", createdDate: "10.02.2026.", dueDate: "31.03.2026.", resolvedDate: null, slaHours: 336, slaBreached: false, category: "compliance", description: "GDPR politika u draftu — čeka finalizaciju" },
  { id: "TOK-20", title: "Financijski model SAN-02 — pregled", spvId: "SAN-02", requestedBy: "FinanceAdvisors d.o.o.", assignedTo: "Jurke Maričić", priority: "high", status: "otvoren", createdDate: "15.02.2026.", dueDate: "01.03.2026.", resolvedDate: null, slaHours: 72, slaBreached: false, category: "pregled", description: "Financijski model čeka CORE odobrenje" },
];

// ─── ACTIVITY LOG (50) ─────────────────────────────────────────────────────

export const ACTIVITY_LOG: ActivityLog[] = [
  { id: "AL-50", timestamp: "21.02.2026. 14:30", action: "Dokument uploadiran", actor: "Jurke Maričić", spvId: "SAN-01", entityType: "document", entityId: "DOC-29", details: "RIVUS CORE Arhitektura v1.1 uploadirana", category: "document" },
  { id: "AL-49", timestamp: "20.02.2026. 16:00", action: "Račun plaćen", actor: "SPV SAN-02", spvId: "SAN-02", entityType: "invoice", entityId: "II-06", details: "IR-2026-006 — platform fee veljača plaćen", category: "billing" },
  { id: "AL-48", timestamp: "20.02.2026. 15:00", action: "Račun plaćen", actor: "SPV SAN-01", spvId: "SAN-01", entityType: "invoice", entityId: "II-01", details: "IR-2026-001 — platform fee veljača plaćen", category: "billing" },
  { id: "AL-47", timestamp: "20.02.2026. 10:00", action: "Rashod plaćen", actor: "CORE d.o.o.", spvId: null, entityType: "invoice", entityId: "RI-01", details: "Pravo & Savjet — NKD analiza 750 EUR", category: "billing" },
  { id: "AL-46", timestamp: "19.02.2026. 14:00", action: "Račun plaćen", actor: "SPV INF-01", spvId: "INF-01", entityType: "invoice", entityId: "II-12", details: "IR-2026-012 — platform fee veljača plaćen", category: "billing" },
  { id: "AL-45", timestamp: "19.02.2026. 11:00", action: "Provizija plaćena", actor: "BuildControl d.o.o.", spvId: "SAN-01", entityType: "invoice", entityId: "II-27", details: "IR-2026-019 — nadzor provizija 1.800 EUR", category: "billing" },
  { id: "AL-44", timestamp: "18.02.2026. 16:00", action: "Due diligence uploadiran", actor: "Pravo & Savjet d.o.o.", spvId: "INF-01", entityType: "document", entityId: "DOC-23", details: "Due diligence report čeka pregled", category: "document" },
  { id: "AL-43", timestamp: "18.02.2026. 14:00", action: "Zadatak kreiran", actor: "Jurke Maričić", spvId: "SAN-01", entityType: "task", entityId: "TSK-25", details: "Nadzor proljetna inspekcija SAN-01", category: "task" },
  { id: "AL-42", timestamp: "18.02.2026. 10:00", action: "Odluka — odbijeno", actor: "Jurke Maričić", spvId: "SAN-01", entityType: "decision", entityId: "DEC-09", details: "Ponuda izvođača B odbijena — cijena previsoka", category: "approval" },
  { id: "AL-41", timestamp: "15.02.2026. 16:00", action: "Financijski model uploadiran", actor: "FinanceAdvisors d.o.o.", spvId: "SAN-02", entityType: "document", entityId: "DOC-09", details: "Financijski model SAN-02 — čeka pregled", category: "document" },
  { id: "AL-40", timestamp: "15.02.2026. 14:00", action: "TOK zahtjev kreiran", actor: "CORE sustav", spvId: "SAN-02", entityType: "tok", entityId: "TOK-20", details: "Financijski model čeka CORE odobrenje", category: "tok" },
  { id: "AL-39", timestamp: "15.02.2026. 12:00", action: "Zadatak kreiran", actor: "Jurke Maričić", spvId: "SAN-01", entityType: "task", entityId: "TSK-17", details: "NKD migracija — priprema dokumentacije", category: "task" },
  { id: "AL-38", timestamp: "15.02.2026. 10:00", action: "Računi izdani (batch)", actor: "CORE sustav", spvId: null, entityType: "invoice", entityId: "batch-feb", details: "6 računa izdano za veljača 2026", category: "billing" },
  { id: "AL-37", timestamp: "14.02.2026. 14:00", action: "Račun plaćen", actor: "SPV TUR-01", spvId: "TUR-01", entityType: "invoice", entityId: "II-11", details: "CORE pregled — inicijalna analiza 1.000 EUR", category: "billing" },
  { id: "AL-36", timestamp: "13.02.2026. 16:00", action: "Račun plaćen", actor: "SPV TEC-01", spvId: "TEC-01", entityType: "invoice", entityId: "II-26", details: "CORE pregled TEC-01 — 1.000 EUR", category: "billing" },
  { id: "AL-35", timestamp: "10.02.2026. 16:00", action: "BLOKADA AKTIVIRANA", actor: "CORE sustav", spvId: "SOL-01", entityType: "lifecycle", entityId: "SOL-01", details: "SPV SOL-01 blokiran — nedostaje elaborat okoliša", category: "block" },
  { id: "AL-34", timestamp: "10.02.2026. 15:00", action: "Odluka — blokada odobrena", actor: "Jurke Maričić", spvId: "SOL-01", entityType: "decision", entityId: "DEC-04", details: "Mandatory dokument nedostaje — blokada potvrđena", category: "approval" },
  { id: "AL-33", timestamp: "10.02.2026. 14:00", action: "IoT specifikacija uploadirana", actor: "Digital Systems d.o.o.", spvId: "TEC-01", entityType: "document", entityId: "DOC-24", details: "Draft specifikacija — čeka pregled", category: "document" },
  { id: "AL-32", timestamp: "10.02.2026. 10:00", action: "TOK — dodijeli knjigovođu SOL-02", actor: "CORE sustav", spvId: "SOL-02", entityType: "tok", entityId: "TOK-05", details: "SPV bez knjigovođe — compliance risk", category: "tok" },
  { id: "AL-31", timestamp: "05.02.2026. 16:00", action: "Energetski certifikat uploadiran", actor: "GreenEnergy Consult", spvId: "SAN-01", entityType: "document", entityId: "DOC-06", details: "Certifikat odobren za SAN-01", category: "document" },
  { id: "AL-30", timestamp: "05.02.2026. 14:00", action: "TOK riješen — GreenEnergy aktiviran", actor: "GreenEnergy Consult", spvId: "SAN-01", entityType: "tok", entityId: "TOK-15", details: "Energetski certifikat dodijeljen na SAN-01", category: "assignment" },
  { id: "AL-29", timestamp: "01.02.2026. 14:00", action: "Analiza tržišta završena", actor: "Agro Savjetovanje d.o.o.", spvId: "AGR-01", entityType: "task", entityId: "TSK-10", details: "Tržišna analiza lavande — završena", category: "task" },
  { id: "AL-28", timestamp: "01.02.2026. 10:00", action: "Vertikala aktivirana — EcoPermit na INF-01", actor: "Jurke Maričić", spvId: "INF-01", entityType: "decision", entityId: "DEC-10", details: "Okolišna dozvola za industrijsku zonu", category: "assignment" },
  { id: "AL-27", timestamp: "28.01.2026. 16:00", action: "Glavni projekt odobren", actor: "Jurke Maričić", spvId: "SAN-01", entityType: "decision", entityId: "DEC-01", details: "Revizija prošla — projekt odobren v3", category: "approval" },
  { id: "AL-26", timestamp: "28.01.2026. 10:00", action: "Zadatak završen — revizija", actor: "Arhitekt Studio d.o.o.", spvId: "SAN-01", entityType: "task", entityId: "TSK-03", details: "Revizija glavnog projekta završena", category: "task" },
  { id: "AL-25", timestamp: "15.01.2026. 14:00", action: "Računi izdani (batch)", actor: "CORE sustav", spvId: null, entityType: "invoice", entityId: "batch-jan", details: "5 računa izdano za siječanj 2026", category: "billing" },
  { id: "AL-24", timestamp: "10.01.2026. 10:00", action: "Geodetski elaborat završen", actor: "Geodet Plus d.o.o.", spvId: "SAN-01", entityType: "task", entityId: "TSK-04", details: "Elaborat predan — faza geodezija gotova", category: "task" },
  { id: "AL-23", timestamp: "05.01.2026. 10:00", action: "SPV AGR-01 kreiran", actor: "Jurke Maričić", spvId: "AGR-01", entityType: "lifecycle", entityId: "AGR-01", details: "Novi SPV — Slavonska farma, sektor Agro", category: "lifecycle" },
  { id: "AL-22", timestamp: "01.01.2026. 10:00", action: "CORE-SPV ugovor potpisan", actor: "Jurke Maričić", spvId: "SAN-01", entityType: "document", entityId: "DOC-05", details: "Ugovor SAN-01 aktiviran za 2026.", category: "document" },
  { id: "AL-21", timestamp: "15.12.2025. 14:00", action: "NDA potpisan — Pravo & Savjet", actor: "Jurke Maričić", spvId: null, entityType: "document", entityId: "DOC-NDA-03", details: "NDA za sve sektore", category: "document" },
  { id: "AL-20", timestamp: "10.12.2025. 16:00", action: "Projekt SAN-03 zatvoren", actor: "Jurke Maričić", spvId: "SAN-03", entityType: "lifecycle", entityId: "SAN-03", details: "Faza: Završeno — svi stanovi prodani", category: "lifecycle" },
  { id: "AL-19", timestamp: "03.12.2025. 10:00", action: "Success fee SAN-03 plaćen", actor: "SPV SAN-03", spvId: "SAN-03", entityType: "invoice", entityId: "II-20", details: "5.200 EUR — 10% neto profita", category: "billing" },
  { id: "AL-18", timestamp: "28.11.2025. 16:00", action: "Projekt TUR-02 zatvoren", actor: "Jurke Maričić", spvId: "TUR-02", entityType: "lifecycle", entityId: "TUR-02", details: "Faza: Završeno — sezona uspješna", category: "lifecycle" },
  { id: "AL-17", timestamp: "28.11.2025. 14:00", action: "Success fee TUR-02 plaćen", actor: "SPV TUR-02", spvId: "TUR-02", entityType: "invoice", entityId: "II-18", details: "7.800 EUR — 10% neto profita", category: "billing" },
  { id: "AL-16", timestamp: "20.11.2025. 10:00", action: "SPV TUR-01 kreiran", actor: "Jurke Maričić", spvId: "TUR-01", entityType: "lifecycle", entityId: "TUR-01", details: "Novi SPV — Vila Maestral, sektor Turizam", category: "lifecycle" },
  { id: "AL-15", timestamp: "15.11.2025. 14:00", action: "Faza promjena: Završeno — SAN-03", actor: "CORE sustav", spvId: "SAN-03", entityType: "lifecycle", entityId: "SAN-03", details: "Lifecycle: Aktivna gradnja → Završeno", category: "lifecycle" },
  { id: "AL-14", timestamp: "14.11.2025. 10:00", action: "Idejni projekt SAN-02 uploadiran", actor: "Arhitekt Studio d.o.o.", spvId: "SAN-02", entityType: "document", entityId: "DOC-07", details: "28.5 MB — odobren", category: "document" },
  { id: "AL-13", timestamp: "01.11.2025. 10:00", action: "Vertikala aktivirana — Arhitekt na SAN-02", actor: "Jurke Maričić", spvId: "SAN-02", entityType: "decision", entityId: "DEC-03", details: "Projektiranje za SAN-02", category: "assignment" },
  { id: "AL-12", timestamp: "01.10.2025. 16:00", action: "Faza promjena: Završeno — TUR-02", actor: "CORE sustav", spvId: "TUR-02", entityType: "lifecycle", entityId: "TUR-02", details: "Lifecycle: Aktivna gradnja → Završeno", category: "lifecycle" },
  { id: "AL-11", timestamp: "10.09.2025. 10:00", action: "SPV SOL-01 kreiran", actor: "Jurke Maričić", spvId: "SOL-01", entityType: "lifecycle", entityId: "SOL-01", details: "Novi SPV — Solarna Baranja, sektor Energetika", category: "lifecycle" },
  { id: "AL-10", timestamp: "01.07.2025. 10:00", action: "SPV INF-01 kreiran", actor: "Jurke Maričić", spvId: "INF-01", entityType: "lifecycle", entityId: "INF-01", details: "Novi SPV — Logistički centar OS", category: "lifecycle" },
  { id: "AL-09", timestamp: "01.06.2025. 10:00", action: "SPV SAN-02 kreiran", actor: "Jurke Maričić", spvId: "SAN-02", entityType: "lifecycle", entityId: "SAN-02", details: "Novi SPV — Vukovarska 12", category: "lifecycle" },
  { id: "AL-08", timestamp: "15.04.2024. 10:00", action: "SPV TUR-02 kreiran", actor: "Jurke Maričić", spvId: "TUR-02", entityType: "lifecycle", entityId: "TUR-02", details: "Novi SPV — Glamping Plitvice", category: "lifecycle" },
  { id: "AL-07", timestamp: "15.03.2025. 10:00", action: "SPV SAN-01 kreiran", actor: "Jurke Maričić", spvId: "SAN-01", entityType: "lifecycle", entityId: "SAN-01", details: "Novi SPV — Šandora Petefija 4", category: "lifecycle" },
  { id: "AL-06", timestamp: "01.02.2024. 10:00", action: "SPV SAN-03 kreiran", actor: "Jurke Maričić", spvId: "SAN-03", entityType: "lifecycle", entityId: "SAN-03", details: "Novi SPV — Strossmayerova 15", category: "lifecycle" },
  { id: "AL-05", timestamp: "01.06.2025. 08:00", action: "CORE d.o.o. osnovan", actor: "Jurke Maričić", spvId: null, entityType: "lifecycle", entityId: "CORE", details: "Temeljni kapital 2.500 EUR uplaćen", category: "lifecycle" },
  { id: "AL-04", timestamp: "12.12.2025. 10:00", action: "RIVUS Holding osnovan", actor: "Jurke Maričić", spvId: null, entityType: "lifecycle", entityId: "HOLDING", details: "Brand guardian i IP holder", category: "lifecycle" },
  { id: "AL-03", timestamp: "01.12.2025. 10:00", action: "SPV TEC-01 kreiran", actor: "Jurke Maričić", spvId: "TEC-01", entityType: "lifecycle", entityId: "TEC-01", details: "Novi SPV — Smart Building OS", category: "lifecycle" },
  { id: "AL-02", timestamp: "10.02.2026. 10:00", action: "SPV SOL-02 kreiran", actor: "Jurke Maričić", spvId: "SOL-02", entityType: "lifecycle", entityId: "SOL-02", details: "Novi SPV — EV Hub Osijek", category: "lifecycle" },
  { id: "AL-01", timestamp: "21.02.2026. 16:00", action: "Safety framing labels ažurirani", actor: "CORE sustav", spvId: null, entityType: "lifecycle", entityId: "CORE", details: "Financije(management), PDV(simulacija), Bilanca(informativna)", category: "lifecycle" },
];

// ─── UGOVORI (18) ───────────────────────────────────────────────────────────

export const CONTRACTS: Contract[] = [
  // CORE-SPV
  { id: "CON-01", number: "UG-2026-001", type: "CORE-SPV", partyA: "CORE d.o.o.", partyB: "SPV SAN-01", partyBId: "SAN-01", startDate: "01.01.2026.", endDate: "31.12.2026.", services: "Brand + Platform + PM", monthlyFee: 3000, commissionPercent: 10, status: "aktivan" },
  { id: "CON-02", number: "UG-2026-002", type: "CORE-SPV", partyA: "CORE d.o.o.", partyB: "SPV SAN-02", partyBId: "SAN-02", startDate: "15.01.2026.", endDate: "31.12.2026.", services: "Brand + Platform", monthlyFee: 500, commissionPercent: 10, status: "aktivan" },
  { id: "CON-03", number: "UG-2025-015", type: "CORE-SPV", partyA: "CORE d.o.o.", partyB: "SPV SOL-01", partyBId: "SOL-01", startDate: "10.09.2025.", endDate: "01.06.2027.", services: "Brand + Platform", monthlyFee: 500, commissionPercent: 10, status: "aktivan" },
  { id: "CON-04", number: "UG-2025-020", type: "CORE-SPV", partyA: "CORE d.o.o.", partyB: "SPV INF-01", partyBId: "INF-01", startDate: "01.07.2025.", endDate: "01.12.2027.", services: "Brand + Platform", monthlyFee: 500, commissionPercent: 10, status: "aktivan" },
  { id: "CON-05", number: "UG-2025-008", type: "CORE-SPV", partyA: "CORE d.o.o.", partyB: "SPV SAN-03", partyBId: "SAN-03", startDate: "01.02.2024.", endDate: "15.11.2025.", services: "Brand + Platform + PM", monthlyFee: 0, commissionPercent: 10, status: "istekao" },
  { id: "CON-06", number: "UG-2024-003", type: "CORE-SPV", partyA: "CORE d.o.o.", partyB: "SPV TUR-02", partyBId: "TUR-02", startDate: "15.04.2024.", endDate: "01.10.2025.", services: "Brand + Platform + PM", monthlyFee: 0, commissionPercent: 10, status: "istekao" },

  // CORE-Vertikale
  { id: "CON-07", number: "UG-2026-003", type: "CORE-vertikala", partyA: "CORE d.o.o.", partyB: "Arhitekt Studio d.o.o.", partyBId: "VER-01", startDate: "01.02.2026.", endDate: "01.02.2027.", services: "Projektiranje — provizija 8%", monthlyFee: null, commissionPercent: 8, status: "aktivan" },
  { id: "CON-08", number: "UG-2026-004", type: "CORE-vertikala", partyA: "CORE d.o.o.", partyB: "Geodet Plus d.o.o.", partyBId: "VER-02", startDate: "10.01.2026.", endDate: "10.01.2027.", services: "Geodezija — provizija 10%", monthlyFee: null, commissionPercent: 10, status: "aktivan" },
  { id: "CON-09", number: "UG-2025-022", type: "CORE-vertikala", partyA: "CORE d.o.o.", partyB: "Pravo & Savjet d.o.o.", partyBId: "VER-03", startDate: "15.12.2025.", endDate: "15.12.2026.", services: "Pravni — provizija 12%", monthlyFee: null, commissionPercent: 12, status: "aktivan" },
  { id: "CON-10", number: "UG-2025-005", type: "CORE-vertikala", partyA: "CORE d.o.o.", partyB: "BuildControl d.o.o.", partyBId: "VER-08", startDate: "01.04.2025.", endDate: "01.04.2026.", services: "Nadzor — provizija 8%", monthlyFee: null, commissionPercent: 8, status: "istječe" },

  // CORE-Knjigovođe
  { id: "CON-11", number: "UG-2026-005", type: "CORE-knjigovodja", partyA: "CORE d.o.o.", partyB: "Računovodstvo Sigma d.o.o.", partyBId: "ACC-01", startDate: "01.01.2026.", endDate: "31.12.2026.", services: "CORE + Holding + SAN-01/02/03", monthlyFee: 350, commissionPercent: null, status: "aktivan" },
  { id: "CON-12", number: "UG-2025-018", type: "CORE-knjigovodja", partyA: "CORE d.o.o.", partyB: "Financa Plus d.o.o.", partyBId: "ACC-02", startDate: "01.10.2025.", endDate: "30.09.2026.", services: "SOL-01 + INF-01 + TEC-01", monthlyFee: 250, commissionPercent: null, status: "aktivan" },
  { id: "CON-13", number: "UG-2024-001", type: "CORE-knjigovodja", partyA: "CORE d.o.o.", partyB: "TuristBooks d.o.o.", partyBId: "ACC-04", startDate: "15.04.2024.", endDate: "15.04.2026.", services: "TUR-01 + TUR-02", monthlyFee: 200, commissionPercent: null, status: "istječe" },

  // NDA-ovi
  { id: "CON-14", number: "NDA-001", type: "NDA", partyA: "CORE d.o.o.", partyB: "Geodet Plus d.o.o.", partyBId: "VER-02", startDate: "10.01.2026.", endDate: "10.01.2028.", services: "NDA — 2 godine", monthlyFee: null, commissionPercent: null, status: "aktivan" },
  { id: "CON-15", number: "NDA-002", type: "NDA", partyA: "CORE d.o.o.", partyB: "Arhitekt Studio d.o.o.", partyBId: "VER-01", startDate: "01.02.2026.", endDate: "01.02.2028.", services: "NDA — 2 godine", monthlyFee: null, commissionPercent: null, status: "aktivan" },
  { id: "CON-16", number: "NDA-003", type: "NDA", partyA: "CORE d.o.o.", partyB: "EcoPermit d.o.o.", partyBId: "VER-10", startDate: "05.01.2026.", endDate: "05.01.2028.", services: "NDA — 2 godine", monthlyFee: null, commissionPercent: null, status: "aktivan" },
  { id: "CON-17", number: "NDA-004", type: "NDA", partyA: "CORE d.o.o.", partyB: "TuristPlan d.o.o.", partyBId: "VER-07", startDate: "01.02.2026.", endDate: "01.02.2028.", services: "NDA — 2 godine", monthlyFee: null, commissionPercent: null, status: "aktivan" },
  { id: "CON-18", number: "NDA-005", type: "NDA", partyA: "CORE d.o.o.", partyB: "Digital Systems d.o.o.", partyBId: "VER-09", startDate: "15.01.2026.", endDate: "15.01.2028.", services: "NDA — 2 godine", monthlyFee: null, commissionPercent: null, status: "aktivan" },
];

// ─── PDV KVARTALI ───────────────────────────────────────────────────────────

export const PDV_QUARTERS: PdvQuarter[] = [
  { quarter: "Q1 2026", year: 2026, inputVat: 4120, outputVat: 2950, difference: 1170, status: "u_pripremi", dueDate: "20.04.2026." },
  { quarter: "Q4 2025", year: 2025, inputVat: 3850, outputVat: 2680, difference: 1170, status: "plaćeno", dueDate: "20.01.2026." },
  { quarter: "Q3 2025", year: 2025, inputVat: 2100, outputVat: 1450, difference: 650, status: "plaćeno", dueDate: "20.10.2025." },
  { quarter: "Q2 2025", year: 2025, inputVat: 980, outputVat: 320, difference: 660, status: "plaćeno", dueDate: "20.07.2025." },
];

// ─── P&L PO MJESECIMA (12 mjeseci) ─────────────────────────────────────────

export const PNL_MONTHS: PnlMonth[] = [
  { month: "Veljača 2026.", monthNum: 2, year: 2026, revenue: 9350, expenses: 5870, net: 3480, margin: 37.2,
    revenueBreakdown: { platformFees: 1200, brandLicence: 400, pmServices: 2500, successFees: 0, verticalCommissions: 5250 } },
  { month: "Siječanj 2026.", monthNum: 1, year: 2026, revenue: 5100, expenses: 4645, net: 455, margin: 8.9,
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

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────────────

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
export const getUnpaidIssued = () => ISSUED_INVOICES.filter((i) => i.status === "čeka" || i.status === "kasni");
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
export const getPendingDocs = () => DOCUMENTS.filter((d) => d.status === "čeka_pregled");

// Decision helpers
export const getPendingDecisions = () => DECISIONS.filter((d) => d.status === "na_čekanju");
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
export const getExpiringContracts = () => CONTRACTS.filter((c) => c.status === "istječe");
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



