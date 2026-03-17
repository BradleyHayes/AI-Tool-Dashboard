import React from 'react';
import { Send, Code, Globe, MessageSquare, Terminal, Search, Trash2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { generateResponse, generateCode, researchTopic } from '../../services/geminiService';
import { ChatMessage } from '../../types';

export default function AIAssistant() {
  const [activeTab, setActiveTab] = React.useState<'chat' | 'code' | 'research'>('chat');
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    let response = '';
    if (activeTab === 'chat') {
      response = await generateResponse(input);
    } else if (activeTab === 'code') {
      response = await generateCode(input);
    } else {
      response = await researchTopic(input);
    }

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: response,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-dashboard-bg text-zinc-800">
      {/* Tabs */}
      <div className="flex border-b border-secondary/30 bg-white/40">
        <TabButton 
          active={activeTab === 'chat'} 
          onClick={() => setActiveTab('chat')} 
          icon={<MessageSquare size={16} />} 
          label="Chat" 
        />
        <TabButton 
          active={activeTab === 'code'} 
          onClick={() => setActiveTab('code')} 
          icon={<Code size={16} />} 
          label="Code Assistant" 
        />
        <TabButton 
          active={activeTab === 'research'} 
          onClick={() => setActiveTab('research')} 
          icon={<Search size={16} />} 
          label="Web Research" 
        />
        <div className="flex-1" />
        <button 
          onClick={() => setMessages([])}
          className="px-4 py-2 text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-2 text-xs font-medium"
        >
          <Trash2 size={14} /> Clear History
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-secondary/30"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-300 space-y-4">
              <div className="p-6 rounded-full bg-white border border-secondary/20 shadow-sm">
                {activeTab === 'chat' && <MessageSquare size={48} className="text-primary" />}
                {activeTab === 'code' && <Terminal size={48} className="text-primary" />}
                {activeTab === 'research' && <Globe size={48} className="text-primary" />}
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-zinc-700">How can I help you today?</p>
                <p className="text-sm text-zinc-400">Ask me anything about development, research, or productivity.</p>
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                max-w-[80%] p-4 rounded-2xl border shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-primary/10 border-primary/30 text-zinc-800' 
                  : 'bg-white border-secondary/20 text-zinc-700'}
              `}>
                <div className="prose prose-sm max-w-none prose-zinc">
                  <Markdown>{msg.content}</Markdown>
                </div>
                <div className="mt-2 text-[10px] opacity-30 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-secondary/20 p-4 rounded-2xl flex gap-2 shadow-sm">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-secondary/30 bg-white/40">
          <div className="max-w-4xl mx-auto relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                activeTab === 'chat' ? "Type a message..." :
                activeTab === 'code' ? "Describe the code you need..." :
                "Enter a topic to research..."
              }
              className="w-full bg-white border border-secondary/50 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:border-primary transition-colors resize-none min-h-[60px] max-h-[200px] shadow-sm"
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 bottom-3 p-3 rounded-xl bg-accent text-white hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-center text-[10px] text-zinc-400 mt-3 uppercase tracking-widest font-bold">
            Aura AI Engine • Powered by Gemini
          </p>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`
        px-6 py-4 flex items-center gap-2 border-b-2 transition-all
        ${active 
          ? 'border-primary text-primary bg-primary/5' 
          : 'border-transparent text-zinc-400 hover:text-zinc-600 hover:bg-white/50'}
      `}
    >
      {icon}
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
}
