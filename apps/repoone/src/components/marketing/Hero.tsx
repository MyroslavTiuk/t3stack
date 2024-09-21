import { signIn } from "next-auth/react";
import Button from "./Button";
import { Container } from "./Container";
import background from "../../../public/hero-bg.webp";
import backgroundMobile from "../../../public/hero-mobile.webp";
import { useMediaQueryCustom } from "~/utils/Hooks/useMediaQueryCustom";
import { useEffect } from "react";

export function Hero() {
  const matches = useMediaQueryCustom("(max-width: 500px)");
  useEffect(() => {
    const defaultBackground = document.body.style.background;
    document.body.style.background = "white";
    return () => {
      document.body.style.background = defaultBackground;
    };
  }, []);
  return (
    <Container
      className="h-screen w-full bg-[#0D0010] pb-16 pt-8 text-white sm:pt-48"
      style={{
        backgroundImage: `${
          matches ? `url(${backgroundMobile.src})` : `url(${background.src})`
        }`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className={`${
          matches ? "items-center justify-center" : ""
        } mx-auto flex h-full max-w-7xl flex-col px-4 sm:px-0`}
      >
        <h1 className="font-display mb-8 text-4xl font-bold uppercase tracking-tight text-white sm:text-9xl">
          Options Trading
        </h1>
        <h1 className="font-display mb-8 text-4xl font-bold uppercase tracking-tight text-white sm:text-9xl">
          Made Simple
        </h1>
        <div className="mt-40 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <p className="w-full text-lg font-normal tracking-tight text-white sm:text-xl">
            Remove guesswork and emotions from your trades <br /> with our
            dedicated platform
          </p>
          <div className="flex w-full max-w-6xl justify-center gap-6 ">
            <Button
              className="w-full max-w-xs items-center justify-center sm:w-auto sm:max-w-none"
              variant="dark"
              onClick={() => void signIn()}
            >
              Learn More
            </Button>
            <Button
              className="w-full max-w-xs items-center justify-center sm:w-auto sm:max-w-none"
              variant="purple"
              onClick={() => void signIn()}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
