import React from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { type Layout } from "@stripe/stripe-js/types";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import Image from "next/image";

export default function Form({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showSceleton, setShowSceleton] = React.useState(true);

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    // const clientSecret = new URLSearchParams(window.location.search).get(
    //   "payment_intent_client_secret"
    // );

    if (!clientSecret) {
      return;
    }

    stripe.retrieveSetupIntent(clientSecret).then(({ setupIntent }) => {
      console.log(setupIntent);
      switch (setupIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:3000/subscription/confirmation",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs" as Layout,
  };

  const cardItems = [
    "Only $39.99 / month after 1 month trial",
    "You won’t be charged until March 14th",
    "Cancel anytime.",
    "Full access to calculator & backtester applications",
  ];

  return (
    <div className="h-screen bg-[#FAFAFC]">
      <div className="flex w-full flex-col bg-[#2B2634]">
        <div className="flex items-center pl-16 pt-10">
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
        <div className="mx-auto mb-5 flex w-full max-w-[457px] flex-col items-start justify-center">
          <h1 className="text-2xl font-bold text-white">Your Plan</h1>
          <div className="w-full max-w-[457px] rounded-lg bg-white">
            <div className="w-full max-w-[457px] rounded-tl-lg rounded-tr-lg  bg-[#2F5DA1] bg-opacity-40 px-6 pb-7 pt-3 font-bold">
              <div className="flex items-center justify-between">
                <p className="text-base">OpCalc Pro</p>
                <p className="text-3xl">$0.00</p>
              </div>
              <div className="mt-1 flex items-center justify-between text-[9px]">
                <p>1 Pro Account</p>
                <p>For 1 month</p>
              </div>
            </div>
            <div className="px-6 pb-5 pt-3 font-bold">
              <div className="flex items-center justify-between text-base">
                <p>Start free month</p>
                <p>Today</p>
              </div>
              <div className="flex items-center justify-between text-base">
                <p>Start billing date</p>
                <p>Mar 14, 2024</p>
              </div>
              <ul className="mt-4">
                {cardItems.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="mr-2 h-[6px] w-[6px] rounded-full bg-black"></div>
                    <li className="text-[10px]">{item}</li>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-3 w-full max-w-[500px] rounded-lg bg-white p-2">
        <div
          id="details"
          className="mx-auto mb-2 w-full max-w-[456px] rounded-lg border-2 bg-white px-3 py-5 after:drop-shadow-xl"
        >
          <div className="flex flex-col justify-between gap-2 font-semibold">
            <p>Your subscription</p>
            <div className="flex items-center justify-between border-b pb-1 font-normal text-gray-500">
              <p>Premium plan</p>
              <p>$15.00 billed monthly</p>
            </div>
            <div className=" flex items-center justify-between">
              <p>Total</p>
              <p>$15.00</p>
            </div>
          </div>
        </div>
        <br className="bg-white" />
        <form
          id="payment-form"
          className="mx-auto w-full max-w-[456px] bg-white"
          onSubmit={handleSubmit}
        >
          <PaymentElement
            id="payment-element"
            options={paymentElementOptions}
            onLoaderStart={() =>
              setTimeout(() => {
                setShowSceleton(false);
              }, 50)
            }
            onReady={() => setIsLoading(false)}
          />
          <Transition
            as={Fragment}
            show={showSceleton}
            enter="transition-opacity ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div role="status" className="max-w-sm animate-pulse bg-opacity-30">
              <div className="my-4 h-6 w-full rounded-md bg-gray-300 backdrop-blur-2xl dark:bg-gray-700"></div>
              <div className="mb-4 h-6 w-full rounded-md bg-gray-300 backdrop-blur-2xl dark:bg-gray-700"></div>
              <div className="mb-4 h-6 w-full rounded-md bg-gray-300 backdrop-blur-2xl dark:bg-gray-700"></div>
              <div className="h-6 w-full rounded-md bg-gray-300 dark:bg-gray-700"></div>
              <span className="sr-only">Loading...</span>
            </div>
          </Transition>
          <button
            className="mt-4 flex w-full items-center justify-center rounded-lg bg-[#429488] py-4 text-sm text-white transition-opacity duration-300 ease-out hover:opacity-90 disabled:opacity-30"
            disabled={isLoading || !stripe || !elements}
            id="submit"
          >
            <span id="button-text">
              {isLoading ? (
                <div
                  className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                >
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Loading...
                  </span>
                </div>
              ) : (
                "Subscribe"
              )}
            </span>
          </button>
          {/* Show any error or success messages */}
          {message && (
            <div id="payment-message" className="text-sm">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
