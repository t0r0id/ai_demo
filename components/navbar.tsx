import React from "react";
import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "./mobile-sidebar";
import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";

import { cn } from "@/lib/utils";
import { getApiCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

type Props = {};

const Navbar = async (props: Props) => {
  const apiLimitCount = await getApiCount();
  const isPro = await checkSubscription();
  return (
    <div className="flex h-1/7 items-center p-4 justify-between bg-[#111827] text-white">
      <MobileSidebar apiLimitCount={apiLimitCount} isPro={isPro} />

      <Link href="/dashboard" className="flex items-center md:hidden">
        <div className="relative w-8 h-8 mr-4">
          <Image fill alt="Logo" src="/logo.png" />
        </div>
        <h1 className={cn("text-2xl font-bold", montserrat.className)}>
          T0r0!d
        </h1>
      </Link>

      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default Navbar;
