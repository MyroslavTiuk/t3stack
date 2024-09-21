import React from "react";
import Link from "next/link";
import Card from "../Card";

const preMadeScans = [
  { name: "Highest ROI Wheel Strategies", link: "wheel-strategy" },
  { name: "High IV options", link: "high-iv" },
  { name: "20%+/year covered call premiums", link: "covered-calls" },
  { name: "Deep value stocks", link: "deep-value-stocks" },
  { name: "Crypto stocks", link: "crypto-stocks" },
  { name: "Earning plays", link: "earnings" },
  { name: "Cheap OTM Calls", link: "otm" },
  { name: "Irons Condors with 15 or less DTE", link: "iron-condor" },
];

const PreMadeScan = () => {
  return (
    <Card>
      <h1 className="flex items-center py-2 font-raleway text-[28px]">
        Choose pre-made scans
      </h1>
      <ul className="ml-7 flex list-disc flex-col gap-2 text-lg leading-8 text-indigo-400 underline underline-offset-8">
        {preMadeScans.map((item) => {
          const { name, link } = item;
          return (
            <li className="max-w-[220px] leading-6" key={name}>
              <Link href={`/builder/pre-made/${link}`}>{name}</Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};

export default PreMadeScan;
