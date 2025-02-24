import { Background } from "@/components/Background";
import { ChatInterface } from "@/components/ChatInterface";
import { useState } from "react";

const Index = () => {
  return (
    <div className="h-screen flex items-center justify-center overflow-hidden">
      <Background />
      <ChatInterface />
    </div>
  );
};

export default Index;
