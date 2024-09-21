import React, {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import ImportTradesDropdown from "~/components/log/ImportTradesDropdown";
import DatePicker from "~/components/FlowBite/DatePicker";

type Props = {
  title?: string;
  children?: ReactNode;
  startDate: Date;
  endDate: Date;
  setStartDate: Dispatch<SetStateAction<Date>>;
  setEndDate: Dispatch<SetStateAction<Date>>;
  disableControls?: boolean;
};
const TableHeader: React.FC<Props> = ({
  title = "Trade Log",
  children,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  disableControls = false,
}: Props) => {
  return (
    <>
      <div className="rounded-md bg-white px-6 py-8 pb-0 shadow">
        <div className="flex justify-between pb-4">
          <h1 className="gap-2 text-2xl font-semibold">{title}</h1>
          {!disableControls && (
            <div className="flex gap-2 py-4">
              <DatePicker
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
              />
              <ImportTradesDropdown />
            </div>
          )}
        </div>
        {children}
      </div>
    </>
  );
};

export { TableHeader };
