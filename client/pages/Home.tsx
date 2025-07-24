import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  QrCode,
  Settings,
  BarChart3,
  CheckSquare,
  Shield,
  Zap,
  Clock,
  Activity,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-2xl">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 py-12 relative">
          <div className="flex items-center justify-between">
            <div className="flex-1"></div>
            <div className="text-center animate-fadeInUp">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 blur-2xl rounded-full"></div>
                <h1 className="relative text-6xl font-black text-white mb-3 tracking-wider">
                  Check<span className="text-green-400">Mate</span>
                </h1>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300/20 to-green-300/20 blur-lg rounded-full"></div>
                <p className="relative text-blue-100 text-lg font-medium tracking-wide uppercase">
                  Smart Maintenance Management
                </p>
              </div>
            </div>
            <div className="flex-1 flex justify-end">
              <Link to="/admin" className="animate-fadeInRight">
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fadeInUp">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
            <h2 className="relative text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
              Next-Gen Maintenance
            </h2>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Transform your workflow with intelligent task management, real-time
            tracking, and seamless digital integration.
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card
            className="group bg-gradient-to-br from-blue-600 to-blue-700 border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 animate-slideInUp"
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader className="text-center">
              <div className="relative">
                <QrCode className="h-12 w-12 text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-2 bg-white/20 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
              </div>
              <CardTitle className="text-white">Scan Machine</CardTitle>
              <CardDescription className="text-blue-100">
                Instant machine identification via QR codes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/scan">
                <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 font-semibold">
                  <Zap className="h-4 w-4 mr-2" />
                  Start Scanning
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card
            className="group bg-gradient-to-br from-green-600 to-emerald-700 border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/25 animate-slideInUp"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader className="text-center">
              <div className="relative">
                <CheckSquare className="h-12 w-12 text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-2 bg-white/20 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
              </div>
              <CardTitle className="text-white">Active Tasks</CardTitle>
              <CardDescription className="text-green-100">
                Monitor ongoing maintenance operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/tasks">
                <Button className="w-full bg-white text-green-700 hover:bg-green-50 font-semibold">
                  <Activity className="h-4 w-4 mr-2" />
                  View Tasks
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card
            className="group bg-gradient-to-br from-orange-600 to-amber-700 border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/25 animate-slideInUp"
            style={{ animationDelay: "0.3s" }}
          >
            <CardHeader className="text-center">
              <div className="relative">
                <BarChart3 className="h-12 w-12 text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-2 bg-white/20 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
              </div>
              <CardTitle className="text-white">Analytics</CardTitle>
              <CardDescription className="text-orange-100">
                Performance insights and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/analytics">
                <Button className="w-full bg-white text-orange-700 hover:bg-orange-50 font-semibold">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card
            className="group bg-gradient-to-br from-purple-600 to-violet-700 border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 animate-slideInUp"
            style={{ animationDelay: "0.4s" }}
          >
            <CardHeader className="text-center">
              <div className="relative">
                <Settings className="h-12 w-12 text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-2 bg-white/20 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
              </div>
              <CardTitle className="text-white">Settings</CardTitle>
              <CardDescription className="text-purple-100">
                System configuration and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/settings">
                <Button className="w-full bg-white text-purple-700 hover:bg-purple-50 font-semibold">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-700/50 animate-fadeInUp"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="text-3xl font-bold text-blue-400 mb-2">12</div>
            <div className="text-slate-300 text-sm">Active Machines</div>
          </div>
          <div
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-700/50 animate-fadeInUp"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="text-3xl font-bold text-green-400 mb-2">8</div>
            <div className="text-slate-300 text-sm">Tasks Completed</div>
          </div>
          <div
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-700/50 animate-fadeInUp"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="text-3xl font-bold text-orange-400 mb-2">3</div>
            <div className="text-slate-300 text-sm">Pending Tasks</div>
          </div>
          <div
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-700/50 animate-fadeInUp"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="text-3xl font-bold text-purple-400 mb-2">96%</div>
            <div className="text-slate-300 text-sm">Efficiency Rate</div>
          </div>
        </div>

        {/* Features Grid */}
        <div
          className="grid md:grid-cols-3 gap-8 animate-fadeInUp"
          style={{ animationDelay: "0.9s" }}
        >
          <div className="group bg-slate-800/30 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
              <QrCode className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Smart Recognition
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Advanced QR scanning with instant machine identification and
              context-aware task loading.
            </p>
          </div>

          <div className="group bg-slate-800/30 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Real-time Sync
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Instant updates across all devices with seamless data
              synchronization and offline support.
            </p>
          </div>

          <div className="group bg-slate-800/30 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Advanced Analytics
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Comprehensive insights with predictive maintenance and performance
              optimization.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
