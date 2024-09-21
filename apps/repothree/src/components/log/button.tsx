import React from "react";

export enum ButtonVariants {
  primary = "primary",
  secondary = "secondary",
}

const classTypes = (disabled: boolean) => ({
  [ButtonVariants.primary]: `text-white ${
    disabled ? "bg-gray-900/30" : "bg-gray-900"
  } hover:bg-gray-700`,
  [ButtonVariants.secondary]: `text-black bg-white border-[1px] ${
    disabled ? "/30" : ""
  } hover:bg-gray-200`,
});

const Button: React.FC<Props> = ({
  children,
  icon,
  onClick,
  rightIcon = false,
  variant = ButtonVariants.primary,
  className = "",
  disabled = false,
}) => {
  const buttonClassName = `flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm no-underline transition duration-150 ease-in-out ${
    classTypes(disabled)[variant]
  } ${className}`;

  return (
    <button className={buttonClassName} onClick={onClick} disabled={disabled}>
      {!rightIcon && icon ? icon : null}
      {children}
      {rightIcon && icon ? icon : null}
    </button>
  );
};

type Props = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: keyof typeof ButtonVariants;
  rightIcon?: boolean;
  className?: string;
  disabled?: boolean;
};

export default Button;
