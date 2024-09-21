import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const PaginationButtons: React.FC<Props> = ({
  pageIdx,
  lastPageIdx,
  setNextPage,
  setPrevPage,
  hasNextPage,
}) => {
  if (pageIdx === 0 && !hasNextPage) {
    return null;
  }

  function getPageButtonsToShow() {
    if (pageIdx === 0) {
      return [0, 1];
    }
    if (!hasNextPage) {
      return [pageIdx - 1, pageIdx];
    }
    return [pageIdx - 1, pageIdx, pageIdx + 1];
  }

  function handleNumberClick(idx: number) {
    if (idx === pageIdx - 1) {
      setPrevPage();
    }
    if (idx === pageIdx + 1) {
      setNextPage();
    }
  }

  return (
    <>
      <div className="flex">
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <button
            onClick={setPrevPage}
            className="inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          {getPageButtonsToShow().map((idx) => (
            <button
              key={idx}
              onClick={() => handleNumberClick(idx)}
              className={
                pageIdx === idx
                  ? "inline-flex items-center border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-semibold text-black"
                  : "inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              }
            >
              {idx + 1}
            </button>
          ))}
          {lastPageIdx - pageIdx > 3 && (
            <>
              <button className="inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                ...
              </button>
              <button
                onClick={setNextPage}
                className="inline-flex items-center px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                {lastPageIdx}
              </button>
            </>
          )}
          {hasNextPage && (
            <button
              onClick={setNextPage}
              className="inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </nav>
      </div>
    </>
  );
};

type Props = {
  pageIdx: number;
  lastPageIdx: number;
  setNextPage: () => void;
  setPrevPage: () => void;
  hasNextPage: boolean;
};

export default PaginationButtons;
