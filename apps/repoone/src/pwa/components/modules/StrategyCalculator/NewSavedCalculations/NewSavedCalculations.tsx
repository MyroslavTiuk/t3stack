import { type Strategy } from "opc-types/lib/Strategy";
import { type Prisma, type SavedCalcs } from "opcalc-database/client";
import { api } from "~/utils/api";
import { NewSavedCalcsContext } from "./NewSavedCalculationsContext";
import { type ReactNode, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import calcActions from "~/pwa/store/actions/calculator";
import Icon from "~/pwa/components/primitives/Icon";
import css from "./NewSavedCalculations.module.css";
import { useRouter } from "next/router";
import { LAYOUT_OPTIONS } from "../../../../../types/enums/LAYOUT_OPTIONS";
import ROUTE_PATHS from "~/consts/ROUTE_PATHS";
import { useMediaQueryCustom } from "~/utils/Hooks/useMediaQueryCustom";

const NewSavedCalculations: React.FC = () => {
  const { data, isLoading, refetch } =
    api.calculations.getCalculations.useQuery();
  /////////////////// downloaded data of strikes

  const removeCalcualtionMutation = api.calculations.remove.useMutation();

  const dispatch = useDispatch();

  const [currentItem, setCurrentItem] = useState<string | null>(null);

  const contextCalcs = useContext(NewSavedCalcsContext);

  if (contextCalcs !== undefined) {
    if (contextCalcs?.isRefetch) {
      refetch();
      contextCalcs.setIsRefetch(false);
    }
  }
  const matches = useMediaQueryCustom("(max-width: 500px)");
  const router = useRouter();

  useEffect(() => {
    const currentCalcArray = data?.filter((item) => item.id === currentItem);
    const currentCalc = currentCalcArray && currentCalcArray[0];
    contextCalcs?.setDisableFocus(true);
    if (currentCalc && "calculations" in currentCalc) {
      const calculation = JSON.parse(
        currentCalc.calculations as string
      ) as Strategy;
      dispatch(calcActions.setCurrentCalc(calculation as Strategy));
      setCurrentItem(currentItem);
    }
    contextCalcs?.setDisableFocus(false);
  }, [currentItem]);

  useEffect(() => {
    if (contextCalcs) {
      if (
        contextCalcs.calculatorUserViewSettings.screenLayout ===
        LAYOUT_OPTIONS.SIDE_BY_SIDE
      ) {
        contextCalcs.setIsSidebarOpened(false);
      } else {
        contextCalcs.setIsSidebarOpened(true);
      }
    }
  }, [contextCalcs?.calculatorUserViewSettings]);

  const header = (
    <div className="flex flex-col-reverse justify-between bg-white px-2 py-2 lg:flex-row lg:px-5 lg:py-5">
      <h3 className="text-md font-extrabold text-red-700 lg:text-lg ">
        Saved Calculations
      </h3>
      <div
        className="flex cursor-pointer flex-col items-start justify-center lg:items-center"
        style={{ rotate: "180deg" }}
        onClick={() => {
          contextCalcs?.setIsSidebarOpened(!contextCalcs.isSidebarOpened);
        }}
      >
        <Icon icon="double-h-caret" small />
      </div>
    </div>
  );

  const emptyResponse = contextCalcs?.isSidebarOpened && !matches && (
    <div className="h-full">
      {header}
      <p className="p-5 italic text-gray-500">
        Calculations you make will appear here
      </p>
    </div>
  );

  if (data !== undefined) {
    if (data.length === 0) {
      return emptyResponse;
    }

    const holdJsonData = (dataJson: Prisma.JsonValue): Strategy => {
      return JSON.parse(dataJson as string) as Strategy;
    };

    const formatExpirationDate = (inputDate: string) => {
      const year = parseInt(inputDate.substring(0, 4));
      const month = parseInt(inputDate.substring(4, 6)) - 1;
      const day = parseInt(inputDate.substring(6, 8));

      const formattedDate = new Date(year, month, day).toLocaleDateString(
        "en-GB",
        {
          day: "numeric",
          month: "short",
          year: "2-digit",
        }
      );

      const [formattedDay, formattedMonth, formattedYear] =
        formattedDate.split(" ");

      const finalFormattedDate = `${formattedDay} ${formattedMonth} '${formattedYear}`;

      return finalFormattedDate;
    };

    const getSymbol = (item: SavedCalcs): ReactNode => {
      const valueObj = holdJsonData(item.calculations).legsById.underlying;
      let resultVal = "";
      if ("val" in valueObj) {
        resultVal = valueObj.val;
      }
      return <p className="font-extrabold">{resultVal}</p>;
    };

    const removeCalculation = async (id: string) => {
      await removeCalcualtionMutation.mutateAsync({ id });
      refetch();
      if (data && data[0] && data[0].calculations) {
        dispatch(
          calcActions.setCurrentCalc(
            JSON.parse(data[0].calculations as string) as Strategy
          )
        );
      }
    };

    const getDatePrice = (item: SavedCalcs): ReactNode => {
      const mainData = holdJsonData(item.calculations);
      const valueObj = mainData.legsById.option;
      let price = 0.0;

      let date = "";

      if ("expiry" in mainData.legsById.option) {
        date = mainData.legsById.option.expiry;
      }

      if ("strike" in valueObj) {
        if (valueObj.strike !== null) {
          price =
            typeof valueObj.strike == "number"
              ? valueObj.strike
              : valueObj.strike[0];
        }
      }

      return (
        <p className="lg:text-md text-sm font-semibold text-blue underline">
          {`${formatExpirationDate(date)} $${price}`}
        </p>
      );
    };

    const isSideBySide = () => {
      return (
        contextCalcs?.calculatorUserViewSettings.screenLayout ===
        LAYOUT_OPTIONS.SIDE_BY_SIDE
      );
    };

    return (
      <div
        className={`relative ${
          !contextCalcs?.isSidebarOpened
            ? "w-0 transition-all duration-300 ease-in-out"
            : isSideBySide()
            ? ""
            : "w-[110px] lg:w-[230px]"
        }`}
      >
        <div
          className={`h-screen bg-white ${
            !contextCalcs?.isSidebarOpened ? css.hideSavedCalcs : ""
          } ${
            isSideBySide()
              ? "fixed z-[40] w-[230px]  shadow-2xl lg:h-[130vh] lg:w-[500px]"
              : ""
          }`}
        >
          {header}
          {isLoading && <p>Loading ...</p>}
          {!isLoading && (
            <ul className="max-h-[90%] overflow-y-auto">
              {data.length > 0 &&
                data.map((item) => (
                  <li
                    key={item.id}
                    className={`${
                      currentItem === item.id && !contextCalcs?.disableFocus
                        ? "bg-white underline"
                        : "bg-gray-100"
                    }`}
                  >
                    <div
                      className="group w-full  cursor-pointer p-2 lg:p-5"
                      onClick={() => {
                        setCurrentItem(item.id);
                        router.push(
                          `${ROUTE_PATHS.CALCULATOR}?source=saved`,
                          `${ROUTE_PATHS.CALCULATOR.replace(
                            "[strat]",
                            holdJsonData(item.calculations).metadata.stratKey
                          )}?source=saved&sid=${item.id}`
                        );
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div>
                            {getSymbol(item)}
                            {getDatePrice(item)}
                          </div>
                          <p className="lg:text-md text-sm text-gray-500 underline">
                            {holdJsonData(item.calculations).title}
                          </p>
                        </div>
                        <div
                          className="lg:invisible  lg:group-hover:visible"
                          onClick={() => {
                            removeCalculation(item.id);
                          }}
                        >
                          <Icon
                            className="text-red-500"
                            icon={"close"}
                            xsmall
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    );
  } else {
    return emptyResponse;
  }
};

export default NewSavedCalculations;
