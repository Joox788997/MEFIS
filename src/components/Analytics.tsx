import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell, PieChart, Pie, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line } from "recharts";
import { motion } from "framer-motion";
import { ArrowRight, Database, Cpu, ShieldCheck, Share2, TrendingUp, Wallet, Landmark, Activity, Zap, Layers, Globe, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const flowData = [
  { name: "Jan", val: 45000, trend: 12 },
  { name: "Feb", val: 52000, trend: 8 },
  { name: "Mar", val: 48000, trend: -5 },
  { name: "Apr", val: 61000, trend: 15 },
  { name: "May", val: 55000, trend: -2 },
  { name: "Jun", val: 67000, trend: 10 },
  { name: "Jul", val: 72000, trend: 18 },
];

const sparkData = [
  { v: 40 }, { v: 35 }, { v: 55 }, { v: 45 }, { v: 60 }, { v: 50 }, { v: 75 }
];

const assets = [
  { name: "Global Holdings", symbol: "GLB", value: "$64,457.24", trend: "+2.3%", color: "#f59e0b", data: sparkData },
  { name: "EU Logistics", symbol: "EUL", value: "$3,548.12", trend: "+1.9%", color: "#8b5cf6", data: sparkData.map(d => ({ v: d.v * 0.8 + 10 })) },
  { name: "Tech Ventures", symbol: "TCH", value: "$600.19", trend: "-0.3%", color: "#ef4444", data: sparkData.map(d => ({ v: 100 - d.v })) },
];

function Sparkline({ data, color }: { data: any[], color: string }) {
  return (
    <div className="h-12 w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#grad-${color})`} dot={false} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Analytics() {
  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 bg-[#06080c]/50">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Asset Evolution Matrix</h1>
        <p className="text-gray-500 font-medium tracking-tight text-sm uppercase">Synthesized valuation across multi-entity neural nodes.</p>
      </div>

      {/* Top Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {assets.map((asset, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-white/5 bg-[#0e1117]/80 backdrop-blur-xl p-5 hover:border-white/10 transition-all group relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-white/5 border border-white/5 group-hover:scale-110 transition-transform" style={{ color: asset.color }}>
                            <Zap size={20} fill="currentColor" fillOpacity={0.2} />
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-white/70 uppercase tracking-tight">{asset.name}</h3>
                            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/40 font-black">{asset.symbol}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-2xl font-black text-white tracking-tighter">{asset.value}</span>
                    <div className="flex items-center gap-1.5 mt-1">
                        <TrendingUp size={12} className={asset.trend.startsWith('+') ? "text-emerald-500" : "text-rose-500"} />
                        <span className={cn("text-[10px] font-black", asset.trend.startsWith('+') ? "text-emerald-500" : "text-rose-500")}>
                            {asset.trend}
                        </span>
                    </div>
                </div>
                <Sparkline data={asset.data} color={asset.color} />
            </Card>
          </motion.div>
        ))}
        
        <Card className="border-white/5 bg-[#0e1117]/80 backdrop-blur-xl p-5 flex flex-col justify-between">
            <h3 className="text-xs font-black text-white/70 uppercase tracking-widest">Total Portfolio Value</h3>
            <div className="mt-2">
                <span className="text-3xl font-black text-white tracking-tighter">$ 240,117</span>
                <div className="flex gap-1.5 mt-4">
                   {[30, 45, 60, 25, 80, 55, 90].map((h, i) => (
                     <div key={i} className="flex-1 bg-gradient-to-t from-violet-600 to-[#00D4FF] rounded-sm opacity-50 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
                   ))}
                </div>
            </div>
        </Card>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Card className="lg:col-span-3 border-white/5 bg-[#0e1117]/80 backdrop-blur-3xl overflow-hidden p-8 relative">
           <div className="absolute top-0 right-0 p-8 flex items-center gap-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">
              <span className="bg-white/5 px-3 py-1 rounded border border-white/5">Auto Rec</span>
              <span className="text-[#00D4FF]">24h Volume</span>
           </div>
           
           <div className="mb-12">
              <h2 className="text-3xl font-black text-white tracking-tighter">MEFIS-Core Synthesis</h2>
              <div className="flex items-center gap-2 text-emerald-500 text-xs font-black mt-2">
                 <TrendingUp size={14} />
                 <span>+ 2.3% Real-time appreciation</span>
              </div>
           </div>

           <div className="h-[400px] w-full mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={flowData}>
                  <defs>
                    <linearGradient id="mainGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c1f26" vertical={false} />
                  <XAxis dataKey="name" stroke="#525252" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0e1117', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="val" stroke="#ef4444" strokeWidth={3} fill="url(#mainGrad)" activeDot={{ r: 6, strokeWidth: 0, fill: '#ef4444' }} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </Card>

        <div className="space-y-6">
            <Card className="border-white/5 bg-[#0e1117]/80 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-black text-white/50 uppercase tracking-widest">Top Gainers</h3>
                </div>
                <div className="space-y-5">
                    {[
                        { label: "Solane Holdings", val: "$154.82", trend: "+6.3%", color: "text-sky-400" },
                        { label: "Avalanche Ventures", val: "$42.61", trend: "+4.2%", color: "text-rose-500" },
                        { label: "Chainlink Proxy", val: "$17.04", trend: "+4.3%", color: "text-blue-500" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className={cn("h-8 w-8 rounded-full bg-white/5 flex items-center justify-center", item.color)}>
                                <Zap size={14} />
                            </div>
                            <div className="flex flex-col flex-1">
                                <span className="text-[11px] font-black text-white">{item.label}</span>
                                <span className="text-[9px] font-bold text-gray-500">LIQUIDITY LAYER</span>
                            </div>
                            <div className="text-right">
                                <div className="text-[11px] font-black text-white">{item.val}</div>
                                <div className="text-[9px] font-black text-emerald-500">{item.trend}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="border-white/5 bg-[#0e1117]/80 p-6 flex-1 h-full">
                <h3 className="text-xs font-black text-white/50 uppercase tracking-widest mb-4">Market Trends</h3>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={flowData}>
                            <Line type="monotone" dataKey="val" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-between text-[10px] font-black text-white/40 uppercase">
                    <span>Sentiment Nodes</span>
                    <span className="text-emerald-500">Optimized</span>
                </div>
            </Card>
        </div>
      </div>

      {/* Capital Intelligence Flowchart */}
      <Card className="border-white/5 bg-[#0e1117]/80 backdrop-blur-xl overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
        <CardHeader className="border-b border-white/5 bg-white/5 relative z-10">
          <div className="flex items-center gap-2">
            <Share2 className="text-[#00D4FF]" size={20} />
            <CardTitle className="text-sm font-black uppercase tracking-widest text-white">Neural Synthesis Architecture</CardTitle>
          </div>
          <CardDescription className="text-gray-500">Autonomous mapping of real-time multi-entity intelligence and capital routing.</CardDescription>
        </CardHeader>
        <CardContent className="p-16 relative z-10">
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Raw Ingestion */}
            <motion.div 
               whileHover={{ scale: 1.05, rotate: -2 }}
               className="relative z-20 flex flex-col items-center justify-center p-6 rounded-3xl bg-[#1c1f26] border border-[#00D4FF]/30 shadow-[0_0_30px_rgba(0,212,255,0.1)] w-48 aspect-square group"
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00D4FF]/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="h-12 w-12 rounded-xl bg-[#00D4FF]/10 flex items-center justify-center text-[#00D4FF] mb-4">
                  <Database size={24} />
                </div>
                <span className="text-xs font-black text-white uppercase tracking-widest text-center px-2">Raw Ingestion</span>
                <span className="text-[10px] text-gray-500 font-bold mt-1 uppercase">Node Cluster 01</span>
            </motion.div>

            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-[#00D4FF]/5 via-[#00D4FF]/40 to-[#00D4FF]/5 -translate-y-1/2 hidden md:block">
                <motion.div 
                  animate={{ left: ["0%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 h-full w-32 bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent shadow-[0_0_20px_#00D4FF]"
                />
            </div>

            {/* Core Processor */}
            <motion.div 
               animate={{ 
                 boxShadow: ["0 0 30px rgba(0,212,255,0.1)", "0 0 60px rgba(0,212,255,0.3)", "0 0 30px rgba(0,212,255,0.1)"] 
               }}
               transition={{ duration: 4, repeat: Infinity }}
               className="relative z-20 flex flex-col items-center justify-center p-8 rounded-[2.5rem] bg-gradient-to-br from-[#1c1f26] to-[#0e1117] border border-[#00D4FF]/50 w-64 aspect-square"
            >
                <div className="absolute inset-4 rounded-[2.5rem] border border-[#00D4FF]/20 animate-spin-slow pb-1" />
                <div className="h-16 w-16 rounded-2xl bg-[#00D4FF] flex items-center justify-center text-white mb-4 shadow-[0_0_40px_rgba(0,212,255,0.5)]">
                  <Cpu size={32} />
                </div>
                <span className="text-sm font-black text-white uppercase tracking-[0.2em]">MEFIS Engine</span>
                <span className="text-[10px] text-[#00D4FF] font-black mt-2 bg-[#00D4FF]/10 px-3 py-1 rounded-full border border-[#00D4FF]/20">v4.0 ACTIVE</span>
            </motion.div>

            {/* Output Nodes */}
            <div className="flex flex-col gap-4 relative z-20">
                {[
                  { label: "Equity Allocation", icon: Landmark, color: "text-[#00D4FF]" },
                  { label: "Yield Harvesting", icon: Wallet, color: "text-emerald-500" },
                  { label: "Risk Mitigation", icon: ShieldCheck, color: "text-amber-500" }
                ].map((node, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.03)" }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    className="flex items-center gap-4 bg-[#1c1f26]/50 p-4 rounded-xl border border-white/5 w-64 group cursor-pointer hover:border-[#00D4FF]/40 transition-all shadow-xl backdrop-blur-md"
                  >
                    <div className={cn("h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0", node.color)}>
                      <node.icon size={22} className="group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-gray-300 uppercase italic tracking-tighter block">{node.label}</span>
                        <span className="text-[9px] text-gray-600 font-bold uppercase">PROCESSED</span>
                    </div>
                    <ArrowRight size={14} className="ml-auto text-gray-700 group-hover:text-[#00D4FF] group-hover:translate-x-1 transition-all" />
                  </motion.div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Mesh Flowchart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-white/5 bg-[#0e1117]/80 backdrop-blur-xl overflow-hidden p-8 group relative">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck size={120} className="text-emerald-500" />
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert className="text-rose-500" size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Security Mesh</span>
                </div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8">Autonomous Risk Isolation</h3>
                
                <div className="space-y-6 relative ml-4 border-l border-white/5 pl-8">
                    {[
                        { title: "Anomaly Detection", desc: "AI-driven pattern recognition across all nodes", status: "Active", icon: Activity, color: "text-blue-500" },
                        { title: "Payload Sanitization", desc: "Recursive byte-filtering for toxic attributes", status: "Safe", icon: Layers, color: "text-emerald-500" },
                        { title: "Global Mesh Lock", desc: "Instant quarantine of compromised entities", status: "Standby", icon: Globe, color: "text-amber-500" }
                    ].map((step, i) => (
                        <motion.div 
                            key={i}
                            whileHover={{ x: 5 }}
                            className="relative"
                        >
                            <div className="absolute -left-[41px] top-0 h-4 w-4 rounded-full bg-[#0e1117] border-2 border-white/10 flex items-center justify-center">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className={cn("mt-1 p-2 rounded-lg bg-white/5 border border-white/5", step.color)}>
                                    <step.icon size={16} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-xs font-black text-white uppercase tracking-tight">{step.title}</h4>
                                        <span className="text-[9px] font-black uppercase text-emerald-500/80">{step.status}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
             </div>
          </Card>

          <Card className="border-white/5 bg-gradient-to-br from-[#0e1117]/80 to-[#1c1f26]/80 backdrop-blur-xl p-8 flex flex-col justify-center items-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-violet-500/10 via-transparent to-transparent" />
             
             <div className="relative z-10 w-full max-w-xs space-y-8">
                <div className="text-center">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-500 mb-2">Live Node Sync</h3>
                   <div className="text-4xl font-black text-white tracking-tighter">99.99%</div>
                   <p className="text-[9px] text-gray-500 font-black uppercase mt-1">Uptime across 12 decentralized clusters</p>
                </div>

                <div className="relative h-48 flex items-center justify-center">
                    {/* Visualizer Circle */}
                    <div className="absolute inset-0 border border-white/5 rounded-full animate-spin-slow" />
                    <div className="absolute inset-4 border border-violet-500/10 rounded-full animate-reverse-spin" />
                    
                    <motion.div 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-20 w-20 rounded-2xl bg-violet-600 flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.5)]"
                    >
                        <Zap size={32} className="text-white fill-white/20" />
                    </motion.div>

                    {/* Orbital Nodes */}
                    {[0, 72, 144, 216, 288].map((deg, i) => (
                        <div 
                            key={i}
                            className="absolute h-6 w-6 rounded-lg bg-[#0e1117] border border-white/10 flex items-center justify-center text-[8px] font-black text-white"
                            style={{ 
                                transform: `rotate(${deg}deg) translate(85px) rotate(-${deg}deg)` 
                            }}
                        >
                            {["US", "EU", "AS", "AU", "AF"][i]}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                        <div className="text-[9px] font-black text-gray-500 uppercase mb-1">Total Txs</div>
                        <div className="text-sm font-black text-white">42.8M</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                        <div className="text-[9px] font-black text-gray-500 uppercase mb-1">Latency</div>
                        <div className="text-sm font-black text-emerald-500">12ms</div>
                    </div>
                </div>
             </div>
          </Card>
      </div>

      {/* Grid Floor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-white/5 bg-gradient-to-br from-[#0e1117] to-[#1c1f26] p-6">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-white/50 uppercase tracking-widest">Internal Balance</h3>
                  <span className="text-[10px] bg-[#00D4FF]/20 text-[#00D4FF] px-2 py-0.5 rounded font-black">60%</span>
              </div>
              <div className="space-y-4">
                  <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center">
                          <Wallet size={18} />
                      </div>
                      <div className="flex flex-col">
                          <span className="text-xl font-black text-white">1.2485 BTC-E</span>
                          <span className="text-[10px] font-bold text-emerald-500">+12% Surplus</span>
                      </div>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "60%" }}
                        className="h-full bg-gradient-to-r from-amber-600 to-[#00D4FF]"
                      />
                  </div>
              </div>
          </Card>

          <Card className="border-white/5 bg-[#0e1117]/80 p-6">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-white/50 uppercase tracking-widest">EU Node Price</h3>
                  <span className="text-emerald-500 font-black text-xs">+1.9%</span>
              </div>
              <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparkData.map(d => ({ v: d.v * 0.4 + 20 }))}>
                          <Area type="stepAfter" dataKey="v" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.1} strokeWidth={2} dot={false} />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
              <div className="mt-2 text-2xl font-black text-white">$ 3,548.12</div>
          </Card>

          <Card className="border-white/5 bg-[#0e1117]/80 p-6">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-white/50 uppercase tracking-widest">APAC Yield</h3>
                  <span className="text-sky-500 font-black text-xs">+5.7%</span>
              </div>
              <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparkData.map(d => ({ v: Math.random() * 50 + 20 }))}>
                          <Area type="monotone" dataKey="v" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} dot={false} />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
              <div className="mt-2 text-2xl font-black text-white">$ 0.4795</div>
          </Card>
      </div>

    </div>
  );
}
