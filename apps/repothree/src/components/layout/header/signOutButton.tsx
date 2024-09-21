import React from "react";
import { signOut } from "next-auth/react";

const SignOutButton: React.FC = () => {
  return (
    <button
      className="w-full rounded-lg bg-teal-600 py-3 font-semibold text-white no-underline transition hover:bg-teal-600/70"
      onClick={() => void signOut()}
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
