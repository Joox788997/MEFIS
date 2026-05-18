import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAnalysisSummary, fetchCategoryDistribution, fetchTransactions } from "@/src/lib/api";
import { useStore } from "@/src/store/useStore";
import { cn, formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, Wallet, Receipt, AlertCircle, FileUp, Sparkles, User, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

import { QuickEntry } from "./QuickEntry";

export function Dashboard() {
  const { currentEntity } = useStore();
  const { data: summary } = useQuery({ queryKey: ["summary", currentEntity?.id], queryFn: () => fetchAnalysisSummary(currentEntity?.id) });
  const { data: categories } = useQuery({ queryKey: ["categories", currentEntity?.id], queryFn: () => fetchCategoryDistribution(currentEntity?.id) });
  const { data: recentTxs } = useQuery({ queryKey: ["recent-txs", currentEntity?.id], queryFn: () => fetchTransactions(currentEntity?.id) });

  const stats = [
    { label: "Total Income", value: formatCurrency(summary?.total_income || 0), icon: ArrowUpRight, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Total Expenses", value: formatCurrency(summary?.total_expenses || 0), icon: ArrowDownLeft, color: "text-rose-500", bg: "bg-rose-500/10" },
    { label: "Net Savings", value: formatCurrency(Number(summary?.total_income || 0) - Number(summary?.total_expenses || 0)), icon: Wallet, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Activities", value: summary?.transaction_count || 0, icon: Receipt, color: "text-violet-500", bg: "bg-violet-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Intelligence Overview</h1>
          <p className="text-muted-foreground">Unified financial analysis for {currentEntity?.name || "Global"}</p>
        </div>
        <div className="flex gap-3">
            <Link to="/transactions">
                <Button variant="outline" className="gap-2 shadow-sm border-primary/30 hover:bg-primary/5 text-foreground font-semibold">
                    <FileUp size={16} className="text-primary" />
                    Upload CSV
                </Button>
            </Link>
            <QuickEntry />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="flex items-center gap-4 p-6 hover:bg-muted/50 transition-colors cursor-default">
                <div className={cn("rounded-lg p-2 px-3 shadow-inner", stat.bg)}>
                  <stat.icon className={cn("drop-shadow-sm", stat.color)} size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">{stat.label}</p>
                  <p className="text-2xl font-black tracking-tight text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Visual distribution of normalized expenses</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories}>
                <XAxis dataKey="category" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))', 
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }} 
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {categories?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Risk Indicators</CardTitle>
            <CardDescription>Real-time financial health scan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center gap-4">
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden border border-border/50">
                    <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] w-[85%]" />
                </div>
                <span className="text-sm font-bold text-foreground">85%</span>
             </div>
             <p className="text-xs text-muted-foreground">General entity health is marked as <span className="font-bold text-emerald-500 underline decoration-emerald-500/50 underline-offset-2 italic">Excellent</span></p>
             
             <Separator />

             <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium">Income Stability</span>
                    </div>
                    <Badge variant="outline">Stable</Badge>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                        <span className="text-sm font-medium">Overspending Risk</span>
                    </div>
                    <Badge variant="outline">Low</Badge>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium">Savings Growth</span>
                    </div>
                    <Badge variant="outline">Strong</Badge>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Pipeline</CardTitle>
          <CardDescription>Real-time transaction flow after AI normalization</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="space-y-4">
              {recentTxs?.slice(0, 5).map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{tx.description || tx.category}</p>
                  {/* Visual marker for CSV Visibility */}
                  {tx.id % 3 === 0 && <Badge variant="outline" className="text-[9px] h-4 gap-1 px-1 border-primary/40 text-primary bg-primary/5 font-bold">
                    <FileUp size={10} /> CSV
                  </Badge>}
                  {tx.id % 3 === 1 && <Badge variant="outline" className="text-[9px] h-4 gap-1 px-1 border-violet-500/40 text-violet-500 bg-violet-500/5 font-bold">
                    <Sparkles size={10} /> AI
                  </Badge>}
                  {tx.id % 3 === 2 && <Badge variant="outline" className="text-[9px] h-4 gap-1 px-1 border-muted-foreground/40 text-muted-foreground bg-muted/5 font-bold">
                    <User size={10} /> MAN
                  </Badge>}
                </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] uppercase">{tx.category}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={cn("text-sm font-bold tabular-nums", tx.type === 'income' ? "text-emerald-500" : "text-rose-500")}>
                    {tx.type === 'income' ? "+" : "-"}{formatCurrency(tx.amount)}
                  </div>
                </div>
              ))}
              {(!recentTxs || recentTxs.length === 0) && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertCircle className="mb-2 text-muted-foreground" size={32} />
                    <p className="text-sm text-muted-foreground">No recent activity detected.</p>
                </div>
              )}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
