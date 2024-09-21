import Image from "next/image";
import { useMediaQueryCustom } from "~/utils/Hooks/useMediaQueryCustom";

type StatisticItem = {
  id: number;
  icon: string;
  amount: string;
  amountAdd: string;
  experience: string;
};

const statistik: StatisticItem[] = [
  {
    id: 1,
    icon: "/icons/user.svg",
    amount: "2M",
    amountAdd: "+",
    experience: "Users",
  },
  {
    id: 2,
    icon: "/icons/docs.svg",
    amount: "1.5",
    amountAdd: "M",
    experience: "Tradable contracts",
  },
  {
    id: 3,
    icon: "/icons/work.svg",
    amount: "13",
    amountAdd: "+",
    experience: "Years in business",
  },
];

export default function Statistics() {
  const matches = useMediaQueryCustom("(max-width: 500px)");

  return (
    <div
      className={`${
        matches ? "my-20 flex-col" : "my-40 flex justify-between"
      } mx-auto max-w-5xl items-center`}
    >
      {statistik.map(({ id, icon, amount, amountAdd, experience }) => (
        <div
          key={id}
          className={`flex flex-col items-center ${matches ? "mt-14" : ""}`}
        >
          <Image src={icon} alt="icon" width={84} height={84} />
          <p
            className={`mt-4 ${
              matches ? "my-5 text-5xl" : "text-8xl"
            } font-bold`}
          >
            {amount}
            <span className="text-[#808080]">{amountAdd}</span>
          </p>
          <p className="text-2xl">{experience}</p>
        </div>
      ))}
    </div>
  );
}
