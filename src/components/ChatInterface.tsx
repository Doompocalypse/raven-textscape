import React, { useState, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { Battery, Signal } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const ChatInterface = () => {
  const [messages, setMessages] = useState<{ content: string; isUser: boolean }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = { content: inputMessage, isUser: true };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { content: "I'm here to assist you!", isUser: false }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-raven-dark text-white">
      {/* Header */}
      <div className="bg-black/20 p-4 flex items-center space-x-4">
        <img
          src="/lovable-uploads/bf5aa511-adfd-48e2-8692-950ee6d3b996.png"
          alt="Raven"
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Raven</h1>
          <p className="text-sm text-gray-400">Your AI Virtual Plug</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Signal className="w-4 h-4" />
          <span>5G</span>
          <Battery className="w-4 h-4" />
          <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <MessageBubble key={index} content={message.content} isUser={message.isUser} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-black/20">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white/10 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-raven-light"
          />
          <button
            type="submit"
            className="bg-raven-light rounded-full px-6 py-2 font-semibold hover:bg-opacity-90 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};