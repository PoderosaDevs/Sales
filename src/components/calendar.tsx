import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { GetVendaByUsuarioIDTypes } from "../graphql/Venda/Types";

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
  controls?: boolean; // nova prop
}

const MyCalendar: React.FC<MyCalendarProps> = ({ data, controls = false }) => {
  const [selectedVenda, setSelectedVenda] = useState<any | null>(null);

  if (!data?.GetVendaByUsuarioID || data.GetVendaByUsuarioID.length === 0) {
    return <div>Nenhuma venda disponível para exibir no calendário.</div>;
  }

  const events = data.GetVendaByUsuarioID.map((venda) => ({
    title: `Venda`,
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
          weekdayFormat: "dddd",
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
        date={controls ? undefined : new Date()} // fixa no mês atual
        selectable={false}
      />

      {selectedVenda && (
        <div className="mt-4 p-4 border rounded bg-white shadow">
          <h2 className="text-lg font-semibold mb-2">Detalhes da Venda</h2>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Data:</strong> {moment(selectedVenda.data_venda).format("DD/MM/YYYY")}
          </p>
          <p className="text-sm text-gray-600 mb-3">
            <strong>Funcionário:</strong> {selectedVenda.funcionario.nome}
          </p>
          <ul className="list-disc pl-5 space-y-1">
            {selectedVenda.venda_detalhe.map((detail: any, idx: number) => (
              <li key={idx}>
                <strong>{detail.produto.nome}</strong> (x{detail.quantidade}) — {detail.pontos} pontos
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
