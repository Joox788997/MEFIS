import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const riskSignals = [
  { level: "Critical", message: "Large out-of-band transfer detected in EU Entity", icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  { level: "High", message: "Counterparty risk elevation for APAC logistics", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { level: "Medium", message: "Unusual liquidity fluctuation across 3 sub-entities", icon: Info, color: "text-sky-500", bg: "bg-sky-500/10", border: "border-sky-500/20" },
];

export default function Risk() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tighter text-white">Risk Intelligence</h1>
        <p className="text-gray-500 font-medium">Real-time threat detection and mitigation protocols.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {riskSignals.map((signal, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={cn("border bg-[#0e1117]", signal.border)}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className={cn("text-[10px] font-black uppercase tracking-widest", signal.color)}>
                  {signal.level} Priority
                </CardTitle>
                <signal.icon className={signal.color} size={18} />
              </CardHeader>
              <CardContent className="pt-2">
                 <p className="text-sm font-bold text-white leading-relaxed">{signal.message}</p>
                 <div className="mt-6 flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: i === 0 ? "85%" : i === 1 ? "60%" : "35%" }}
                          className={cn("h-full", i === 0 ? "bg-rose-500 shadow-[0_0_10px_#f43f5e]" : i === 1 ? "bg-amber-500" : "bg-sky-500")}
                        />
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Impact Index</span>
                 </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-[#1c1f26] bg-[#0e1117]">
          <CardHeader>
             <CardTitle className="text-sm font-black uppercase tracking-widest text-white">Mitigation Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                    <CheckCircle2 size={20} />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-white">System Protocol #{140 - i}</span>
                    <span className="text-xs text-gray-500">Full audit completed for transaction set ID_X55</span>
                </div>
                <div className="ml-auto text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-md">
                   Resolved
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#1c1f26] bg-[#0e1117] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />
          <CardHeader>
             <CardTitle className="text-sm font-black uppercase tracking-widest text-white">Anomaly Heatmap</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl m-6">
             <div className="flex flex-col items-center gap-3 text-gray-600">
                <AlertTriangle size={48} className="text-gray-800" />
                <span className="text-xs font-black uppercase tracking-widest">Projection Visual Waiting for Sync</span>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
