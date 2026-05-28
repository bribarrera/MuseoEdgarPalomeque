// utils/format_date.ts — formatea fechas para respuestas y auditoría
export function formatDate(date: Date | null): string {
  if (!date) return null;
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

export function formatDateTime(date: Date | null): string {
  if (!date) return null;
  return date.toISOString().replace('T', ' ').substring(0, 19); // YYYY-MM-DD HH:mm:ss
}
