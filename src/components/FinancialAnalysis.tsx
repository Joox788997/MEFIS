import { useStore } from "@/src/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Line, 
  LineChart, 
  Cell, 
  PieChart, 
  Pie, 
  Area, 
  AreaChart 
} from "recharts";
import { motion } from "framer-motion";
import { cn, formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign, Activity, Percent, PieChart as PieIcon } from "lucide-react";

const lineData = [
  { name: '2018', revenue: 4000, profit: 2400 },
  { name: '2019', revenue: 3000, profit: 1398 },
  { name: '2020', revenue: 2000, profit: 9800 },
  { name: '2021', revenue: 2780, profit: 3908 },
  { name: '2022', revenue: 1890, profit: 4800 },
];

const barData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 278 },
  { name: 'May', value: 189 },
  { name: 'Jun', value: 239 },
  { name: 'Jul', value: 349 },
];

const donutData1 = [
  { name: 'Operating', value: 25.4, color: '#3b82f6' },
  { name: 'Margin', value: 14.2, color: '#a855f7' },
  { name: 'Other', value: 14.7, color: '#ec4899' },
];

export function FinancialAnalysis() {
  const { currentEntity } = useStore();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter uppercase text-foreground">
            Financial Performance <br />
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">& Cost Analysis</span>
        </h1>
        <p className="text-xs font-bold tracking-[0.3em] text-primary uppercase">
            {currentEntity?.name || "System Base"} • Intelligence Report
        </p>
      </div>

      {/* Top Level KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
            { label: "Revenue", value: "$56,2M", icon: DollarSign, color: "text-blue-500" },
            { label: "Profit", value: "12,5M", icon: Activity, color: "text-primary" },
            { label: "Revenue Growth", value: "8,3%", icon: TrendingUp, color: "text-emerald-500" },
            { label: "Profit Margin", value: "22,2%", icon: Percent, color: "text-violet-500" },
        ].map((kpi, i) => (
            <motion.div 
                key={kpi.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
            >
                <Card className="bg-muted/30 border-muted-foreground/10 hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{kpi.label}</p>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black tracking-tight text-foreground">{kpi.value}</span>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        ))}
      </div>

      {/* Main Grid Components */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Revenue & Profit Line Chart */}
        <Card className="lg:col-span-2 bg-muted/20 border-muted-foreground/10 shadow-xl overflow-hidden group">
            <CardHeader className="pb-0">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                    Revenue & Profit
                    <TrendingUp size={12} className="text-primary" />
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={lineData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            borderColor: 'hsl(var(--border))', 
                            borderRadius: '12px',
                            color: 'hsl(var(--foreground))'
                          }}
                          itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                        <Area type="monotone" dataKey="profit" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorProf)" />
                    </AreaChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500" /> Revenue</div>
                    <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-violet-500" /> Profit</div>
                </div>
            </CardContent>
        </Card>

        {/* Donut Chart: Profit Contribution */}
        <Card className="bg-muted/20 border-muted-foreground/10 shadow-xl">
             <CardHeader>
                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Contribution</CardTitle>
             </CardHeader>
             <CardContent className="h-[280px] flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={donutData1}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {donutData1.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-foreground">25,4%</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Operating</span>
                </div>
             </CardContent>
        </Card>

        {/* Expenses Bar Chart */}
        <Card className="bg-muted/20 border-muted-foreground/10 shadow-xl lg:col-span-1">
             <CardHeader>
                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Monthly Expenses</CardTitle>
             </CardHeader>
             <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                        <Bar 
                            dataKey="value" 
                            radius={[4, 4, 0, 0]}
                        >
                            {barData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === barData.length - 1 ? "#3b82f6" : "#3b82f644"} />
                            ))}
                        </Bar>
                        <Tooltip 
                            cursor={{ fill: 'transparent' }} 
                            contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                            }} 
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                    </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-between mt-4 text-[10px] font-bold text-muted-foreground uppercase px-2">
                    <span>Jan</span>
                    <span>Dec</span>
                </div>
             </CardContent>
        </Card>

        {/* Net Income Line Chart */}
        <Card className="bg-muted/20 border-muted-foreground/10 shadow-xl overflow-hidden group lg:col-span-2">
            <CardHeader>
                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex justify-between">
                    Net Income Flow
                    <PieIcon size={12} className="text-emerald-500" />
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[200px] p-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                        <Line 
                            type="step" 
                            dataKey="revenue" 
                            stroke="#10b981" 
                            strokeWidth={3} 
                            dot={false}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                            }} 
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
                <div className="flex justify-between px-6 pb-4 text-[8px] font-bold text-muted-foreground uppercase">
                    {lineData.map(d => <span key={d.name}>{d.name}</span>)}
                </div>
            </CardContent>
        </Card>

        {/* Operating Costs & COGS Column */}
        <div className="lg:col-span-3 grid gap-6 md:grid-cols-3">
             <Card className="bg-muted/20 border-muted-foreground/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">COGS Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                            <Bar 
                                dataKey="value" 
                                className="fill-violet-500/80"
                                radius={[2, 2, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
             </Card>

             <Card className="bg-muted/20 border-muted-foreground/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Gross Profit Ratio</CardTitle>
                </CardHeader>
                <CardContent className="h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                            <Bar 
                                dataKey="value" 
                                className="fill-blue-500/80"
                                radius={[2, 2, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
             </Card>

             <Card className="bg-muted/20 border-muted-foreground/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Budget Variance</CardTitle>
                </CardHeader>
                <CardContent className="h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={lineData}>
                            <Area type="monotone" dataKey="profit" stroke="#a855f7" fill="#a855f722" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
             </Card>
        </div>

      </div>
    </div>
  );
}
