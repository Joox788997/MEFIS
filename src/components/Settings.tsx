import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCurrentUser, updateProfile, updatePreferences } from "@/src/lib/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { 
  User, Shield, Bell, Palette, Cpu, Zap, Database, 
  RefreshCw, Save, Activity, Globe, Layers, HardDrive 
} from "lucide-react";
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

  // State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState("dark");
  const [aiCreativity, setAiCreativity] = useState(70);
  const [autoExtraction, setAutoExtraction] = useState(true);
  const [systemDensity, setSystemDensity] = useState("high");
  const [notifMode, setNotifMode] = useState("stealth");
  const [meshSync, setMeshSync] = useState(true);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setTheme(user.theme || "dark");
    }
  }, [user]);

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Profile Node Updated");
    }
  });

  const preferenceMutation = useMutation({
    mutationFn: updatePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("System Protocol Saved");
    }
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    profileMutation.mutate({ fullName, email });
  };

  const handleGlobalSave = () => {
    if (theme === "dark") setDarkMode(true);
    else if (theme === "light") setDarkMode(false);

    preferenceMutation.mutate({
      theme,
      preferences: {
        aiCreativity,
        autoExtraction,
        systemDensity,
        notifMode,
        meshSync
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <RefreshCw className="animate-spin text-[#00D4FF]" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
            <div className="h-2 w-10 bg-[#00D4FF] rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00D4FF]/60">System Core v4.0.2</span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">Architecture Configuration</h1>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-tight">Configure autonomous synthesis parameters and neural node behavior.</p>
      </div>

      <Tabs defaultValue="identity" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 rounded-2xl bg-black/40 border border-white/5 p-1 h-auto gap-1">
          <TabsTrigger value="identity" className="gap-2 py-3 rounded-xl data-[state=active]:bg-white/5 data-[state=active]:text-[#00D4FF] text-[10px] font-black uppercase tracking-widest transition-all">
            <User size={14} /> Identity
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="gap-2 py-3 rounded-xl data-[state=active]:bg-white/5 data-[state=active]:text-[#00D4FF] text-[10px] font-black uppercase tracking-widest transition-all">
            <Cpu size={14} /> AI Synthesis
          </TabsTrigger>
          <TabsTrigger value="mesh" className="gap-2 py-3 rounded-xl data-[state=active]:bg-white/5 data-[state=active]:text-[#00D4FF] text-[10px] font-black uppercase tracking-widest transition-all">
            <Globe size={14} /> Mesh Network
          </TabsTrigger>
          <TabsTrigger value="hardware" className="gap-2 py-3 rounded-xl data-[state=active]:bg-white/5 data-[state=active]:text-[#00D4FF] text-[10px] font-black uppercase tracking-widest transition-all">
            <Layers size={14} /> UI Hardware
          </TabsTrigger>
          <TabsTrigger value="ledger" className="gap-2 py-3 rounded-xl data-[state=active]:bg-white/5 data-[state=active]:text-[#00D4FF] text-[10px] font-black uppercase tracking-widest transition-all">
            <Database size={14} /> Data Ledger
          </TabsTrigger>
        </TabsList>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8"
        >
          {/* Identity Protocol */}
          <TabsContent value="identity" className="space-y-6 m-0">
            <Card className="border-white/5 bg-[#0e1117]/80 backdrop-blur-3xl overflow-hidden rounded-3xl shadow-2xl">
              <CardHeader className="border-b border-white/5 bg-white/5 p-8">
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-white">Identity Matrix</CardTitle>
                <CardDescription className="text-[10px] uppercase font-bold text-gray-500">Node identification and core authentication data.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center gap-8">
                    <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-[#1c1f26] to-black border-2 border-dashed border-[#00D4FF]/30 flex items-center justify-center relative group cursor-pointer overflow-hidden shadow-lg">
                        <User size={40} className="text-[#00D4FF]/40" />
                        <div className="absolute inset-0 bg-[#00D4FF]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Swap Node</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">Matrix Avatar</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Recommend 512x512 neural-net generated PNG.</p>
                        <Button variant="outline" size="sm" className="mt-2 h-8 text-[9px] font-black uppercase tracking-widest border-white/10 hover:bg-[#00D4FF] hover:text-black transition-all">Generate AI Avatar</Button>
                    </div>
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Universal Name</Label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-xl bg-black/40 border-white/10 h-12 text-sm font-medium text-white focus:ring-[#00D4FF]/30" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Node Access Point (Email)</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl bg-black/40 border-white/10 h-12 text-sm font-medium text-white focus:ring-[#00D4FF]/30" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-white/5 border-t border-white/5 flex justify-end gap-3 p-6">
                <Button onClick={handleProfileSave} disabled={profileMutation.isPending} className="h-12 px-8 rounded-xl bg-[#00D4FF] text-black font-black uppercase tracking-widest text-[11px] shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:brightness-110 active:scale-95 transition-all">
                  {profileMutation.isPending ? <RefreshCw className="animate-spin" size={16} /> : "Update Matrix"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* AI Synthesis Protocol */}
          <TabsContent value="intelligence" className="space-y-6 m-0">
            <Card className="border-white/5 bg-[#0e1117]/80 backdrop-blur-3xl overflow-hidden rounded-3xl shadow-2xl">
              <CardHeader className="border-b border-white/5 bg-white/5 p-8">
                <div className="flex items-center gap-2 mb-1">
                    <Cpu className="text-[#00D4FF]" size={16} />
                    <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-white">Neural Synthesis parameters</CardTitle>
                </div>
                <CardDescription className="text-[10px] uppercase font-bold text-gray-500">Calibrate the Gemini extraction engine for high-precision ledger entry.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-10">
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-1">
                        <div className="space-y-1">
                            <Label className="text-xs font-black text-white uppercase tracking-widest">Synthesis Creativity</Label>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Higher values allow for more fluid natural language interpretation.</p>
                        </div>
                        <span className="text-xl font-black text-[#00D4FF]">{aiCreativity}%</span>
                    </div>
                    <Slider 
                        value={[aiCreativity]} 
                        onValueChange={(val) => setAiCreativity(val[0])} 
                        max={100} 
                        step={1}
                        className="py-4"
                    />
                </div>

                <Separator className="bg-white/5" />

                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-black/40 border border-white/5 group border-white/10">
                        <div className="space-y-1">
                            <Label className="text-xs font-black text-white uppercase tracking-widest">Autonomous Extraction</Label>
                            <p className="text-[9px] text-gray-500 font-bold uppercase">Parse all ledger entries through AI node by default.</p>
                        </div>
                        <Switch checked={autoExtraction} onCheckedChange={setAutoExtraction} className="data-[state=checked]:bg-[#00D4FF]" />
                    </div>
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-black/40 border border-white/5 group border-white/10">
                        <div className="space-y-1">
                            <Label className="text-xs font-black text-white uppercase tracking-widest">Deep context Memory</Label>
                            <p className="text-[9px] text-gray-500 font-bold uppercase">Allow AI to access historical entity behavior.</p>
                        </div>
                        <Switch defaultChecked className="data-[state=checked]:bg-[#00D4FF]" />
                    </div>
                </div>
              </CardContent>
              <CardFooter className="bg-white/5 border-t border-white/5 flex justify-end p-6">
                <Button onClick={handleGlobalSave} className="h-12 px-8 rounded-xl bg-violet-600 text-white font-black uppercase tracking-widest text-[11px] shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:bg-violet-500 transition-all">
                  Commit Protocol Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Mesh Network Protocol */}
          <TabsContent value="mesh" className="space-y-6 m-0">
             <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-white/5 bg-[#0e1117]/80 backdrop-blur-3xl p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Zap className="text-amber-500" size={20} />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Sync Propulsion</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grid Synchronization</span>
                            <Switch checked={meshSync} onCheckedChange={setMeshSync} className="data-[state=checked]:bg-amber-500" />
                        </div>
                        <div className="flex justify-between items-center opacity-50">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Edge Node Relay</span>
                            <Switch defaultChecked className="data-[state=checked]:bg-amber-500" />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stealth Alert Mode</span>
                            <Switch checked={notifMode === "stealth"} onCheckedChange={(val) => setNotifMode(val ? "stealth" : "active")} className="data-[state=checked]:bg-amber-500" />
                        </div>
                    </div>
                </Card>

                <Card className="border-white/5 bg-[#0e1117]/80 backdrop-blur-3xl p-8 rounded-3xl border-rose-500/10">
                    <div className="flex items-center gap-3 mb-6 text-rose-500">
                        <Shield className="animate-pulse" size={20} />
                        <h3 className="text-sm font-black uppercase tracking-widest">Firewall Integrity</h3>
                    </div>
                    <div className="space-y-4">
                        <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed">System is currently running under Tier 4 security protocol. Neural endpoints are end-to-end encrypted across decentralized clusters.</p>
                        <Button className="w-full bg-rose-600/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest h-10 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                             Recalibrate Security Mesh
                        </Button>
                    </div>
                </Card>
             </div>
          </TabsContent>

          {/* UI Hardware Protocol */}
          <TabsContent value="hardware" className="space-y-6 m-0">
            <Card className="border-white/5 bg-[#0e1117]/80 backdrop-blur-3xl overflow-hidden rounded-3xl shadow-2xl">
              <CardHeader className="border-b border-white/5 bg-white/5 p-8">
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-white">Visual Hardware Calibration</CardTitle>
                <CardDescription className="text-[10px] uppercase font-bold text-gray-500">Modify the resolution and density of the intelligence dashboard.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-10">
                <div className="grid gap-8 sm:grid-cols-2">
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">System Theme mode</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button 
                                variant={theme === "dark" ? "default" : "outline"} 
                                className={cn("h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border-white/10", theme === "dark" && "bg-[#00D4FF] text-black shadow-[0_0_15px_rgba(0,212,255,0.2)]")}
                                onClick={() => setTheme("dark")}
                            >
                                <Zap size={14} className="mr-2" /> Dark Protocol
                            </Button>
                            <Button 
                                variant={theme === "light" ? "default" : "outline"} 
                                className={cn("h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border-white/10", theme === "light" && "bg-white text-black")}
                                onClick={() => setTheme("light")}
                            >
                                <Palette size={14} className="mr-2" /> Light Protocol
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Matrix grid Density</Label>
                        <Select value={systemDensity} onValueChange={setSystemDensity}>
                            <SelectTrigger className="h-12 rounded-xl bg-black/40 border-white/10 text-[10px] font-black uppercase tracking-widest">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1c1f26] border-white/10 rounded-xl">
                                <SelectItem value="low" className="text-[10px] font-black uppercase tracking-widest">Spaced (Low)</SelectItem>
                                <SelectItem value="medium" className="text-[10px] font-black uppercase tracking-widest">Balanced (Mid)</SelectItem>
                                <SelectItem value="high" className="text-[10px] font-black uppercase tracking-widest text-[#00D4FF]">High Frequency (Ultra)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div className="space-y-1">
                        <Label className="text-xs font-black text-white uppercase tracking-widest">Hardware Acceleration</Label>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Offload animation synthesis to GPU nodes.</p>
                    </div>
                    <Switch defaultChecked className="data-[state=checked]:bg-[#00D4FF]" />
                </div>
              </CardContent>
              <CardFooter className="bg-white/5 border-t border-white/5 flex justify-end p-6">
                 <Button onClick={handleGlobalSave} className="h-12 px-8 rounded-xl bg-[#00D4FF] text-black font-black uppercase tracking-widest text-[11px] hover:brightness-110 active:scale-95 transition-all">
                    Commit Calibrations
                 </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Data Ledger Protocol */}
          <TabsContent value="ledger" className="space-y-6 m-0">
            <Card className="border-white/10 bg-black/40 backdrop-blur-3xl overflow-hidden rounded-3xl border-dashed">
                <CardContent className="p-16 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="h-20 w-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
                        <HardDrive size={40} className="animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] italic">Full Ledger Export</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase max-w-sm mx-auto leading-relaxed">
                            Generate an authenticated JSON payload containing all historical entity behavior and neural synthesis records.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button className="h-12 px-8 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
                             Archive to Cloud
                        </Button>
                        <Button className="h-12 px-8 rounded-xl bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:bg-emerald-500 transition-all">
                             Download Physical Copy
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="p-8 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Activity className="text-amber-500" size={24} />
                    <div className="space-y-1">
                        <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest">Factory Purge Protocol</h4>
                        <p className="text-[10px] text-amber-500/70 font-bold uppercase leading-relaxed">Irreversibly wipe all local intelligence nodes and reset architecture. This cannot be undone.</p>
                    </div>
                </div>
                <Button variant="outline" className="h-10 border-amber-500/30 text-amber-500 text-[9px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all">
                    Initiate Zero-Point Reset
                </Button>
            </div>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
}
