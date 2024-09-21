import { ScannerTable } from "~/components/scanner/Table";
import MakeScan from "~/components/scanner/card/MakeScan";
import PreMadeScan from "~/components/scanner/card/PreMadeScan";
import { useMediaQueryCustom } from "~/utils/Hooks/useMediaQueryCustom";
import { featureFlags } from "~/utils/featureFlags";

export default function ScannerIndex() {
  const matches = useMediaQueryCustom("(max-width: 500px)");
  if (featureFlags.hideScanner) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-4xl">You made a wrong turn!</h1>
      </div>
    );
  }
  return (
    <>
      <div className="mt-10 flex min-h-[100vh] w-full flex-col justify-start gap-4 bg-gray-100 p-4 lg:ml-64 lg:w-[87.5vw]">
        <h1 className="p-6 text-center text-2xl ">
          Welcome First_Name, let’s go find some options
        </h1>
        <div className={`${matches ? "flex-col" : "flex"} gap-5 font-sans `}>
          <MakeScan />
          <PreMadeScan />
        </div>
        <ScannerTable />
      </div>
    </>
  );
}
