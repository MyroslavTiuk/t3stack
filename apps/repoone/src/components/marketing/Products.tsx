import { Tab } from "@headlessui/react";
import ProductTab from "./Tab";
import Image from "next/image";
import afc from "../../../public/icons/MacBookPro16.svg";
import st from "../../../public/icons/MacBookPro16-1.svg";
import bt from "../../../public/icons/MacBookPro16-2.svg";
import jour from "../../../public/icons/MacBookPro16-3.svg";

const products = [
  {
    number: "01",
    title: "Add Free Calculator",
    description: "The Calculator web app with no ads",
  },
  {
    number: "02",
    title: "Track your option trades & profits",
    description:
      "Import your option trades and have a to-go source to track your profits",
  },
  {
    number: "03",
    title: "Backtester to prove your investment thesis",
    description: "Research and analyze your investment thesis",
  },
  {
    number: "04",
    title: "Find trades before the masses",
    description: "The Calculator web app with no ads",
  },
];
export default function Products() {
  return (
    <div className="flex flex-col-reverse items-center justify-between gap-6 px-8 py-32 md:flex-row lg:px-32">
      <Tab.Group>
        <Tab.List className="flex flex-col">
          {products.map((product) => (
            <Tab key={product.title} className="text-start focus:outline-none">
              {({ selected }) => (
                <ProductTab
                  number={product.number}
                  title={product.title}
                  isActive={selected}
                  description={product.description}
                />
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <Image
              // @ts-ignore
              src={afc}
              width={625}
              height={550}
              alt="product description"
              unoptimized
            />
          </Tab.Panel>
          <Tab.Panel>
            <Image
              // @ts-ignore
              src={bt}
              width={625}
              height={550}
              alt="product description"
              unoptimized
            />
          </Tab.Panel>
          <Tab.Panel>
            <Image
              // @ts-ignore
              src={st}
              width={625}
              height={550}
              alt="product description"
              unoptimized
            />
          </Tab.Panel>
          <Tab.Panel>
            <Image
              // @ts-ignore
              src={jour}
              width={625}
              height={550}
              alt="product description"
              unoptimized
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
