import React from "react";

const Card: React.FC<Props> = ({ children, className }) => {
  return (
    <div
      className={`rounded-lg bg-neutral-50 p-4 shadow-md ${className ?? ""}`}
    >
      {children}
    </div>
  );
};

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default Card;
