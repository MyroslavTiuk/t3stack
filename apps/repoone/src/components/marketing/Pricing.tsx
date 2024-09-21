import clsx from "clsx";

import Button from "./Button";
import { Container } from "./Container";
import { signIn } from "next-auth/react";
import bgMobile from "../../../public/opcalcProMobile.webp";
import bg from "../../../public/opcalcPro.webp";
import { useMediaQueryCustom } from "~/utils/Hooks/useMediaQueryCustom";

export function SwirlyDoodle(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 281 40"
      preserveAspectRatio="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M240.172 22.994c-8.007 1.246-15.477 2.23-31.26 4.114-18.506 2.21-26.323 2.977-34.487 3.386-2.971.149-3.727.324-6.566 1.523-15.124 6.388-43.775 9.404-69.425 7.31-26.207-2.14-50.986-7.103-78-15.624C10.912 20.7.988 16.143.734 14.657c-.066-.381.043-.344 1.324.456 10.423 6.506 49.649 16.322 77.8 19.468 23.708 2.65 38.249 2.95 55.821 1.156 9.407-.962 24.451-3.773 25.101-4.692.074-.104.053-.155-.058-.135-1.062.195-13.863-.271-18.848-.687-16.681-1.389-28.722-4.345-38.142-9.364-15.294-8.15-7.298-19.232 14.802-20.514 16.095-.934 32.793 1.517 47.423 6.96 13.524 5.033 17.942 12.326 11.463 18.922l-.859.874.697-.006c2.681-.026 15.304-1.302 29.208-2.953 25.845-3.07 35.659-4.519 54.027-7.978 9.863-1.858 11.021-2.048 13.055-2.145a61.901 61.901 0 0 0 4.506-.417c1.891-.259 2.151-.267 1.543-.047-.402.145-2.33.913-4.285 1.707-4.635 1.882-5.202 2.07-8.736 2.903-3.414.805-19.773 3.797-26.404 4.829Zm40.321-9.93c.1-.066.231-.085.29-.041.059.043-.024.096-.183.119-.177.024-.219-.007-.107-.079ZM172.299 26.22c9.364-6.058 5.161-12.039-12.304-17.51-11.656-3.653-23.145-5.47-35.243-5.576-22.552-.198-33.577 7.462-21.321 14.814 12.012 7.205 32.994 10.557 61.531 9.831 4.563-.116 5.372-.288 7.337-1.559Z"
      />
    </svg>
  );
}

function CheckIcon({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      aria-hidden="true"
      className={clsx(
        "h-6 w-6 flex-none fill-current stroke-current",
        className
      )}
      {...props}
    >
      <path
        d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
        strokeWidth={0}
      />
      <circle
        cx={12}
        cy={12}
        r={8.25}
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Plan({
  name,
  price,
  description,
  features,
  featured = false,
}: {
  name: string;
  price: string;
  description: string;
  features: Array<string>;
  featured?: boolean;
}) {
  const matches = useMediaQueryCustom("(max-width: 500px)");

  return (
    <section
      className={matches ? "h-[413px] w-[343px]" : "h-[525px] w-[866px]"}
      style={{
        backgroundImage: `${
          matches ? `url(${bgMobile.src})` : `url(${bg.src})`
        }`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div>
        <h3
          className={`${
            matches
              ? "mb-6 max-w-[190px] text-xl"
              : "mb-10 max-w-[433px] text-4xl"
          }  mt-2 w-full rounded-3xl border border-white py-3  text-center  text-white`}
        >
          {name}
        </h3>
        <p
          className={clsx(
            "ml-6 text-lg",
            featured ? "text-white" : "text-slate-400"
          )}
        >
          {description}
        </p>
      </div>
      <ul
        role="list"
        className={clsx(
          `ml-6 flex flex-col ${
            matches ? "mt-2 gap-y-3" : "mt-10 gap-y-8"
          } text-base`,
          featured ? "text-white" : "text-slate-200"
        )}
      >
        {features.map((feature) => (
          <li key={feature} className="flex items-center">
            <CheckIcon className={featured ? "text-white" : "text-slate-400"} />
            {/*<div className="h-4 w-4 rounded-full bg-zinc-300 sm:h-6 sm:w-6" />*/}
            <span className="ml-4">{feature}</span>
          </li>
        ))}
        <li className="flex items-center">
          <CheckIcon className={featured ? "text-white" : "text-slate-400"} />
          {/*<div className="h-4 w-4 rounded-full bg-zinc-300 sm:h-6 sm:w-6"/>*/}
          <div className="flex flex-col sm:flex-row">
            <div className="ml-4 inline-flex h-5 w-fit items-center justify-center gap-2.5 rounded-lg   bg-[#00DEEC] px-2 py-0.5">
              <div className="font-['Space Mono'] text-center text-[10px] font-normal leading-none text-white">
                Coming Soon
              </div>
            </div>
            <span className="ml-4">Access to options scanner</span>
          </div>
        </li>
        <p className="font-display mb-4 text-5xl font-extrabold tracking-tight text-white">
          {price}
        </p>
      </ul>
      <Button
        variant="blue"
        className={`absolute ${
          matches
            ? "right-10 mt-[-40px] max-w-[120px] py-3"
            : "right-[15%] mt-[-10px] max-h-[48px] w-full max-w-[252px] py-5"
        } w-full justify-center`}
        onClick={() => void signIn()}
        aria-label={`Get started with the ${name} plan for ${price}`}
      >
        Get started
      </Button>
    </section>
  );
}

export function Pricing() {
  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="bg-[#221D28] py-16 sm:py-20"
    >
      <Container className="flex flex-col items-center justify-center gap-6 md:flex-row">
        <div className="w-full max-w-[321px]">
          <h2 className="text-3xl tracking-tight text-white sm:text-4xl">
            <span className=" font-bold">
              Simple pricing,
              <br />
            </span>
            <span className="w-full font-semibold text-[#fff]">
              for everyone
            </span>
          </h2>
        </div>
        <Plan
          featured
          name="OpCalc Pro"
          price="$14.99"
          description="Perfect for the serious trader"
          features={[
            "Ad-Free Calculator",
            "Access to stock & options tracker",
            "access to options backtester",
          ]}
        />
      </Container>
    </section>
  );
}
