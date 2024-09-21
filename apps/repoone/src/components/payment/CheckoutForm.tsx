import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { type Appearance } from "@stripe/stripe-js/types/stripe-js/elements-group";
import { api } from "~/utils/api";
import Form from "~/components/payment/Form";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);
export default function CheckoutForm() {
  const {
    data: subscription,
    mutate: createSubscription,
    isLoading,
  } = api.stripe.createSubscription.useMutation();
  React.useEffect(() => {
    createSubscription();
  }, []);

  if (isLoading || !subscription) {
    return;
  }

  const appearance: Appearance = {
    theme: "stripe",
    labels: "floating",
    variables: {
      fontFamily: "Raleway, sans-serif",
      fontLineHeight: "1.5",
      borderRadius: "10px",
      colorPrimary: "#429488",
    },
    rules: {
      ".Input": {
        backgroundColor: "transparent",
        padding: "4px 12px 4px 12px",
      },
      ".Tab": {
        borderRadius: "10px",
      },
    },
  };
  const options = {
    clientSecret: subscription.clientSecret as string,
    appearance,
  };

  return (
    <>
      {subscription.clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <Form clientSecret={subscription.clientSecret} />
        </Elements>
      )}
    </>
  );
}
