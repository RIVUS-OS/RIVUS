"use client";

import { supabaseBrowser } from "../supabaseBrowser";
import { useSupabaseQuery, fmtDate, UseDataResult } from "./shared";

export interface Vertikala {
  id: string;
  spvId: string;
  naziv: string;
  tip: string;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "TERMINATED";
  kontaktOsoba: string | null;
  kontaktEmail: string | null;
  kontaktTelefon: string | null;
  oib: string | null;
  provizijaPct: number | null;
  ugovorDatum: string | null;
  ugovorExpiry: string | null;
  notes: string | null;
  metadata: Record<string, unknown>;
}

export interface Deliverable {
  id: string;
  vertikalaId: string;
  spvId: string;
  naziv: string;
  opis: string | null;
  rok: string | null;
  status: "ASSIGNED" | "IN_PROGRESS" | "DELIVERED" | "ACCEPTED" | "REJECTED";
  deliveredAt: string | null;
  acceptedAt: string | null;
  acceptedByName: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  linkedDocumentId: string | null;
}

export interface Tranche {
  id: string;
  bankEvaluationId: string;
  spvId: string;
  trancheNumber: number;
  plannedAmount: number;
  disbursedAmount: number;
  status: "PLANNED" | "REQUESTED" | "APPROVED" | "DISBURSED" | "CANCELLED";
  requestDate: string | null;
  approvalDate: string | null;
  disbursementDate: string | null;
  conditionsMet: boolean;
  notes: string | null;
}

async function fetchVertikaleRaw(spvId?: string): Promise<Vertikala[]> {
  let query = supabaseBrowser
    .from("vertikale")
    .select("*")
    .order("created_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) { console.error("fetchVertikale:", error); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    spvId: r.spv_id,
    naziv: r.naziv || "",
    tip: r.tip || "OSTALO",
    status: r.status || "DRAFT",
    kontaktOsoba: r.kontakt_osoba || null,
    kontaktEmail: r.kontakt_email || null,
    kontaktTelefon: r.kontakt_telefon || null,
    oib: r.oib || null,
    provizijaPct: r.provizija_pct ? Number(r.provizija_pct) : null,
    ugovorDatum: fmtDate(r.ugovor_datum),
    ugovorExpiry: fmtDate(r.ugovor_expiry),
    notes: r.notes || null,
    metadata: r.metadata || {},
  }));
}

export function useVertikale(spvId?: string): UseDataResult<Vertikala[]> {
  return useSupabaseQuery(() => fetchVertikaleRaw(spvId), [], [spvId]);
}

export function useActiveVertikale(spvId?: string): UseDataResult<Vertikala[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchVertikaleRaw(spvId);
    return all.filter((v) => v.status === "ACTIVE");
  }, [], [spvId]);
}

export function useVertikalaById(id: string): UseDataResult<Vertikala | null> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabaseBrowser
      .from("vertikale")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return null;
    const r = data as any;
    return {
      id: r.id, spvId: r.spv_id, naziv: r.naziv || "", tip: r.tip || "OSTALO",
      status: r.status || "DRAFT", kontaktOsoba: r.kontakt_osoba || null,
      kontaktEmail: r.kontakt_email || null, kontaktTelefon: r.kontakt_telefon || null,
      oib: r.oib || null, provizijaPct: r.provizija_pct ? Number(r.provizija_pct) : null,
      ugovorDatum: fmtDate(r.ugovor_datum), ugovorExpiry: fmtDate(r.ugovor_expiry),
      notes: r.notes || null, metadata: r.metadata || {},
    } as Vertikala;
  }, null, [id]);
}

export async function fetchDeliverablesRaw(spvId?: string, vertikalaId?: string): Promise<Deliverable[]> {
  let query = supabaseBrowser
    .from("deliverables")
    .select(`*, accepter:user_profiles!deliverables_accepted_by_fkey(full_name)`)
    .order("rok", { ascending: true });

  if (spvId) query = query.eq("spv_id", spvId);
  if (vertikalaId) query = query.eq("vertikala_id", vertikalaId);

  const { data, error } = await query;
  if (error) { console.error("fetchDeliverables:", error); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    vertikalaId: r.vertikala_id,
    spvId: r.spv_id,
    naziv: r.naziv || "",
    opis: r.opis || null,
    rok: fmtDate(r.rok),
    status: r.status || "ASSIGNED",
    deliveredAt: fmtDate(r.delivered_at),
    acceptedAt: fmtDate(r.accepted_at),
    acceptedByName: r.accepter?.full_name || null,
    rejectedAt: fmtDate(r.rejected_at),
    rejectionReason: r.rejection_reason || null,
    linkedDocumentId: r.linked_document_id || null,
  }));
}

export function useDeliverables(spvId?: string): UseDataResult<Deliverable[]> {
  return useSupabaseQuery(() => fetchDeliverablesRaw(spvId), [], [spvId]);
}

export function useDeliverablesByVertikala(vertikalaId: string): UseDataResult<Deliverable[]> {
  return useSupabaseQuery(() => fetchDeliverablesRaw(undefined, vertikalaId), [], [vertikalaId]);
}

export function useOverdueDeliverables(): UseDataResult<Deliverable[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchDeliverablesRaw();
    const today = new Date().toISOString().split("T")[0];
    return all.filter((d) => d.rok && d.rok < today && d.status !== "ACCEPTED" && d.status !== "REJECTED");
  }, []);
}

export async function fetchTranchesRaw(spvId?: string, bankEvalId?: string): Promise<Tranche[]> {
  let query = supabaseBrowser
    .from("tranches")
    .select("*")
    .order("tranche_number", { ascending: true });

  if (spvId) query = query.eq("spv_id", spvId);
  if (bankEvalId) query = query.eq("bank_evaluation_id", bankEvalId);

  const { data, error } = await query;
  if (error) { console.error("fetchTranches:", error); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    bankEvaluationId: r.bank_evaluation_id,
    spvId: r.spv_id,
    trancheNumber: r.tranche_number,
    plannedAmount: Number(r.planned_amount) || 0,
    disbursedAmount: Number(r.disbursed_amount) || 0,
    status: r.status,
    requestDate: fmtDate(r.request_date),
    approvalDate: fmtDate(r.approval_date),
    disbursementDate: fmtDate(r.disbursement_date),
    conditionsMet: r.conditions_met || false,
    notes: r.notes || null,
  }));
}

export function useTranches(spvId?: string): UseDataResult<Tranche[]> {
  return useSupabaseQuery(() => fetchTranchesRaw(spvId), [], [spvId]);
}

export function useTranchesByEvaluation(bankEvalId: string): UseDataResult<Tranche[]> {
  return useSupabaseQuery(() => fetchTranchesRaw(undefined, bankEvalId), [], [bankEvalId]);
}
