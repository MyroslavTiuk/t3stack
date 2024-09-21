import { PlusIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import StrategyForm from "./strategyForm";

const CreateStrategy: React.FC = () => {
  const [showStrategyForm, setShowStrategyForm] = useState(false);
  return (
    <>
      {showStrategyForm ? (
        <StrategyForm onCancel={() => setShowStrategyForm((prev) => !prev)} />
      ) : (
        <button
          className="flex w-40 items-center justify-center gap-2 rounded-lg bg-orange  py-2 font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-orange/70 "
          onClick={() => setShowStrategyForm((prev) => !prev)}
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Strategy</span>
        </button>
      )}
    </>
  );
};

export default CreateStrategy;
