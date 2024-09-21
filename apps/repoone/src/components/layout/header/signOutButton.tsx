import React from "react";
import { signOut } from "next-auth/react";

const SignOutButton: React.FC = () => {
  return (
    <button
      className="w-full rounded-lg bg-orange py-3 font-semibold text-white no-underline transition hover:bg-orange/70"
      onClick={() => void signOut()}
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
