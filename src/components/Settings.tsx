import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCurrentUser, updateProfile, updatePreferences, updateSecurity } from "@/src/lib/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { User, Shield, Bell, Palette, Timer, Laptop, Save, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useStore } from "@/src/store/useStore";
import { cn } from "@/lib/utils";

export default function Settings() {
  const queryClient = useQueryClient();
  const { setDarkMode } = useStore();
  const { data: user, isLoading } = useQuery({ 
    queryKey: ["user"], 
    queryFn: fetchCurrentUser 
  });

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState("system");
  const [studyTimer, setStudyTimer] = useState(25);
  const [breakTimer, setBreakTimer] = useState(5);
  const [reminders, setReminders] = useState(true);
  const [notifTasks, setNotifTasks] = useState(true);
  const [notifSchedule, setNotifSchedule] = useState(true);
  const [notifStudy, setNotifStudy] = useState(true);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setTheme(user.theme || "system");
      if (user.preferences) {
        setStudyTimer(user.preferences.studyTimer || 25);
        setBreakTimer(user.preferences.breakTimer || 5);
        setReminders(user.preferences.reminders !== false);
        setNotifTasks(user.preferences.notifications?.tasks !== false);
        setNotifSchedule(user.preferences.notifications?.schedule !== false);
        setNotifStudy(user.preferences.notifications?.study !== false);
      }
    }
  }, [user]);

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Profile updated successfully");
    }
  });

  const preferenceMutation = useMutation({
    mutationFn: updatePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Preferences saved successfully");
    }
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    profileMutation.mutate({ fullName, email });
  };

  const handlePreferenceSave = () => {
    if (theme === "dark") setDarkMode(true);
    else if (theme === "light") setDarkMode(false);

    preferenceMutation.mutate({
      theme,
      preferences: {
        studyTimer,
        breakTimer,
        reminders,
        notifications: {
          tasks: notifTasks,
          schedule: notifSchedule,
          study: notifStudy
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <RefreshCw className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tighter">System Settings</h1>
        <p className="text-muted-foreground font-medium">Configure your workspace and AI node preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 rounded-xl bg-muted/40 p-1">
          <TabsTrigger value="profile" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <User size={14} /> Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Timer size={14} /> Productivity
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Bell size={14} /> Alerts
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Shield size={14} /> Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-4">
          <Card className="border-border/50 shadow-xl shadow-black/5 rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/30 pb-6">
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your public identity on the platform.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleProfileSave} className="space-y-6">
                <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-2xl bg-primary/10 border-2 border-dashed border-primary/20 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                        {user?.avatarUrl ? (
                             <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User size={32} className="text-primary/40" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Change</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold">Avatar Node</span>
                        <span className="text-xs text-muted-foreground">Recommend 400x400 SVG or PNG.</span>
                    </div>
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-bold uppercase text-[10px] tracking-widest">Full Name</Label>
                    <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold uppercase text-[10px] tracking-widest">Email Access</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl" />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t flex justify-end gap-3 p-4">
              <Button type="submit" variant="ghost" className="rounded-lg" onClick={() => { setFullName(user?.fullName || ""); setEmail(user?.email || ""); }}>Cancel</Button>
              <Button onClick={handleProfileSave} disabled={profileMutation.isPending} className="rounded-lg bg-primary shadow-lg shadow-primary/20">
                {profileMutation.isPending ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} className="mr-2" />}
                Save Profile
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6 space-y-4">
          <Card className="border-border/50 shadow-xl shadow-black/5 rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/30 pb-6">
              <CardTitle>Productivity Flow</CardTitle>
              <CardDescription>Tailor the deep-work timers and interface theme.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Palette className="text-primary" size={18} />
                        <div className="flex flex-col">
                            <Label className="text-sm font-bold">Interface Theme</Label>
                            <span className="text-xs text-muted-foreground">Adjust the visual environment of the intel board.</span>
                        </div>
                    </div>
                    <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="w-[180px] rounded-xl">
                            <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="light" className="rounded-lg">Light Core</SelectItem>
                            <SelectItem value="dark" className="rounded-lg">Dark Core</SelectItem>
                            <SelectItem value="system" className="rounded-lg">Auto Protocol</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <Timer className="text-primary" size={18} />
                    <Label className="text-sm font-bold">Concentration Engine</Label>
                </div>
                
                <div className="space-y-6 px-1">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Deep Work Session</span>
                            <span className="text-lg font-black">{studyTimer}m</span>
                        </div>
                        <Slider 
                            value={[studyTimer]} 
                            onValueChange={(val) => setStudyTimer(val[0])} 
                            max={120} 
                            min={5} 
                            step={5}
                            className="py-4"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Recharge Break</span>
                            <span className="text-lg font-black">{breakTimer}m</span>
                        </div>
                        <Slider 
                            value={[breakTimer]} 
                            onValueChange={(val) => setBreakTimer(val[0])} 
                            max={30} 
                            min={2} 
                            step={1}
                            className="py-4"
                        />
                    </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t flex justify-end gap-3 p-4">
              <Button onClick={handlePreferenceSave} disabled={preferenceMutation.isPending} className="rounded-lg bg-primary shadow-lg shadow-primary/20">
                 {preferenceMutation.isPending ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} className="mr-2" />}
                 Apply Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-4">
          <Card className="border-border/50 shadow-xl shadow-black/5 rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/30 pb-6">
              <CardTitle>Alert Protocols</CardTitle>
              <CardDescription>Manage how the system communicates urgent intel.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/10">
                    <div className="space-y-1">
                        <Label className="text-sm font-extrabold">Master Reminders</Label>
                        <p className="text-xs text-muted-foreground">Enable all system push notifications and browser alerts.</p>
                    </div>
                    <Switch checked={reminders} onCheckedChange={setReminders} />
                </div>

                <div className="space-y-4 px-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Individual Subscriptions</h4>
                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium">Task Deadlines</span>
                        <Switch checked={notifTasks} onCheckedChange={setNotifTasks} disabled={!reminders} />
                    </div>
                    <Separator className="opacity-50" />
                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium">Auto-Schedule Sync</span>
                        <Switch checked={notifSchedule} onCheckedChange={setNotifSchedule} disabled={!reminders} />
                    </div>
                    <Separator className="opacity-50" />
                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium">Concentration Reminders</span>
                        <Switch checked={notifStudy} onCheckedChange={setNotifStudy} disabled={!reminders} />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t flex justify-end gap-3 p-4">
              <Button onClick={handlePreferenceSave} disabled={preferenceMutation.isPending} className="rounded-lg bg-primary shadow-lg shadow-primary/20">
                 Apply Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-4">
          <Card className="border-border/50 shadow-xl shadow-black/5 rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/30 pb-6">
              <CardTitle>Security & Hardware</CardTitle>
              <CardDescription>Manage credentials and authentication layers.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 flex items-start gap-4">
                <AlertCircle className="text-rose-500 shrink-0 mt-1" size={20} />
                <div className="space-y-1">
                    <h5 className="text-sm font-black text-rose-600 uppercase tracking-tight">Security Alert</h5>
                    <p className="text-xs text-rose-500/80 leading-relaxed">Multi-factor authentication is recommended for all ledger accounts. Proceed to update your security protocols below.</p>
                </div>
              </div>

              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Current Access Code</Label>
                  <Input type="password" placeholder="••••••••••••" className="rounded-xl bg-muted/30 border-transparent" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">New Access Code</Label>
                        <Input type="password" placeholder="••••••••••••" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <Label className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Verify Code</Label>
                        <Input type="password" placeholder="••••••••••••" className="rounded-xl" />
                    </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t flex justify-between p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                 <Shield size={14} />
                 <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encrypted</span>
              </div>
              <Button variant="outline" className="rounded-lg border-rose-500/30 text-rose-500 hover:bg-rose-500/10">
                Update Security
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
