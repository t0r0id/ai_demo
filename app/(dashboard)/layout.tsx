import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { getApiCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = async ({ children }: Props) => {
  const apiLimitCount = await getApiCount();
  const isPro = await checkSubscription();
  return (
    <div className="h-full w-full fixed top-0 bottom-0 left-0 flex flex-col">
      <div
        className="hidden h-full md:flex md:flex-col md:fixed
         bg-gray-900 md:w-72"
      >
        <div>
          <Sidebar apiLimitCount={apiLimitCount} isPro={isPro} />
        </div>
      </div>
      <div className="md:pl-72 flex flex-col h-full justify-start">
        <Navbar></Navbar>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
