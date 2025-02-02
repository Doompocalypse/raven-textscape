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
        "max-w-[80%] p-4 rounded-2xl mb-4",
        isUser
          ? "ml-auto bg-raven-accent text-white rounded-br-none"
          : "bg-raven-light text-white rounded-bl-none"
      )}
    >
      <p className="text-sm md:text-base">{content}</p>
    </div>
  );
};