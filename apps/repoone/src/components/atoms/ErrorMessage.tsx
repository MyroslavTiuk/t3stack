import React from "react";

const ErrorMessage: React.FC<Props> = ({ children }) => {
  return <p className="text-red-800">{children}</p>;
};

type Props = {
  children: React.ReactNode;
};

export default ErrorMessage;
