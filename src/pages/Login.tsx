
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/use-login";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const login = useLogin();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/dashboard");
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: error.message || "Something went wrong. Please try again.",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Card className="w-[350px] bg-gray-800/50 backdrop-blur-xl border-gray-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-white">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={login.isPending}
            >
              {login.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent border-gray-600 text-gray-200 hover:bg-gray-700/50"
              onClick={() => navigate("/signup")}
              disabled={login.isPending}
            >
              Create Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
