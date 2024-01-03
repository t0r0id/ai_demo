export const MAX_FREE_COUNTS = 5;

import {
    Code,
    ImageIcon,
    LayoutDashboard,
    MessageSquare,
    Music,
    Settings,
    VideoIcon,
  } from "lucide-react";
import { ToolType } from "@/shared/types";

export const tools: Record<string,ToolType>= {
    dashboard: {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
        bgColor: "bg-sky-500/10",
        displayOnDashboard: false,
        isTool: false,
      },
    conversation: {
      label: "Conversation",
      icon: MessageSquare,
      description: "Our most advanced conversational model.",
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
      href: "/conversation",
      displayOnDashboard: true,
      isTool: true,
    },
    // music: {
    //   label: "Music Generation",
    //   icon: Music,
    //   description: "Generate music from natural language.",
    //   color: "text-emerald-500",
    //   bgColor: "bg-emerald-500/10",
    //   href: "/music",
    //   displayOnDashboard: true,
    //   isTool: true,
    // },
    image: {
      label: "Image Generation",
      icon: ImageIcon,
      description: "Generate images from natural language.",
      href: "/image",
      color: "text-pink-700",
      bgColor: "bg-pink-700/10",
      displayOnDashboard: true,
      isTool: true,
    },
    // video: {
    //   label: "Video Generation",
    //   icon: VideoIcon,
    //   href: "/video",
    //   color: "text-orange-500",
    //   bgColor: "bg-orange-500/10",
    //   displayOnDashboard: true,
    //   isTool: true,
    // },
    code: {
      label: "Code Generation",
      icon: Code,
      description: "Generate code from natural language.",
      href: "/code",
      color: "text-green-700",
      bgColor: "bg-green-700/10",
      displayOnDashboard: true,
      isTool: true,
    },
    settings: {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      color: "",
      bgColor: "",
      displayOnDashboard: true,
      isTool: false,
    },
};