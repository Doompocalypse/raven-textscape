
import { Background } from "@/components/Background";
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center overflow-auto py-8">
      <Background />
      <ChatInterface />
    </div>
  );
};

export default Index;
