import React from "react";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";

const localizer = momentLocalizer(moment);

var defaultMessages = {
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
  showMore: function showMore(total) {
    return "+" + total + " mais";
  }
};

const myEventsList = [
  {
    title: "Teste",
    start: new Date(2020, 5, 17, 13, 0, 0, 0),
    end: new Date(2020, 5, 17, 13, 30, 0, 0),
    desc: "Evento Teste"
  }
];

const MyCalendar = props => (
  <div>
    <Calendar
      messages={defaultMessages}
      formats={{
        agendaDateFormat: "DD/MM ddd",
        weekdayFormat: "dddd"
      }}
      localizer={localizer}
      events={myEventsList}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  </div>
);


export default MyCalendar;
