import React from 'react';
import { Save, Trash2, FileText, Plus, Copy, Send } from 'lucide-react';

interface PromptBuilderProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSendToChat?: (prompt: string) => void;
  fullScreen?: boolean;
}

const TEMPLATES = [
  { name: 'Basic Query', content: 'Explain [TOPIC] in simple terms for a beginner.' },
  { name: 'Code Review', content: 'Review the following code for performance, security, and readability:\n\n[CODE]' },
  { name: 'System Persona', content: 'You are an expert [ROLE] with 20 years of experience. Your goal is to [GOAL]. Always respond in a [TONE] tone.' },
  { name: 'Creative Writing', content: 'Write a [GENRE] story about [SUBJECT]. Include [ELEMENTS].' },
];

export default function PromptBuilder({ prompt, setPrompt, onSendToChat, fullScreen = false }: PromptBuilderProps) {
  const [history, setHistory] = React.useState<{ name: string; content: string }[]>(() => {
    const saved = localStorage.getItem('prompt_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [saveName, setSaveName] = React.useState('');

  React.useEffect(() => {
    localStorage.setItem('prompt_history', JSON.stringify(history));
  }, [history]);

  const handleSave = () => {
    if (!saveName.trim() || !prompt.trim()) return;
    setHistory(prev => [...prev, { name: saveName, content: prompt }]);
    setSaveName('');
  };

  const handleDelete = (index: number) => {
    setHistory(prev => prev.filter((_, i) => i !== index));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
  };

  return (
    <div className={`flex flex-col h-full ${fullScreen ? 'p-8 max-w-5xl mx-auto' : 'p-4'} space-y-6 bg-white/50`}>
      <div className="flex items-center justify-between">
        <h2 className={`font-bold text-zinc-800 ${fullScreen ? 'text-3xl' : 'text-lg'}`}>
          AI Prompt Builder
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-zinc-200 text-zinc-500 transition-colors"
            title="Copy to Clipboard"
          >
            <Copy size={18} />
          </button>
          {onSendToChat && (
            <button 
              onClick={() => onSendToChat(prompt)}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent/80 transition-all shadow-md text-sm font-bold"
            >
              <Send size={16} />
              {fullScreen ? 'Send to AI Assistant' : 'Send'}
            </button>
          )}
        </div>
      </div>

      {/* Templates */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Templates</label>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((t, i) => (
            <button
              key={i}
              onClick={() => setPrompt(t.content)}
              className="px-3 py-1.5 rounded-lg bg-white border border-secondary/30 text-xs font-medium text-zinc-600 hover:border-primary hover:text-primary transition-all shadow-sm"
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Builder Area */}
      <div className="flex-1 flex flex-col space-y-2">
        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Prompt Editor</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Construct your prompt here..."
          className="flex-1 w-full bg-white border border-secondary/50 rounded-2xl p-6 focus:outline-none focus:border-primary transition-colors resize-none shadow-inner font-mono text-sm leading-relaxed"
        />
      </div>

      {/* History Management */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="Save prompt as..."
            className="flex-1 bg-white border border-secondary/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
          />
          <button
            onClick={handleSave}
            disabled={!saveName.trim() || !prompt.trim()}
            className="p-2 rounded-xl bg-primary text-white hover:bg-primary/80 disabled:opacity-50 transition-all shadow-md"
          >
            <Save size={20} />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Saved History</label>
          <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-secondary/30">
            {history.length === 0 ? (
              <p className="text-xs text-zinc-400 italic py-4 text-center border border-dashed border-secondary/30 rounded-xl">
                No saved prompts yet.
              </p>
            ) : (
              history.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white border border-secondary/20 rounded-xl hover:border-primary/30 transition-all group">
                  <button 
                    onClick={() => setPrompt(item.content)}
                    className="flex-1 text-left text-sm font-medium text-zinc-700 hover:text-primary truncate"
                  >
                    {item.name}
                  </button>
                  <button 
                    onClick={() => handleDelete(i)}
                    className="p-1.5 text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
