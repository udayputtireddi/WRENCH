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
import { Lock, Mail, AlertCircle, Settings, CheckCircle, Zap } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WrenchLogo, WrenchTagline, WrenchBadge } from "@/components/WrenchLogo";
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
    <div className="min-h-screen bg-gradient-to-br from-wrench-navy-900 via-wrench-navy-800 to-wrench-navy-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 text-wrench-navy-300 opacity-20">
        <Settings className="h-8 w-8 animate-spin" style={{ animationDuration: "20s" }} />
      </div>
      <div className="absolute bottom-20 right-20 text-wrench-navy-300 opacity-20">
        <Zap className="h-6 w-6" />
      </div>

      {/* Main Login Container */}
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:block text-white">
          <div className="space-y-8">
            <div>
              <WrenchLogo size="xl" variant="dark" showText={true} />
            </div>
            
            <div className="space-y-6">
              <h1 className="text-4xl xl:text-5xl font-black leading-tight">
                Professional
                <br />
                <span className="bg-gradient-to-r from-wrench-accent to-blue-400 bg-clip-text text-transparent">
                  Maintenance Platform
                </span>
              </h1>
              
              <p className="text-xl text-white/80 leading-relaxed">
                Advanced equipment maintenance management with comprehensive tracking and professional reporting.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3 text-white/80">
                <CheckCircle className="h-5 w-5 text-wrench-success" />
                <span>Real-time task tracking</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <CheckCircle className="h-5 w-5 text-wrench-success" />
                <span>Comprehensive reporting</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <CheckCircle className="h-5 w-5 text-wrench-success" />
                <span>Mobile-ready interface</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="lg:hidden">
                <WrenchBadge />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-wrench-navy-900">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-wrench-navy-600">
                  Professional maintenance management system
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert className="border-wrench-error/20 bg-wrench-error/5">
                    <AlertCircle className="h-4 w-4 text-wrench-error" />
                    <AlertDescription className="text-wrench-error">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

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
                      className="pl-10 border-wrench-navy-200 focus:border-wrench-accent"
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
                      className="pl-10 border-wrench-navy-200 focus:border-wrench-accent"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-wrench-accent to-blue-600 hover:from-blue-600 hover:to-wrench-accent text-white font-semibold py-3 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

            </CardContent>
          </Card>

          {/* Mobile Branding */}
          <div className="lg:hidden text-center mt-8">
            <WrenchTagline variant="light" size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
