import ChevronDoubleLeftIcon from "@heroicons/react/20/solid/ChevronDoubleLeftIcon";
import ChevronDoubleRightIcon from "@heroicons/react/20/solid/ChevronDoubleRightIcon";
import ChevronLeftIcon from "@heroicons/react/20/solid/ChevronLeftIcon";
import ChevronRightIcon from "@heroicons/react/20/solid/ChevronRightIcon";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { SavedBacktests } from "opcalc-database";
import { toast } from "react-toastify";
import Spinner from "~/pwa/components/primitives/Spinner";
import { toastProps } from "~/styles/toast";
import { api } from "~/utils/api";

const BackTesterHistory: NextPage = () => {
  const router = useRouter();
  const page = Number(router.query.id as string);
  const limit = 20;

  const {
    data: backtesterInfo,
    isLoading,
    refetch,
  } = api.backtester.getSavedBacktests.useQuery({
    page: page,
    limit,
  });

  const removeMutation = api.backtester.removeSavedBacktest.useMutation();

  const removeItem = async (
    id: bigint,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.currentTarget.disabled = true;

    const response = window.confirm("Are you sure?");
    if (response) {
      const res = await removeMutation.mutateAsync({
        id,
      });
      if (res) {
        refetch();
      }
      toast.success("Deleted!", toastProps);
      if (backtesterInfo) {
        backtesterInfo.data.length === 0 &&
          backtesterInfo.count != 1 &&
          router.push(`/backtester/history/${page - 1}`);
      }
    } else {
      e.currentTarget.disabled = false;
    }
  };

  const handlePageChange = (newPage: number, maxNumPages: number) => {
    if (newPage >= 1 && newPage <= maxNumPages) {
      router.push(`/backtester/history/${newPage}`);
    }
  };

  const PaginationBtns = ({ maxNumPages }) => {
    const buttons = [];
    const startPage = Math.max(1, page - 1);
    const endPage = Math.min(maxNumPages, page + 1);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => {
            handlePageChange(i, maxNumPages);
          }}
          className={`hover:text-blue-700  border-b border-r border-t  ${
            i === page ? "bg-gray-200" : "bg-white"
          } px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 `}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  const formatCurrency = (number: number): string => {
    let isNegative = number < 0;

    number = Math.abs(number);

    let formattedNumber = number.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    if (isNegative) {
      formattedNumber = "-" + formattedNumber;
    }

    return formattedNumber;
  };

  return (
    <div className="flex w-full bg-gray-100 p-4 font-inter">
      <div className="w-full flex-col items-start">
        <div className="rounded-lg bg-white pb-[600px] pl-[19px] pr-7 pt-[15px]">
          <div className="flex w-full justify-between">
            <h2 className="font-bold lg:text-2xl">Saved Backtests:</h2>
            <Link
              href="/backtester"
              className="flex gap-1 rounded bg-red-500 px-6 py-1 text-lg font-semibold text-white transition-all duration-150 ease-in-out hover:bg-red-500/70 lg:text-xl"
            >
              <span>+</span>
              <span>New Backtest</span>
            </Link>
          </div>

          <div className="pt-5">
            <div className="overflow-x-auto ">
              <table className="w-full border-collapse  rounded-md border border-gray-100">
                <thead>
                  <tr>
                    <th
                      colSpan={1}
                      className="border-b bg-gray-100 px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500 "
                    >
                      <div>ID</div>
                    </th>
                    <th
                      colSpan={1}
                      className="border-b bg-gray-100 px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500 "
                    >
                      <div>SYMBOL</div>
                    </th>
                    <th
                      colSpan={1}
                      className="border-b bg-gray-100 px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500 "
                    >
                      <div className="font-medium">TYPE</div>
                    </th>
                    <th
                      colSpan={1}
                      className="border-b bg-gray-100 px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500 "
                    >
                      <div>STRATEGY</div>
                    </th>
                    <th
                      colSpan={1}
                      className="border-b bg-gray-100 px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500 "
                    >
                      <div>% RETURN</div>
                    </th>
                    <th
                      colSpan={1}
                      className="border-b bg-gray-100 px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500 "
                    >
                      <div>PROFIT</div>
                    </th>
                    <th
                      colSpan={1}
                      className="border-b bg-gray-100 px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500 "
                    >
                      <div>MAX DN</div>
                    </th>
                    <th
                      colSpan={1}
                      className="border-b bg-gray-100 px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500 "
                    >
                      <div>MAX GN</div>
                    </th>
                    <th
                      colSpan={1}
                      className="border-b bg-gray-100 px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500 "
                    >
                      <div># TRADES</div>
                    </th>
                    <th
                      colSpan={1}
                      className="border-b bg-gray-100 px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500 "
                    >
                      <div>DATE RANGE</div>
                    </th>
                    <th
                      colSpan={1}
                      className="border-b bg-gray-100 px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500 "
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td colSpan={11}>
                        <div className="h-20">
                          <Spinner />
                        </div>
                      </td>
                    </tr>
                  )}
                  {backtesterInfo &&
                    backtesterInfo.data.map((item: SavedBacktests) => {
                      const dataFields = item.dataFields as {
                        selectedTabMode: string;
                        selectedStrategy: string;
                        symbols: string[];
                        datesRange: string;
                      };
                      const dataMain = item.dataMain as object;

                      const informationOfSymbols = [];

                      for (const dataMainItemKey in dataMain) {
                        if (dataMainItemKey.includes("SPY")) continue;

                        const infoItem = dataMain[dataMainItemKey];

                        informationOfSymbols.push(
                          <tr
                            key={`${item.id + "_" + dataMainItemKey}`}
                            className=" border-b text-sm font-normal   text-gray-500 transition duration-300 hover:bg-gray-50"
                          >
                            <td className="px-4 py-2 font-medium text-gray-500">
                              <Link
                                href={`/backtester/?id=${item.id}&mode=${
                                  dataFields.selectedTabMode
                                }&symbols=${dataFields.symbols.join("_")}`}
                                className="text-blue underline"
                              >
                                {item.id.toString()}
                              </Link>
                            </td>
                            <td className="px-4 py-2 font-medium text-gray-500">
                              <p className="font-bold uppercase text-gray-800">
                                {dataMainItemKey}
                              </p>
                            </td>
                            <td className="px-4 py-2 font-medium capitalize text-gray-500">
                              <p>{dataFields.selectedTabMode}</p>
                            </td>
                            <td className="px-4 py-2 font-medium text-gray-500">
                              <p>{dataFields.selectedStrategy}</p>
                            </td>
                            <td className="px-4 py-2 font-medium text-gray-500">
                              {(infoItem.last_percent * 100).toFixed(2)}%
                            </td>
                            <td className="px-4 py-2 font-medium text-gray-500">
                              {formatCurrency(
                                infoItem.last_profit.amount.toFixed(2)
                              )}
                            </td>
                            <td className="px-4 py-2 font-medium text-gray-500">
                              {formatCurrency(
                                infoItem.max_drawdown.amount.toFixed(2)
                              )}
                            </td>
                            <td className="px-4 py-2 font-medium text-gray-500">
                              {formatCurrency(
                                infoItem.biggest_gain.amount.toFixed(2)
                              )}
                            </td>
                            <td className="px-4 py-2 font-medium text-gray-500">
                              {infoItem.total_trades}
                            </td>
                            <td className="px-4 py-2 font-medium text-gray-500">
                              {dataFields.datesRange}
                            </td>
                            <td className="px-4 py-2 font-medium text-gray-500">
                              <div>
                                <button
                                  title="Delete"
                                  onClick={(e) => {
                                    removeItem(item.id, e);
                                  }}
                                  className="cursor-pointer"
                                >
                                  <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 22 22"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M9.42857 0C7.7 0 6.28571 1.2375 6.28571 2.75H3.14286C1.41429 2.75 0 3.9875 0 5.5H22C22 3.9875 20.5857 2.75 18.8571 2.75H15.7143C15.7143 1.2375 14.3 0 12.5714 0H9.42857ZM3.14286 8.25V21.4775C3.14286 21.78 3.39429 22 3.74 22H18.2914C18.6371 22 18.8886 21.78 18.8886 21.4775V8.25H15.7457V17.875C15.7457 18.645 15.0543 19.25 14.1743 19.25C13.2943 19.25 12.6029 18.645 12.6029 17.875V8.25H9.46V17.875C9.46 18.645 8.76857 19.25 7.88857 19.25C7.00857 19.25 6.31714 18.645 6.31714 17.875V8.25H3.17429H3.14286Z"
                                      fill="#7C7C7C"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }

                      return informationOfSymbols;
                    })}
                </tbody>
              </table>
            </div>

            {backtesterInfo && backtesterInfo.data.length === 0 && (
              <div className="flex h-20 items-center justify-center">
                <p className="text-xl ">
                  No backtests, try creating a new{" "}
                  <Link href="/backtester" className="text-blue underline">
                    one
                  </Link>
                  .
                </p>
              </div>
            )}
            {backtesterInfo && backtesterInfo.data.length > 0 && (
              <div className="flex w-full flex-col gap-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="font-medium text-gray-500">
                  <div>
                    Showing{" "}
                    <span className="font-extrabold text-gray-900">
                      {page > 1 ? (page - 1) * limit : 1}-
                      {backtesterInfo &&
                        (page > 1
                          ? (page - 1) * limit + backtesterInfo.data.length
                          : backtesterInfo.data.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-extrabold text-gray-900">
                      {backtesterInfo && backtesterInfo.count}
                    </span>
                  </div>
                </div>
                <div className=" inline-flex rounded-md shadow-sm">
                  <button
                    onClick={() => {
                      backtesterInfo &&
                        handlePageChange(
                          page - 1,
                          Math.ceil(backtesterInfo.count / limit)
                        );
                    }}
                    className="hover:text-blue-700 rounded-s-lg border  border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      router.push("/backtester/history/1");
                    }}
                    className="hover:text-blue-700  border-b border-r border-t border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                  >
                    <ChevronDoubleLeftIcon className="h-4 w-4" />
                  </button>
                  <PaginationBtns
                    maxNumPages={
                      backtesterInfo
                        ? Math.ceil(backtesterInfo.count / limit)
                        : 1
                    }
                  />
                  <button
                    onClick={() => {
                      backtesterInfo &&
                        router.push(
                          `/backtester/history/${Math.ceil(
                            backtesterInfo.count / limit
                          )}`
                        );
                    }}
                    className="hover:text-blue-700  border-b border-t border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                  >
                    <ChevronDoubleRightIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      backtesterInfo &&
                        handlePageChange(
                          page + 1,
                          Math.ceil(backtesterInfo.count / limit)
                        );
                    }}
                    className="hover:text-blue-700  rounded-e-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackTesterHistory;
