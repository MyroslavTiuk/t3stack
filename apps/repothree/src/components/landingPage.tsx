import feature_1 from "~/images/feature_1.png";
import feature_2 from "~/images/feature_2.png";
import feature_3 from "~/images/feature_3.png";
import { signIn } from "next-auth/react";
import Image from "next/image";

const footerNavigation = {
  legal: [
    { name: "Privacy", href: "/legal/privacy" },
    { name: "Terms", href: "/legal/terms" },
  ],
};

const LandingPage: React.FC = () => {
  return (
    <div className="overflow-hidden bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex items-center lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <Image
                className="ml-2"
                src="/android-chrome-192x192.png"
                alt="Track Greeks Logo"
                width={40}
                height={40}
              />
            </a>
            <p className="ml-2 text-lg font-extrabold tracking-tight text-teal-600">
              Track Greeks
            </p>
          </div>
          <div className="flex justify-end">
            <button
              className="rounded-full bg-red-400 px-4 py-3 font-semibold text-white no-underline transition hover:bg-red-400/70 lg:px-10"
              onClick={() => void signIn()}
            >
              {"Log in"}
            </button>
          </div>
        </nav>
      </header>

      <main className="isolate">
        <div className="relative pt-14">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-teal-200 to-teal-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div className="py-24 sm:py-32 ">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Track your options portfolio with confidence
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Trackgreeks is a stock & options tracker that helps you
                  organize & gain deeper insights to your portfolio. Get started
                  today with a special 1 month free trial for being one of the
                  first users of our application
                </p>
                <div className="mt-8 flex w-full items-center justify-center">
                  <button
                    onClick={() => void signIn()}
                    className="w-full rounded-full bg-teal-600 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                  >
                    GET 1 MONTH FREE NOW
                  </button>
                </div>
              </div>

              <div className="px-6 pb-24 pt-20 sm:pb-32 lg:flex lg:px-8 lg:py-40">
                <h3 className="text-center text-3xl">
                  Log All Of Your Option & Stock Trades
                </h3>
                <div className="mt-16 flex sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 xl:ml-32">
                  <div className="max-w-xl flex-none sm:max-w-none">
                    <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                      <Image
                        src={feature_1}
                        width={2432}
                        height={1442}
                        className="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
                        alt="Screenshot of trading log"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-24 pt-20 sm:pb-32 lg:flex lg:px-8 lg:py-40">
                <div className="flex flex-col items-center">
                  <h3 className="text-center text-3xl">
                    Automatically Pull In Your Trades From TD Ameritrade{" "}
                  </h3>
                  <p className="text-lg">(more brokers coming soon)</p>
                </div>
                <div className="mt-16 flex sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 xl:ml-32">
                  <div className="max-w-xl flex-none sm:max-w-none">
                    <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                      <Image
                        src={feature_2}
                        width={2432}
                        height={1442}
                        className="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
                        alt="Screenshot of TD Ameritrade import"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-24 pt-20 sm:pb-32 lg:flex lg:px-8 lg:py-40">
                <h3 className="text-center text-3xl">
                  Gain Deeper Insights From Your Trading Activity
                </h3>
                <div className="mt-16 flex sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 xl:ml-32">
                  <div className="max-w-xl flex-none sm:max-w-none">
                    <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                      <Image
                        src={feature_3}
                        width={2432}
                        height={1442}
                        className="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
                        alt="Screenshot of TD Ameritrade import"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full items-center justify-center">
              <button
                onClick={() => void signIn()}
                className="w-96 rounded-full bg-teal-600 py-2.5 text-center text-lg font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                GET 1 MONTH FREE NOW
              </button>
            </div>
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-teal-200 to-teal-600 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
      </main>

      <div className="mx-auto max-w-7xl px-12 lg:px-24">
        <footer
          aria-labelledby="footer-heading"
          className="relative border-t border-gray-900/10 py-10"
        >
          <h2 id="footer-heading" className="sr-only">
            Footer
          </h2>
          <div className="flex flex-wrap gap-10 md:gap-24">
            <div className="flex items-center">
              <Image
                src="/android-chrome-192x192.png"
                alt="Track Greeks Logo"
                width={40}
                height={40}
              />
              <p className="ml-2 text-lg font-extrabold tracking-tight text-teal-600">
                Track Greeks
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 text-gray-900">
                Legal
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                {footerNavigation.legal.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 text-gray-900">
                Contact
              </h3>
              <div className="mt-6 space-y-4">
                <a
                  className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                  href="mailto:trackgreeks@gmail.com"
                >
                  trackgreeks@gmail.com
                </a>
                <p className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                  © {new Date().getFullYear()} TrackGreeks LLC
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
