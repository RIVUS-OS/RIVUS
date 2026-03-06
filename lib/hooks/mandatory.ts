"use client";

import { supabaseBrowser } from "../supabaseBrowser";
import { useSupabaseQuery, fmtDate, UseDataResult } from "./shared";

export interface MandatoryItem {
  id: string;
  spvId: string;
  title: string;
  itemType: "DOCUMENT" | "TASK";
  lifecyclePhase: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "WAIVED";
  dueDate: string | null;
  completedAt: string | null;
  completedBy: string | null;
  waivedBy: string | null;
  waivedReason: string | null;
  blocksTransition: boolean;
  linkedDocumentId: string | null;
  linkedTaskId: string | null;
  sortOrder: number;
}

export async function fetchMandatoryItemsRaw(spvId?: string): Promise<MandatoryItem[]> {
  let query = supabaseBrowser
    .from("mandatory_items")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) { console.error("fetchMandatoryItems:", error); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    spvId: r.spv_id,
    title: r.title || "",
    itemType: r.item_type,
    lifecyclePhase: r.lifecycle_phase,
    status: r.status,
    dueDate: fmtDate(r.due_date),
    completedAt: fmtDate(r.completed_at),
    completedBy: r.completed_by || null,
    waivedBy: r.waived_by || null,
    waivedReason: r.waived_reason || null,
    blocksTransition: r.blocks_transition,
    linkedDocumentId: r.linked_document_id || null,
    linkedTaskId: r.linked_task_id || null,
    sortOrder: r.sort_order || 0,
  }));
}

export function useMandatoryItems(spvId?: string): UseDataResult<MandatoryItem[]> {
  return useSupabaseQuery(() => fetchMandatoryItemsRaw(spvId), [], [spvId]);
}

export function useBlockingItems(spvId: string): UseDataResult<MandatoryItem[]> {
  return useSupabaseQuery(async () => {
    const items = await fetchMandatoryItemsRaw(spvId);
    return items.filter((i) => i.blocksTransition && i.status !== "COMPLETED" && i.status !== "WAIVED");
  }, [], [spvId]);
}

export function useMandatoryItemsByPhase(spvId: string, phase: string): UseDataResult<MandatoryItem[]> {
  return useSupabaseQuery(async () => {
    const items = await fetchMandatoryItemsRaw(spvId);
    return items.filter((i) => i.lifecyclePhase === phase);
  }, [], [spvId, phase]);
}
