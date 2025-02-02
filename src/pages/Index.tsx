import { Background } from "@/components/Background";
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <Background />
      <ChatInterface />
    </div>
  );
};

export default Index;