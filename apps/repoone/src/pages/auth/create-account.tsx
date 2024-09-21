"use client";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken } from "next-auth/react";
import Image from "next/image";
import { getServerAuthSession } from "~/server/auth";
import { env } from "~/env.mjs";
import { Fragment, useEffect } from "react";
import { Transition } from "@headlessui/react";
import CreateAccountForm from "~/components/auth/CreateAccountForm";
import CheckoutForm from "~/components/payment/CheckoutForm";

export default function CustomAuth({
  csrfToken,
  needsSubscription,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useEffect(() => {
    if (!needsSubscription) {
      const oldHeight = document.body.style.height;
      const oldOverflow = document.body.style.overflow;
      const oldHtmlHeight = document.documentElement.style.height;
      const oldOHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.height = "100%";
      document.body.style.height = "auto";
      document.documentElement.style.height = "100%";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.height = oldHeight;
        document.body.style.height = oldOverflow;
        document.documentElement.style.height = oldHtmlHeight;
        document.documentElement.style.height = oldOHtmlOverflow;
      };
    }
  }, []);
  return (
    <>
      {needsSubscription ? (
        <CheckoutForm />
      ) : (
        <Transition
          as={Fragment}
          appear={true}
          show={true}
          enter="transition-opacity ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in duration-75"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="min-h-screen flex-col items-center justify-center bg-[url('/Sign-up.png')] bg-cover bg-fixed bg-center">
            <Transition
              as={Fragment}
              appear={true}
              show={true}
              enter="transition-all ease-out duration-150"
              enterFrom="opacity-0 translate-y-5"
              enterTo="opacity-100 translate-y-0"
              leave="transition-all ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-5"
            >
              <div
                className={`${
                  needsSubscription ? "hidden  md:flex" : "flex"
                } items-center px-4 py-4 sm:px-6 sm:py-12 lg:px-20 xl:px-24`}
              >
                <Image
                  className="ml-2"
                  src="/icons/Logo.svg"
                  alt="Options Profit Calculator Logo"
                  width={40}
                  height={40}
                />
                <p className="font-raleway ml-2 text-lg font-extrabold tracking-tight text-black">
                  Options Profit Calculator
                </p>
              </div>
            </Transition>
            <Transition
              as={Fragment}
              appear={true}
              show={true}
              enter="transition-all ease-out duration-500"
              enterFrom="opacity-0 translate-y-5"
              enterTo="opacity-100 translate-y-0"
              leave="transition-all ease-in duration-500"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-5"
            >
              <div
                className={`no-scrollbar mx-2 max-h-screen max-w-md transform flex-col overflow-y-scroll sm:max-h-[690px] ${
                  needsSubscription ? "sm:-translate-y-28" : ""
                } items-center justify-center rounded-3xl bg-[#D7D7E7] bg-opacity-50 px-6 py-10 backdrop-blur-xl min-[458px]:m-auto sm:px-14 sm:py-12`}
              >
                <div
                  className={`flex transform items-center justify-center gap-4 transition-all duration-300 ease-in-out ${
                    needsSubscription ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <div className="h-[6px] w-12 rounded-lg bg-[#09068A]"></div>
                  <div className="h-[6px] w-12 rounded-3xl border border-[#09068A] bg-[transparent]"></div>
                </div>
                <CreateAccountForm csrfToken={csrfToken} />
              </div>
            </Transition>
          </div>
        </Transition>
      )}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  if (session && session.user.subscriptionActive) {
    return { redirect: { destination: "/" } };
  }

  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken, env: env.NODE_ENV, needsSubscription: !!session },
  };
}
