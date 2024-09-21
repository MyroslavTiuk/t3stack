import Button from "~/components/marketing/Button";
import { Container } from "./Container";
import backgroundMobile from "../../../public/CTA-mobile.webp";
import { useMediaQueryCustom } from "~/utils/Hooks/useMediaQueryCustom";
import background from "../../../public/CTA.webp";
import { signIn } from "next-auth/react";

export default function Banner() {
  const matches = useMediaQueryCustom("(max-width: 500px)");

  return (
    <Container
      className="w-full py-[136px] text-black"
      style={{
        backgroundImage: `${
          matches ? `url(${backgroundMobile.src})` : `url(${background.src})`
        }`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className={`${
          matches ? "" : "ml-[100px]"
        } flex flex-col items-center gap-24 sm:flex-row`}
      >
        <div
          className={`flex flex-col gap-4 ${
            matches ? "items-center justify-center" : ""
          }`}
        >
          <h2 className={`${matches ? "text-2xl" : "text-4xl"} font-semibold`}>
            Take Control of Your
            <br />
            Options Trading Now
          </h2>
          <p className="text-lg">Gain an edge with our software</p>
          <Button
            onClick={() => void signIn()}
            variant="blue"
            className="mt-4 w-full max-w-[252px] py-3"
          >
            <span className="mx-auto">Get Started Now</span>
          </Button>
        </div>
      </div>
    </Container>
  );
}
