import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, Sparkles, Zap, Target, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const insights = [
  { title: "Optimization Hub", description: "Consolidation of 3 sub-entity accounts could reduce operational overhead by 12%.", icon: Zap, color: "text-[#00D4FF]" },
  { title: "Tax Efficiency", description: "Proposed restructuring of cross-border R&D credits can yield $420k annual savings.", icon: Target, color: "text-emerald-500" },
  { title: "Liquidity Surge", description: "AI predicts a 15% increase in seasonal cash reserves based on historical Q3 patterns.", icon: Sparkles, color: "text-violet-500" },
];

export default function Insights() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tighter text-white">AI Insights</h1>
        <p className="text-gray-500 font-medium">Strategic intelligence derived from multi-entity data synthesis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-[#1c1f26] bg-[#0e1117] hover:border-[#00D4FF]/30 transition-all cursor-default overflow-hidden group h-full">
              <CardHeader>
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-2 group-hover:bg-[#00D4FF]/10 transition-colors">
                    <insight.icon className={insight.color} size={20} />
                </div>
                <CardTitle className="text-sm font-black uppercase tracking-tight text-white">{insight.title}</CardTitle>
                <CardDescription className="text-xs text-gray-500 leading-relaxed font-medium">
                  {insight.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-[#1c1f26] bg-[#0e1117] overflow-hidden">
        <CardHeader className="border-b border-white/5 bg-[#1c1f26]/30">
          <div className="flex items-center gap-2">
            <BookOpen className="text-sky-500" size={20} />
            <CardTitle className="text-sm font-black uppercase tracking-widest text-white">Market Intelligence Report</CardTitle>
          </div>
          <CardDescription className="text-gray-500 pb-2">Synthesized quarterly outlook for multi-regional holdings.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
           <div className="prose prose-invert max-w-none text-gray-400">
              <h3 className="text-white font-bold mb-4">Autonomous Executive Summary</h3>
              <p className="leading-relaxed mb-6">
                Current data flow analysis suggests a stabilization period in the APAC logistics division, following a period of high-volatility capital expansion. The integration of the new **MEFIS-01** protocol has successfully reduced reconciliation errors by 34.2% across all entities.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-[#00D4FF]" />
                        <span className="text-xs font-black text-white uppercase tracking-widest">Regional Strengths</span>
                    </div>
                    <p className="text-xs leading-relaxed">
                        North American operations show strong resilience with a 4.2% margin improvement in technical ventures.
                    </p>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                        <span className="text-xs font-black text-white uppercase tracking-widest">Watch Items</span>
                    </div>
                    <p className="text-xs leading-relaxed">
                        Currency fluctuation in the EU logistics sector remains a priority monitoring item for the upcoming quarter.
                    </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                    <Lightbulb className="text-amber-500" size={18} />
                    <span className="text-sm font-bold text-white">Recommended Strategy</span>
                </div>
                <p className="text-xs text-gray-500 italic">
                    "Transitioning to automated ledger reconciliation for the Real Estate entity is projected to free up 120 man-hours per month."
                </p>
              </div>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
