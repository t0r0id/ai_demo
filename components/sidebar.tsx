"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Montserrat } from "next/font/google";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { tools } from "@/shared/constants";
import FreeCounter from "./free-counter";
import { checkSubscription } from "@/lib/subscription";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

interface SidebarProps {
  apiLimitCount: number;
  isPro: boolean;
}

const Sidebar = ({ apiLimitCount = 0, isPro = false }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <div
      className="flex flex-col py-4 text-white
    space-y-4 bg-[#111827] h-screen"
    >
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
            <Image fill alt="Logo" src="/logo.png" />
          </div>
          <h1 className={cn("text-2xl font-bold", montserrat.className)}>
            T0r0!d
          </h1>
        </Link>
        <div className="space-y-2">
          {Object.entries(tools).map(([key, tool]) => (
            <Link
              href={tool.href}
              key={tool.href}
              className={cn(
                `text-sm group flex p-3 w-full 
            justify-start font-medium cursor-pointer
            hover:text-white hover:bg-white/10 rounded-lg
            transition
            `,
                pathname === tool.href
                  ? "bg-white/10 text-white"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <tool.icon className={cn(tool.color, "h-5 w-5 mr-3")} />
                {tool.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      {!isPro && <FreeCounter apiLimitCount={apiLimitCount} />}
    </div>
  );
};

export default Sidebar;
