"use client";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken } from "next-auth/react";
import Image from "next/image";
import { GoogleSignInButton } from "~/components/atoms/authButton";
import { getServerAuthSession } from "~/server/auth";
import { env } from "~/env.mjs";
import { Fragment, useEffect } from "react";
import { Transition } from "@headlessui/react";
import Link from "next/link";

export default function Login({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useEffect(() => {
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
  }, []);
  return (
    <>
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
            <div className="flex items-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 ">
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
            <div className="mx-2 max-w-md flex-col items-center justify-center rounded-3xl bg-[#D7D7E7] bg-opacity-50 px-6 py-10 backdrop-blur-xl min-[458px]:m-auto sm:px-14 sm:py-12">
              <form action="/api/auth/signin/email" method="POST">
                <h2 className="font-raleway text-center text-3xl font-semibold leading-9 text-gray-900">
                  Sign in to your account
                </h2>
                <input
                  name="csrfToken"
                  type="hidden"
                  defaultValue={csrfToken}
                />
                <div className="mt-12">
                  <label>Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mb-6 mt-1 w-full rounded-md border-gray-900 bg-transparent px-4 py-3 text-gray-900 placeholder-gray-900"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="flex w-full transform justify-center rounded-md bg-blue p-3 text-sm font-semibold leading-6 text-white transition duration-300 ease-in-out hover:bg-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                  >
                    Sign in
                  </button>
                </div>
                <div className="mt-6">
                  <div className="relative">
                    <div
                      className="absolute inset-0 flex items-center justify-between"
                      aria-hidden="true"
                    >
                      <div className="w-[43%] border-t border-black" />
                      <div className="w-[43%] border-t border-black" />
                    </div>
                    <div className="relative flex justify-center font-medium leading-6">
                      <span className="bg-transparent px-6 text-gray-900">
                        or
                      </span>
                    </div>
                  </div>
                </div>
              </form>
              <div className="mt-2 grid gap-4">
                <GoogleSignInButton />
              </div>
              <p className="mt-2 text-center text-sm">
                Don’t have an account?{" "}
                <Link
                  className="text-[#0C08C2] hover:underline"
                  href="/auth/create-account"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </Transition>
        </div>
      </Transition>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  if (session) {
    return { redirect: { destination: "/" } };
  }

  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken, env: env.NODE_ENV },
  };
}
