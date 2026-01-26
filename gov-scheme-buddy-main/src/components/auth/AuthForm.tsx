import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield } from "lucide-react";

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        if (!fullName.trim()) {
          toast({
            title: "Name Required",
            description: "Please enter your full name",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast({
            title: "Registration Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account Created",
            description: "You can now access the portal",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/50 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-1 bg-tricolor-gradient" />
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-saffron/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-green-india/5 blur-3xl" />
      
      <Card className="w-full max-w-md shadow-2xl border-0 glass-card animate-fade-in-scale">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-xl">
              <Shield className="h-10 w-10 text-primary-foreground" />
            </div>
            {/* Decorative corners */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-saffron rounded-tl-lg" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-saffron rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-green-india rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-green-india rounded-br-lg" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            SAMVAAD
          </CardTitle>
          <CardDescription className="text-saffron font-medium">
            संवाद AI - Government Scheme Assistant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name (पूरा नाम)</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  className="border-2 focus:border-primary"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email (ईमेल)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-2 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password (पासवर्ड)</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="border-2 focus:border-primary"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all btn-ripple" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Login (लॉगिन)" : "Register (पंजीकरण)"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-saffron hover:underline font-medium"
            >
              {isLogin
                ? "Don't have an account? Register (पंजीकरण करें)"
                : "Already have an account? Login (लॉगिन करें)"}
            </button>
          </div>
          <div className="mt-6 rounded-xl bg-muted/50 p-4 text-center border border-border">
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
              <span>🇮🇳</span>
              <span>Official Government Service Portal</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Your data is secure and protected</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}