import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { TrendingUp, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";

export function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 flex-col gap-8 md:flex-row max-w-6xl mx-auto relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:flex flex-1 flex-col gap-4"
      >
        <div className="flex items-center gap-3 text-primary text-4xl font-bold">
           <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
              <TrendingUp size={32} />
           </div>
           MEFIS
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Financial Intelligence <br />
          <span className="text-primary italic font-serif">Redefined.</span>
        </h2>
        <p className="max-w-md text-muted-foreground leading-relaxed">
          The ultimate multi-entity platform for analyzed financial behavior, risk assessment, and predictive recovery planning.
        </p>
        
        <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-xl border bg-card/50 p-6 backdrop-blur-sm shadow-xl">
                <div className="text-3xl font-bold text-primary">99.9%</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">Data Accuracy</div>
            </div>
            <div className="rounded-xl border bg-card/50 p-6 backdrop-blur-sm shadow-xl">
                <div className="text-3xl font-bold text-emerald-500">Real-Time</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">Processing</div>
            </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[400px] z-10"
      >
        <Card className="border-primary/20 shadow-2xl bg-card/80 backdrop-blur-md">
          <CardHeader className="space-y-1 text-center md:text-left">
            <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              Enter credentials to access System Intel
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                   <Mail className="absolute left-3 top-3 text-muted-foreground" size={16} />
                   <Input id="email" type="email" placeholder="name@enterprise.com" className="pl-10" required />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                   <Lock className="absolute left-3 top-3 text-muted-foreground" size={16} />
                   <Input id="password" type="password" className="pl-10" required />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember for 30 days
                </label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Synchronizing..." : "Authenticate"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t pt-6 bg-muted/20">
            <p className="text-center text-sm text-muted-foreground">
              Don't have an access key?{" "}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Register Entity
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
