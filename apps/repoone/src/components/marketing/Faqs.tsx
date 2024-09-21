import { Container } from "./Container";
import { Disclosure } from "@headlessui/react";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import { useMediaQueryCustom } from "~/utils/Hooks/useMediaQueryCustom";

const faqs = [
  {
    question: "How do I enable ad-free viewing once subscribed?",
    answer:
      "All you need to do is go to https://www.optionsprofitcalculator.com/membership.html and press the button 'enable ad-free' and you should no longer see ads on the site",
  },
  {
    question: "If I have questions, how do I reach out?",
    answer:
      "Email support@optionsprofitcalculator.com and we will get back to you within 1 business day.",
  },
  {
    question: "How do I import my trades into the tracker?",
    answer:
      "There are 3 ways you can import trades. 1. if you happen to trade on td ameritrade/think or swim, we have a direct intergration where you login at TD ameritrade and connect to OpCalc. We are working on adding more brokers, however you can upload any CSV file from any brokerage and can add your trades in that way. If you do not want to or don't have a csv file to import, you can also manually add in any stock or option trade.",
  },
  {
    question: "What is the refund policy?",
    answer:
      "Anyone subscribing gets a 14 day free trial, after that you can cancel at any time. You can cancel by going to your account page within the application. We do not process any refunds due to the nature we provide a 14 day free trial and then provide the opportunity to cancel your account at any time..",
  },
];

export function Faqs() {
  const matches = useMediaQueryCustom("(max-width: 500px)");

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className={`relative w-full overflow-hidden px-5 py-20`}
    >
      <h2
        className={`${
          matches ? "" : "ml-40"
        } text-bold relative mb-4 w-full text-4xl text-black`}
      >
        FAQ
      </h2>
      <p
        className={`${
          matches ? "" : "ml-40"
        } relative mb-20 w-full text-xl text-black`}
      >
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        If you can't find an answer, reach out to our support team via email for
        assistance
      </p>
      <Container className="relative text-black">
        <div className="w-full max-w-7xl rounded-bl-lg rounded-br-3xl rounded-tl-3xl rounded-tr-lg bg-white py-2 sm:mx-auto">
          {faqs.map((f, i) => (
            <Disclosure key={i} as="div">
              {({ open }) => (
                <div className="border-b">
                  <Disclosure.Button className="flex w-full justify-between p-4 text-left text-sm font-medium ">
                    <span
                      className={`${
                        matches ? "w-full max-w-[319px] text-lg" : "text-2xl"
                      } font-bold`}
                    >
                      {f.question}
                    </span>
                    {open ? (
                      <MinusCircleIcon className="h-6 w-6 text-[#2D78C8] opacity-50" />
                    ) : (
                      <PlusCircleIcon className="h-6 w-6 text-[#2D78C8]" />
                    )}
                  </Disclosure.Button>
                  <Disclosure.Panel className="text-normal w-full px-4 pb-6 text-black">
                    {f.answer}
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          ))}
        </div>
      </Container>
    </section>
  );
}
