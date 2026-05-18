import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchEntities, createEntity, updateEntity } from "@/src/lib/api";
import { useStore } from "@/src/store/useStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Building2, User, Factory, HeartPulse, School, GraduationCap, Users, Plus, Check, Briefcase, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const entityConfig: Record<string, { icon: any, color: string, bg: string }> = {
  individual: { icon: User, color: "text-blue-500", bg: "bg-blue-500/10" },
  company: { icon: Building2, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  factory: { icon: Factory, color: "text-amber-500", bg: "bg-amber-500/10" },
  hospital: { icon: HeartPulse, color: "text-rose-500", bg: "bg-rose-500/10" },
  school: { icon: School, color: "text-violet-500", bg: "bg-violet-500/10" },
  university: { icon: GraduationCap, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  organization: { icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  business: { icon: Briefcase, color: "text-pink-500", bg: "bg-pink-500/10" },
};

export function EntitiesPage() {
  const queryClient = useQueryClient();
  const { currentEntity, setCurrentEntity } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("individual");
  const [editEntityId, setEditEntityId] = useState<string | null>(null);
  const [isConfirmingEdit, setIsConfirmingEdit] = useState(false);

  const { data: entities } = useQuery({ queryKey: ["entities"], queryFn: fetchEntities });

  const createMutation = useMutation({
    mutationFn: createEntity,
    onSuccess: (newEntity) => {
      queryClient.invalidateQueries({ queryKey: ["entities"] });
      setIsCreating(false);
      setName("");
      setCurrentEntity(newEntity);
      toast.success(`${newEntity.name} created and selected`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, name: string, type: string }) => updateEntity(data.id, { name: data.name, type: data.type }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["entities"] });
      setIsEditing(false);
      setIsConfirmingEdit(false);
      setEditEntityId(null);
      if (currentEntity?.id === updated.id) {
        setCurrentEntity(updated);
      }
      toast.success(`${updated.name} updated successfully`);
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ name, type });
  };

  const handleEditClick = (e: React.MouseEvent, entity: any) => {
    e.stopPropagation();
    setEditEntityId(entity.id);
    setName(entity.name);
    setType(entity.type);
    setIsEditing(true);
  };

  const handleUpdate = () => {
    if (editEntityId) {
      updateMutation.mutate({ id: editEntityId, name, type });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Entities</h1>
          <p className="text-muted-foreground">Manage and pivot between multi-entity financial contexts</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)} className="gap-2">
          {isCreating ? "Cancel" : <><Plus size={16} /> New Entity</>}
        </Button>
      </div>

      {isCreating && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Create New Entity</CardTitle>
            <CardDescription>Setup a new tracking context for a specific entity type</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Entity Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Acme Corp" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Entity Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="factory">Factory</SelectItem>
                      <SelectItem value="hospital">Hospital</SelectItem>
                      <SelectItem value="school">School</SelectItem>
                      <SelectItem value="university">University</SelectItem>
                      <SelectItem value="organization">Organization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full">Initialize Intelligence System</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {entities?.map((entity: any) => {
          const config = entityConfig[entity.type] || entityConfig.company;
          const Icon = config.icon;
          const isSelected = currentEntity?.id === entity.id;

          return (
            <Card 
              key={entity.id} 
              className={cn(
                "relative cursor-pointer transition-all hover:border-primary/50 group overflow-hidden border-muted-foreground/10",
                isSelected && "border-primary ring-1 ring-primary shadow-lg shadow-primary/5 bg-primary/5"
              )}
              onClick={() => setCurrentEntity(entity)}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className={cn(
                  "rounded-xl p-3 transition-transform group-hover:scale-110", 
                  isSelected ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : config.bg
                )}>
                  <Icon size={24} className={cn(isSelected ? "text-primary-foreground" : config.color)} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="truncate font-bold text-lg tracking-tight text-foreground">{entity.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-current/20", config.bg, config.color)}>
                      {entity.type}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  {isSelected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleEditClick(e, entity)}
                  >
                    <Pencil size={14} className="text-muted-foreground hover:text-primary" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Entity</DialogTitle>
            <DialogDescription>
              Modify entity details. Changes will require confirmation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Entity Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Entity Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="edit-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="factory">Factory</SelectItem>
                  <SelectItem value="hospital">Hospital</SelectItem>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="university">University</SelectItem>
                  <SelectItem value="organization">Organization</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={() => setIsConfirmingEdit(true)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmingEdit} onOpenChange={setIsConfirmingEdit}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to update this entity? This action will modify the tracking context.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">New Name:</span>
              <span className="font-bold">{name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">New Type:</span>
              <span className="font-bold capitalize">{type}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmingEdit(false)}>Go Back</Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Confirm Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
