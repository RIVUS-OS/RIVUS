// RIVUS v1.2.7 — P19: usePermission Hook
// Role-aware gate prema §8 matrici iz A14.
// Svaka stranica MORA koristiti za write/action gating (A13-K9).
'use client';

import { useMemo } from 'react';
import { useAuth } from '@/lib/useAuth';
import { usePlatformMode } from '@/lib/hooks/usePlatformMode';
import type { PlatformModeType } from '@/lib/hooks/usePlatformMode';

// Permission matrica — koji action je dozvoljen za koju rolu
const PERMISSION_MATRIX: Record<string, string[]> = {
  // Control Room
  core_dashboard:       ['Core'],
  spv_management:       ['Core'],
  spv_detail_read:      ['Core'],

  // SPV Financije
  finance_read:         ['Core', 'SPV_Owner', 'Knjigovodja'],
  finance_write:        ['SPV_Owner', 'Knjigovodja'],

  // SPV Dokumenti + Zadaci
  document_write:       ['SPV_Owner', 'Knjigovodja'],
  task_write:           ['SPV_Owner'],

  // SPV Vertikale
  vertical_manage:      ['Core'],
  vertical_detail:      ['Core', 'SPV_Owner', 'Vertical'],

  // SPV Banka + Knjigovodstvo
  bank_read:            ['Core', 'Bank', 'SPV_Owner'],
  accounting_access:    ['Core', 'Knjigovodja', 'SPV_Owner'],

  // SPV Mandatory + Odobrenja + Korisnici
  mandatory_manage:     ['Core', 'SPV_Owner'],
  approval_manage:      ['Core', 'SPV_Owner', 'Knjigovodja'],
  user_manage:          ['Core', 'SPV_Owner'],

  // SPV TOK + Dnevnik + Billing + Postavke
  activity_read:        ['Core', 'SPV_Owner', 'Knjigovodja'],
  audit_read:           ['Core', 'SPV_Owner'],
  billing_manage:       ['Core'],
  spv_settings:         ['Core', 'SPV_Owner'],

  // Owner Cockpit
  owner_dashboard:      ['SPV_Owner'],
  owner_spv_workspace:  ['SPV_Owner'],
  checklist_manage:     ['SPV_Owner', 'Core'],
  report_read:          ['SPV_Owner', 'Knjigovodja'],
  invoice_write:        ['SPV_Owner', 'Knjigovodja'],

  // CORE D.O.O.
  core_company_access:  ['Core', 'Knjigovodja'],
  core_finance_write:   ['Core', 'Knjigovodja'],
  core_invoice_write:   ['Core', 'Knjigovodja'],
  core_eracun_manage:   ['Core', 'Knjigovodja'],
  core_tax_manage:      ['Core', 'Knjigovodja'],
  core_report_read:     ['Core', 'Knjigovodja'],
  core_cashflow_manage: ['Core', 'Knjigovodja'],
  core_docs_manage:     ['Core'],
  core_contracts_manage:['Core'],
  core_settings:        ['Core'],

  // Pentagon
  pentagon_tok:         ['Core'],
  pentagon_rizik:       ['Core'],
  pentagon_approvals:   ['Core'],

  // Assignments + Obligations + GDPR
  assignment_manage:    ['Core'],
  obligation_overview:  ['Core'],
  gdpr_manage:          ['Core'],

  // System
  platform_mode_change: ['Core'],
  notifications_read:   ['Core', 'SPV_Owner', 'Vertical', 'Bank', 'Knjigovodja', 'Holding'],
  holding_read:         ['Holding', 'Core'],
};

// Write akcije koje se blokiraju u non-NORMAL modu
const WRITE_ACTIONS = new Set([
  'finance_write', 'document_write', 'task_write', 'vertical_manage',
  'approval_manage', 'user_manage', 'billing_manage', 'spv_settings',
  'spv_management', 'core_finance_write', 'core_invoice_write',
  'core_eracun_manage', 'core_tax_manage', 'core_cashflow_manage',
  'core_docs_manage', 'core_contracts_manage', 'core_settings',
  'mandatory_manage', 'checklist_manage', 'invoice_write',
  'assignment_manage', 'platform_mode_change', 'pentagon_approvals',
]);

// Akcije dozvoljene u SAFE modu (read + monitoring)
const SAFE_MODE_ALLOWED = new Set([
  'core_dashboard', 'spv_detail_read', 'finance_read', 'bank_read',
  'accounting_access', 'activity_read', 'audit_read', 'report_read',
  'pentagon_tok', 'pentagon_rizik', 'obligation_overview', 'gdpr_manage',
  'notifications_read', 'core_report_read', 'core_company_access',
  'owner_dashboard', 'owner_spv_workspace',
  'platform_mode_change',
]);

interface PermissionResult {
  allowed: boolean;
  reason: string;
  role: string | null;
  loading: boolean;
}

export function usePermission(action: string): PermissionResult {
  const { role, loading: authLoading } = useAuth();
  const { mode, loading: modeLoading, isLockdown, isSafe, isForensic } = usePlatformMode();

  const result = useMemo((): Omit<PermissionResult, 'loading'> => {
    if (!role) {
      return { allowed: false, reason: 'Korisnik nije autentificiran.', role: null };
    }

    // LOCKDOWN: samo Core moze pristupiti, i to ograniceno
    if (isLockdown) {
      if (role !== 'Core') {
        return { allowed: false, reason: 'Sustav u Lockdown modu.', role };
      }
      const lockdownAllowed = new Set([
        'core_dashboard', 'activity_read', 'audit_read', 'obligation_overview',
        'gdpr_manage', 'pentagon_tok', 'pentagon_rizik', 'platform_mode_change',
        'notifications_read',
      ]);
      if (!lockdownAllowed.has(action)) {
        return { allowed: false, reason: 'Akcija nedostupna u Lockdown modu.', role };
      }
    }

    // SAFE: write akcije blokirane (osim platform_mode_change za Core)
    if (isSafe && WRITE_ACTIONS.has(action) && !SAFE_MODE_ALLOWED.has(action)) {
      return { allowed: false, reason: 'Write operacije blokirane u Safe Mode.', role };
    }

    // FORENSIC: write blokiran, ali read + export dozvoljen
    if (isForensic && WRITE_ACTIONS.has(action)) {
      if (action === 'platform_mode_change' && role === 'Core') {
        return { allowed: true, reason: '', role };
      }
      return { allowed: false, reason: 'Write operacije blokirane u Forensic modu.', role };
    }

    // Role check prema matrici
    const allowedRoles = PERMISSION_MATRIX[action];
    if (!allowedRoles) {
      return { allowed: false, reason: 'Nepoznata akcija: ' + action, role };
    }

    if (!allowedRoles.includes(role)) {
      return { allowed: false, reason: 'Rola ' + role + ' nema pristup za: ' + action, role };
    }

    return { allowed: true, reason: '', role };
  }, [role, mode, action, isLockdown, isSafe, isForensic]);

  return {
    ...result,
    loading: authLoading || modeLoading,
  };
}

// Export matrice za testiranje
export { PERMISSION_MATRIX, WRITE_ACTIONS };

