import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Database, 
  Search, 
  Filter, 
  Container, 
  Brain, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight,
  UserPlus,
  Workflow,
  Cpu
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const pipelineStages = [
    { title: "Input Ingestion", desc: "NLP / Manual / CSV Batch", icon: UserPlus, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Validation Layer", desc: "Integrity & Type Checks", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "AI Normalization", desc: "Category Extraction", icon: Cpu, color: "text-violet-500", bg: "bg-violet-500/10" },
    { title: "Canonical Storage", desc: "PostgreSQL Standard", icon: Database, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Analysis Engine", desc: "Category Distribution", icon: Filter, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Risk Scan", desc: "Heath & Stability", icon: Brain, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Forecasting", desc: "ML Trend Prediction", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
    { title: "Decision Layer", desc: "Recovery & Advice", icon: Workflow, color: "text-cyan-500", bg: "bg-cyan-500/10" },
];

export function AnalysisPipeline() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">System Architecture Flow</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Multi-entity data pipeline from messy real-world input to structured financial intelligence.
        </p>
      </div>

      <div className="relative mx-auto max-w-4xl">
        <div className="grid gap-12 sm:grid-cols-2">
            {pipelineStages.map((stage, idx) => (
                <motion.div
                    key={stage.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative group"
                >
                    <Card className="hover:border-primary/50 transition-all border-dashed bg-card/40 backdrop-blur-md shadow-2xl group-hover:shadow-primary/5 group-hover:-translate-y-1 duration-300">
                        <CardHeader className="flex flex-row items-center gap-4 pb-4">
                            <div className={cn("rounded-xl p-3 shadow-inner transition-transform group-hover:scale-110", stage.bg)}>
                                <stage.icon className={stage.color} size={24} />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold tracking-tight">{stage.title}</CardTitle>
                                <CardDescription className="text-xs font-mono uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{stage.desc}</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                    
                    {/* Arrow to Next Node */}
                    {idx < pipelineStages.length - 1 && (
                        <motion.div 
                            animate={{ y: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-primary/30 hidden lg:block z-20"
                        >
                            <ArrowRight className="rotate-90" size={24} />
                        </motion.div>
                    )}
                </motion.div>
            ))}
        </div>
        
        {/* Connection Background Decor (Optional line) */}
        <div className="absolute left-[50%] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/10 via-primary/40 to-primary/10 -z-10 -translate-x-1/2 hidden lg:block" />
      </div>

      <Card className="border-primary/30 max-w-2xl mx-auto overflow-hidden">
        <CardHeader className="bg-primary/10">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Intelligence Logic</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-sm italic leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors font-serif">
            "MEFIS operates on a unified processing pipeline. Whether data enters via NLP, Manual Form, or API ingestion, it is immediately normalized through our Gemini-powered extraction layer. Structured outcomes are then cross-referenced against historical entity patterns to generate precise risk indicators and recovery strategies."
        </CardContent>
      </Card>
    </div>
  );
}
