import React, { useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { Send } from "lucide-react";

export const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { content: "What is the contact address for $TEST token?", isUser: true },
    {
      content:
        "The contract address for $TEST is 86EvFgXebSbpBHtaXboqie9RnopuoXVPkE4N5ncdpump.",
      isUser: false,
    },
    { content: "What is your name?", isUser: true },
    {
      content:
        "I'm Raven, your go-to gal for all things Doompocalypse. What can I hook you up with today?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { content: input, isUser: true }]);
    setInput("");
    setIsTyping(true);

    // Simulate RAVEN's response
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          content: "I'm processing your request through the wasteland's network...",
          isUser: false,
        },
      ]);
    }, 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto h-[600px] bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 shadow-2xl animate-float">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              content={message.content}
              isUser={message.isUser}
            />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
        <div className="p-4 bg-white/5 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="How can I assist you today?"
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-raven-accent"
            />
            <button
              onClick={handleSend}
              className="bg-raven-accent hover:bg-raven-accent/80 text-white rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-raven-accent"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};