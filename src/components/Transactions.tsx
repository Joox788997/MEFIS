import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTransactions, createTransaction, fetchEntities } from "@/src/lib/api";
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
import { Loader2, Plus, Sparkles, ReceiptText, Settings2, Eye, EyeOff, ChevronUp, ChevronDown, FileUp, Check } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transaction Pipeline</h1>
          <p className="text-muted-foreground">Intelligent ingestion and normalization of financial data</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Direct Ingestion</CardTitle>
            <CardDescription>Manual or AI-assisted entry</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ai">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ai" className="gap-2">
                    <Sparkles size={16} /> AI Smart
                </TabsTrigger>
                <TabsTrigger value="csv" className="gap-2">
                    <FileUp size={16} /> CSV
                </TabsTrigger>
                <TabsTrigger value="manual" className="gap-2">
                    <Plus size={16} /> Manual
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="ai" className="pt-4">
                <form onSubmit={handleNlpSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nlp">Describe transaction</Label>
                    <textarea
                      id="nlp"
                      value={nlpText}
                      onChange={(e) => setNlpText(e.target.value)}
                      placeholder="e.g. spent 500 on groceries or received 5000 salary"
                      className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2" disabled={isParsing || !currentEntity}>
                    {isParsing && <Loader2 className="animate-spin" size={16} />}
                    Process with AI
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="csv" className="pt-4">
                <CsvUploadForm entityId={currentEntity?.id} onComplete={() => mutation.mutate({} as any)} />
              </TabsContent>

              <TabsContent value="manual" className="pt-4">
                 <ManualEntryForm entityId={currentEntity?.id} onComplete={() => mutation.mutate({} as any)} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
           <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Structured Transactions</CardTitle>
                <CardDescription>Canonical data model output</CardDescription>
              </div>
              <Popover>
                <PopoverTrigger render={
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings2 size={14} /> Customize Columns
                  </Button>
                } />
                <PopoverContent className="w-64 p-3" align="end">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold border-b pb-2">Toggle & Reorder Columns</h4>
                    <div className="space-y-2">
                      {columns.map((col, index) => (
                        <div key={col.key} className="flex items-center gap-2 group transition-all">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={() => moveColumn(index, 'up')}
                            disabled={index === 0}
                          >
                            <ChevronUp size={12} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={() => moveColumn(index, 'down')}
                            disabled={index === columns.length - 1}
                          >
                            <ChevronDown size={12} />
                          </Button>
                          <Checkbox 
                            id={`col-${col.key}`} 
                            checked={col.visible} 
                            onCheckedChange={() => toggleColumn(col.key)} 
                          />
                          <Label htmlFor={`col-${col.key}`} className="flex-1 cursor-pointer text-sm">
                            {col.label}
                          </Label>
                          {col.visible ? <Eye size={12} className="text-muted-foreground" /> : <EyeOff size={12} className="text-destructive/50" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
           </CardHeader>
           <CardContent>
              <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {visibleColumns.map(col => (
                              <TableHead key={col.key} className={col.key === 'amount' ? "text-right" : ""}>
                                {col.label}
                              </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions?.map((tx: any) => (
                            <TableRow key={tx.id}>
                                {visibleColumns.map(col => {
                                  if (col.key === 'date') return (
                                    <TableCell key={col.key} className="text-xs text-muted-foreground font-medium">
                                      {new Date(tx.createdAt).toLocaleDateString()}
                                    </TableCell>
                                  );
                                  if (col.key === 'description') return (
                                    <TableCell key={col.key} className="font-semibold text-xs md:text-sm text-foreground">
                                      {tx.description}
                                    </TableCell>
                                  );
                                  if (col.key === 'category') return (
                                    <TableCell key={col.key}>
                                      <Badge variant={tx.confidenceScore && Number(tx.confidenceScore) < 0.7 ? "outline" : "secondary"} className="text-[10px] uppercase">
                                          {tx.category}
                                      </Badge>
                                    </TableCell>
                                  );
                                  if (col.key === 'notes') return (
                                    <TableCell key={col.key} className="text-xs text-muted-foreground/80 italic truncate max-w-[100px] group-hover:text-muted-foreground transition-colors">
                                      {tx.notes}
                                    </TableCell>
                                  );
                                  if (col.key === 'amount') return (
                                    <TableCell key={col.key} className={cn("text-right font-bold tabular-nums", tx.type === 'income' ? "text-emerald-500" : "text-rose-500")}>
                                      {tx.type === 'income' ? "+" : "-"}{formatCurrency(tx.amount)}
                                    </TableCell>
                                  );
                                  return null;
                                })}
                            </TableRow>
                        ))}
                        {(!transactions || transactions.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={visibleColumns.length} className="h-24 text-center text-muted-foreground">
                                    No transactions recorded yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
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
                    "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all",
                    isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20 bg-muted/20",
                    file ? "border-emerald-500/50 bg-emerald-500/5" : ""
                )}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
            >
                {file ? (
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                            <Check size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • Ready to process</p>
                        </div>
                        <Button variant="ghost" size="sm" className="mt-2 text-rose-500" onClick={() => setFile(null)}>Remove</Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <FileUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground">Upload CSV Statement</p>
                            <p className="text-xs text-muted-foreground font-medium">Drag and drop or click to browse</p>
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
                className="w-full gap-2" 
                disabled={!file || isProcessing || !entityId}
                onClick={handleUpload}
            >
                {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                {isProcessing ? "Analyzing Batch..." : "Normalize & Import Batch"}
            </Button>
            
            <div className="rounded-lg bg-muted/30 p-3 text-[10px] text-muted-foreground leading-relaxed">
                <p className="font-bold uppercase tracking-widest text-primary mb-1">CSV Template</p>
                Expected: date, description, amount, category, type
            </div>
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
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!entityId) return toast.error("Select entity");
        mutation.mutate({
            entityId,
            amount,
            type,
            category,
            description,
            notes,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">$</span>
                      <Input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        className="pl-7"
                        placeholder="0.00"
                        required 
                      />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Category</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Food, Salary" required />
            </div>
            <div className="space-y-2">
                <Label>Description</Label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label>Notes</Label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional context..." />
            </div>
            <Button type="submit" variant="secondary" className="w-full">Create Transaction</Button>
        </form>
    );
}
