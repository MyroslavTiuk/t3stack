import { type StratName } from "opc-types/lib/StratName";
import React from "react";
import Strategies from "~/model/Strategies";
import Link from "next/link";

const Footer: React.FC = () => {
  const strats = Strategies.getStrategies();

  const CALCULATORS: [StratName, string][] = (
    Object.keys(strats) as StratName[]
  ).map((stratKey) => [stratKey, `${strats[stratKey].title} calculator`]);

  return (
    <div className="relative z-20">
      <footer className="bg-dark p-4">
        <div className="m-auto max-w-7xl py-10">
          <div className="pb-10">
            <h3 className="pb-2 text-2xl text-white">
              <Link href="/calculator">All Calculators</Link>
            </h3>
            <ul className="grid grid-cols-4">
              {CALCULATORS.map((linkInfo) => (
                <li key={linkInfo[0]}>
                  <Link
                    className="cursor-pointer text-sm text-sky-200 hover:underline"
                    href={`/calculator/${linkInfo[0]}`}
                  >
                    {linkInfo[1]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="pb-10">
            <h3 className="pb-2 text-2xl text-white">Help</h3>
            <ul className="grid grid-cols-4">
              <li key="help-calculator-faq">
                <Link
                  className="cursor-pointer text-sky-200"
                  href="/calculator/faq"
                >
                  Frequently asked questions
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="py-8">
          <p className="text-center text-white">
            © Options Calculator 2008-{new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
