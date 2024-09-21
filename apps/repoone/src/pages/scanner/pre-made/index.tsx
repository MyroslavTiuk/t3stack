import React from "react";
import TableScanner from "~/components/scanner/tables/TableScanner";
import { featureFlags } from "~/utils/featureFlags";

const TabView = () => {
  if (featureFlags.hideScanner) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-4xl">You made a wrong turn!</h1>
      </div>
    );
  }
  return (
    <div>
      <TableScanner />
    </div>
  );
};

export default TabView;
