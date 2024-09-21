import React, { useState } from "react";

type ButtonGroupProps = {
  first: string;
  second: string;
  active: boolean;
  onButtonClick: () => void;
};

const ButtonGroup = ({
  first,
  second,
  active,
  onButtonClick,
}: ButtonGroupProps) => {
  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <button
        type="button"
        className={`inline-flex items-center rounded-s-lg border border-gray-200 px-8 py-2 text-sm font-medium text-gray-500 ${
          active ? "bg-gray-100 text-gray-900 focus:z-10" : "bg-white"
        }`}
        onClick={onButtonClick}
      >
        {first}
      </button>
      <button
        type="button"
        className={`inline-flex items-center rounded-e-lg border border-gray-200 px-8 py-2 text-sm font-medium text-gray-500 ${
          !active ? "bg-gray-100 text-gray-900 focus:z-10" : "bg-white "
        }`}
        onClick={onButtonClick}
      >
        {second}
      </button>
    </div>
  );
};

type ButtonGroupsProps = {
  groups: { first: string; second: string }[];
};

const ButtonGroups = ({ groups }: ButtonGroupsProps) => {
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);

  const handleButtonClick = (index: number) => {
    setActiveGroupIndex(index);
  };

  return (
    <div>
      {groups.map((group, index) => (
        <ButtonGroup
          key={index}
          first={group.first}
          second={group.second}
          active={index === activeGroupIndex}
          onButtonClick={() => handleButtonClick(index)}
        />
      ))}
    </div>
  );
};

export default ButtonGroups;
