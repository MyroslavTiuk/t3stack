import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const LinkList: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const router = useRouter();

  const links = [
    {
      name: "Log",
      href: "/trade-logs",
    },
    {
      name: "Strategies",
      href: "/strategy",
    },
    {
      name: "Portfolio",
      href: "/portfolio",
    },
  ];

  return (
    <ul className="flex w-full flex-col sm:flex-row sm:gap-20">
      {links.map((link, idx) => (
        <li className="flex w-full" key={link.href}>
          <Link
            className={`h-20 w-full border-b ${
              idx === 0 ? "border-t" : ""
            } pt-6 text-center sm:h-10 sm:border-none sm:pt-2 ${
              router.pathname === link.href ? "text-orange" : ""
            }`}
            href={link.href}
            onClick={onClick}
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default LinkList;
