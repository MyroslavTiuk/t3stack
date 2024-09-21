import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { format, addDays } from "date-fns";
import { BiDollarCircle } from "react-icons/bi";

const calendarEvents: CalendarEvent[] = [
  // Background full cell example
  {
    start: format(new Date(), "yyyy-MM-dd"),
    display: "background",
    backgroundColor: "green",
  },
  // Text example
  {
    title: "Earnings",
    start: format(new Date(), "yyyy-MM-dd"),
    backgroundColor: "transparent",
    borderColor: "transparent",
    textColor: "black",
  },

  {
    title: "MSFT | $16.01",
    start: format(new Date(), "yyyy-MM-dd"),
    backgroundColor: "red",
  },
  {
    title: "MSFT | $16.01",
    start: format(new Date(), "yyyy-MM-dd"),
    backgroundColor: "green",
  },
  {
    title: "MSFT | $16.01",
    start: format(new Date(), "yyyy-MM-dd"),
    backgroundColor: "red",
  },
  {
    title: "MSFT | $16.01",
    start: format(new Date(), "yyyy-MM-dd"),
    backgroundColor: "red",
  },
  {
    title: "MSFT | $16.01",
    start: format(new Date(), "yyyy-MM-dd"),
    backgroundColor: "red",
  },

  {
    start: format(addDays(new Date(), -3), "yyyy-MM-dd"),
    display: "background",
    backgroundColor: "red",
  },

  {
    title: "AAPL | $16.01",
    start: format(addDays(new Date(), -3), "yyyy-MM-dd"),
    backgroundColor: "red",
  },
  {
    title: "AAPL | $16.01",
    start: format(addDays(new Date(), -3), "yyyy-MM-dd"),
    backgroundColor: "green",
  },
  {
    title: "AAPL | $16.01",
    start: format(addDays(new Date(), -3), "yyyy-MM-dd"),
    backgroundColor: "red",
  },
  {
    title: "AAPL | $16.01",
    start: format(addDays(new Date(), -3), "yyyy-MM-dd"),
    backgroundColor: "red",
  },
  {
    title: "AAPL | $16.01",
    start: format(addDays(new Date(), -3), "yyyy-MM-dd"),
    backgroundColor: "red",
  },
];

const Calendar = () => {
  return (
    <div className="w-full px-2 md:w-1/2">
      <FullCalendar
        initialView="dayGridMonth"
        themeSystem="default"
        headerToolbar={{
          left: "prev,today,next",
          right: "title",
        }}
        dayCellContent={renderDay}
        dayMaxEvents={true}
        plugins={[dayGridPlugin, timeGridPlugin]}
        events={calendarEvents}
      />
    </div>
  );
};

function renderDay({ view, date, dayNumberText }: RenderDay) {
  const events = view.getCurrentData().calendarOptions.events;
  const isEarnings = events.find(
    (event: CalendarEvent) =>
      event.start === format(new Date(date), "yyyy-MM-dd") &&
      event.title === "Earnings"
  );

  return (
    <div className="flex items-center justify-between">
      {isEarnings && <BiDollarCircle className="h-4 w-4" />}
      <div>{dayNumberText}</div>
    </div>
  );
}

type RenderDay = {
  date: Date;
  dayNumberText: string;
  view: any;
};

type CalendarEvent = {
  title?: string;
  start: string;
  backgroundColor: "red" | "green" | "transparent";
  borderColor?: "transparent";
  textColor?: "black";
  display?: "background";
};

export default Calendar;
