
import { Background } from "@/components/Background";
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  return (
    <div className="h-screen flex items-center justify-center overflow-hidden">
      <Background />
      <div className="my-4 sm:my-8 md:my-12">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;
