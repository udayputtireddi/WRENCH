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
import { Wrench, Lock, Mail, AlertCircle, Settings, CheckCircle } from "lucide-react";
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
    <div className="app-container bg-gradient-to-br from-wrench-navy-900 via-wrench-navy-800 to-wrench-navy-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 text-wrench-navy-300 opacity-20">
        <Settings className="h-12 w-12 animate-spin" style={{animationDuration: '20s'}} />
      </div>
      <div className="absolute bottom-20 right-20 text-wrench-navy-300 opacity-20">
        <Wrench className="h-16 w-16 rotate-45" />
      </div>
      <div className="absolute top-32 right-16 text-wrench-navy-300 opacity-15">
        <CheckCircle className="h-8 w-8" />
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 relative z-10">
        {/* WRENCH Branding Section */}
        <div className="text-center mb-8 sm:mb-12">
          {/* Logo Section */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fda94b5400eec417db21cb7a4e8a60aa1%2F22e9e2bc7655407bac8f82eee5b44985?format=webp&width=800"
                alt="WRENCH Logo"
                className="h-32 sm:h-40 lg:h-48 w-auto object-contain filter drop-shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wrench-navy-900/20 to-transparent rounded-lg"></div>
            </div>
          </div>

          {/* Title */}
          <div className="relative mb-6">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white mb-4 tracking-tight animate-checkmate-title">
              WRENCH
            </h1>
            <div className="absolute inset-0 text-5xl sm:text-7xl lg:text-8xl font-black text-wrench-accent/20 blur-sm animate-checkmate-title">
              WRENCH
            </div>
          </div>

          {/* Tagline */}
          <div className="space-y-2 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
            <p className="text-xl sm:text-2xl lg:text-3xl text-wrench-navy-100 font-semibold tracking-wide">
              We Repair Everything Now – Checklists Help
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-wrench-accent to-wrench-success mx-auto rounded-full"></div>
            <p className="text-wrench-navy-300 text-base sm:text-lg lg:text-xl px-4 italic font-light">
              Because missed maintenance costs money.
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl shadow-wrench-navy-900/50 animate-slideInUp" style={{animationDelay: '0.5s'}}>
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-2">
              <div className="h-12 w-12 bg-gradient-to-br from-wrench-accent to-wrench-navy-700 rounded-full flex items-center justify-center">
                <Lock className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-wrench-navy-800 font-bold">
              System Access
            </CardTitle>
            <CardDescription className="text-wrench-navy-600">
              Enter your credentials to access the maintenance system
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-wrench-navy-700 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-wrench-navy-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-wrench-navy-200 bg-white text-wrench-navy-800 placeholder:text-wrench-navy-400 focus:border-wrench-accent focus:ring-wrench-accent/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-wrench-navy-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-wrench-navy-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-wrench-navy-200 bg-white text-wrench-navy-800 placeholder:text-wrench-navy-400 focus:border-wrench-accent focus:ring-wrench-accent/20"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert className="bg-wrench-error/10 border-wrench-error/20">
                  <AlertCircle className="h-4 w-4 text-wrench-error" />
                  <AlertDescription className="text-wrench-error">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-gradient-to-r from-wrench-navy-800 to-wrench-navy-700 hover:from-wrench-navy-900 hover:to-wrench-navy-800 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover-lift"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Accessing System...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Wrench className="h-5 w-5" />
                    <span>Access System</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 space-y-3">
              <div className="text-center">
                <p className="text-wrench-navy-600 text-sm font-medium">
                  Contact your system administrator for access
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-wrench-accent/10 to-wrench-navy-700/10 border border-wrench-accent/20 rounded-lg">
                <p className="text-wrench-navy-700 text-sm font-semibold mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-wrench-success" />
                  Demo Access Available:
                </p>
                <div className="space-y-1 text-sm">
                  <p className="text-wrench-navy-600">
                    <span className="font-mono bg-wrench-navy-50 px-2 py-1 rounded text-xs">admin@company.com</span>
                    <span className="text-wrench-navy-500 ml-2">with any password</span>
                  </p>
                  <p className="text-wrench-navy-600">
                    <span className="font-mono bg-wrench-navy-50 px-2 py-1 rounded text-xs">operator@company.com</span>
                    <span className="text-wrench-navy-500 ml-2">with any password</span>
                  </p>
                  <p className="text-wrench-navy-500 text-xs mt-2 italic">
                    Use strong passwords to avoid browser security warnings
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 px-4 animate-fadeInUp" style={{animationDelay: '0.7s'}}>
          <p className="text-wrench-navy-400 text-sm">
            © 2024 WRENCH Maintenance Systems. All rights reserved.
          </p>
          <p className="text-wrench-navy-500 text-xs mt-1">
            Professional maintenance & repair solutions
          </p>
        </div>
      </div>
    </div>
  );
}
