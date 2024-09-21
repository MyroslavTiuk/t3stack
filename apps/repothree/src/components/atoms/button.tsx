import React from "react";

export enum ButtonVariants {
  primary = "primary",
  secondary = "secondary",
  outlined = "outlined",
}

const classTypes = (disabled: boolean) => ({
  [ButtonVariants.primary]: `text-white ${
    disabled ? "bg-teal-600/30" : "bg-teal-600"
  } hover:bg-teal-600/${disabled ? "30" : "70"}`,
  [ButtonVariants.secondary]: `text-white bg-red-400${
    disabled ? "/30" : ""
  } hover:bg-red-400/${disabled ? "30" : "70"} hover:bg-opacity-10`,
  [ButtonVariants.outlined]: `border-2 border-teal-600${
    disabled ? "/30" : ""
  } text-teal-600${disabled ? "/30" : ""} ${
    disabled ? "" : "hover:bg-neutral-500 hover:bg-opacity-10"
  }`,
});

const Button: React.FC<Props> = ({
  children,
  icon,
  onClick,
  variant = ButtonVariants.primary,
  className = "",
  disabled = false,
}) => {
  const buttonClassName = `flex items-center gap-2 rounded-lg  px-1 py-2 text-sm font-semibold no-underline drop-shadow transition duration-150 ease-in-out md:px-2 lg:text-base ${
    classTypes(disabled)[variant]
  } ${className}`;

  return (
    <button className={buttonClassName} onClick={onClick} disabled={disabled}>
      {icon && icon}
      {children}
    </button>
  );
};

type Props = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: keyof typeof ButtonVariants;
  className?: string;
  disabled?: boolean;
};

export default Button;
