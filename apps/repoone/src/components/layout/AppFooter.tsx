import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="flex gap-4 bg-[#2B2634] px-8 py-2 text-xs text-white sm:text-base">
      <Link href="/">Home</Link>
      <Link href="/legal-and-privacy">Legal & Privacy</Link>
      <Link href="/legal-and-privacy">Options rist & disclosure</Link>
      <p>@ 2024 Options Profit Calculator</p>
    </footer>
  );
}
