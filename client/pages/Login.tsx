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
import { Lock, Mail, AlertCircle, Settings, CheckCircle, Zap, Users } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-wrench-navy-900 via-wrench-navy-800 to-wrench-navy-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-wrench-accent/10 to-transparent rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-gradient-to-br from-wrench-success/10 to-transparent rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-wrench-warning/10 to-transparent rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Professional grid overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-wrench-navy-900/50 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header Section */}
        <div className="flex-1 flex flex-col justify-center px-4 py-12">
          <div className="w-full max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Side - Branding */}
              <div className="text-center lg:text-left space-y-8">
                {/* Logo and Company Name */}
                <div className="space-y-6">
                  <WrenchLogo 
                    size="xl" 
                    variant="dark" 
                    className="justify-center lg:justify-start animate-fadeInLeft"
                  />
                  
                  <div className="space-y-4 animate-fadeInLeft" style={{animationDelay: '0.2s'}}>
                    <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight">
                      Professional
                      <br />
                      <span className="bg-gradient-to-r from-wrench-accent to-wrench-success bg-clip-text text-transparent">
                        Maintenance
                      </span>
                      <br />
                      Management
                    </h1>
                    
                    <WrenchTagline 
                      variant="dark" 
                      size="lg"
                      className="lg:text-left animate-fadeInLeft" 
                      style={{animationDelay: '0.4s'}}
                    />
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fadeInLeft" style={{animationDelay: '0.6s'}}>
                  <div className="flex items-center space-x-3 text-white">
                    <div className="h-10 w-10 bg-wrench-accent/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-wrench-accent" />
                    </div>
                    <div>
                      <p className="font-semibold">Smart Checklists</p>
                      <p className="text-sm text-white/70">Automated task tracking</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-white">
                    <div className="h-10 w-10 bg-wrench-success/20 rounded-full flex items-center justify-center">
                      <Zap className="h-5 w-5 text-wrench-success" />
                    </div>
                    <div>
                      <p className="font-semibold">Real-time Updates</p>
                      <p className="text-sm text-white/70">Instant notifications</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-white">
                    <div className="h-10 w-10 bg-wrench-warning/20 rounded-full flex items-center justify-center">
                      <Settings className="h-5 w-5 text-wrench-warning" />
                    </div>
                    <div>
                      <p className="font-semibold">Equipment Care</p>
                      <p className="text-sm text-white/70">Preventive maintenance</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-white">
                    <div className="h-10 w-10 bg-wrench-navy-400/20 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-wrench-navy-400" />
                    </div>
                    <div>
                      <p className="font-semibold">Team Coordination</p>
                      <p className="text-sm text-white/70">Seamless collaboration</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Login Form */}
              <div className="flex justify-center lg:justify-end">
                <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl animate-slideInUp" style={{animationDelay: '0.3s'}}>
                  <CardHeader className="text-center pb-6">
                    <div className="flex justify-center mb-4">
                      <div className="h-16 w-16 bg-gradient-to-br from-wrench-accent to-wrench-navy-700 rounded-full flex items-center justify-center shadow-lg">
                        <Lock className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    
                    <CardTitle className="text-2xl text-wrench-navy-800 font-bold">
                      System Access
                    </CardTitle>
                    <CardDescription className="text-wrench-navy-600">
                      Enter your credentials to access the WRENCH maintenance platform
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
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
                            className="pl-10 border-wrench-navy-200 bg-white text-wrench-navy-800 placeholder:text-wrench-navy-400 focus:border-wrench-accent focus:ring-wrench-accent/20 h-12"
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
                            className="pl-10 border-wrench-navy-200 bg-white text-wrench-navy-800 placeholder:text-wrench-navy-400 focus:border-wrench-accent focus:ring-wrench-accent/20 h-12"
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
                        className="w-full bg-gradient-to-r from-wrench-navy-800 to-wrench-navy-700 hover:from-wrench-navy-900 hover:to-wrench-navy-800 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover-lift h-14"
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            <span>Accessing System...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Lock className="h-5 w-5" />
                            <span>Access WRENCH System</span>
                          </div>
                        )}
                      </Button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-wrench-navy-600 text-sm font-medium">
                          Contact your system administrator for access
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-wrench-accent/10 to-wrench-navy-700/10 border border-wrench-accent/20 rounded-lg">
                        <p className="text-wrench-navy-700 text-sm font-semibold mb-3 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-wrench-success" />
                          Demo Access Available:
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-mono bg-wrench-navy-50 px-3 py-1 rounded text-xs">admin@wrench.com</span>
                            <span className="text-wrench-navy-500 text-xs">Administrator</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono bg-wrench-navy-50 px-3 py-1 rounded text-xs">tech@wrench.com</span>
                            <span className="text-wrench-navy-500 text-xs">Technician</span>
                          </div>
                          <p className="text-wrench-navy-500 text-xs mt-2 italic text-center">
                            Use any password • Designed for demonstration purposes
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-6 px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between">
            <WrenchBadge className="mb-4 sm:mb-0" />
            <div className="text-center sm:text-right">
              <p className="text-white/70 text-sm">
                © 2024 WRENCH Professional Services. All rights reserved.
              </p>
              <p className="text-white/50 text-xs mt-1">
                Enterprise maintenance management solutions
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
