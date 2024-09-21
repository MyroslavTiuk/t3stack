import React from "react";
import Card from "../Card";
import CButton from "../atoms/Button";
import { FilterSection } from "../atoms/FilterSection";

const MakeScan = () => {
  return (
    <Card>
      <h1 className="font-raleway text-[28px] uppercase">Make a scan</h1>
      <ul>
        <li className="py-2">
          <h3 className="text-[20px] font-bold">1. Options Strategy</h3>
          <div className="mb-4 mt-[6px]">
            <button className="rounded-s-lg border border-[#EF3C24] bg-white px-5 py-2 text-[18px] font-normal text-[#EF3C24] hover:bg-gray-100 focus:z-10  ">
              Call
            </button>
            <button className="border-b border-r border-t border-[#EF3C24] bg-white px-5 py-2 text-[18px] font-normal text-[#EF3C24] hover:bg-gray-100 hover:text-[#EF3C24] focus:z-10 focus:text-[#EF3C24] ">
              Put
            </button>
            <button className="border-b border-t border-[#EF3C24] bg-white px-5 py-2 text-[18px] font-normal text-[#EF3C24] hover:bg-gray-100 hover:text-[#EF3C24] focus:z-10 focus:text-[#EF3C24] ">
              Spread
            </button>
            <button className="rounded-e-lg border border-[#EF3C24] bg-white px-5 py-2 text-[18px] font-normal text-[#EF3C24] hover:bg-gray-100 hover:text-[#EF3C24] focus:z-10 focus:text-[#EF3C24] ">
              More...
            </button>
          </div>
        </li>
        <li>
          <h3 className="text-lg font-bold">2. Create filters Filters:</h3>
          <ul className="pl-4">
            <FilterSection
              title="Stock Data"
              filters={[
                { label: "Stock Price", id: "stockPrice" },
                { label: "Market Cap", id: "marketCap" },
                { label: "RE Ratio", id: "reRatio" },
              ]}
            />
            <FilterSection
              title="Options Data"
              filters={[
                { label: "Days to expiration", id: "daysToExpiration" },
                { label: "IV", id: "iv" },
              ]}
            />
          </ul>
        </li>
      </ul>
      <CButton color="blue">
        <p className="text-lg uppercase">Run Scanner</p>
      </CButton>
    </Card>
  );
};

export default MakeScan;
