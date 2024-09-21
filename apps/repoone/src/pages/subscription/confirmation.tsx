import PaymentConfirmation from "~/components/payment/confirm/PaymentConfirmation";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "~/utils/api";
export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentIntentSecret = searchParams.get("setup_intent");
  const redirectStatus = searchParams.get("redirect_status");

  window.history.replaceState(null, "", "/subscription/confirmation");

  if (!paymentIntentSecret) {
    return router.push("/");
  }

  if (redirectStatus !== "succeeded") {
    return <div>Something wen't wrong</div>;
  }

  console.log(paymentIntentSecret);
  const { data: paymentIntentsDetails, isLoading } =
    api.stripe.retrieveSubscriptionInformation.useQuery(paymentIntentSecret);

  return (
    <PaymentConfirmation details={paymentIntentsDetails} loading={isLoading} />
  );
}
