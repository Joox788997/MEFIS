import { useState, useRef, useEffect } from "react";
import { useStore } from "@/src/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MessageSquareText, Send, X, Bot, User, ShieldAlert, TrendingUp, PieChart, Workflow, Cpu, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestions = [
    { label: "Predict entity risk", icon: ShieldAlert },
    { label: "Optimal recovery path", icon: TrendingUp },
    { label: "Transaction anomaly report", icon: PieChart },
    { label: "Pipeline validation", icon: Workflow },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "MEFIS Node 01 Online. Authorized terminal access granted. How may I assist your financial research today?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTo({
                top: viewport.scrollHeight,
                behavior: 'smooth'
            });
        }
    }
  }, [messages, isTyping]);

  const handleSend = async (content: string = input) => {
    if (!content.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: messages.map(m => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }]
          }))
        })
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "System synchronization failure. Protocol error detected. Please try your transmission again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          animate={{
            scale: isOpen ? 0.9 : [1, 1.1, 1],
            opacity: isOpen ? 0.2 : [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 via-[#00D4FF] to-emerald-400 rounded-full blur-xl opacity-30 group-hover:opacity-100 transition-opacity"
        />
        <Button
          className={cn(
            "h-16 w-16 rounded-full shadow-[0_0_40px_rgba(0,212,255,0.3)] transition-all duration-500 active:scale-90 bg-slate-950 border border-white/10 text-white group overflow-hidden relative",
            isOpen && "rotate-180"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
              >
                <X size={28} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="relative flex items-center justify-center h-full w-full"
              >
                <div className="relative z-10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-[#00D4FF] rounded-full opacity-0 group-hover:opacity-20 blur-sm transition-opacity"
                    />
                    <Sparkles size={28} className="group-hover:scale-110 transition-transform text-[#00D4FF]" />
                    {/* Notification Pulse */}
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4FF] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-[#00D4FF] border-2 border-slate-950"></span>
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
            initial={{ opacity: 0, y: 30, scale: 0.95, rotate: 1, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 30, scale: 0.95, rotate: 1, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="fixed bottom-24 right-6 w-[calc(100vw-3rem)] sm:w-[420px] h-[650px] max-h-[calc(100vh-10rem)] z-50 origin-bottom-right drop-shadow-[0_0_50px_rgba(0,212,255,0.15)]"
          >
            <Card className="h-full flex flex-col border-white/10 bg-[#0e1117]/90 backdrop-blur-3xl overflow-hidden rounded-[2.5rem] relative group/card">
              {/* Decorative scanline effect */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
              
              {/* Dynamic pulse background */}
              <div className="absolute -top-24 -right-24 h-64 w-64 bg-[#00D4FF]/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />

              <CardHeader className="p-8 border-b border-white/5 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-tr from-indigo-600 to-[#00D4FF] text-white shadow-[0_0_25px_rgba(0,212,255,0.4)]">
                                <Cpu size={26} className="animate-pulse" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#0e1117] border-2 border-white/5 flex items-center justify-center">
                              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgb(16,185,129)]" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <CardTitle className="text-lg font-black tracking-tighter text-white uppercase leading-none">
                                Matrix Intelligence
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              <div className="flex h-1.5 w-1.5 rounded-full bg-[#00D4FF]" />
                              <span className="text-[10px] text-[#00D4FF] font-black uppercase tracking-[0.25em] leading-none">
                                Research Node 01-X
                              </span>
                            </div>
                        </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsOpen(false)}
                      className="rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-all"
                    >
                      <X size={20} />
                    </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-0 overflow-hidden relative z-10 bg-black/20">
                <ScrollArea className="h-full p-8" ref={scrollRef}>
                  <div className="space-y-8 pb-4">
                    {messages.map((m, idx) => (
                      <motion.div
                        initial={{ opacity: 0, x: m.role === "user" ? 20 : -20, filter: "blur(8px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        transition={{ delay: idx * 0.1 }}
                        key={m.id}
                        className={cn(
                          "flex gap-4",
                          m.role === "user" ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        <div className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                          m.role === "user" 
                            ? "bg-indigo-600/20 border-indigo-500/30 text-indigo-400" 
                            : "bg-[#00D4FF]/10 border-[#00D4FF]/20 text-[#00D4FF]"
                        )}>
                          {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
                        </div>
                        <div className={cn(
                          "flex flex-col gap-2 max-w-[85%]",
                          m.role === "user" ? "items-end" : "items-start"
                        )}>
                            <div className={cn(
                                "px-5 py-3.5 text-[13px] leading-relaxed font-medium tracking-tight markdown-body",
                                m.role === "user" 
                                    ? "bg-indigo-600 text-white rounded-[1.25rem] rounded-tr-none shadow-[0_10px_25px_rgba(79,70,229,0.2)]" 
                                    : "bg-white/5 border border-white/10 text-gray-200 rounded-[1.25rem] rounded-tl-none backdrop-blur-sm shadow-xl"
                            )}>
                                <ReactMarkdown>{m.content}</ReactMarkdown>
                            </div>
                            <div className="flex items-center gap-2 px-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {m.role === "assistant" && (
                                  <div className="flex items-center gap-1">
                                    <div className="h-1 w-1 rounded-full bg-[#00D4FF]/30" />
                                    <span className="text-[8px] text-[#00D4FF]/50 font-black uppercase tracking-widest">Verified Payload</span>
                                  </div>
                                )}
                            </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-[#00D4FF]/10 border-[#00D4FF]/20 text-[#00D4FF]">
                          <Bot size={14} />
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-[1.25rem] rounded-tl-none px-5 py-4 flex gap-1.5 items-center backdrop-blur-sm shadow-xl">
                            <motion.span 
                              animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5]
                              }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                              className="w-1.5 h-1.5 bg-[#00D4FF] rounded-full" 
                            />
                            <motion.span 
                              animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5]
                              }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                              className="w-1.5 h-1.5 bg-[#00D4FF] rounded-full" 
                            />
                            <motion.span 
                              animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5]
                              }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                              className="w-1.5 h-1.5 bg-[#00D4FF] rounded-full" 
                            />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="p-8 flex-col gap-6 border-t border-white/5 relative z-10 bg-black/20">
                <div className="flex flex-wrap gap-2.5">
                    {suggestions.map((s, i) => (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (i * 0.05) }}
                            key={s.label}
                            onClick={() => handleSend(s.label)}
                            className={cn(
                                "flex items-center gap-2.5 rounded-xl border px-3.5 py-2 text-[10px] font-black uppercase tracking-widest transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 group/sug",
                                "bg-white/5 text-gray-400 border-white/5 hover:border-[#00D4FF]/40 hover:text-[#00D4FF] hover:bg-[#00D4FF]/5"
                            )}
                        >
                            <s.icon size={12} className="group-hover/sug:animate-pulse" />
                            {s.label}
                        </motion.button>
                    ))}
                </div>
                
                <div className="flex w-full items-center gap-3">
                  <div className="relative flex-1 group">
                    <Input
                      placeholder="Transmission input..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      className="h-14 bg-white/5 border-white/10 focus-visible:ring-[#00D4FF]/30 focus-visible:border-[#00D4FF]/50 rounded-2xl transition-all text-white placeholder:text-gray-600 px-6 font-medium"
                    />
                    <div className="absolute right-2 top-2 flex items-center gap-2">
                       <Button 
                          size="icon" 
                          className="h-10 w-10 bg-[#00D4FF] hover:bg-[#00D4FF]/80 text-black rounded-xl shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all active:scale-90 flex items-center justify-center" 
                          onClick={() => handleSend()}
                          disabled={!input.trim() || isTyping}
                      >
                        <Send size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between w-full px-2">
                    <div className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-emerald-500" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600">Secure Protocol v3.8</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                        <PieChart size={10} />
                        <Workflow size={10} />
                        <ShieldAlert size={10} />
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
