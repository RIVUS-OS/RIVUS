// RIVUS v1.0 — Formatteri (HR locale)

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return '0,00 €';
  return new Intl.NumberFormat('hr-HR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(amount);
}

export function formatNumber(amount: number | null | undefined): string {
  if (amount == null) return '0,00';
  return new Intl.NumberFormat('hr-HR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return '-';
  return new Intl.DateTimeFormat('hr-HR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));
}

export function formatDateLong(date: string | null | undefined): string {
  if (!date) return '-';
  return new Intl.DateTimeFormat('hr-HR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date));
}

export function formatDateTime(date: string | null | undefined): string {
  if (!date) return '-';
  return new Intl.DateTimeFormat('hr-HR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date));
}

export function formatRelative(date: string | null | undefined): string {
  if (!date) return '-';
  const diffMs = Date.now() - new Date(date).getTime();
  const min = Math.floor(diffMs / 60000);
  const hrs = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  if (min < 1) return 'upravo sada';
  if (min < 60) return `prije ${min} min`;
  if (hrs < 24) return `prije ${hrs}h`;
  if (days < 7) return `prije ${days} dana`;
  return formatDate(date);
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes, i = 0;
  while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
  return `${size.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

export function isOverdue(date: string | null | undefined): boolean {
  if (!date) return false;
  return new Date(date) < new Date();
}

export function daysUntil(date: string | null | undefined): number | null {
  if (!date) return null;
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
}
