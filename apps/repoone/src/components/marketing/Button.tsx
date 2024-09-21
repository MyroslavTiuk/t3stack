import React from "react";

export enum ButtonVariants {
  white = "white",
  dark = "dark",
  purple = "purple",
  blue = "blue",
  outlined = "outlined",
}

const classTypes = (disabled: boolean) => ({
  [ButtonVariants.white]: `text-[#2D78C8] ${
    disabled ? "bg-grey" : "bg-white"
  } bg-white"`,
  [ButtonVariants.dark]: `text-white ${
    disabled ? "bg-grey" : "bg-black"
  } bg-black"`,
  [ButtonVariants.purple]: `text-white ${
    disabled ? "bg-grey" : "bg-[#4E57EF]"
  } bg-white"`,
  [ButtonVariants.blue]: `text-white ${
    disabled ? "bg-grey" : "bg-[#2D78C8]"
  } bg-[#2D78C8]"`,
  [ButtonVariants.outlined]: `text-white${disabled ? "/30" : ""} ${
    disabled ? "" : "hover:bg-neutral-500 hover:bg-opacity-10"
  } border-2 border-white`,
});

const Button: React.FC<Props> = ({
  children,
  icon,
  onClick,
  variant = ButtonVariants.white,
  className = "",
  disabled = false,
}) => {
  const buttonClassName = `flex items-center gap-2 rounded-3xl px-4 py-2 text-xs font-semibold no-underline drop-shadow transition duration-150 ease-in-out lg:text-sm ${
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
