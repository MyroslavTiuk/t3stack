import React from "react";

const TooltipContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="rounded-lg bg-neutral-200 p-1 shadow-md">{children}</div>
  );
};

type Props = {
  children: React.ReactNode;
};

export default TooltipContainer;
