import React from "react";

const Tooltip: React.FC<Props> = ({ message, children }) => {
  return (
    <div className="group relative z-10 flex cursor-pointer justify-center">
      {children}
      <span className="absolute top-7 w-40 scale-0 rounded bg-neutral-200 p-2 text-xs transition-all group-hover:scale-100">
        {message}
      </span>
    </div>
  );
};

type Props = {
  message: string;
  children: React.ReactNode;
};

export default Tooltip;
