"use client";
import { Sidebar } from "flowbite-react";
import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export function SidebarComponent() {
  const router = useRouter();
  const links = [
    {
      name: "Dashboard",
      href: "/",
      icon: () => (
        <Image src={`/home.svg`} alt="Trade Logs" width="20" height="20" />
      ),
    },
    {
      name: "Log",
      href: "/trade-logs",
      icon: () => (
        <Image src={`/book.svg`} alt="Trade Logs" width="20" height="20" />
      ),
    },
    {
      name: "Strategies",
      href: "/strategy",
      icon: () => (
        <Image src={`/book.svg`} alt="Trade Logs" width="20" height="20" />
      ),
    },
    {
      name: "Portfolio",
      href: "/portfolio",
      icon: () => (
        <Image src={`/chart-pie.svg`} alt="Trade Logs" width="20" height="20" />
      ),
    },
    {
      name: "Settings",
      href: "/settings",
      icon: () => (
        <Image src={`/cog.svg`} alt="Trade Logs" width="20" height="20" />
      ),
    },
  ];

  return (
    <div className="fixed hidden h-screen lg:block">
      <Sidebar aria-label="Default sidebar example">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            {links.map((link, idx) => (
              <Sidebar.Item
                key={idx}
                icon={link.icon}
                as={Link}
                href={link.href}
                onClick={() => {}}
                className={router.pathname === link.href ? "bg-gray-100" : ""}
              >
                {link.name}
              </Sidebar.Item>
            ))}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}
