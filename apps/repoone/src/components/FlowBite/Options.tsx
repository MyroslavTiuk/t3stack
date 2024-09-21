import React, { useState } from "react";
import GroupButton from "./GroupButton";
import { SingleDatePicker } from "./SingleDatePicker";

const Options = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [expirationDate, setExpirationDateDate] = useState(null);

  return (
    <div className="m-auto w-[376px] rounded-lg bg-gray-50 py-4">
      <h1 className="font-semibold">1st Leg</h1>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/*// @ts-ignore*/}
      <GroupButton />
      <div className="flex items-center justify-between">
        <SingleDatePicker
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          selectedDate={selectedDate}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setSelectedDate={setSelectedDate}
        />
        <SingleDatePicker
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          selectedDate={expirationDate}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setSelectedDate={setExpirationDateDate}
        />
        {/* <StrikeOption /> */}
      </div>
    </div>
  );
};

export default Options;
