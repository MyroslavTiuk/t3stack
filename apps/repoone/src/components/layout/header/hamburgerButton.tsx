import React from "react";

const HamburgerButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      className="ml-auto h-10 w-10 px-2 hover:text-neutral-700 focus:text-neutral-700 sm:hidden"
      type="button"
      aria-label="Toggle navigation"
      onClick={onClick}
    >
      <span className="[&>svg]:w-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-7 w-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </span>
    </button>
  );
};
export default HamburgerButton;
