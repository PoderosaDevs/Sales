import { eachDayOfInterval, parseISO } from "date-fns";

export const formatDateString = (isoDate: string) => {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

export const formatDateDisplay = (date: Date) =>
  `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()}`;

export const diasNoPeriodo = (start: string, end: string) => {
  const startD = new Date(start);
  const endD = new Date(end);
  const diff = Math.abs(endD.getTime() - startD.getTime());
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1, 1);
};

export const diasNoPeriodoSemDomingos = (start: string, end: string) => {
  const allDays = eachDayOfInterval({
    start: parseISO(start),
    end: parseISO(end),
  });

  return allDays.filter((d) => d.getDay() !== 0).length;
};
