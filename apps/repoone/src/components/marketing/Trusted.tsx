import fiftyThree from "../../../public/icons/fifth_third_bank.svg";
import bnp from "../../../public/icons/bnp.svg";
import tradier from "../../../public/icons/tradier-logo.svg";
import Image from "next/image";
import { useMediaQueryCustom } from "~/utils/Hooks/useMediaQueryCustom";

export default function Trusted() {
  const matches = useMediaQueryCustom("(max-width: 768px)");

  return (
    <>
      <ul
        role="list"
        className="my-60 mt-20 flex items-center justify-center gap-x-8 sm:flex-col sm:gap-x-0 sm:gap-y-10 xl:flex-row xl:gap-x-12 xl:gap-y-0"
      >
        {[
          [
            { name: "53", logo: fiftyThree },
            { name: "bnp", logo: bnp },
            { name: "tradier", logo: tradier },
          ],
        ].map((group, groupIndex) => (
          <li key={groupIndex}>
            <ul
              role="list"
              className="mx-auto flex w-screen flex-col items-center justify-center border  text-center sm:flex-row sm:gap-x-12"
            >
              {group.map((company, index) => (
                <li
                  key={company.name}
                  className={`${
                    matches
                      ? "border-b"
                      : index !== group.length - 1
                      ? "border-r "
                      : ""
                  } flex w-full max-w-[480px] items-center justify-center  py-7`}
                >
                  <Image
                    // @ts-ignore
                    src={company.logo}
                    height={36}
                    alt={company.name}
                    unoptimized
                  />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}
