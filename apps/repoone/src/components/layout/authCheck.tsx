import { useSession } from "next-auth/react";
import React from "react";
import LandingPage from "../landingPage";
import { useRouter } from "next/router";

const allowedPaths = [
  "/legal/terms",
  "/legal/privacy",
  "/auth/create-account",
  "/auth/verify-request",
  "/auth/login",
];

const AuthCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, status } = useSession();
  const { pathname, push } = useRouter();

  if (allowedPaths.includes(pathname)) {
    return <>{children}</>;
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
  if (status === "unauthenticated") {
    return <LandingPage />;
  }

  if (!data?.user.subscriptionActive) {
    push("/auth/create-account");
    return <></>;
  }

  return <>{children}</>;
};

export default AuthCheck;
