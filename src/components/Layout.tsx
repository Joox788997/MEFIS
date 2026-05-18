import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Receipt, Building2, TrendingUp, Settings, ChevronRight, Moon, Sun, Plus, ShieldAlert, Workflow, LogOut, PieChart, Clock, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStore } from "@/src/store/useStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { QuickEntry } from "./QuickEntry";
import { Chatbot } from "./Chatbot";
import { entityConfig } from "./Entities";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { currentEntity, isDarkMode, toggleDarkMode } = useStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  if (isAuthPage) {
    return (
      <div className={cn("min-h-screen bg-background", isDarkMode && "dark")}>
        {children}
      </div>
    );
  }

  const navItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/" },
    { title: "Transactions", icon: Receipt, href: "/transactions" },
    { title: "Entities", icon: Building2, href: "/entities" },
    { title: "Settings", icon: Settings, href: "/settings" },
  ];

  const intelItems = [
    { title: "Analysis Pipeline", icon: Workflow, href: "/analysis" },
    { title: "Recovery Plan", icon: ShieldAlert, href: "/recovery-plan" },
    { title: "Financial Stats", icon: PieChart, href: "/financial-stats" },
  ];

  return (
    <div className={cn("flex min-h-screen w-full bg-background", isDarkMode && "dark")}>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r bg-card lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center px-6">
            <Link to="/" className="flex items-center gap-2 font-bold tracking-tight text-primary">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <TrendingUp size={20} />
              </div>
              <span>MEFIS</span>
            </Link>
          </div>
          
          <Separator />
          
          <div className="px-4 py-4">
            {currentEntity ? (
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3 border">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg shadow-sm font-bold", entityConfig[currentEntity.type]?.bg || "bg-primary/20", entityConfig[currentEntity.type]?.color || "text-primary")}>
                  {(() => {
                    const Config = entityConfig[currentEntity.type] || entityConfig.company;
                    const Icon = Config.icon;
                    return <Icon size={20} />;
                  })()}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold truncate max-w-[140px]">
                    {currentEntity.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                    {currentEntity.type}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl bg-muted/30 p-3 border border-border/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-foreground">No Entity</span>
                  <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Select one</span>
                </div>
              </div>
            )}
          </div>

          <ScrollArea className="flex-1 px-4 py-2 min-h-0">
            <div className="space-y-1">
              <h4 className="px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 mb-2">Core</h4>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:bg-accent hover:text-accent-foreground group",
                    location.pathname === item.href ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon size={18} className={cn(location.pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors")} />
                  {item.title}
                  {location.pathname === item.href && <ChevronRight size={14} className="ml-auto" />}
                </Link>
              ))}
            </div>
            
            <Separator className="my-6" />
            
             <div className="space-y-1">
                <h4 className="px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 mb-2">Intelligence</h4>
                {intelItems.map((item) => (
                 <Link
                   key={item.href}
                   to={item.href}
                   className={cn(
                     "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:bg-accent hover:text-accent-foreground group",
                     location.pathname === item.href ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                   )}
                 >
                   <item.icon size={18} className={cn(location.pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors")} />
                   {item.title}
                   {location.pathname === item.href && <ChevronRight size={14} className="ml-auto" />}
                 </Link>
               ))}
             </div>

             <Separator className="my-6" />

             <div className="space-y-3 px-1">
                <h4 className="px-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Process History</h4>
                {[
                    { label: "Entity Sync", date: "May 15", status: "Completed", icon: Building2 },
                    { label: "CSV Import", date: "May 14", status: "Success", icon: Workflow },
                    { label: "Audit Log", date: "May 14", status: "Review", icon: ShieldAlert },
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 px-2 py-1 group cursor-default">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <item.icon size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-foreground/80">{item.label}</span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-black uppercase text-muted-foreground/60">{item.status}</span>
                                <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                <span className="text-[9px] font-black text-muted-foreground/60">{item.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
          </ScrollArea>

          <Separator />
          
          <div className="p-4 space-y-3">
            <div className="px-3 py-3 rounded-2xl bg-muted/30 border border-border/50 space-y-2">
                <div className="flex items-center gap-2 text-primary">
                    <Calendar size={14} />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                        {time.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                    <Clock size={14} className="text-muted-foreground" />
                    <span className="text-xl font-black tracking-tight">
                        {time.toLocaleTimeString(undefined, { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                </div>
            </div>

            <QuickEntry />
            <div className="flex flex-col gap-2">
               <h4 className="px-3 text-[10px] font-black uppercase tracking-widest text-foreground/60">Appearance</h4>
               <div 
                 className="mx-3 mt-1 relative h-10 w-full max-w-[200px] rounded-full bg-muted/40 border border-border/50 cursor-pointer overflow-hidden transition-all duration-500 shadow-inner group"
                 onClick={toggleDarkMode}
               >
                 <motion.div 
                    initial={false}
                    animate={{ 
                      x: isDarkMode ? "50%" : "0%",
                      backgroundColor: isDarkMode ? "#10b981" : "#e5e7eb"
                    }}
                    className="absolute inset-0 flex items-center px-1 w-full"
                 >
                    <motion.div 
                      layout
                      className="h-8 w-[48%] rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] flex items-center justify-center z-10"
                    >
                        <AnimatePresence mode="wait">
                            {isDarkMode ? (
                                <motion.div
                                    key="dark"
                                    initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
                                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                    exit={{ scale: 0.5, rotate: 45, opacity: 0 }}
                                    className="text-emerald-500"
                                >
                                    <Moon size={14} fill="currentColor" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="light"
                                    initial={{ scale: 0.5, rotate: 45, opacity: 0 }}
                                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                    exit={{ scale: 0.5, rotate: -45, opacity: 0 }}
                                    className="text-amber-500"
                                >
                                    <Sun size={14} fill="currentColor" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                    <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
                      <span className={cn("text-[10px] font-black uppercase tracking-tighter transition-opacity duration-300", !isDarkMode ? "opacity-100 text-gray-500" : "opacity-0")}>LIGHT</span>
                      <span className={cn("text-[10px] font-black uppercase tracking-tighter transition-opacity duration-300", isDarkMode ? "opacity-100 text-white" : "opacity-0")}>DARK</span>
                    </div>
                 </motion.div>
               </div>
            </div>
            <Link to="/login" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors">
                <LogOut size={18} />
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
