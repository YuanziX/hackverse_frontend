import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useSignup } from "@/hooks/use-signup";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const signup = useSignup();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    signup.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/login");
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Signup Failed",
            description: "Something went wrong. Please try again.",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[350px] backdrop-blur-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-white">
            Create Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={signup.isPending}
            >
              {signup.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/login")}
              disabled={signup.isPending}
            >
              Already have an account? Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
