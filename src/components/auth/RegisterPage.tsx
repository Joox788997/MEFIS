import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, User, Mail, Lock, Building2 } from "lucide-react";
import { motion } from "framer-motion";

export function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth
    setTimeout(() => {
      setIsLoading(false);
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 flex-col gap-8 md:flex-row max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex flex-1 flex-col gap-6"
      >
        <div className="flex items-center gap-3 text-primary text-4xl font-bold">
           <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <TrendingUp size={32} />
           </div>
           MEFIS
        </div>
        <h2 className="text-4xl font-bold tracking-tight">
          Establish Your <br />
          <span className="text-emerald-500 underline decoration-emerald-500/20 underline-offset-4">Financial Core.</span>
        </h2>
        <div className="space-y-4">
            <div className="flex items-start gap-4">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Building2 size={16} />
                </div>
                <div>
                    <h4 className="font-bold">Multi-Entity Support</h4>
                    <p className="text-sm text-muted-foreground">From individuals to hospitals, manage any entity type.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                    <TrendingUp size={16} />
                </div>
                <div>
                    <h4 className="font-bold">AI Normalization</h4>
                    <p className="text-sm text-muted-foreground">Messy text inputs processed into canonical intelligence.</p>
                </div>
            </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[450px]"
      >
        <Card className="border-primary/20 shadow-2xl shadow-primary/5">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-foreground">Create System Access</CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              Setup your multi-entity financial intelligence account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullname">Full Name</Label>
                  <div className="relative">
                     <User className="absolute left-3 top-3 text-muted-foreground" size={16} />
                     <Input id="fullname" placeholder="John Doe" className="pl-10" required />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="entity">Primary Context</Label>
                  <Select defaultValue="company">
                    <SelectTrigger>
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
                        <SelectItem value="organization">Organization / NGO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                   <Mail className="absolute left-3 top-3 text-muted-foreground" size={16} />
                   <Input id="email" type="email" placeholder="name@enterprise.com" className="pl-10" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-muted-foreground" size={16} />
                        <Input id="password" type="password" className="pl-10" required />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="confirm">Confirm</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-muted-foreground" size={16} />
                        <Input id="confirm" type="password" className="pl-10" required />
                    </div>
                </div>
              </div>
              <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                {isLoading ? "Initializing..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t pt-6 bg-muted/20">
            <p className="text-center text-sm text-muted-foreground">
              Already have an entity registered?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Authenticate
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
