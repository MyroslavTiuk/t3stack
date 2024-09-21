"use client";
import { Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function VerifyRequest() {
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
            <div className="mx-2 flex max-w-md flex-col items-center justify-center gap-6 rounded-3xl bg-[#D7D7E7] bg-opacity-50 px-6 py-10 backdrop-blur-xl min-[458px]:m-auto sm:px-14 sm:py-12">
              <EnvelopeIcon className="h-16 w-16" />
              <h1 className="text-center text-2xl">Check your email!</h1>
              <p className="text-lg">
                A sign in link has been sent to your email address.{" "}
              </p>
            </div>
          </Transition>
        </div>
      </Transition>
    </>
  );
}
