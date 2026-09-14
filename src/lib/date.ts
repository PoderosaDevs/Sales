import { addMonths, format, parseISO } from "date-fns";
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

/** Converte uma string "MM/yy" no primeiro dia daquele mes (meio-dia, evita virada por fuso). */
function parseDataMensal(dataMensal: string): Date {
  const [mes, ano] = dataMensal.split("/").map(Number);
  return new Date(2000 + ano, mes - 1, 1, 12);
}

function toDataMensal(date: Date): string {
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;
}

/** Soma (ou subtrai, com delta negativo) meses a uma "data mensal" no formato "MM/yy". */
export function addMonthsToDataMensal(dataMensal: string, delta: number): string {
  return toDataMensal(addMonths(parseDataMensal(dataMensal), delta));
}

/** True quando a "data mensal" informada e o mes atual ou um mes futuro. */
export function isCurrentOrFutureDataMensal(dataMensal: string): boolean {
  return parseDataMensal(dataMensal) >= parseDataMensal(currentDataMensal());
}

/** Formata "MM/yy" como rotulo legivel, ex: "Setembro de 2026". */
export function formatDataMensalLabel(dataMensal: string): string {
  const label = format(parseDataMensal(dataMensal), "MMMM 'de' yyyy", { locale: ptBR });
  return label.charAt(0).toUpperCase() + label.slice(1);
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
