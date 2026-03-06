"use client";

import { supabaseBrowser } from "../supabaseBrowser";
import { useSupabaseQuery, fmtDate, UseDataResult } from "./shared";

export interface BillingRecord {
  id: string;
  spvId: string;
  spvName: string;
  periodStart: string;
  periodEnd: string;
  planType: string;
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: "PENDING" | "INVOICED" | "PAID" | "OVERDUE" | "CANCELLED";
  invoiceId: string | null;
  dueDate: string | null;
  paidAt: string | null;
  notes: string | null;
}

export interface CoreCompanyFinanceEntry {
  id: string;
  entryType: "INCOME" | "EXPENSE";
  category: string;
  subcategory: string | null;
  description: string;
  grossAmount: number;
  netAmount: number | null;
  taxAmount: number | null;
  taxRatePct: number;
  currency: string;
  costType: "CAPEX" | "OPEX" | null;
  entryDate: string;
  counterparty: string | null;
  referenceNumber: string | null;
  isStorno: boolean;
  stornoOf: string | null;
  stornoReason: string | null;
  periodLocked: boolean;
  recordedByName: string;
  approvedByName: string | null;
}

export async function fetchBillingRaw(spvId?: string): Promise<BillingRecord[]> {
  let query = supabaseBrowser
    .from("billing_records")
    .select(`*, spv:spvs!billing_records_spv_id_fkey(project_name)`)
    .order("period_start", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) { console.error("fetchBilling:", error); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    spvId: r.spv_id,
    spvName: r.spv?.project_name || "—",
    periodStart: fmtDate(r.period_start),
    periodEnd: fmtDate(r.period_end),
    planType: r.plan_type || "STANDARD",
    baseAmount: Number(r.base_amount) || 0,
    taxAmount: Number(r.tax_amount) || 0,
    totalAmount: Number(r.total_amount) || 0,
    currency: r.currency || "EUR",
    status: r.status,
    invoiceId: r.invoice_id || null,
    dueDate: fmtDate(r.due_date),
    paidAt: fmtDate(r.paid_at),
    notes: r.notes || null,
  }));
}

export function useBillingRecords(spvId?: string): UseDataResult<BillingRecord[]> {
  return useSupabaseQuery(() => fetchBillingRaw(spvId), [], [spvId]);
}

export function useOverdueBilling(): UseDataResult<BillingRecord[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchBillingRaw();
    return all.filter((b) => b.status === "OVERDUE");
  }, []);
}

export function usePendingBilling(): UseDataResult<BillingRecord[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchBillingRaw();
    return all.filter((b) => b.status === "PENDING");
  }, []);
}

export async function fetchCoreFinanceRaw(entryType?: "INCOME" | "EXPENSE"): Promise<CoreCompanyFinanceEntry[]> {
  let query = supabaseBrowser
    .from("core_company_finance")
    .select(`*,
      recorder:user_profiles!core_company_finance_recorded_by_fkey(full_name),
      approver:user_profiles!core_company_finance_approved_by_fkey(full_name)
    `)
    .order("entry_date", { ascending: false });

  if (entryType) query = query.eq("entry_type", entryType);

  const { data, error } = await query;
  if (error) { console.error("fetchCoreFinance:", error); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    entryType: r.entry_type,
    category: r.category || "",
    subcategory: r.subcategory || null,
    description: r.description || "",
    grossAmount: Number(r.gross_amount) || 0,
    netAmount: r.net_amount ? Number(r.net_amount) : null,
    taxAmount: r.tax_amount ? Number(r.tax_amount) : null,
    taxRatePct: Number(r.tax_rate_pct) || 25,
    currency: r.currency || "EUR",
    costType: r.cost_type || null,
    entryDate: fmtDate(r.entry_date),
    counterparty: r.counterparty || null,
    referenceNumber: r.reference_number || null,
    isStorno: r.is_storno || false,
    stornoOf: r.storno_of || null,
    stornoReason: r.storno_reason || null,
    periodLocked: r.period_locked || false,
    recordedByName: r.recorder?.full_name || "—",
    approvedByName: r.approver?.full_name || null,
  }));
}

export function useCoreFinance(): UseDataResult<CoreCompanyFinanceEntry[]> {
  return useSupabaseQuery(() => fetchCoreFinanceRaw(), []);
}

export function useCoreIncome(): UseDataResult<CoreCompanyFinanceEntry[]> {
  return useSupabaseQuery(() => fetchCoreFinanceRaw("INCOME"), []);
}

export function useCoreExpenses(): UseDataResult<CoreCompanyFinanceEntry[]> {
  return useSupabaseQuery(() => fetchCoreFinanceRaw("EXPENSE"), []);
}

export function useCoreFinanceSummary(): UseDataResult<{
  totalIncome: number; totalExpenses: number; netResult: number;
  lockedEntries: number; stornoCount: number;
}> {
  return useSupabaseQuery(async () => {
    const all = await fetchCoreFinanceRaw();
    const active = all.filter((e) => !e.isStorno);
    const income = active.filter((e) => e.entryType === "INCOME").reduce((s, e) => s + e.grossAmount, 0);
    const expenses = active.filter((e) => e.entryType === "EXPENSE").reduce((s, e) => s + e.grossAmount, 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      netResult: income - expenses,
      lockedEntries: all.filter((e) => e.periodLocked).length,
      stornoCount: all.filter((e) => e.isStorno).length,
    };
  }, { totalIncome: 0, totalExpenses: 0, netResult: 0, lockedEntries: 0, stornoCount: 0 });
}
