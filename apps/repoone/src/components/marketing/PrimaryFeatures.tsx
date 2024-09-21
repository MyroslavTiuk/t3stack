"use client";

import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import clsx from "clsx";

import { Container } from "./Container";
import adfree from "../../images/screenshots/ad-free.png";
import trades from "../../images/screenshots/trades.png";
import soon from "../../images/screenshots/soon.png";

const features = [
  {
    title: "Ad-Free Calculator",
    description: "Enjoy the calculator web app with no ads!",
    image: adfree,
  },
  {
    title: "Track your option trades & profits! ",
    description:
      "Simply import your option trades and have a to-go source to track your profits.",
    image: trades,
  },
  {
    title:
      "(COMING SOON) Robust options scanner to find trades before the masses",
    description:
      "We are currently working on a one of a kind scanner that helps you identify trades based on your trading criteria.",
    image: soon,
  },
  {
    title: "(COMING SOON) Backtester to prove your investment thesis",
    description:
      "We are currently developing a backtester that you can use to research and analyze your investment thesis.",
    image: soon,
  },
];

export function PrimaryFeatures() {
  const [tabOrientation, setTabOrientation] = useState<
    "horizontal" | "vertical"
  >("horizontal");

  useEffect(() => {
    const lgMediaQuery = window.matchMedia("(min-width: 1024px)");

    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setTabOrientation(matches ? "vertical" : "horizontal");
    }

    onMediaQueryChange(lgMediaQuery);
    lgMediaQuery.addEventListener("change", onMediaQueryChange);

    return () => {
      lgMediaQuery.removeEventListener("change", onMediaQueryChange);
    };
  }, []);

  return (
    <section
      id="features"
      aria-label="Features for running your books"
      className="relative overflow-hidden pb-28 pt-20 sm:py-32"
    >
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
            A glimpse into what you are getting.
          </h2>
        </div>
        <Tab.Group
          as="div"
          className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === "vertical"}
        >
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:pb-0 lg:col-span-5">
                <Tab.List className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <div
                      key={feature.title}
                      className={clsx(
                        "group relative border-l-2 px-4 py-1 lg:p-6 ",
                        selectedIndex === featureIndex
                          ? "border-[#00FF00]"
                          : "border-[#280330]"
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            "font-display text-lg",
                            selectedIndex === featureIndex
                              ? "lg:text-[#00FF00]"
                              : "hover:text-white lg:text-white"
                          )}
                        >
                          <span className="absolute inset-0 rounded-full outline-none lg:rounded-l-xl lg:rounded-r-none" />
                          {feature.title}
                        </Tab>
                      </h3>
                      <p
                        className={clsx(
                          "mt-2 hidden text-sm text-white lg:block",
                          selectedIndex === featureIndex
                            ? "text-white"
                            : "group-hover:text-white"
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </Tab.List>
              </div>
              <Tab.Panels className="lg:col-span-7">
                {features.map((feature) => (
                  <Tab.Panel key={feature.title} unmount={false}>
                    <div className="relative sm:px-6 lg:hidden">
                      <div className="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl" />
                      <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
                        {feature.description}
                      </p>
                    </div>
                    <div className="shadow-blue-900/20 w-max-[45rem] mt-10 overflow-hidden rounded-xl bg-slate-50 shadow-xl sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                      <div className="h-96 w-96 rounded-3xl bg-[#280330]" />
                    </div>
                  </Tab.Panel>
                ))}
                <div className="h-96 w-96 rounded-3xl bg-[#280330] md:mr-32" />
              </Tab.Panels>
            </>
          )}
        </Tab.Group>
      </Container>
    </section>
  );
}
