import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { toastProps } from "~/styles/toast";
import SelectTdAccountId from "~/components/atoms/selectTdAccountId";

const TdAmeritradeIntegration: React.FC = () => {
  const router = useRouter();
  const { code } = router.query;
  const [showMainAccountSelector, setShowMainAccountSelector] =
    React.useState(false);

  const { mutate, isLoading } =
    api.tdAmeritrade.postTdAmeritradeToken.useMutation({
      onSuccess: (response) => {
        if (!response) {
          return;
        }
        if (response.accountIds.length === 1) {
          toast.success(
            "Successfully integrated with TD Ameritrade",
            toastProps
          );
          router.push("/");
        } else {
          setShowMainAccountSelector(true);
        }
      },
      onError: () => {
        toast.error(
          "Could not load trades from TD Ameritrade. Please try again",
          toastProps
        );
        router.push("/");
      },
    });

  // We only want to trigger the mutation once on page load
  useEffect(() => {
    if (code && typeof code === "string") {
      mutate({ code });
    }
  }, [mutate, code]);

  if (showMainAccountSelector) {
    return <SelectTdAccountId />;
  }

  if (isLoading) {
    return (
      <div className="flex w-full flex-col items-center gap-4 px-5 pt-20">
        <div
          className="aspect-square h-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        ></div>
        <p className="max-w-prose">
          Importing trades from TD Ameritrade. This may take up to a few minutes
          depending on how many trades you made. Do not close or reload the
          page, you&apos;ll be redirected once the import is done.
        </p>
      </div>
    );
  }

  return null;
};

export default TdAmeritradeIntegration;
