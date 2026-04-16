import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { askAI } from '../services/gemini';
import { ChatMessage } from '../types';
import { cn } from '../lib/utils';

export function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Olá! Eu sou o assistente do Radar. Como posso te ajudar a ganhar dinheiro hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const response = await askAI(userMsg, messages);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[75vh] bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
      <div className="p-4 border-bottom border-white/10 bg-white/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-400/20 flex items-center justify-center">
          <Bot className="text-green-400" size={24} />
        </div>
        <div>
          <h3 className="text-white font-bold">Consultor IA</h3>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Online</span>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "flex gap-3 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-blue-500/20" : "bg-green-400/20"
            )}>
              {msg.role === 'user' ? <User size={16} className="text-blue-400" /> : <Bot size={16} className="text-green-400" />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed",
              msg.role === 'user' ? "bg-blue-500 text-white" : "bg-white/10 text-gray-200"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-green-400" />
            </div>
            <div className="bg-white/10 p-4 rounded-2xl flex gap-1">
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-black/20 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Como posso ganhar dinheiro hoje?"
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-green-400/50 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="w-12 h-12 rounded-2xl bg-green-400 flex items-center justify-center text-black hover:bg-green-300 transition-colors disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
