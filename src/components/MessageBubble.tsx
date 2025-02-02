import React from "react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  content: string;
  isUser?: boolean;
}

export const MessageBubble = ({ content, isUser }: MessageBubbleProps) => {
  return (
    <div
      className={cn(
        "max-w-[80%] p-3 rounded-2xl mb-2",
        isUser
          ? "ml-auto bg-raven-accent text-white rounded-br-md"
          : "bg-white/10 text-white rounded-bl-md"
      )}
    >
      <p className="text-sm">{content}</p>
    </div>
  );
};