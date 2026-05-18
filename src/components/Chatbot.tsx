import { useState, useRef, useEffect } from "react";
import { useStore } from "@/src/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MessageSquareText, Send, X, Bot, User, Sparkles, TrendingUp, ShieldAlert, PieChart, Workflow, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestions = [
    { label: "Explain my risk", icon: ShieldAlert, variant: "destructive" },
    { label: "Show recovery plan", icon: TrendingUp, variant: "primary" },
    { label: "Summarize expenses", icon: PieChart, variant: "secondary" },
    { label: "Analysis pipeline", icon: Workflow, variant: "outline" },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I am your MEFIS Research Assistant. How can I help you analyze your entity metrics today?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  const handleSend = async (content: string = input) => {
    if (!content.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Analyzing entity behavior... Based on current trends, your maintenance category shows 15% volatility. I recommend reviewing your recovery plan for sub-entity optimization.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          animate={{
            scale: isOpen ? 0.9 : [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-sky-400 rounded-full blur-lg opacity-30 group-hover:opacity-60 transition-opacity"
        />
        <Button
          className={cn(
            "h-14 w-14 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 active:scale-95 bg-slate-950 hover:bg-slate-900 text-white group overflow-hidden border border-white/10 dark:bg-white dark:text-slate-950",
            isOpen && "rotate-90"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="relative flex items-center justify-center"
              >
                <div className="relative">
                    <MessageSquareText size={24} className="group-hover:scale-110 transition-transform" />
                    {/* Notification Pulse */}
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500 border-2 border-slate-950 dark:border-white"></span>
                    </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed bottom-24 right-6 w-[calc(100vw-3rem)] sm:w-[400px] h-[600px] max-h-[calc(100vh-8rem)] z-50 origin-bottom-right"
          >
            <Card className="h-full flex flex-col border-slate-200/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white/80 backdrop-blur-2xl dark:bg-slate-950/80 dark:border-slate-800/50 overflow-hidden rounded-[2rem]">
              <CardHeader className="p-6 border-b border-slate-100/50 dark:border-slate-800/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/20">
                                <Cpu size={22} className="animate-pulse" />
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950" />
                        </div>
                        <div className="flex flex-col">
                            <CardTitle className="text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none mb-1">
                                Intel Assistant
                            </CardTitle>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
                                AI Research Node 01
                            </span>
                        </div>
                    </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-0 overflow-hidden bg-slate-50/30 dark:bg-slate-900/10">
                <ScrollArea className="h-full p-6" ref={scrollRef}>
                  <div className="space-y-6">
                    {messages.map((m) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={m.id}
                        className={cn(
                          "flex gap-3",
                          m.role === "user" ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        <div className="flex flex-col gap-1.5 max-w-[80%]">
                            <div className={cn(
                                "px-4 py-2.5 text-sm leading-relaxed",
                                m.role === "user" 
                                    ? "bg-indigo-600 text-white rounded-2xl rounded-tr-none shadow-lg shadow-indigo-500/10" 
                                    : "bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 shadow-sm"
                            )}>
                                {m.content}
                            </div>
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-tighter text-slate-400",
                                m.role === "user" ? "text-right" : "text-left"
                            )}>
                                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex gap-3">
                        <div className="bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center shadow-sm">
                            <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="p-5 flex-col gap-4 border-t border-slate-100/50 dark:border-slate-800/50">
                <div className="flex flex-wrap gap-2">
                    {suggestions.map((s, i) => (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + (i * 0.05) }}
                            key={s.label}
                            onClick={() => handleSend(s.label)}
                            className={cn(
                                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50",
                                "bg-white text-slate-600 border-slate-200 shadow-sm hover:border-indigo-400 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                            )}
                        >
                            <s.icon size={12} />
                            {s.label}
                        </motion.button>
                    ))}
                </div>
                
                <div className="flex w-full items-center gap-2">
                  <div className="relative flex-1 group">
                    <Input
                      placeholder="Type a message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      className="h-12 bg-slate-100/50 border-transparent focus-visible:ring-indigo-500/20 focus-visible:bg-white rounded-2xl transition-all dark:bg-slate-900/50"
                    />
                    <Button 
                        size="icon" 
                        className="absolute right-1 top-1 h-10 w-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-90" 
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isTyping}
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
