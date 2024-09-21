import { type NextPage } from "next";

import BackTesterSettingForm from "~/components/log/import/manual/backTesterSettingForm";

const BackTester: NextPage = () => {
  return (
    <>
      <div className="flex min-h-[100vh] flex-col justify-start gap-4 bg-gray-100 p-4">
        <BackTesterSettingForm />
      </div>
    </>
  );
};

export default BackTester;
