import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AuthService from "@/lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user = AuthService.login(email, password);
      if (user) {
        navigate("/");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-2 sm:mb-4 tracking-wider">
            Check<span className="text-green-400">Mate</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg lg:text-xl px-4">
            Smart Maintenance Management System
          </p>
        </div>

        <Card className="w-full max-w-md mx-auto bg-slate-800/50 backdrop-blur-sm border-slate-700/50 overflow-hidden">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Sign In</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert className="bg-red-500/10 border-red-500/20">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-lg"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-4 sm:mt-6 text-center space-y-2">
              <p className="text-slate-400 text-xs sm:text-sm px-2">
                Contact your system administrator for access
              </p>
              <div className="p-2 sm:p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-left mx-2 sm:mx-0">
                <p className="text-blue-300 text-xs font-medium mb-1">
                  Quick Login Examples:
                </p>
                <p className="text-blue-200 text-xs break-all">
                  <span className="font-mono text-xs">admin@company.com</span>{" "}
                  with any password
                </p>
                <p className="text-blue-200 text-xs break-all">
                  <span className="font-mono text-xs">
                    operator@company.com
                  </span>{" "}
                  with any password
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Note: Use strong passwords to avoid browser security warnings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 sm:mt-8 px-4">
          <p className="text-slate-500 text-xs sm:text-sm">
            © 2024 CheckMate. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
