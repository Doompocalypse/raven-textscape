import React from "react";

export const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 p-2 max-w-[80%] bg-white/10 rounded-2xl rounded-bl-md">
      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
    </div>
  );
};