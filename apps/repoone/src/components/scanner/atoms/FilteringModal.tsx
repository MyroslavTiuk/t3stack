import { PlusIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import useOnClickOutside from "~/utils/Hooks/useClickOutside";
import { AddFilters } from "./AddFilters";
import ModalDropDown from "./ModalDropDown";
type Props = {
  openModal: boolean;
  openFilters: boolean;
  setOpenFilters: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FilteringModal: React.FC<Props> = ({
  openModal,
  setOpenModal,
  openFilters,
  setOpenFilters,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const addFiltersRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState({
    stockPrice: "",
    marketCap: "",
    peRatio: "",
    daysToExpiration: "",
    moneyness: "",
    iv: "",
    roi: "",
    rsi: "",
    beta: "",
    eps: "",
  });
  const handleModalClick = (event: Event) => {
    if (
      modalRef.current &&
      event.target instanceof Node &&
      !modalRef.current.contains(event.target) &&
      !openFilters &&
      !(addFiltersRef.current && addFiltersRef.current.contains(event.target))
    ) {
      setOpenModal(false);
    }
  };

  useOnClickOutside(modalRef, handleModalClick);

  const dropdownItems = ["Less than", "Greater than", "Equal to", "Between"];

  const modalClasses = openModal
    ? "absolute top-0 right-[10vw] max-w-[388px] w-full mx-auto bg-white rounded drop-shadow-3xl    min-h-[400px]"
    : "hidden";

  return (
    <div className={modalClasses} ref={modalRef}>
      <div className="relative">
        <button
          onClick={() => setOpenFilters(true)}
          className="absolute right-3 top-3 flex w-full max-w-[128px] cursor-pointer items-center justify-center rounded-lg border border-dark py-2 text-blue"
        >
          <PlusIcon className="h-4 w-4" />{" "}
          <span className="ml-1">Add Filters</span>
        </button>
      </div>
      <div className="py-8 pr-4">
        <ul className="pl-4">
          <li className="mb-2 mt-4">
            <p className="text-base font-bold">Stock Data:</p>
            <ul className="pl-4">
              <li className="mb-2">
                <div className="flex items-center justify-between">
                  <span className="w-full max-w-[133px]">Stock Price:</span>
                  <div className="flex items-center gap-2">
                    <ModalDropDown
                      dropdownItems={dropdownItems}
                      selectedItem={selectedItem.stockPrice}
                      setSelectedItem={(value: string) => {
                        setSelectedItem({
                          ...selectedItem,
                          stockPrice: value,
                        });
                      }}
                    />
                    <div className="flex justify-end border-b-2">
                      <span className="mt-4 h-4 border border-r"></span>
                      <input className="w-full max-w-[72px] border-transparent focus:border-transparent focus:ring-0" />
                    </div>
                  </div>
                </div>
              </li>
              <li className="mb-2">
                <div className="flex w-full max-w-[350px] items-center justify-between">
                  <span className="w-full max-w-[133px]">Market Cap:</span>
                  <div className="flex items-center gap-2 ">
                    <ModalDropDown
                      dropdownItems={dropdownItems}
                      selectedItem={selectedItem.marketCap}
                      setSelectedItem={(value: string) => {
                        setSelectedItem({
                          ...selectedItem,
                          marketCap: value,
                        });
                      }}
                    />
                    <div className="flex justify-end border-b-2 p-0">
                      <span className="mt-4 h-4 border border-r"></span>
                      <input className="w-full max-w-[72px] border-transparent focus:border-transparent focus:ring-0" />
                    </div>
                  </div>
                </div>
              </li>
              <li className="mb-2">
                <div className="flex items-center justify-between">
                  <span className="w-full max-w-[133px]">PE Ratio:</span>
                  <div className="flex items-center gap-2 ">
                    <ModalDropDown
                      dropdownItems={dropdownItems}
                      selectedItem={selectedItem.peRatio}
                      setSelectedItem={(value: string) => {
                        setSelectedItem({
                          ...selectedItem,
                          peRatio: value,
                        });
                      }}
                    />
                    <div className="flex justify-end border-b-2">
                      <span className="mt-4 h-4 border border-r"></span>
                      <input className="w-full max-w-[72px] border-transparent focus:border-transparent focus:ring-0" />
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
        <ul className="pl-4">
          <li className="mb-2 mt-6">
            <p className="text-base font-bold"> Options Data:</p>
            <ul className="pl-4">
              <li className="mb-2">
                <div
                  className="flex items-center justify-between
                "
                >
                  <span className="w-full max-w-[141px]">
                    Days to expiration:
                  </span>
                  <div className="flex items-center gap-2 ">
                    <ModalDropDown
                      dropdownItems={dropdownItems}
                      selectedItem={selectedItem.daysToExpiration}
                      setSelectedItem={(value: string) => {
                        setSelectedItem({
                          ...selectedItem,
                          daysToExpiration: value,
                        });
                      }}
                    />
                    <div className="flex justify-end border-b-2">
                      <span className="mt-4 h-4 border border-r"></span>
                      <input className="w-full max-w-[72px] border-transparent focus:border-transparent focus:ring-0" />
                    </div>
                  </div>
                </div>
              </li>
              <li className="mb-2">
                <div className="flex items-center justify-between ">
                  <span className="w-full max-w-[133px]">
                    ITM/OTM “Moneyness”:
                  </span>
                  <div className="flex items-center gap-2 ">
                    <ModalDropDown
                      dropdownItems={dropdownItems}
                      selectedItem={selectedItem.moneyness}
                      setSelectedItem={(value: string) => {
                        setSelectedItem({
                          ...selectedItem,
                          moneyness: value,
                        });
                      }}
                    />
                    <div className="flex justify-end border-b-2">
                      <span className="mt-4 h-4 border border-r"></span>
                      <input className="w-full max-w-[72px] border-transparent focus:border-transparent focus:ring-0" />
                    </div>
                  </div>
                </div>
              </li>
              <li className="mb-2">
                <div className="flex items-center justify-between  ">
                  <span className="w-full max-w-[133px]">IV:</span>
                  <div className="flex items-center gap-2 ">
                    <ModalDropDown
                      dropdownItems={dropdownItems}
                      selectedItem={selectedItem.iv}
                      setSelectedItem={(value: string) => {
                        setSelectedItem({
                          ...selectedItem,
                          iv: value,
                        });
                      }}
                    />
                    <div className="flex justify-end border-b-2">
                      <span className="mt-4 h-4 border border-r"></span>
                      <input className="w-full max-w-[72px] border-transparent focus:border-transparent focus:ring-0" />
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
        <ul className="pl-4">
          <li className="mb-2 mt-6">
            <p className="text-base font-bold">Profit and risk:</p>
            <ul className="pl-4">
              <li>
                <div className="flex items-center justify-between ">
                  ROI:
                  <div className="flex items-center gap-2 ">
                    <ModalDropDown
                      dropdownItems={dropdownItems}
                      selectedItem={selectedItem.roi}
                      setSelectedItem={(value: string) => {
                        setSelectedItem({
                          ...selectedItem,
                          roi: value,
                        });
                      }}
                    />
                    <div className="flex justify-end border-b-2">
                      <span className="mt-4 h-4 border border-r"></span>
                      <input className="w-full max-w-[72px] border-transparent focus:border-transparent focus:ring-0" />
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
        <ul className="pl-4">
          <li className="mb-2 mt-6">
            <p className="text-base font-bold">Technical Data</p>
            <ul className="pl-4">
              <li>
                <div className="flex items-center justify-between ">
                  RSI:
                  <div className="flex items-center gap-2 ">
                    <ModalDropDown
                      dropdownItems={dropdownItems}
                      selectedItem={selectedItem.rsi}
                      setSelectedItem={(value: string) => {
                        setSelectedItem({
                          ...selectedItem,
                          rsi: value,
                        });
                      }}
                    />
                    <div className="flex justify-end border-b-2">
                      <span className="mt-4 h-4 border border-r"></span>
                      <input className="w-full max-w-[72px] border-transparent focus:border-transparent focus:ring-0" />
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
        <ul className="pl-4">
          <li className="mb-2 mt-6">
            <p className="text-base font-bold">Technical Data</p>
            <ul className="pl-4">
              <li className="mb-2">
                <div className="flex items-center justify-between ">
                  Beta
                  <div className="flex items-center gap-2 ">
                    <ModalDropDown
                      dropdownItems={dropdownItems}
                      selectedItem={selectedItem.beta}
                      setSelectedItem={(value: string) => {
                        setSelectedItem({
                          ...selectedItem,
                          beta: value,
                        });
                      }}
                    />
                    <div className="flex justify-end border-b-2">
                      <span className="mt-4 h-4 border border-r"></span>
                      <input className="w-full max-w-[72px] border-transparent focus:border-transparent focus:ring-0" />
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center justify-between ">
                  EPS:
                  <div className="flex items-center gap-2 ">
                    <ModalDropDown
                      dropdownItems={dropdownItems}
                      selectedItem={selectedItem.eps}
                      setSelectedItem={(value: string) => {
                        setSelectedItem({
                          ...selectedItem,
                          eps: value,
                        });
                      }}
                    />
                    <div className="flex justify-end border-b-2">
                      <span className="mt-4 h-4 border border-r"></span>
                      <input className="w-full max-w-[72px] border-transparent focus:border-transparent focus:ring-0" />
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
        <div className="mt-8 flex items-center gap-3 pl-4">
          <button
            className="w-full max-w-[180px] rounded-md border border-black py-2 font-sans text-sm"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </button>
          <button className="flex w-full max-w-[180px] items-center justify-center gap-1 rounded-md border border-blue bg-blue py-2 font-sans text-sm text-white">
            <PlayIcon className=" h-4 w-4" />
            <span>Run Scan</span>
          </button>
        </div>
      </div>
      <AddFilters
        openFilters={openFilters}
        setOpenFilters={setOpenFilters}
      ></AddFilters>
    </div>
  );
};
