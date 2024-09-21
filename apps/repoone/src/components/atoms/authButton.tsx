import Image from "next/image";
import { signIn } from "next-auth/react";

export function GoogleSignInButton() {
  const handleClick = () => signIn("google");

  return (
    <button
      onClick={handleClick}
      className="focus:shadow-outline mt-4 flex h-14 w-full items-center justify-center rounded-lg border-2 border-white bg-[#F5F4F7] px-6 text-xl font-semibold text-black transition-colors duration-300"
    >
      <Image src="/google_logo.png" alt="google logo" width={20} height={20} />
      <span className="ml-4">Sign up with Google</span>
    </button>
  );
}
