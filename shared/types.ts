import { LucideIcon } from "lucide-react";

export type ToolType = {
    label: string;
    icon: LucideIcon;
    description?: string;
    color: string;
    bgColor: string;
    href: string;
    displayOnDashboard: boolean;
    isTool: boolean
}

export type ConversationMessageType = {
    role: "user" | "bot";
    content: string;
}