
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setLoading(false);
      if (error) {
        toast({ title: "Login failed", description: error.message });
      } else {
        toast({ title: "Welcome back!" });
        navigate("/");
      }
    } else {
      // Sign up with display name (will set in profile after sign up)
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { display_name: displayName }
        }
      });
      setLoading(false);
      if (error) {
        toast({ title: "Sign up failed", description: error.message });
      } else {
        toast({ title: "Check your inbox to verify your email!" });
        setMode("login");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{mode === "login" ? "Log In" : "Sign Up"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="sr-only" htmlFor="displayName">Name</label>
                <Input
                  id="displayName"
                  placeholder="Your Name"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <label className="sr-only" htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="password">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading
                ? mode === "login" ? "Logging in..." : "Signing up..."
                : mode === "login" ? "Log In" : "Sign Up"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Button variant="link" size="sm" type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Log in"}
            </Button>
            <div className="mt-4 text-xs text-muted-foreground">
              By signing up, you agree to our terms and privacy policy.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
