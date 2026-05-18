import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchEntities } from "@/src/lib/api";
import { LayoutDashboard, Receipt, Building2, TrendingUp, Settings, ChevronRight, Moon, Sun, Plus, ShieldAlert, Workflow, LogOut, PieChart, Clock, Calendar, BarChart3, Activity, Lightbulb, Zap, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStore } from "@/src/store/useStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { QuickEntry } from "./QuickEntry";
import { Chatbot } from "./Chatbot";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { entityConfig } from "./Entities";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { currentEntity, setCurrentEntity, isDarkMode, toggleDarkMode } = useStore();
  const { data: entities } = useQuery({ queryKey: ["entities"], queryFn: fetchEntities });
  const [time, setTime] = useState(new Date());
  const [isEntityPopoverOpen, setIsEntityPopoverOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEntitySelect = (entity: any) => {
    setCurrentEntity(entity);
    setIsEntityPopoverOpen(false);
  };

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  if (isAuthPage) {
    return (
      <div className={cn("min-h-screen bg-background", isDarkMode && "dark")}>
        {children}
      </div>
    );
  }

  const coreItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/" },
    { title: "Transactions", icon: Receipt, href: "/transactions" },
    { title: "Entities", icon: Building2, href: "/entities" },
    { title: "Analytics", icon: BarChart3, href: "/analytics" },
    { title: "Settings", icon: Settings, href: "/settings" },
  ];

  const intelligenceItems = [
    { title: "Risk", icon: Activity, href: "/risk" },
    { title: "Recovery Plan", icon: ShieldAlert, href: "/recovery-plan" },
    { title: "Insights", icon: Lightbulb, href: "/insights" },
  ];

  return (
    <div className={cn("flex min-h-screen w-full bg-background", isDarkMode && "dark")}>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-[#1c1f26] bg-[#0e1117] text-gray-300 lg:block shadow-[10px_0_30px_rgba(0,0,0,0.1)]">
        <div className="flex h-full flex-col">
          <div className="px-6 py-6 border-b border-white/5 bg-white/3">
            <Popover open={isEntityPopoverOpen} onOpenChange={setIsEntityPopoverOpen}>
              <PopoverTrigger render={
                <button className="w-full flex items-center gap-3 rounded-2xl bg-[#1c1f26] p-4 border border-white/5 transition-all hover:border-[#00D4FF]/30 hover:bg-[#1c1f26]/80 group cursor-pointer text-left outline-none shadow-xl">
                  {currentEntity ? (
                    <>
                      <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl shadow-lg font-bold transition-transform group-hover:rotate-3", entityConfig[currentEntity.type]?.bg || "bg-[#00D4FF]/20", entityConfig[currentEntity.type]?.color || "text-[#00D4FF]")}>
                        {(() => {
                           const Config = entityConfig[currentEntity.type] || entityConfig.company;
                           const Icon = Config.icon;
                           return <Icon size={24} />;
                        })()}
                      </div>
                      <div className="flex flex-col overflow-hidden flex-1">
                        <span className="text-sm font-black text-white truncate">
                          {currentEntity.name}
                        </span>
                        <div className="flex items-center gap-1">
                           <span className="text-[9px] text-[#00D4FF] font-black uppercase tracking-widest">Active Node</span>
                           <ChevronRight size={8} className="text-gray-600" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-800 text-gray-500 group-hover:bg-[#00D4FF]/10 group-hover:text-[#00D4FF] transition-colors">
                        <Building2 size={24} />
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-xs font-bold text-gray-400">Choose Entity</span>
                        <div className="flex items-center text-[#00D4FF] text-[10px] uppercase font-black tracking-widest animate-pulse">
                          Select One <Plus size={10} className="ml-1" />
                        </div>
                      </div>
                    </>
                  )}
                </button>
              } />
              <PopoverContent className="w-[280px] p-2 bg-[#0e1117] border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] ml-6 z-[100] backdrop-blur-xl">
                <div className="space-y-1">
                  <div className="px-3 py-3 border-b border-white/5 mb-1">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00D4FF]">Intelligence Matrix Nodes</h5>
                    <p className="text-[9px] text-gray-500 font-bold uppercase mt-0.5">Switch active financial cluster</p>
                  </div>
                  <ScrollArea className="h-auto max-h-[320px]">
                    <div className="space-y-1 pr-3 py-1">
                      {entities && entities.length > 0 ? (
                        entities.map((entity: any) => {
                          const config = entityConfig[entity.type] || entityConfig.company;
                          const Icon = config.icon;
                          const isSelected = currentEntity?.id === entity.id;
                          return (
                            <button
                              key={entity.id}
                              onClick={() => handleEntitySelect(entity)}
                              className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-xl transition-all group relative overflow-hidden",
                                isSelected ? "bg-white/5 ring-1 ring-white/10" : "hover:bg-white/5"
                              )}
                            >
                              {isSelected && (
                                <motion.div 
                                  layoutId="selected-entity-indicator"
                                  className="absolute left-0 top-0 bottom-0 w-1 bg-[#00D4FF]"
                                />
                              )}
                              <div className={cn("h-10 w-10 flex items-center justify-center rounded-lg transition-transform group-hover:scale-110", config.bg)}>
                                <Icon size={18} className={config.color} />
                              </div>
                              <div className="flex flex-col items-start flex-1 overflow-hidden text-left">
                                <span className={cn("text-xs font-black truncate w-full tracking-tight", isSelected ? "text-[#00D4FF]" : "text-gray-200")}>
                                  {entity.name}
                                </span>
                                <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">
                                  {entity.type}
                                </span>
                              </div>
                              {isSelected && <Check size={14} className="text-[#00D4FF] shadow-[0_0_8px_#00D4FF]" />}
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-3 py-8 text-center flex flex-col items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-gray-600">
                             <ShieldAlert size={20} />
                          </div>
                          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-relaxed"> No entities detected in current mesh </p>
                        </div>
                      )}

                      <div className="px-2 pt-2">
                        <Link to="/entities" className="block">
                          <Button variant="ghost" className="w-full justify-center gap-2 h-11 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-white/5 hover:bg-[#00D4FF] hover:text-black rounded-xl transition-all border border-white/5">
                            <Plus size={14} /> NEW ENTITY
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-1 px-8 py-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00D4FF] to-sky-400 text-white shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                <TrendingUp size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-white leading-none">MEFIS</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Multi-Entity Financial Intelligence</span>
              </div>
            </Link>
          </div>

          <ScrollArea className="flex-1 px-4 py-6 min-h-0">
            <div className="space-y-8">
              <div className="space-y-1">
                <h4 className="px-5 text-xs font-black uppercase tracking-[0.25em] text-gray-600 mb-4">Core</h4>
                {coreItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "relative flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-bold transition-all duration-300 group",
                        isActive 
                          ? "bg-gradient-to-r from-[#00D4FF]/10 to-transparent text-white" 
                          : "text-gray-500 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="active-accent"
                          className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#00D4FF] shadow-[2px_0_10px_#00D4FF]"
                        />
                      )}
                      <item.icon size={20} className={cn("transition-colors", isActive ? "text-[#00D4FF]" : "text-gray-600 group-hover:text-gray-300")} />
                      <span className={cn(isActive ? "font-black" : "font-medium")}>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
              
              <div className="space-y-1">
                <h4 className="px-5 text-xs font-black uppercase tracking-[0.25em] text-gray-600 mb-4">Intelligence</h4>
                {intelligenceItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "relative flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-bold transition-all duration-300 group",
                        isActive 
                          ? "bg-gradient-to-r from-[#00D4FF]/10 to-transparent text-white" 
                          : "text-gray-500 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="active-accent"
                          className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#00D4FF] shadow-[2px_0_10px_#00D4FF]"
                        />
                      )}
                      <item.icon size={20} className={cn("transition-colors", isActive ? "text-[#00D4FF]" : "text-gray-600 group-hover:text-gray-300")} />
                      <span className={cn(isActive ? "font-black" : "font-medium")}>{item.title}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="space-y-4">
                <h4 className="px-5 text-xs font-black uppercase tracking-[0.25em] text-gray-600 mb-4">Analysis Status</h4>
                <div className="space-y-4 px-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400">Neural Engine</span>
                      <span className="text-[11px] font-black text-[#00D4FF]">84%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "84%" }}
                        className="h-full bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-gray-400">Sentiment Node</span>
                    </div>
                    <span className="text-[11px] font-black text-emerald-500 uppercase">Optimized</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-sky-500 animate-bounce" />
                      <span className="text-xs font-bold text-gray-400">Risk Engine</span>
                    </div>
                    <span className="text-[11px] font-black text-sky-500 uppercase">Syncing</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="px-5 text-xs font-black uppercase tracking-[0.25em] text-gray-600">Process History</h4>
                <div className="space-y-2 px-3">
                  {[
                      { label: "Entity Sync", date: "May 15", status: "Completed", icon: Building2, color: "text-emerald-500" },
                      { label: "CSV Import", date: "May 14", status: "Success", icon: Workflow, color: "text-sky-500" },
                      { label: "Audit Log", date: "May 14", status: "Review", icon: ShieldAlert, color: "text-amber-500" },
                  ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-2.5 rounded-xl transition-all hover:bg-white/5 group cursor-default">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1c1f26] border border-white/5 group-hover:border-[#00D4FF]/30 transition-colors">
                              <item.icon size={16} className="text-gray-500 group-hover:text-gray-300" />
                          </div>
                          <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold text-gray-300 truncate">{item.label}</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className={cn("text-[11px] font-black uppercase", item.color)}>{item.status}</span>
                                  <span className="h-0.5 w-0.5 rounded-full bg-gray-700" />
                                  <span className="text-[11px] font-bold text-gray-600">{item.date}</span>
                              </div>
                          </div>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="p-6 space-y-4 mt-auto border-t border-white/5 bg-[#0e1117]/80 backdrop-blur-sm">
            <QuickEntry customTrigger={
              <Button className="w-full h-12 bg-gradient-to-r from-[#00D4FF] to-sky-600 hover:to-sky-400 text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-[0_0_20px_rgba(0,212,255,0.2)] hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all active:scale-[0.98] group">
                <Zap size={14} className="mr-2 fill-white animate-pulse" />
                Quick Intel Entry
              </Button>
            } />

            <div className="flex items-center justify-between gap-2 px-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Last Sync</span>
                <span className="text-[11px] font-bold text-emerald-500">2 minutes ago</span>
              </div>
              
              <div 
                className="relative h-8 w-14 rounded-full bg-[#1c1f26] border border-white/5 cursor-pointer overflow-hidden p-1 group"
                onClick={toggleDarkMode}
              >
                <div className={cn(
                  "absolute inset-0.5 h-7 w-7 rounded-full bg-white shadow-xl flex items-center justify-center transition-all duration-300 text-gray-900",
                  isDarkMode ? "translate-x-6" : "translate-x-0"
                )}>
                  {isDarkMode ? <Moon size={12} fill="currentColor" /> : <Sun size={12} fill="currentColor" />}
                </div>
              </div>
            </div>

            <Link to="/login" className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-rose-500/80 hover:text-rose-500 hover:bg-rose-500/5 transition-all">
                <LogOut size={16} />
                <span>Sign Out</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <ScrollArea className="h-screen bg-background/50">
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </ScrollArea>
      </main>

      <Chatbot />
    </div>
  );
}
