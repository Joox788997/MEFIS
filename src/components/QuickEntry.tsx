import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "@/src/lib/api";
import { useStore } from "@/src/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Sparkles, TrendingUp, TrendingDown, LayoutDashboard, Zap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface QuickEntryProps {
  customTrigger?: React.ReactElement;
}

export function QuickEntry({ customTrigger }: QuickEntryProps) {
  const { currentEntity } = useStore();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Intelligence updated successfully");
      setIsOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`Analysis failed: ${error.message}`);
    }
  });

  const resetForm = () => {
    setAmount("");
    setType("expense");
    setCategory("");
    setDescription("");
    setNotes("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEntity) return toast.error("Select an entity first");
    if (!amount || !category) return toast.error("Missing required fields");

    setIsProcessing(true);
    mutation.mutate({
      entityId: currentEntity.id,
      amount,
      type,
      category,
      description: description || category,
      notes,
    });
    setIsProcessing(false);
  };

  const commonCategories = type === "income" 
    ? ["Salary", "Investment", "Sales", "Grant", "Donation", "Refund"]
    : ["Food", "Transport", "Utilities", "Maintenance", "Rent", "Salary", "Supplies", "Marketing"];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {customTrigger ? (
        <DialogTrigger render={customTrigger} />
      ) : (
        <DialogTrigger render={
          <Button className="gap-2 shadow-lg" size="lg">
            <PlusCircle size={18} />
            <span>Quick Intel Entry</span>
          </Button>
        } />
      )}
      <DialogContent className="sm:max-w-[425px] bg-[#0e1117] border-white/10 text-white">
          <DialogHeader className="border-b border-white/5 pb-4">
          <DialogTitle className="flex items-center gap-2 text-white">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-inner">
                <Sparkles size={20} className="text-[#00D4FF]" />
             </div>
             Unified Transaction Pipeline
          </DialogTitle>
          <DialogDescription className="text-gray-400 font-medium pt-1">
            Enter financial behavior for intelligent normalization and analysis.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="flex gap-2">
             <Button 
                type="button"
                variant={type === "income" ? "default" : "outline"}
                className={cn("flex-1 gap-2 border-white/10", type === "income" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "text-gray-400 hover:text-white")}
                onClick={() => setType("income")}
             >
                <TrendingUp size={16} /> Income
             </Button>
             <Button 
                type="button"
                variant={type === "expense" ? "default" : "outline"}
                className={cn("flex-1 gap-2 border-white/10", type === "expense" ? "bg-rose-600 hover:bg-rose-700 text-white" : "text-gray-400 hover:text-white")}
                onClick={() => setType("expense")}
             >
                <TrendingDown size={16} /> Expense
             </Button>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2 group">
              <Label htmlFor="amount" className="text-xs font-black uppercase tracking-wider text-gray-500 group-hover:text-[#00D4FF] transition-colors">Numeric Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#00D4FF] font-black">$</span>
                <Input 
                   id="amount" 
                   type="number" 
                   step="0.01"
                   placeholder="0.00" 
                   className="pl-8 text-xl font-black text-white bg-white/5 border-white/10 focus:ring-[#00D4FF]/30"
                   value={amount}
                   onChange={(e) => setAmount(e.target.value)}
                   required
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <Label className="text-xs font-black uppercase tracking-wider text-gray-500 group-hover:text-[#00D4FF] transition-colors">Category Allocation</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white font-semibold">
                  <SelectValue placeholder="Select or type category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1c1f26] border-white/10 text-white">
                  {commonCategories.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                  <SelectItem value="Other">Other (Custom)</SelectItem>
                </SelectContent>
              </Select>
              {category === "Other" && (
                 <Input 
                    placeholder="Enter custom category..." 
                    className="mt-2 bg-white/5 border-white/10 text-white"
                    onChange={(e) => setCategory(e.target.value === "" ? "Other" : e.target.value)}
                 />
              )}
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="desc" className="text-xs font-black uppercase tracking-wider text-gray-500 group-hover:text-[#00D4FF] transition-colors">Behavior Explanation</Label>
              <Input 
                 id="desc" 
                 placeholder="e.g. Monthly maintenance fee" 
                 className="bg-white/5 border-white/10 text-white"
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="notes" className="text-xs font-black uppercase tracking-wider text-gray-500 group-hover:text-[#00D4FF] transition-colors">Additional Notes</Label>
              <Input 
                 id="notes" 
                 placeholder="Optional internal notes..." 
                 className="bg-white/5 border-white/10 text-white"
                 value={notes}
                 onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full gap-2 bg-[#00D4FF] text-black font-black hover:bg-[#00D4FF]/80" size="lg" disabled={isProcessing || mutation.isPending}>
             {isProcessing || mutation.isPending ? (
                <Sparkles className="animate-pulse" size={18} />
             ) : (
                <Zap size={18} />
             )}
             Incorporate and Analyze
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
