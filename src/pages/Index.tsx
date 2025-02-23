import { Background } from "@/components/Background";
import { ChatInterface } from "@/components/ChatInterface";
import { useState } from "react";

const Index = () => {
  const [selectedModel, setSelectedModel] = useState<string>("gpt-3.5-turbo");

  return (
    <div className="h-screen flex items-center justify-center overflow-hidden">
      <Background />
      <ChatInterface selectedModel={selectedModel} />
      {/* AI Model Selection Dropdown */}
      <div className="relative  mx-autoss bg-black rounded-[1rem] border-4 border-white/10 overflow-hhidden">
        <div className="mt-2">
          <select
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-black border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-raven-accent">
            <option value="gpt-3.5-turbo">GPT 3.5 Turbo</option>
            <option value="deepseek">Deepseek </option>
            <option value="gpt-4o-mini">GPT 4o Mini</option>
            <option value="gpt-4o">GPT 4o</option>
            <option value="gpt-4-turbo">GPT 4 Turbo</option>
            <option value="gpt-4">GPT 4</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Index;
