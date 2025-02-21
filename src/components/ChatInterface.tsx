
import React, { useState, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { Send, BatteryLow, SignalLow } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Array<{ content: string; isUser: boolean }>>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionId] = useState(() => crypto.randomUUID());
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Subscribe to message updates
  useEffect(() => {
    const channel = supabase
      .channel('message_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const { new: updatedMessage } = payload;
          if (updatedMessage.bot_response) {
            setIsTyping(false);
            setMessages(prev => {
              // Remove the last message if it was a loading message
              const filtered = prev.filter(msg => msg.content !== "I'm processing your request through the wasteland's network...");
              return [...filtered, { content: updatedMessage.bot_response, isUser: false }];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  // Load existing messages for this session
  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        toast({
          title: "Error loading messages",
          description: "There was a problem loading your chat history.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setMessages(data.map(msg => ({
          content: msg.is_user ? msg.content : (msg.bot_response || msg.content),
          isUser: msg.is_user
        })));
      }
    };

    loadMessages();
  }, [sessionId, toast]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { content: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Store user message in Supabase
    const { error: userMsgError } = await supabase
      .from('messages')
      .insert({
        content: input,
        is_user: true,
        session_id: sessionId,
        status: 'pending'
      });

    if (userMsgError) {
      console.error('Error saving user message:', userMsgError);
      toast({
        title: "Error saving message",
        description: "Your message couldn't be saved.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="relative w-[380px] h-[700px] mx-auto bg-black rounded-[3rem] border-4 border-white/10 shadow-2xl overflow-hidden">
      {/* Phone Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-40 bg-black rounded-b-2xl z-20"></div>
      
      {/* Status Bar */}
      <div className="relative h-12 bg-black flex items-center justify-between px-6 border-b border-white/10">
        <span className="text-white text-sm">{formatTime(currentTime)}</span>
        <div className="flex items-center space-x-2">
          <SignalLow className="w-4 h-4 text-white" />
          <span className="text-white text-sm">5G</span>
          <BatteryLow className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Chat Header */}
      <div className="bg-black/90 px-4 py-3 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-cover bg-center" 
               style={{ backgroundImage: "url('/lovable-uploads/62fd8eb1-f0c1-4a66-a3b6-f9588687db41.png')" }}>
          </div>
          <div>
            <h3 className="text-white font-medium">RAVEN</h3>
            <p className="text-white/60 text-sm">Your AI Virtual Plug</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="h-[calc(100%-8rem)] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/95 scrollbar-none">
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              content={message.content}
              isUser={message.isUser}
            />
          ))}
          {isTyping && <TypingIndicator />}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/90 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Message RAVEN..."
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
