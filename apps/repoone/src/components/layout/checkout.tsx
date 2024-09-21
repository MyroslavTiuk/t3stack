import { signOut, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { api } from "~/utils/api";

const Checkout: React.FC = () => {
  const { status, mutate, data } = api.stripe.createCheckoutSession.useMutation(
    {}
  );
  const {
    status: S,
    mutate: M,
    data: D,
  } = api.stripe.createPaymentIntents.useMutation({});
  const { update } = useSession();

  useEffect(() => {
    mutate();
    M();
  }, [mutate, M]);
  console.log(D, S);
  // useEffect(() => {
  //   if (status === "success") {
  //     router.push(data); // Redirect to the provided URL
  //   }
  // }, [status, data, router]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      update();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [update]);

  if (status === "success") {
    return (
      <div className="flex w-full flex-col items-center gap-4 py-4">
        <a
          className="flex gap-2 rounded-lg bg-orange px-4 py-2 font-semibold text-white no-underline transition hover:bg-orange/70"
          href={data}
        >
          Sign up now
        </a>
        <button
          className="flex gap-2 rounded-lg border-2 border-orange px-4 py-2 font-semibold text-orange no-underline transition hover:border-orange/70"
          onClick={() => void signOut()}
        >
          Sign out
        </button>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div
        role="status"
        className="flex w-full animate-pulse flex-col items-center"
      >
        <div className="mt-24 h-16 w-1/2 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="mt-10 h-10 w-1/3 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="mt-10 h-16 w-1/3 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex w-full justify-center">
        <span className="mt-24">
          Something went wrong with the checkout, please refresh the page.
        </span>
      </div>
    );
  }

  return null;
};

export default Checkout;
