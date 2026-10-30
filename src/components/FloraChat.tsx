import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Cpu,
  Sprout,
  X,
  Copy,
  Check,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { ChatMessage, PlantIdentification } from '../types/plant';

interface FloraChatProps {
  currentPlantContext: PlantIdentification | null;
  onClearPlantContext: () => void;
}

export const FloraChat: React.FC<FloraChatProps> = ({
  currentPlantContext,
  onClearPlantContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm **FloraBot**, your master horticulturist and botanical doctor. 🌿

I can help you diagnose leaf discoloration, dial in custom watering and lighting schedules, formulate organic soil mixes, explain propagation techniques, and ensure pet safety.

${currentPlantContext ? `I see you're currently examining **${currentPlantContext.commonName}** (*${currentPlantContext.scientificName}*). Feel free to ask me anything specific about it!` : 'How can I assist your garden or indoor jungle today?'}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.8-flash',
    },
  ]);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const starterPrompts = [
    currentPlantContext
      ? `How do I treat the ${currentPlantContext.healthDiagnosis?.issueDetected || 'stress'} on my ${currentPlantContext.commonName}?`
      : 'Why are the tips of my indoor plant leaves turning brown and crispy?',
    'What is the ideal DIY soil recipe for tropical houseplants?',
    'How do I eliminate fungus gnats naturally using organic methods?',
    'Which beautiful indoor plants are completely safe for curious cats?',
    'When and how should I take stem cuttings for water propagation?',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isSending) return;

    setErrorMsg(null);
    setInput('');

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsSending(true);

    try {
      // Determine task type based on model selection
      let taskType = 'general';
      if (selectedModel === 'gemini-4-argon') taskType = 'complex';
      if (selectedModel === 'gemini-3.1-flash-lite') taskType = 'fast';

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory
            .filter((m) => m.role === 'user' || m.role === 'assistant')
            .map((m) => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              content: m.content,
            })),
          model: selectedModel,
          taskType,
          plantContext: currentPlantContext,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get response from Gemini.');
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMsg(err.message || 'Something went wrong while chatting with FloraBot.');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat history reset. How can I help with your plants today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      },
    ]);
  };

  // Helper to render basic markdown bold and bullet points nicely
  const formatBotMessage = (content: string) => {
    return content.split('\n').map((line, idx) => {
      // Bold replacement
      const parsedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      const italicLine = parsedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');

      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li
            key={idx}
            className="ml-4 list-disc text-stone-700 leading-relaxed my-1"
            dangerouslySetInnerHTML={{ __html: italicLine.replace(/^[-*]\s+/, '') }}
          />
        );
      }
      if (/^\d+\.\s+/.test(line.trim())) {
        return (
          <div
            key={idx}
            className="ml-2 font-medium text-stone-800 leading-relaxed my-1 flex items-start gap-1.5"
            dangerouslySetInnerHTML={{ __html: italicLine }}
          />
        );
      }
      if (line.trim().startsWith('### ')) {
        return (
          <h4
            key={idx}
            className="font-bold text-emerald-950 text-base mt-3 mb-1"
            dangerouslySetInnerHTML={{ __html: italicLine.replace(/^###\s+/, '') }}
          />
        );
      }
      if (line.trim().startsWith('## ')) {
        return (
          <h3
            key={idx}
            className="font-bold text-emerald-950 text-lg mt-4 mb-2 font-serif-plant"
            dangerouslySetInnerHTML={{ __html: italicLine.replace(/^##\s+/, '') }}
          />
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p
          key={idx}
          className="text-stone-700 leading-relaxed my-1"
          dangerouslySetInnerHTML={{ __html: italicLine }}
        />
      );
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[750px] bg-white rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-900/5 overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700/80 border border-emerald-500/30 flex items-center justify-center text-white shadow-inner">
            <Bot className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-plant font-bold text-lg text-white">
                FloraBot
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-700 text-emerald-200 border border-emerald-500/30">
                Master Horticulturist
              </span>
            </div>
            <p className="text-xs text-emerald-200/90">
              Multi-turn plant care advice, disease diagnosis &amp; cultivation
            </p>
          </div>
        </div>

        {/* Model switcher & Chat reset */}
        <div className="flex items-center gap-2">
          {/* Model selector dropdown */}
          <div className="flex items-center gap-1.5 bg-emerald-950/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-700/50 text-xs">
            <Cpu className="w-3.5 h-3.5 text-emerald-300" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={isSending}
              className="bg-transparent text-emerald-100 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="gemini-4-argon" className="bg-stone-900 text-white">
                Gemini 4 Argon (Complex Tasks)
              </option>
              <option value="gemini-3.8-flash" className="bg-stone-900 text-white">
                Gemini 3.8 Flash (General Tasks)
              </option>
              <option value="gemini-3.1-flash-lite" className="bg-stone-900 text-white">
                Gemini 3.1 Flash-Lite (Fast Tasks)
              </option>
            </select>
          </div>

          <button
            onClick={clearChat}
            disabled={isSending}
            title="Clear Chat History"
            className="p-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-950 text-emerald-200 hover:text-white transition-all border border-emerald-700/40"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Context Banner (If inspecting a plant) */}
      {currentPlantContext && (
        <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-950">
          <div className="flex items-center gap-2 truncate">
            <Sprout className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-semibold">Linked Plant Context:</span>
            <span className="font-bold underline truncate">
              {currentPlantContext.commonName} ({currentPlantContext.scientificName})
            </span>
            <span className="hidden sm:inline text-stone-500">
              • Status: {currentPlantContext.healthStatus}
            </span>
          </div>
          <button
            onClick={onClearPlantContext}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-emerald-100 transition-all shrink-0 ml-2"
            title="Remove plant context"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-50/40">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex gap-3 max-w-[88%] sm:max-w-[80%] ${
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                  isUser
                    ? 'bg-emerald-800 text-white'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-emerald-700" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1">
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed shadow-xs relative group ${
                    isUser
                      ? 'bg-emerald-800 text-white rounded-tr-xs'
                      : 'bg-white text-stone-800 border border-emerald-100/80 rounded-tl-xs shadow-xs'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className="space-y-1">{formatBotMessage(message.content)}</div>
                  )}

                  {/* Copy button on hover for bot messages */}
                  {!isUser && (
                    <button
                      onClick={() => copyToClipboard(message.id, message.content)}
                      className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy response"
                    >
                      {copiedId === message.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Subtext info */}
                <div
                  className={`flex items-center gap-2 text-[10px] text-stone-400 px-1 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{message.timestamp}</span>
                  {!isUser && message.modelUsed && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">{message.modelUsed}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isSending && (
          <div className="flex gap-3 max-w-[80%] mr-auto items-center">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white border border-emerald-100 text-xs text-stone-500 flex items-center gap-2 shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>FloraBot is consulting botanical references...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts */}
      {messages.length <= 2 && (
        <div className="px-4 py-2.5 bg-stone-50/70 border-t border-stone-100 overflow-x-auto">
          <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-emerald-600" />
            Suggested Questions:
          </p>
          <div className="flex gap-2 pb-1">
            {starterPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isSending}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-xs text-stone-700 hover:text-emerald-950 font-medium transition-all shadow-2xs shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-stone-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-end gap-2"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            placeholder="Ask FloraBot about symptoms, watering, pruning, soil mixes, pests... (Press Enter to send)"
            rows={1}
            className="flex-1 px-4 py-3 rounded-2xl border border-stone-200 bg-stone-50/60 focus:bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all resize-none max-h-32 placeholder:text-stone-400"
          />

          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className={`p-3.5 rounded-2xl font-bold transition-all shrink-0 ${
              isSending || !input.trim()
                ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-md shadow-emerald-800/20 active:scale-95'
            }`}
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-stone-400 mt-2 text-center">
          Powered by Gemini AI (Argon, Flash, &amp; Flash-Lite) • Provides organic &amp; scientific botanical guidance
        </p>
      </div>
    </div>
  );
};
