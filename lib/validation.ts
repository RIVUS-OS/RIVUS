import { z } from 'zod'

export const financeCreateSchema = z.object({
  spv_id: z.string().uuid(),
  entry_type: z.enum(['PRIHOD', 'RASHOD']),
  category: z.string().optional().default('OTHER'),
  description: z.string().optional(),
  neto_iznos: z.coerce.number().positive(),
  pdv_stopa: z.coerce.number().refine(v => [0, 5, 13, 25].includes(v), { message: 'PDV stopa mora biti 0, 5, 13 ili 25' }),
  datum: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export const racunCreateSchema = z.object({
  spv_id: z.string().uuid(),
  direction: z.enum(['IZDANI', 'PRIMLJENI']),
  issuer_name: z.string().min(1),
  issuer_oib: z.string().optional(),
  receiver_name: z.string().min(1),
  receiver_oib: z.string().optional(),
  net_amount: z.coerce.number().positive(),
  pdv_rate: z.coerce.number().min(0).max(100).optional().default(0),
  invoice_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  category: z.string().optional().default('Ostalo'),
  notes: z.string().optional(),
  kpd_code: z.string().optional(),
  items: z.array(z.unknown()).optional().default([]),
})

export const racunStornoSchema = z.object({
  original_id: z.string().uuid(),
})

export const spvCreateSchema = z.object({
  project_name: z.string().min(1).trim(),
  oib: z.string().regex(/^\d{11}$/).trim(),
  address: z.string().min(1).trim(),
  city: z.string().min(1).trim(),
  owner_name: z.string().min(1).trim(),
})

export const periodLockSchema = z.object({
  spv_id: z.string().uuid(),
  period: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
  reason: z.string().optional(),
})

export function zodError(err: unknown): string {
  if (err instanceof z.ZodError) {
    return err.issues.map(i => i.message).join('; ')
  }
  return 'Invalid input'
}
