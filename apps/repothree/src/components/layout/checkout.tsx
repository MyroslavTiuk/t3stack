import { signOut } from "next-auth/react";
import React, { useEffect } from "react";
import { api } from "~/utils/api";

const Checkout: React.FC = () => {
  const { status, mutate, data } = api.stripe.createCheckoutSession.useMutation(
    {}
  );

  useEffect(() => {
    mutate();
  }, [mutate]);

  if (status === "success") {
    return (
      <div className="flex w-full flex-col items-center gap-4 py-4">
        <a
          className="flex gap-2 rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white no-underline transition hover:bg-teal-600/70"
          href={data}
        >
          Sign up now
        </a>
        <button
          className="flex gap-2 rounded-lg border-2 border-teal-600 px-4 py-2 font-semibold text-teal-600 no-underline transition hover:border-teal-600/70"
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
