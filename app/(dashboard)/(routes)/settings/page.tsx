import Heading from "@/components/heading";
import { SubscriptionButton } from "@/components/subscription-button";
import { checkSubscription } from "@/lib/subscription";
import { tools } from "@/shared/constants";
import { Subscript } from "lucide-react";

import React from "react";

const SettingsPage = async () => {
  const isPro = await checkSubscription();

  const tool = tools["settings"];
  return (
    <div className="flex flex-col h-full w-full justify-start overflow-auto">
      <div>
        <Heading
          title={tool.label}
          description={tool.description}
          icon={tool.icon}
          iconColor={tool.color}
          bgColor={tool.bgColor}
        />
      </div>
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isPro
            ? "You are currently on a pro plan."
            : "You are currently on a free plan."}
        </div>
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  );
};

export default SettingsPage;
