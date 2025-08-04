import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, CheckSquare, Zap, Activity, Clock, User } from "lucide-react";
import AuthService from "@/lib/auth";

export default function UserHome() {
  const currentUser = AuthService.getCurrentUser();

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
              <div className="text-right">
                <div className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{currentUser?.name}</p>
                    <p className="text-sm text-blue-200 capitalize">{currentUser?.role} - {currentUser?.shift}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Welcome Message */}
        <div className="text-center mb-16 animate-fadeInUp">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 blur-3xl rounded-full"></div>
            <h2 className="relative text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-6">
              Welcome, {currentUser?.name?.split(' ')[0]}!
            </h2>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Ready to perform your maintenance tasks? Start by scanning a machine QR code 
            or check your active tasks list.
          </p>
        </div>

        {/* Quick Action Cards - User Version (Only 2 cards) */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 max-w-4xl mx-auto">
          <Card className="group bg-gradient-to-br from-blue-600 to-blue-700 border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 animate-slideInUp" style={{animationDelay: "0.1s"}}>
            <CardHeader className="text-center p-8">
              <div className="relative">
                <QrCode className="h-16 w-16 text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-4 bg-white/20 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
              </div>
              <CardTitle className="text-white text-2xl mb-4">Scan Machine</CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Point your device at any machine's QR code to instantly access its maintenance tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <Link to="/scan">
                <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 font-semibold text-lg py-6">
                  <Zap className="h-5 w-5 mr-3" />
                  Start Scanning
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group bg-gradient-to-br from-green-600 to-emerald-700 border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/25 animate-slideInUp" style={{animationDelay: "0.2s"}}>
            <CardHeader className="text-center p-8">
              <div className="relative">
                <CheckSquare className="h-16 w-16 text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-4 bg-white/20 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
              </div>
              <CardTitle className="text-white text-2xl mb-4">Active Tasks</CardTitle>
              <CardDescription className="text-green-100 text-lg">
                View all maintenance tasks assigned to you and track your progress
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <Link to="/tasks">
                <Button className="w-full bg-white text-green-700 hover:bg-green-50 font-semibold text-lg py-6">
                  <Activity className="h-5 w-5 mr-3" />
                  View My Tasks
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats for User */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-700/50 animate-fadeInUp" style={{animationDelay: "0.3s"}}>
            <div className="text-3xl font-bold text-blue-400 mb-2">5</div>
            <div className="text-slate-300 text-sm">Tasks Today</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-700/50 animate-fadeInUp" style={{animationDelay: "0.4s"}}>
            <div className="text-3xl font-bold text-green-400 mb-2">8</div>
            <div className="text-slate-300 text-sm">Completed</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-700/50 animate-fadeInUp" style={{animationDelay: "0.5s"}}>
            <div className="text-3xl font-bold text-orange-400 mb-2">2</div>
            <div className="text-slate-300 text-sm">In Progress</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-700/50 animate-fadeInUp" style={{animationDelay: "0.6s"}}>
            <div className="text-3xl font-bold text-purple-400 mb-2">{currentUser?.shift}</div>
            <div className="text-slate-300 text-sm">Current Shift</div>
          </div>
        </div>

        {/* User Features */}
        <div className="grid md:grid-cols-2 gap-8 animate-fadeInUp" style={{animationDelay: "0.7s"}}>
          <div className="group bg-slate-800/30 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
              <QrCode className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Quick Access</h3>
            <p className="text-slate-400 leading-relaxed">
              Scan any machine QR code to instantly access maintenance checklists, safety procedures, and task instructions.
            </p>
          </div>
          
          <div className="group bg-slate-800/30 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Track Progress</h3>
            <p className="text-slate-400 leading-relaxed">
              Mark tasks as complete in real-time. Your progress is automatically saved and synced across all devices.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 mb-6">Need help or have questions?</p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600">
              Contact Support
            </Button>
            <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600">
              Safety Guidelines
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
