import React, { type ReactElement } from "react";
import Button from "~/components/log/button";
import Dropdown from "~/components/atoms/Dropdown";
import { SymbolAutocompleteNew } from "~/components/molecules/SymbolAutocompletNew";

type Props = {
  title?: string;
  children: ReactElement;
  columns: { title: string; checked: boolean }[];
  setColumn: (columns: string) => void;
  startDate?: Date;
  endDate?: Date;
  filter: string;
  onFilterChange: (input: string) => void;
  onExport: () => void;
};

const LogTableEntry: React.FC<Props> = (props: Props) => {
  return (
    <div className="rounded-lg bg-white shadow">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-2">
          {props.title && (
            <h1 className="mb-2 text-2xl font-extrabold uppercase">
              {props.title}
            </h1>
          )}
          <div className="relative">
            <SymbolAutocompleteNew
              value={props.filter ?? ""}
              onChange={(symbol) => props.onFilterChange(symbol)}
            />
          </div>
        </div>
        <div
          className={
            "flex h-fit w-full items-center justify-end gap-2" +
            (props.title ? "py-6" : "py-6 sm:py-0")
          }
        >
          <Button
            onClick={props.onExport}
            variant="primary"
            className="mr-2 text-sm font-medium"
            icon={
              <svg
                className="h-3 w-3"
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.91331 10.7C9.75572 10.7 9.60458 10.7632 9.49314 10.8757C9.38171 10.9883 9.3191 11.1409 9.3191 11.3H2.18857V4.70001H3.9712C4.28639 4.70001 4.58867 4.57358 4.81154 4.34853C5.03442 4.12349 5.15963 3.81827 5.15963 3.50001V1.70001H9.3191V4.10001C9.3191 4.25914 9.38171 4.41175 9.49314 4.52427C9.60458 4.63679 9.75572 4.70001 9.91331 4.70001C10.0709 4.70001 10.222 4.63679 10.3335 4.52427C10.4449 4.41175 10.5075 4.25914 10.5075 4.10001V1.70001C10.5125 1.38718 10.3943 1.08515 10.179 0.860188C9.96363 0.635222 9.66871 0.50569 9.35892 0.500009H4.4638C4.22952 0.499256 3.99742 0.545488 3.78097 0.636023C3.56451 0.726557 3.36802 0.859592 3.20289 1.02741L1.52246 2.72421C1.35626 2.89095 1.22451 3.08936 1.13485 3.30792C1.04519 3.52648 0.999403 3.76084 1.00015 3.99741V11.3C0.995219 11.6128 1.11338 11.9149 1.32871 12.1398C1.54405 12.3648 1.83896 12.4943 2.14876 12.5H9.3191C9.63429 12.5 9.93657 12.3736 10.1594 12.1485C10.3823 11.9235 10.5075 11.6183 10.5075 11.3C10.5075 11.1409 10.4449 10.9883 10.3335 10.8757C10.222 10.7632 10.0709 10.7 9.91331 10.7ZM3.9712 1.94841V3.50001H2.43457L3.9712 1.94841Z"
                  fill="white"
                />
                <path
                  d="M10.826 7.2758L9.18125 5.61501C9.12643 5.5577 9.06087 5.51199 8.98837 5.48054C8.91587 5.4491 8.8379 5.43255 8.759 5.43186C8.6801 5.43116 8.60186 5.44634 8.52883 5.47651C8.4558 5.50668 8.38946 5.55123 8.33367 5.60757C8.27787 5.6639 8.23375 5.7309 8.20388 5.80463C8.174 5.87837 8.15896 5.95738 8.15965 6.03705C8.16034 6.11671 8.17673 6.19545 8.20787 6.26865C8.23901 6.34185 8.28428 6.40806 8.34103 6.4634L8.9709 7.1H5.15963C5.00203 7.1 4.85089 7.16322 4.73946 7.27574C4.62802 7.38826 4.56541 7.54087 4.56541 7.7C4.56541 7.85913 4.62802 8.01175 4.73946 8.12427C4.85089 8.23679 5.00203 8.3 5.15963 8.3H8.9709L8.34103 8.9366C8.28428 8.99195 8.23901 9.05816 8.20787 9.13136C8.17673 9.20456 8.16034 9.28329 8.15965 9.36296C8.15896 9.44263 8.174 9.52164 8.20388 9.59538C8.23375 9.66911 8.27787 9.7361 8.33367 9.79244C8.38946 9.84877 8.4558 9.89333 8.52883 9.9235C8.60186 9.95366 8.6801 9.96884 8.759 9.96815C8.8379 9.96746 8.91587 9.95091 8.98837 9.91946C9.06087 9.88802 9.12643 9.84231 9.18125 9.785L10.826 8.1242C10.9374 8.01169 11 7.8591 11 7.7C11 7.54091 10.9374 7.38832 10.826 7.2758Z"
                  fill="white"
                />
              </svg>
            }
          >
            Export
          </Button>
          <Dropdown onChange={props.setColumn} items={props.columns} />
        </div>
      </div>
      {props.children}
    </div>
  );
};

export default LogTableEntry;
