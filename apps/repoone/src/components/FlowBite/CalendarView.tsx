import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import Button from "~/components/log/button";
import { api } from "~/utils/api";
import CalendarModal from "~/components/FlowBite/CalendarModal";

const CalendarView = () => {
  const [view] = useState("month"); // State to track the current view ('month' or 'week')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Set the default year to the current year
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate(); // Get the last day of the month

  const [transactions, setTransactions] = useState<
    { date: string; value: number; trades: number }[]
  >([]);

  const { data } = api.transactions.getAllUserTransactions.useQuery(undefined, {
    enabled: true,
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    const stocksGroup = data.equityTransaction.reduce(
      (groups: any, stock: any) => {
        const date = stock.transactionDate.toDateString().split("T")[0];
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(stock);
        return groups;
      },
      {}
    );

    const groupArraysStocks = Object.keys(stocksGroup).map((date) => {
      return {
        date,
        stocks: stocksGroup[date],
      };
    });

    const optionsGroups = data.optionTransaction.reduce(
      (groups: any, stock: any) => {
        const date = stock.transactionDate.toDateString().split("T")[0];
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(stock);
        return groups;
      },
      {}
    );

    const groupArraysOptions = Object.keys(stocksGroup).map((date) => {
      return {
        date,
        options: optionsGroups[date],
      };
    });
    const transactions = groupArraysStocks.map((stock) => {
      return {
        date: stock.date,
        value: stock.stocks
          .map((stock: any) => stock.netPrice)
          .reduce((acc: number, price: number) => acc + price),
        trades: stock.stocks.length,
      };
    });
    const optionsData =
      groupArraysOptions?.map((option) => {
        return {
          date: option.date,
          value:
            option.options
              ?.map((option: any) => option.netPrice)
              .reduce(
                (acc: number, price: number) => (acc ?? 0) + (price ?? 0)
              ) ?? 0,
          trades: option.options?.length ?? 0,
        };
      }) ?? [];
    transactions.push(...optionsData);

    const result = transactions.reduce((acc, current) => {
      // @ts-ignore
      const existingItem = acc.find((item) => item.date === current.date);
      if (existingItem) {
        // If the date already exists, update trades and price
        // @ts-ignore
        existingItem.trades += current.trades;
        // @ts-ignore
        existingItem.value += current.value;
      } else {
        // If the date doesn't exist, add a new entry
        // @ts-ignore
        acc.push({
          date: current.date,
          trades: current.trades,
          value: current.value,
        });
      }
      return acc;
    }, []);
    setTransactions(result);
  }, [data]);

  // const toggleView = () => {
  //   setView((prevView) => (prevView === "month" ? "week" : "month"));
  // };

  const renderCalendarDays = () => {
    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    let days;

    if (view === "month") {
      days = daysInMonth;
    } else {
      startDate.setDate(1); // Start from the first day of the selected month
      days = 7;
    }

    const calendarDays = [];

    function formatValue(value: number): string {
      if (value == 0) {
        return `$0`;
      }
      if (value > -1) {
        return `+$${value}`;
      }
      return `-$${Math.abs(value)}`;
    }

    function getCorner(day: number): string {
      if (day == 0) {
        return "rounded-bl-lg";
      } else if (day == 6) {
        return "rounded-br-lg";
      }
      return "";
    }

    function getBorderRadius(
      firstDay: number,
      day: number,
      days: number,
      isMonthView: boolean
    ): string {
      if (isMonthView) {
        if (firstDay == 28) {
          return getCorner(day);
        } else if (firstDay == 21 && days == 28) {
          return getCorner(day);
        } else {
          return "";
        }
      } else {
        return getCorner(day);
      }
    }

    for (let i = 0; i < days; i += 7) {
      const weekRow = [];

      for (let j = 0; j < 7; j++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i + j);
        const dayOfMonth = currentDate.getDate();

        const date = new Date(selectedYear, selectedMonth - 1, i + j + 1);
        const dayData = transactions.find(
          (data) => new Date(data.date).getTime() == date.getTime()
        ) || {
          value: 0,
          trades: 0,
        };

        let backgroundColor;
        if (dayData.value === 0) {
          backgroundColor = "bg-white";
        } else if (dayData.value < 0) {
          backgroundColor = "bg-red-200";
        } else {
          backgroundColor = "bg-green-200";
        }

        weekRow.push(
          <div
            key={j}
            onClick={() => setSelectedDate(date)}
            className={`w-1/7 flex h-16 w-24 cursor-pointer flex-col items-center justify-center border border-gray-100 text-center md:h-20 md:w-28 ${backgroundColor} ${getBorderRadius(
              i,
              j,
              days,
              view == "month"
            )}`}
          >
            <span className="block">{dayOfMonth}</span>
            {dayData.value != 0 && (
              <>
                <span className="block text-lg">
                  {formatValue(dayData.value)}
                </span>
                <span className="block text-xs underline">
                  {dayData.trades} trades
                </span>
              </>
            )}
          </div>
        );
      }

      calendarDays.push(
        <div key={i / 7} className="flex">
          {weekRow}
        </div>
      );
    }

    return calendarDays;
  };

  const handleMonthChange = (event: any) => {
    setSelectedMonth(parseInt(event.target.value, 10));
  };

  const theme = {
    root: {
      base: "flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800",
      children: "flex flex-col justify-center gap-4 pt-6",
      horizontal: {
        off: "flex-col",
        on: "flex-col md:max-w-xl md:flex-row",
      },
      href: "hover:bg-gray-100 dark:hover:bg-gray-700",
    },
    img: {
      base: "",
      horizontal: {
        off: "rounded-t-lg",
        on: "w-full rounded-t-lg object-cover md:w-48 md:rounded-none md:rounded-l-lg",
      },
    },
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <Card theme={theme}>
      <CalendarModal
        isOpen={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        date={selectedDate}
      />
      <div>
        <div className="mb-4 flex items-center justify-between px-6">
          <div className="flex items-center">
            <select
              className="mr-2 rounded-lg border border-gray-200 p-2"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              {Array.from({ length: 12 }, (_, index) => index + 1).map(
                (month) => (
                  <option key={month} value={month}>
                    {new Date(selectedYear, month - 1, 1).toLocaleString(
                      "default",
                      { month: "long" }
                    )}
                  </option>
                )
              )}
            </select>

            <select
              className="mr-2 rounded-lg border border-gray-200 p-2"
              value={selectedYear}
              onChange={(event) => {
                setSelectedYear(Number(event.target.value));
              }}
            >
              {Array.from({ length: 25 }, (_, index) => index + 1).map(
                (year) => (
                  <option
                    key={year}
                    value={new Date().getFullYear() + 1 - year}
                  >
                    {new Date().getFullYear() + 1 - year}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => setSelectedMonth(new Date().getMonth() + 1)}
            >
              Today
            </Button>
          </div>
        </div>

        <div className="flex flex-col">{renderCalendarDays()}</div>
      </div>
    </Card>
  );
};

export default CalendarView;
