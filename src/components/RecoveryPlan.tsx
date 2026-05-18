import { useStore } from "@/src/store/useStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ShieldAlert, 
  Zap, 
  Clock, 
  Target, 
  CircleCheck, 
  ArrowRight, 
  HeartPulse,
  TrendingDown,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const plans = [
    {
        title: "Immediate Actions (Next 7 Days)",
        icon: Zap,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        items: [
            { id: 1, action: "Stop all non-essential marketing budget", priority: "Critical", impact: "High", status: "pending" },
            { id: 2, action: "Renegotiate fuel supplier contracts", priority: "High", impact: "Medium", status: "completed" },
            { id: 3, action: "Cancel unused hospital maintenance subscriptions", priority: "Medium", impact: "Low", status: "pending" }
        ]
    },
    {
        title: "Short-Term Optimization (30 Days)",
        icon: Clock,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        items: [
            { id: 4, action: "Optimize staff rotation schedule", priority: "Medium", impact: "High", status: "pending" },
            { id: 5, action: "Identify top 3 leaking expense categories", priority: "High", impact: "High", status: "completed" }
        ]
    },
    {
        title: "Long-Term Stabilization (90 Days+)",
        icon: Target,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        items: [
            { id: 6, action: "Transition to solar energy for factory unit", priority: "Low", impact: "Very High", status: "pending" },
            { id: 7, action: "Build 6-month contingency reserve fund", priority: "High", impact: "Critical", status: "pending" }
        ]
    }
];

export function RecoveryPlan() {
  const { currentEntity } = useStore();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recovery Intelligence</h1>
          <p className="text-muted-foreground">Strategic stabilization roadmap for {currentEntity?.name || "Global Context"}</p>
        </div>
        <Button variant="outline" className="gap-2">
            <ShieldAlert size={16} className="text-primary" />
            Recalculate Strategy
        </Button>
      </div>

      {/* Recovery Summary */}
      <Card className="border-primary/30 bg-primary/10 shadow-lg shadow-primary/5">
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
             <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Operational Health</span>
                <div className="flex items-center gap-3">
                    <HeartPulse className="text-rose-500" size={32} />
                    <div>
                        <div className="text-2xl font-bold">Unstable</div>
                        <p className="text-xs text-muted-foreground">Burn rate exceeds threshold</p>
                    </div>
                </div>
             </div>
             <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recovery Velocity</span>
                <div className="space-y-1">
                    <Progress value={45} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground font-medium">
                        <span>Initiated</span>
                        <span>45%</span>
                    </div>
                </div>
             </div>
             <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key Vulnerability</span>
                <div className="flex items-center gap-2 text-rose-500">
                    <TrendingDown size={20} />
                    <span className="text-sm font-bold">Maintenance Overrun</span>
                </div>
             </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((section, idx) => (
          <motion.div 
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="h-full border-muted-foreground/10">
              <CardHeader className="pb-3 px-6">
                <div className={cn("inline-flex w-fit rounded-lg p-2 mb-2", section.bg)}>
                    <section.icon className={section.color} size={20} />
                </div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <CardDescription>Targeted stabilization phase</CardDescription>
              </CardHeader>
              <CardContent className="px-6 space-y-4">
                {section.items.map(item => (
                    <div key={item.id} className="group relative flex flex-col gap-3 rounded-xl border border-muted bg-muted/30 p-4 transition-all hover:border-primary/30 hover:bg-muted/50">
                        <div className="flex items-start justify-between">
                            <Badge variant={item.status === 'completed' ? 'secondary' : 'outline'} className="text-[10px] h-5">
                                {item.status === 'completed' ? <CircleCheck size={10} className="mr-1" /> : <Clock size={10} className="mr-1" />}
                                {item.status.toUpperCase()}
                            </Badge>
                            <div className="flex gap-1">
                                <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] h-5">{item.priority}</Badge>
                            </div>
                        </div>
                        <p className="text-sm font-semibold leading-snug">{item.action}</p>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Est. Impact: <span className={cn("font-black text-foreground", item.impact === 'Critical' || item.impact === 'High' ? "text-primary italic" : "")}>{item.impact}</span></span>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 hover:bg-primary/20 text-primary">
                                <ArrowRight size={14} />
                            </Button>
                        </div>
                    </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
