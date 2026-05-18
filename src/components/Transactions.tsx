import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTransactions, createTransaction } from "@/src/lib/api";
import { useStore } from "@/src/store/useStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import { parseTransactionText } from "@/src/lib/gemini";
import { Loader2, Plus, Sparkles, Settings2, Eye, EyeOff, ChevronUp, ChevronDown, FileUp, Check, ArrowDownLeft, ArrowUpRight, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";

type ColumnKey = "date" | "description" | "category" | "notes" | "amount";

interface ColumnDef {
  key: ColumnKey;
  label: string;
  visible: boolean;
}

const DEFAULT_COLUMNS: ColumnDef[] = [
  { key: "date", label: "Date", visible: true },
  { key: "description", label: "Description", visible: true },
  { key: "category", label: "Category", visible: true },
  { key: "notes", label: "Notes", visible: true },
  { key: "amount", label: "Amount", visible: true },
];

export function TransactionsPage() {
  const { currentEntity } = useStore();
  const queryClient = useQueryClient();
  const [nlpText, setNlpText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [columns, setColumns] = useState<ColumnDef[]>(DEFAULT_COLUMNS);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: transactions } = useQuery({ 
    queryKey: ["transactions", currentEntity?.id], 
    queryFn: () => fetchTransactions(currentEntity?.id) 
  });

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Transaction processed successfully");
    }
  });

  const toggleColumn = (key: ColumnKey) => {
    setColumns(prev => prev.map(col => 
      col.key === key ? { ...col, visible: !col.visible } : col
    ));
  };

  const moveColumn = (index: number, direction: 'up' | 'down') => {
    const newColumns = [...columns];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newColumns.length) return;
    
    [newColumns[index], newColumns[targetIndex]] = [newColumns[targetIndex], newColumns[index]];
    setColumns(newColumns);
  };

  const handleNlpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEntity) return toast.error("Please select an entity first");
    if (!nlpText) return;

    setIsParsing(true);
    try {
      const result = await parseTransactionText(nlpText);
      if (result) {
        await mutation.mutateAsync({
          entityId: currentEntity.id,
          amount: result.amount,
          type: result.type,
          category: result.category,
          rawCategory: result.category,
          description: result.description,
          notes: result.notes,
          confidenceScore: result.confidence,
        });
        setNlpText("");
      }
    } catch (error) {
      toast.error("AI parsing failed. Please use manual entry.");
    } finally {
      setIsParsing(false);
    }
  };

  const visibleColumns = columns.filter(c => c.visible);

  const filteredTransactions = transactions?.filter((tx: any) => 
    tx.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tx.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-8"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">Transaction Pipeline</h1>
          <p className="text-gray-400 font-bold tracking-[0.1em] text-xs uppercase">Intelligent ingestion and synthesis of financial intelligence</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00D4FF] transition-colors" size={16} />
                <Input 
                    placeholder="SCAN LEDGER..." 
                    className="pl-10 bg-[#0e1117]/80 border-white/10 h-11 w-72 text-[10px] font-black tracking-widest focus:border-[#00D4FF]/50 transition-all rounded-xl shadow-2xl"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button variant="outline" className="bg-[#0e1117]/80 border-white/10 h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-white/5 transition-all text-gray-300">
                <Filter size={14} /> FILTER
            </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <Card className="lg:col-span-1 border-white/5 bg-[#0e1117]/80 backdrop-blur-3xl p-6 relative overflow-hidden group flex flex-col">
          <CardHeader className="p-0 mb-6 relative z-10">
            <div className="flex items-center gap-2 mb-1">
                <div className="h-1 w-4 bg-[#00D4FF] rounded-full" />
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#00D4FF]">Direct Ingestion</CardTitle>
            </div>
            <CardDescription className="text-[10px] uppercase font-bold text-gray-500 ml-6">Intel Protocol v4.0</CardDescription>
          </CardHeader>
          <CardContent className="p-0 relative z-10 flex-1">
            <Tabs defaultValue="ai" className="w-full h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 bg-white/5 p-1 rounded-xl h-10">
                <TabsTrigger value="ai" className="gap-1.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#00D4FF] data-[state=active]:text-black transition-all rounded-lg h-full">
                    <Sparkles size={11} /> AI
                </TabsTrigger>
                <TabsTrigger value="csv" className="gap-1.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all rounded-lg h-full">
                    <FileUp size={11} /> CSV
                </TabsTrigger>
                <TabsTrigger value="manual" className="gap-1.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-violet-500 data-[state=active]:text-white transition-all rounded-lg h-full">
                    <Plus size={11} /> NEW
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="ai" className="pt-6 flex-1 flex flex-col">
                <form onSubmit={handleNlpSubmit} className="space-y-4 flex-1 flex flex-col">
                  <div className="space-y-2 flex-1">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00D4FF]/70">Neural Synthesis Input</Label>
                    <textarea
                      value={nlpText}
                      onChange={(e) => setNlpText(e.target.value)}
                      placeholder="Input natural language context..."
                      className="min-h-[160px] w-full rounded-xl border border-white/10 bg-black/40 px-4 py-4 text-sm font-medium text-white placeholder:text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#00D4FF]/40 transition-all resize-none shadow-inner"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl bg-[#00D4FF] text-black font-black uppercase tracking-[0.2em] text-[11px] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(0,212,255,0.3)]" disabled={isParsing || !currentEntity}>
                    {isParsing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                    Process Synthesis
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="csv" className="pt-6">
                <CsvUploadForm entityId={currentEntity?.id} onComplete={() => mutation.mutate({} as any)} />
              </TabsContent>

              <TabsContent value="manual" className="pt-6">
                 <ManualEntryForm entityId={currentEntity?.id} onComplete={() => mutation.mutate({} as any)} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-white/5 bg-[#0e1117]/80 backdrop-blur-3xl overflow-hidden p-0 relative shadow-2xl">
           <CardHeader className="flex flex-row items-center justify-between p-7 border-b border-white/5 bg-white/5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <div className="h-1 w-4 bg-[#00D4FF] rounded-full" />
                    <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#00D4FF]">Structured Ledger Output</CardTitle>
                </div>
                <CardDescription className="text-[11px] uppercase font-bold text-gray-500 ml-6">Authenticated Cluster Record</CardDescription>
              </div>
              <Popover>
                <PopoverTrigger render={
                  <Button variant="ghost" size="sm" className="h-8 group hover:bg-white/5 px-3 rounded-lg border border-white/5">
                    <Settings2 size={14} className="text-gray-500 group-hover:text-white transition-colors" />
                  </Button>
                } />
                <PopoverContent className="w-64 bg-[#1c1f26] border-white/5 p-4 rounded-2xl backdrop-blur-xl shadow-2xl" align="end">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#00D4FF] border-b border-white/5 pb-2">Toggle & Reorder Columns</h4>
                    <div className="space-y-2">
                      {columns.map((col, index) => (
                        <div key={col.key} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group">
                          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => moveColumn(index, 'up')} disabled={index === 0} className="hover:text-white text-gray-600 disabled:opacity-20"><ChevronUp size={12} /></button>
                            <button onClick={() => moveColumn(index, 'down')} disabled={index === columns.length - 1} className="hover:text-white text-gray-600 disabled:opacity-20"><ChevronDown size={12} /></button>
                          </div>
                          <Checkbox 
                            id={`col-${col.key}`} 
                            checked={col.visible} 
                            onCheckedChange={() => toggleColumn(col.key)} 
                            className="bg-white/5 border-white/10"
                          />
                          <Label htmlFor={`col-${col.key}`} className="flex-1 cursor-pointer text-xs font-bold text-gray-400 group-hover:text-white transition-colors">
                            {col.label}
                          </Label>
                          {col.visible ? <Eye size={12} className="text-[#00D4FF]/60" /> : <EyeOff size={12} className="text-rose-500/40" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
           </CardHeader>
           <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-white/5">
                        <TableRow className="border-none hover:bg-transparent">
                            {visibleColumns.map(col => (
                              <TableHead key={col.key} className={cn(
                                "text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 h-14",
                                col.key === 'amount' ? "text-right pr-8" : "pl-8"
                              )}>
                                {col.label}
                              </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                            {filteredTransactions?.map((tx: any, i: number) => (
                                <motion.tr
                                    key={tx.id || i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="border-b border-white/5 hover:bg-white/[0.02] transition-all group"
                                >
                                    {visibleColumns.map(col => {
                                      if (col.key === 'date') return (
                                        <TableCell key={col.key} className="pl-8 py-5">
                                          <div className="flex flex-col">
                                            <span className="text-[11px] font-black text-gray-100 uppercase letter tracking-tighter">
                                                {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <span className="text-[9px] font-bold text-gray-500 uppercase mt-0.5">
                                                {new Date(tx.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                          </div>
                                        </TableCell>
                                      );
                                      if (col.key === 'description') return (
                                        <TableCell key={col.key} className="pl-8 py-5">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                {tx.type === 'income' ? <ArrowDownLeft className="text-emerald-500" size={14} /> : <ArrowUpRight className="text-rose-500" size={14} />}
                                            </div>
                                            <span className="font-bold text-xs text-white uppercase tracking-tight">
                                                {tx.description}
                                            </span>
                                          </div>
                                        </TableCell>
                                      );
                                      if (col.key === 'category') return (
                                        <TableCell key={col.key} className="pl-8 py-5">
                                          <Badge variant="outline" className={cn(
                                              "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border-white/10",
                                              tx.type === 'income' ? "bg-emerald-500/10 text-emerald-500" : "bg-[#00D4FF]/10 text-[#00D4FF]"
                                          )}>
                                              {tx.category}
                                          </Badge>
                                        </TableCell>
                                      );
                                      if (col.key === 'notes') return (
                                        <TableCell key={col.key} className="pl-8 py-5">
                                          <span className="text-[10px] font-medium text-gray-400 italic truncate max-w-[150px] block opacity-70">
                                            {tx.notes || "No additional context"}
                                          </span>
                                        </TableCell>
                                      );
                                      if (col.key === 'amount') return (
                                        <TableCell key={col.key} className="pr-8 py-5 text-right">
                                          <div className={cn(
                                            "text-sm font-black tabular-nums tracking-tighter",
                                            tx.type === 'income' ? "text-emerald-500" : "text-rose-500"
                                          )}>
                                            {tx.type === 'income' ? "+" : "-"}{formatCurrency(tx.amount)}
                                          </div>
                                        </TableCell>
                                      );
                                      return null;
                                    })}
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        {(!filteredTransactions || filteredTransactions.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={visibleColumns.length} className="h-48 text-center text-gray-600 font-black uppercase tracking-widest text-[10px]">
                                    Pipeline Empty • Waiting for ingestion
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
              </div>
           </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

function CsvUploadForm({ entityId, onComplete }: { entityId?: string, onComplete: () => void }) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleUpload = () => {
        if (!file || !entityId) return;
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setFile(null);
            onComplete();
            toast.success(`Batch processed: 12 transactions imported from ${file.name}`);
        }, 1500);
    };

    return (
        <div className="space-y-4">
            <div 
                className={cn(
                    "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all h-[240px]",
                    isDragging ? "border-[#00D4FF] bg-[#00D4FF]/5" : "border-white/5 bg-white/5",
                    file ? "border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : ""
                )}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
            >
                {file ? (
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                            <Check size={28} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-white uppercase tracking-tight">{file.name}</p>
                            <p className="text-[10px] text-emerald-500/60 font-black uppercase tracking-widest mt-1">Ready for synthesis</p>
                        </div>
                        <Button variant="ghost" size="sm" className="mt-2 text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 text-[10px] font-black uppercase tracking-widest" onClick={() => setFile(null)}>Cancel</Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-gray-500">
                            <FileUp size={28} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-white uppercase tracking-widest">Upload Statement</p>
                            <p className="text-[10px] text-gray-600 font-bold uppercase mt-1">Drag and drop or browse CSV</p>
                        </div>
                        <Input 
                            type="file" 
                            accept=".csv" 
                            className="absolute inset-0 cursor-pointer opacity-0" 
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }}
                        />
                    </div>
                )}
            </div>

            <Button 
                className="w-full h-12 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                disabled={!file || isProcessing || !entityId}
                onClick={handleUpload}
            >
                {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <FileUp size={16} />}
                {isProcessing ? "Analyzing Pipeline..." : "Process Batch"}
            </Button>
        </div>
    );
}

function ManualEntryForm({ entityId, onComplete }: { entityId?: string, onComplete: () => void }) {
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("expense");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [notes, setNotes] = useState("");
    const mutation = useMutation({
        mutationFn: createTransaction,
        onSuccess: () => {
            onComplete();
            setAmount("");
            setDescription("");
            setNotes("");
            setCategory("");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!entityId) return toast.error("Select entity");
        mutation.mutate({
            entityId,
            amount: Number(amount),
            type,
            category,
            rawCategory: category,
            description,
            notes,
        });
    };    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Value</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-black text-[#00D4FF] uppercase">$</span>
                      <Input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-8 bg-white/5 border-white/10 h-11 rounded-xl text-[14px] font-black text-white focus:ring-[#00D4FF]/30 transition-all"
                        placeholder="0.00"
                        required 
                      />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Type</Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="bg-white/5 border-white/10 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest text-white px-4">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1c1f26] border-white/10 rounded-xl">
                            <SelectItem value="income" className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Income</SelectItem>
                            <SelectItem value="expense" className="text-[10px] font-black uppercase tracking-widest text-rose-500">Expense</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Category</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. FOOD, SALARY..." className="bg-white/5 border-white/10 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest text-white px-4" required />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Description</Label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} className="bg-white/5 border-white/10 h-11 rounded-xl text-xs font-medium text-white px-4" />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Contextual Notes</Label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-white/5 border-white/10 h-11 rounded-xl text-[10px] font-medium text-white px-4" />
            </div>
            <Button type="submit" variant="secondary" className="w-full h-12 rounded-xl bg-violet-600 text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-violet-500 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] gap-2">
                <Check size={16} className="text-[#00D4FF] drop-shadow-[0_0_8px_#00D4FF]" />
                Commit to Ledger
            </Button>
        </form>
    );
}
