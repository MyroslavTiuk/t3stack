import React, { useState } from "react";
import Image from "next/image";
import tdAmeritradeLogo from "~/images/td-logo.png";
import TdIntegrationDialog from "./tdAmeritrade/dialog";
import { ArrowDownOnSquareIcon } from "@heroicons/react/24/solid";
import CsvDialog from "./csv/dialog";

const ImportTrades: React.FC = () => {
  const [isTdDialogOpen, setIsTdDialogOpen] = useState(false);
  const [isCsvDialogOpen, setIsCsvDialogOpen] = useState(false);

  return (
    <div className="mb-4 flex gap-3">
      <button
        className="flex items-center gap-2 rounded-lg bg-[#40a829] px-1 py-2 text-sm font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-[#40a829]/70 md:px-2 lg:text-base"
        onClick={() => setIsTdDialogOpen(true)}
      >
        <Image
          src={tdAmeritradeLogo}
          width={20}
          height={20}
          alt="TD Ameritrade Logo"
        />
        Ameritrade Import
      </button>
      <TdIntegrationDialog
        isOpen={isTdDialogOpen}
        onClose={() => setIsTdDialogOpen(false)}
      />

      <>
        <button
          className="flex items-center gap-2 rounded-lg bg-blue px-1  text-sm font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-blue/70 hover:bg-opacity-10 md:px-2 lg:text-base"
          onClick={() => setIsCsvDialogOpen(true)}
        >
          <ArrowDownOnSquareIcon className="h-5 w-5" />
          CSV Import
        </button>
        <CsvDialog
          isOpen={isCsvDialogOpen}
          onClose={() => setIsCsvDialogOpen(false)}
        />
      </>
    </div>
  );
};

export default ImportTrades;
