import { Fragment, useState, useEffect } from "react";
import Checkbox from "~/components/atoms/Checkbox";

const AddClosingPosition: React.FC<Props> = ({ actions }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
  };

  useEffect(() => {
    if (isChecked) {
      actions.onClick();
      setIsChecked(false);
    }
  }, [isChecked, actions]);

  return (
    <>
      <Checkbox
        id="closing"
        checked={isChecked}
        title="Add closing Trade"
        onChange={handleCheckboxChange}
      />
      {/*{isChecked ? null : (*/}
      {/*  <div>*/}
      {/*    <label className="mt-4 flex h-11 cursor-pointer items-center gap-2 rounded-lg px-3 py-2 no-underline drop-shadow transition duration-150 ease-in-out hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:bg-blue/50 md:px-2">*/}
      {/*      <span className="sr-only">Add another leg</span>*/}
      {/*      <input*/}
      {/*        type="checkbox"*/}
      {/*        checked={isChecked}*/}
      {/*        onChange={handleCheckboxChange}*/}
      {/*      />*/}
      {/*      <span className="ml-2">Add closing Trade</span>*/}
      {/*    </label>*/}
      {/*  </div>*/}
      {/*)}*/}
    </>
  );
};

type Props = { actions: { label: string; onClick: () => void } };

export default AddClosingPosition;
