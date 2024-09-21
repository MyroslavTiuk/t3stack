import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import OptionTransactionForm from "./manual/optionTransactionForm";
import EquityTransactionForm from "./manual/equityTransactionForm";
import ImportTrades from "~/components/log/import/importTrades";
import produce from "immer";
import type {
  EquityTransactionInput,
  OptionTransactionInput,
} from "~/server/strategies/transaction";

const AddTransactions: React.FC = () => {
  const [optionForms, setOptionForms] = useState<
    { id: number; initialState: Partial<OptionTransactionInput> }[]
  >([]);
  const [equityForms, setEquityForms] = useState<
    { id: number; initialState: Partial<EquityTransactionInput> }[]
  >([]);

  function removeOptionForm(id: number) {
    setOptionForms((prev) =>
      produce(prev, (draft) => {
        const index = draft.findIndex((form) => form.id === id);
        if (index !== -1) draft.splice(index, 1);
      })
    );
  }
  function removeEquityForm(id: number) {
    setEquityForms((prev) =>
      produce(prev, (draft) => {
        const index = draft.findIndex((form) => form.id === id);
        if (index !== -1) draft.splice(index, 1);
      })
    );
  }

  function addOptionLeg(initialState: Partial<OptionTransactionInput>) {
    return () => {
      setOptionForms((prev) => [...prev, { id: Math.random(), initialState }]);
    };
  }

  function addEquityLeg(initialState: Partial<EquityTransactionInput>) {
    return () => {
      setEquityForms((prev) => [...prev, { id: Math.random(), initialState }]);
    };
  }

  return (
    <div>
      <h2 className="mt-10 font-semibold text-neutral-700">Add Option Trade</h2>
      {optionForms.map((form) => (
        <OptionTransactionForm
          initialState={form.initialState}
          remove={() => removeOptionForm(form.id)}
          addOptionLeg={addOptionLeg}
          addEquityLeg={addEquityLeg}
          key={form.id}
        />
      ))}
      <button
        className="rounded-lg bg-orange px-3 py-2 font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-orange/70 "
        onClick={() =>
          setOptionForms((prev) => [
            ...prev,
            { id: Math.random(), initialState: {} },
          ])
        }
      >
        <PlusIcon className="h-5 w-5" />
      </button>

      <h2 className="mt-4 font-semibold text-neutral-700">Add Stock Trade</h2>
      {equityForms.map((form) => (
        <EquityTransactionForm
          initialState={form.initialState}
          remove={() => removeEquityForm(form.id)}
          addOptionLeg={addOptionLeg}
          addEquityLeg={addEquityLeg}
          key={form.id}
        />
      ))}
      <button
        className=" rounded-lg bg-orange px-3 py-2 font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-orange/70 "
        onClick={() =>
          setEquityForms((prev) => [
            ...prev,
            { id: Math.random(), initialState: {} },
          ])
        }
      >
        <PlusIcon className="h-5 w-5" />
      </button>
      <h2 className="mb-2 mt-4 font-semibold text-neutral-700">
        Import Trades
      </h2>
      <ImportTrades />
    </div>
  );
};

export default AddTransactions;
