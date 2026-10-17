import { useState, useRef, useEffect } from 'react';
import { askAssistant, getSessionId } from '../api';
import { Send, Bot, User, Loader2, Sparkles, RotateCcw } from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  "What schemes are available for students?",
  "How to apply for a PM Mudra business loan?",
  "Tell me about PM KISAN Samman Nidhi for farmers",
  "What documents are required for post-matric scholarships?",
  "Are there welfare schemes for girl children?"
];

const Assistant = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I am your AccessMind AI Assistant. I can help you discover government welfare schemes, understand eligibility criteria, and prepare required application documents. How can I help you today?", 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = text.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), text: userMsg, sender: 'user' }]);
    setLoading(true);

    try {
      const sessionId = getSessionId();
      const res = await askAssistant(userMsg, sessionId);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: res.reply, 
        sources: res.sources,
        sender: 'bot' 
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "Sorry, I am having trouble connecting to the backend server. Please verify your connection or check if the backend is running.", 
        sender: 'bot',
        isError: true
      }]);
    }
    setLoading(false);
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const resetChat = () => {
    setMessages([
      { 
        id: 1, 
        text: "Chat reset. How can I assist you with government schemes and welfare programs today?", 
        sender: 'bot' 
      }
    ]);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8.5rem)] bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      {/* Top Assistant Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/20">
            <Bot size={22} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-slate-900 text-sm">AccessMind AI Assistant</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Scheme Discovery • Eligibility Explanations</p>
          </div>
        </div>

        <button
          onClick={resetChat}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
          title="Reset conversation"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/40">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
                msg.sender === 'user' ? 'bg-slate-900 text-white ml-3 shadow-sm' : 'bg-blue-100 text-blue-700 mr-3'
              }`}>
                {msg.sender === 'user' ? <User size={15} /> : <Bot size={16} />}
              </div>
              <div className={`px-5 py-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : msg.isError
                  ? 'bg-red-50 border border-red-200 text-red-700 rounded-tl-sm'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-500">Sources:</span>
                    {msg.sources.map((src, idx) => (
                      <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                        {src}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center max-w-[80%] flex-row">
              <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-700 mr-3">
                <Bot size={16} />
              </div>
              <div className="px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-400 rounded-tl-sm shadow-sm flex items-center space-x-2">
                <Loader2 className="animate-spin text-blue-600" size={16} />
                <span className="text-xs font-semibold text-slate-600">AccessMind AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto scrollbar-none">
        <Sparkles size={14} className="text-indigo-600 shrink-0" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">Try asking:</span>
        {SUGGESTED_QUESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => sendMessage(q)}
            disabled={loading}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-600 rounded-full text-xs font-medium whitespace-nowrap transition-colors shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about schemes, eligibility rules, loans, or required documents..."
            className="w-full bg-slate-50 border border-slate-200 rounded-full py-3.5 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-900 text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-full transition-all shadow-sm"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Assistant;
