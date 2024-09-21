import Image from "next/image";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Link from "next/link";

type PaymentConfirmProps = {
  details: {
    intent: any;
    invoice: any;
  };
  loading?: boolean;
};
export default function PaymentConfirmation({
  details,
  loading,
}: PaymentConfirmProps) {
  const router = useRouter();
  const proItems = [
    "Free today through March 14th.",
    "$39.99 / month after.",
    "For any feedback, feature requests, or support email support@optionsprofitcalculator.com",
  ];
  const proBenefits = [
    "Ad-free usage",
    "Multiple symbols per one calculation",
    "Multiple strategies calculation view",
    "Customizable viewing settings",
    "Stock & options calculator to backtest",
    "strategies from any date since 2002",
    "Stock & Options tracker",
    "Email support",
  ];
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div
          className="inline-block h-24 w-24 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="h-screen w-full overflow-y-auto bg-[#FAFAFC]">
      <div className="flex w-full flex-col bg-[#2B2634]">
        <div className="flex items-center py-10 pl-16">
          <Image
            src="/logo.svg"
            alt="Options Profit Calculator Logo"
            width={40}
            height={40}
          />
          <p className="font-raleway ml-2 text-lg font-extrabold tracking-tight text-white">
            Options Profit Calculator
          </p>
        </div>
      </div>
      <div className="w-full bg-white">
        <div className="w-full bg-[#2F5DA1] bg-opacity-40">
          <p>1 Pro Account</p>
          <div className="flex w-full items-center justify-center">
            <div className="flex w-full max-w-[457px] flex-col items-start justify-center">
              <CheckCircleIcon className="h-7 w-7" />
              <p className="text-3xl font-bold">
                You’re subscribed to OpCalc
                <br /> Pro
              </p>
              <ul className="mt-1">
                {proItems.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-2 mt-2 h-1 w-1 rounded-full bg-black"></div>
                    <li className="max-w-[400px] text-base font-bold">
                      {item}
                    </li>
                  </div>
                ))}
              </ul>
              <div className="mb-20 mt-5 w-full max-w-[457px] rounded-lg bg-white p-4">
                <p className="text-sm font-bold">Next step</p>
                <h1 className="text-2xl font-bold">Your OpCalc pro benefits</h1>
                <ul className="mt-1">
                  {proBenefits.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckIcon className="mr-1 mt-1 h-4 w-4" />
                      <li className="max-w-[400px] text-[18px] font-bold">
                        {item}
                      </li>
                    </div>
                  ))}
                </ul>
                <button
                  onClick={() => router.push("/")}
                  className="mt-14 w-full max-w-[430px] rounded-3xl border-none bg-[#EF3C24] py-2 text-[18px] font-bold uppercase text-white"
                >
                  open opcalc pro
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16 flex w-full items-center justify-center">
        <div className="flex flex-col items-start justify-center">
          <p className="text-[26px] font-bold">Order Summary</p>
          <p className="my-3 text-xl">
            We’ve sent a confirmation email to <br />{" "}
            {details.invoice.customer_email}
          </p>
          <p className="text-xl font-bold">Order #{details.invoice.number}</p>
          <div className=" my-7 w-full max-w-[456px] rounded-lg border-2 bg-white px-3 py-5 after:drop-shadow-xl">
            <div className="flex flex-col justify-between gap-2 font-bold">
              <p>OpCalc Pro</p>
              <div className="flex items-center justify-between ">
                <p>Starting today</p>
                <p>1 month free</p>
              </div>
              <div className=" flex items-center justify-between">
                <p>Starting Mar 14, 2024</p>
                <p>$39.99 / month</p>
              </div>
            </div>
          </div>
          <p className="w-full max-w-[457px]  text-xl">
            View your plan, receipts, or cancel anytime on your OpCalc{" "}
            <Link href="/settings" className="underline">
              settings page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
