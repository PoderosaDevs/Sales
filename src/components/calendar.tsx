import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br"; // define o locale
import "react-big-calendar/lib/css/react-big-calendar.css";
import { GetVendaByUsuarioIDTypes } from "../graphql/Venda/Types";
import { FaTimes } from "react-icons/fa";

// Aplica a localização globalmente
moment.locale("pt-br");

const localizer = momentLocalizer(moment);

const defaultMessages = {
  date: "Data",
  time: "Hora",
  event: "Evento",
  allDay: "Dia Todo",
  week: "Semana",
  work_week: "Eventos",
  day: "Dia",
  month: "Mês",
  previous: "Anterior",
  next: "Próximo",
  yesterday: "Ontem",
  tomorrow: "Amanhã",
  today: "Hoje",
  agenda: "Agenda",
  noEventsInRange: "Não há eventos no período.",
  showMore: (total: number) => `+${total} mais`,
};

interface MyCalendarProps {
  data: GetVendaByUsuarioIDTypes;
  controls?: boolean;
}

const MyCalendar: React.FC<MyCalendarProps> = ({ data, controls = false }) => {
  const [selectedVenda, setSelectedVenda] = useState<any | null>(null);

  if (!data?.GetVendaByUsuarioID || data.GetVendaByUsuarioID.length === 0) {
    return <div>Nenhuma venda disponível para exibir no calendário.</div>;
  }

  const events = data.GetVendaByUsuarioID.map((venda) => ({
    title: "Venda",
    start: new Date(venda.data_venda),
    end: new Date(venda.data_venda),
    resource: venda,
  }));

  return (
    <div>
      <Calendar
        messages={defaultMessages}
        formats={{
          agendaDateFormat: "DD/MM ddd",
          weekdayFormat: "dddd", // Isso vai usar "segunda", "terça", etc.
          dayFormat: "dddd", // garante dias da semana no mês também
          dateFormat: "D", // formatação básica de datas
          monthHeaderFormat: "MMMM yyyy", // mês em extenso em português
        }}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={(event) => setSelectedVenda(event.resource)}
        style={{ height: 500 }}
        views={controls ? undefined : [Views.MONTH]}
        defaultView="month"
        toolbar={controls}
        date={controls ? undefined : new Date()}
        selectable={false}
      />

      {selectedVenda && (
        <div className="mt-4 p-4 border rounded bg-white shadow relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
            onClick={() => setSelectedVenda(null)}
            aria-label="Fechar detalhes"
          >
            <FaTimes />
          </button>
          <h2 className="text-lg font-semibold mb-2">Detalhes da Venda</h2>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Data:</strong>{" "}
            {moment(selectedVenda.data_venda).format("DD/MM/YYYY")}
          </p>
          <p className="text-sm text-gray-600 mb-3">
            <strong>Funcionário:</strong> {selectedVenda.funcionario.nome}
          </p>
          <ul className="list-disc pl-5 space-y-1">
            {selectedVenda.venda_detalhe.map((detail: any, idx: number) => (
              <li key={idx}>
                <strong>{detail.produto.nome}</strong> (x{detail.quantidade}) —{" "}
                {detail.pontos} pontos
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
