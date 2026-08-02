import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDateTime(value: string | Date): string {
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, "dd/MM/yyyy", { locale: ptBR });
}

export function currentDataMensal(): string {
  const today = new Date();
  return `${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getFullYear()).slice(-2)}`;
}

export function toBrDate(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  return format(parseISO(dateStr), "dd/MM/yyyy");
}

/** Converte um input <input type="date"> (yyyy-MM-dd) para o formato dd/MM/yyyy
 *  que a API espera nos filtros de período (startDate/endDate). */
export function toApiDateParam(dateInputValue?: string): string | undefined {
  if (!dateInputValue) return undefined;
  const [year, month, day] = dateInputValue.split("-");
  if (!year || !month || !day) return undefined;
  return `${day}/${month}/${year}`;
}
