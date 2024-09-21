import { GoogleSignInButton } from "~/components/atoms/authButton";
import Link from "next/link";

type CreateAccountFormProps = {
  csrfToken: any;
};

export default function CreateAccountForm({
  csrfToken,
}: CreateAccountFormProps) {
  return (
    <>
      <form action="/api/auth/signin/email" method="POST">
        <h2 className="font-raleway mt-10 text-center text-3xl font-semibold leading-9 text-gray-900">
          Create your account
        </h2>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <div className="mt-12">
          <label>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mb-6 mt-1 w-full rounded-md border-gray-900 bg-transparent px-4 py-3 text-gray-900 placeholder-gray-900"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <button
            type="submit"
            className="flex w-full transform justify-center rounded-md bg-blue p-3 text-sm font-semibold leading-6 text-white transition duration-300 ease-in-out hover:bg-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            Create Account
          </button>
        </div>
        <div className="mt-6">
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center justify-between"
              aria-hidden="true"
            >
              <div className="w-[43%] border-t border-black" />
              <div className="w-[43%] border-t border-black" />
            </div>
            <div className="relative flex justify-center font-medium leading-6">
              <span className="bg-transparent px-6 text-gray-900">or</span>
            </div>
          </div>
        </div>
      </form>
      <div className="mt-2 grid gap-4">
        <GoogleSignInButton />
      </div>
      <p className="mt-2 text-center text-sm">
        Already have an account?{" "}
        <Link className="text-[#0C08C2] hover:underline" href="/auth/login">
          Sign in
        </Link>
      </p>
    </>
  );
}
