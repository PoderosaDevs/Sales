import { useEffect, useMemo, useRef, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { FaCalendarDays, FaChevronLeft, FaChevronRight, FaXmark } from "react-icons/fa6";
import { cn } from "../../lib/utils";

interface DateRangeFilterProps {
  dataInicio: string;
  dataFim: string;
  onChangeInicio: (value: string) => void;
  onChangeFim: (value: string) => void;
  onClear: () => void;
  label?: string;
}

const WEEKDAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTH_LABELS = Array.from({ length: 12 }, (_, m) => capitalize(format(new Date(2024, m, 1), "MMM", { locale: ptBR })));

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Converte um Date local em string yyyy-MM-dd sem sofrer shift de fuso horário. */
function toInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Converte uma string yyyy-MM-dd em Date local (evita o shift de parseISO). */
function fromInputValue(value?: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function getMonthMatrix(monthDate: Date): Date[][] {
  const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

function isFullMonthRange(start?: Date, end?: Date): boolean {
  if (!start || !end) return false;
  return isSameDay(start, startOfMonth(start)) && isSameDay(end, endOfMonth(start)) && isSameMonth(start, end);
}

/**
 * Seletor de período estilo Airbnb: por padrão mostra uma grade de meses
 * (seleção rápida de um mês inteiro); alternando para "Data personalizada"
 * abre um calendário de intervalo (clique na data inicial, depois na final).
 * Usado no painel de gestão e nas páginas de desempenho por loja/vendedora/marca.
 * Responsivo: dropdown ao lado do gatilho no desktop, painel em tela cheia no mobile.
 */
export function DateRangeFilter({ dataInicio, dataFim, onChangeInicio, onChangeFim, onClear, label = "Período" }: DateRangeFilterProps) {
  const committedStart = fromInputValue(dataInicio);
  const committedEnd = fromInputValue(dataFim);

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"mes" | "personalizado">(isFullMonthRange(committedStart, committedEnd) || !committedStart ? "mes" : "personalizado");
  const [yearCursor, setYearCursor] = useState(committedStart?.getFullYear() ?? new Date().getFullYear());
  const [monthCursor, setMonthCursor] = useState(startOfMonth(committedStart ?? new Date()));
  const [draftStart, setDraftStart] = useState<Date | undefined>(committedStart);
  const [draftEnd, setDraftEnd] = useState<Date | undefined>(committedEnd);
  const [hoverDay, setHoverDay] = useState<Date | undefined>();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setTab(isFullMonthRange(committedStart, committedEnd) || !committedStart ? "mes" : "personalizado");
    setYearCursor(committedStart?.getFullYear() ?? new Date().getFullYear());
    setMonthCursor(startOfMonth(committedStart ?? new Date()));
    setDraftStart(committedStart);
    setDraftEnd(committedEnd);
    setHoverDay(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const triggerLabel = useMemo(() => {
    if (!committedStart || !committedEnd) return "Mês atual";
    if (isFullMonthRange(committedStart, committedEnd)) return capitalize(format(committedStart, "MMMM yyyy", { locale: ptBR }));
    const sameYear = committedStart.getFullYear() === committedEnd.getFullYear();
    const startFmt = format(committedStart, sameYear ? "d MMM" : "d MMM yyyy", { locale: ptBR });
    const endFmt = format(committedEnd, "d MMM yyyy", { locale: ptBR });
    return `${startFmt} – ${endFmt}`;
  }, [committedStart, committedEnd]);

  function selectMonth(monthIndex: number) {
    const start = new Date(yearCursor, monthIndex, 1);
    const end = endOfMonth(start);
    onChangeInicio(toInputValue(start));
    onChangeFim(toInputValue(end));
    setOpen(false);
  }

  function selectDay(day: Date) {
    if (!draftStart || (draftStart && draftEnd)) {
      setDraftStart(day);
      setDraftEnd(undefined);
      return;
    }
    if (draftStart && !draftEnd) {
      if (isAfter(draftStart, day)) {
        setDraftStart(day);
      } else {
        setDraftEnd(day);
      }
    }
  }

  function applyCustomRange() {
    if (!draftStart) return;
    const end = draftEnd ?? draftStart;
    onChangeInicio(toInputValue(draftStart));
    onChangeFim(toInputValue(end));
    setOpen(false);
  }

  function clearAll() {
    setDraftStart(undefined);
    setDraftEnd(undefined);
    onClear();
    setOpen(false);
  }

  const rangeEndPreview = draftStart && !draftEnd && hoverDay && isAfter(hoverDay, draftStart) ? hoverDay : draftEnd;

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-3 bg-[#0d0d10] border border-white/10 hover:border-emerald-500/40 rounded-2xl pl-4 pr-4 py-3 transition-all"
        >
          <FaCalendarDays className="text-emerald-500 flex-shrink-0" size={14} />
          <span className="flex flex-col items-start leading-tight">
            <span className="text-[9px] font-bold uppercase tracking-[2px] text-gray-500">{label}</span>
            <span className="text-xs font-bold text-white">{triggerLabel}</span>
          </span>
        </button>
        {(dataInicio || dataFim) && (
          <button
            onClick={onClear}
            className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:text-white transition-all flex-shrink-0"
            title="Limpar período (volta pro mês atual)"
          >
            <FaXmark size={14} />
          </button>
        )}
      </div>

      {open && (
        <>
          {/* Mobile: painel em tela cheia */}
          <div className="sm:hidden fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm flex items-end" onClick={() => setOpen(false)}>
            <div
              className="w-full max-h-[88vh] overflow-y-auto bg-[#0d0d10] rounded-t-[32px] p-6 pb-8 animate-in slide-in-from-bottom duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-black text-sm uppercase tracking-widest">Selecionar período</h3>
                <button onClick={() => setOpen(false)} className="p-2 bg-white/5 rounded-xl text-gray-400">
                  <FaXmark size={16} />
                </button>
              </div>
              <PickerTabs tab={tab} setTab={setTab} />
              {tab === "mes" ? (
                <MonthGrid
                  yearCursor={yearCursor}
                  setYearCursor={setYearCursor}
                  selectedStart={committedStart}
                  selectedEnd={committedEnd}
                  onSelectMonth={selectMonth}
                />
              ) : (
                <div className="space-y-4">
                  <CalendarNav monthCursor={monthCursor} setMonthCursor={setMonthCursor} />
                  <MonthCalendar
                    monthDate={monthCursor}
                    selStart={draftStart}
                    selEnd={rangeEndPreview}
                    onHoverDay={setHoverDay}
                    onSelectDay={selectDay}
                  />
                  <CustomRangeFooter draftStart={draftStart} draftEnd={draftEnd} onClear={clearAll} onApply={applyCustomRange} />
                </div>
              )}
            </div>
          </div>

          {/* Desktop: dropdown ancorado no gatilho */}
          <div className="hidden sm:block absolute z-[300] mt-3 left-0 bg-[#0d0d10] border border-white/10 rounded-[32px] shadow-2xl p-6 w-[600px] max-w-[90vw]">
            <PickerTabs tab={tab} setTab={setTab} />
            {tab === "mes" ? (
              <MonthGrid
                yearCursor={yearCursor}
                setYearCursor={setYearCursor}
                selectedStart={committedStart}
                selectedEnd={committedEnd}
                onSelectMonth={selectMonth}
              />
            ) : (
              <div className="space-y-4">
                <CalendarNav monthCursor={monthCursor} setMonthCursor={setMonthCursor} />
                <div className="grid grid-cols-2 gap-8" onMouseLeave={() => setHoverDay(undefined)}>
                  <MonthCalendar
                    monthDate={monthCursor}
                    selStart={draftStart}
                    selEnd={rangeEndPreview}
                    onHoverDay={setHoverDay}
                    onSelectDay={selectDay}
                  />
                  <MonthCalendar
                    monthDate={addMonths(monthCursor, 1)}
                    selStart={draftStart}
                    selEnd={rangeEndPreview}
                    onHoverDay={setHoverDay}
                    onSelectDay={selectDay}
                  />
                </div>
                <CustomRangeFooter draftStart={draftStart} draftEnd={draftEnd} onClear={clearAll} onApply={applyCustomRange} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function PickerTabs({ tab, setTab }: { tab: "mes" | "personalizado"; setTab: (t: "mes" | "personalizado") => void }) {
  return (
    <div className="flex items-center gap-2 mb-6 bg-white/5 p-1.5 rounded-2xl w-fit">
      {(["mes", "personalizado"] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setTab(t)}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
            tab === t ? "bg-emerald-500 text-black" : "text-gray-400 hover:text-white"
          )}
        >
          {t === "mes" ? "Mês" : "Data personalizada"}
        </button>
      ))}
    </div>
  );
}

function MonthGrid({
  yearCursor,
  setYearCursor,
  selectedStart,
  selectedEnd,
  onSelectMonth,
}: {
  yearCursor: number;
  setYearCursor: (fn: (y: number) => number) => void;
  selectedStart?: Date;
  selectedEnd?: Date;
  onSelectMonth: (monthIndex: number) => void;
}) {
  const isMonthSelected = (monthIndex: number) =>
    isFullMonthRange(selectedStart, selectedEnd) && selectedStart!.getFullYear() === yearCursor && selectedStart!.getMonth() === monthIndex;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <button type="button" onClick={() => setYearCursor((y) => y - 1)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <FaChevronLeft size={14} />
        </button>
        <span className="text-white font-black text-sm">{yearCursor}</span>
        <button type="button" onClick={() => setYearCursor((y) => y + 1)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <FaChevronRight size={14} />
        </button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {MONTH_LABELS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => onSelectMonth(i)}
            className={cn(
              "py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border",
              isMonthSelected(i)
                ? "bg-emerald-500 text-black border-emerald-500"
                : "bg-white/[0.02] text-gray-300 border-white/5 hover:border-emerald-500/40 hover:text-white"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CalendarNav({ monthCursor, setMonthCursor }: { monthCursor: Date; setMonthCursor: (fn: (d: Date) => Date) => void }) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={() => setMonthCursor((d) => subMonths(d, 1))}
        className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
      >
        <FaChevronLeft size={14} />
      </button>
      <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest text-center px-2">Escolha a data inicial e depois a final</span>
      <button
        type="button"
        onClick={() => setMonthCursor((d) => addMonths(d, 1))}
        className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
      >
        <FaChevronRight size={14} />
      </button>
    </div>
  );
}

function MonthCalendar({
  monthDate,
  selStart,
  selEnd,
  onHoverDay,
  onSelectDay,
}: {
  monthDate: Date;
  selStart?: Date;
  selEnd?: Date;
  onHoverDay: (d?: Date) => void;
  onSelectDay: (d: Date) => void;
}) {
  const weeks = useMemo(() => getMonthMatrix(monthDate), [monthDate]);

  return (
    <div>
      <p className="text-center text-white font-bold text-xs uppercase tracking-widest mb-4">{capitalize(format(monthDate, "MMMM yyyy", { locale: ptBR }))}</p>
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAY_LABELS.map((d, i) => (
          <span key={i} className="text-center text-[9px] font-bold text-gray-600 uppercase">
            {d}
          </span>
        ))}
      </div>
      <div className="space-y-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((day) => {
              const outside = !isSameMonth(day, monthDate);
              const isStart = selStart && isSameDay(day, selStart);
              const isEnd = selEnd && isSameDay(day, selEnd);
              const inRange = selStart && selEnd && isWithinInterval(day, { start: selStart, end: selEnd });
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onMouseEnter={() => onHoverDay(day)}
                  onClick={() => onSelectDay(day)}
                  className={cn(
                    "h-9 w-9 mx-auto flex items-center justify-center text-xs transition-all",
                    outside ? "text-gray-700" : "text-gray-200",
                    inRange && !isStart && !isEnd && "bg-emerald-500/15 text-white rounded-lg",
                    !isStart && !isEnd && !inRange && "rounded-full hover:bg-white/10",
                    (isStart || isEnd) && "rounded-full bg-emerald-500 text-black font-bold"
                  )}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomRangeFooter({
  draftStart,
  draftEnd,
  onClear,
  onApply,
}: {
  draftStart?: Date;
  draftEnd?: Date;
  onClear: () => void;
  onApply: () => void;
}) {
  return (
    <div className="flex items-center justify-between pt-2 border-t border-white/5">
      <button type="button" onClick={onClear} className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest underline underline-offset-4">
        Limpar
      </button>
      <button
        type="button"
        onClick={onApply}
        disabled={!draftStart}
        className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/5 disabled:text-gray-600 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-widest transition-all"
      >
        {draftStart && draftEnd ? "Aplicar" : "Selecione a data final"}
      </button>
    </div>
  );
}
