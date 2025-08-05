import { Link, useNavigate } from "react-router-dom";
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
  CheckSquare,
  Zap,
  Activity,
  LogOut,
  User,
  AlertCircle,
  Upload,
} from "lucide-react";
import AuthService from "@/lib/auth";
import Database from "@/lib/database";

export default function UserHome() {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const analytics = Database.getAnalytics();

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-2xl">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-white">
              <User className="h-8 w-8 mr-3" />
              <div>
                <p className="font-semibold">{currentUser?.name}</p>
                <p className="text-blue-200 text-sm">{currentUser?.department}</p>
              </div>
            </div>
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
                  Operator Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* System Status */}
        {analytics.totalTasks === 0 ? (
          <div className="text-center mb-16 animate-fadeInUp">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 blur-3xl rounded-full"></div>
              <AlertCircle className="h-16 w-16 text-orange-400 mx-auto mb-4" />
              <h2 className="relative text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-6">
                No Tasks Available
              </h2>
            </div>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Your maintenance schedule hasn't been uploaded yet. Contact your supervisor or administrator to set up your tasks.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600">
                Contact Support
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center mb-16 animate-fadeInUp">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 blur-3xl rounded-full"></div>
              <h2 className="relative text-5xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-6">
                Ready for Work
              </h2>
            </div>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              You have {analytics.totalTasks} tasks scheduled across {analytics.totalMachines} machines.
            </p>
          </div>
        )}

        {/* Quick Action Cards - Only Scan and Tasks for Operators */}
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto mb-16">
          <Card
            className="group bg-gradient-to-br from-blue-600 to-blue-700 border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 animate-slideInUp"
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader className="text-center pb-6">
              <div className="relative">
                <QrCode className="h-16 w-16 text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-2 bg-white/20 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
              </div>
              <CardTitle className="text-2xl text-white">Scan Machine</CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Scan QR code to access machine tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/scan">
                <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 font-semibold py-6 text-lg">
                  <Zap className="h-5 w-5 mr-2" />
                  Start Scanning
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card
            className="group bg-gradient-to-br from-green-600 to-green-700 border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/25 animate-slideInUp"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader className="text-center pb-6">
              <div className="relative">
                <CheckSquare className="h-16 w-16 text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-2 bg-white/20 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
              </div>
              <CardTitle className="text-2xl text-white">My Tasks</CardTitle>
              <CardDescription className="text-green-100 text-lg">
                View your assigned maintenance tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/tasks">
                <Button className="w-full bg-white text-green-700 hover:bg-green-50 font-semibold py-6 text-lg">
                  <Activity className="h-5 w-5 mr-2" />
                  View Tasks ({analytics.totalTasks})
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Personal Statistics - Only show if data exists */}
        {analytics.totalTasks > 0 && (
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fadeInUp">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-300 text-sm font-medium text-center">
                  Completed Today
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-green-400">
                  {analytics.completedToday}
                </div>
                <p className="text-slate-400 text-sm mt-1">Tasks Finished</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-300 text-sm font-medium text-center">
                  Pending Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-yellow-400">
                  {analytics.totalTasks - analytics.completedToday}
                </div>
                <p className="text-slate-400 text-sm mt-1">Remaining</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-300 text-sm font-medium text-center">
                  Overdue
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-red-400">
                  {analytics.overdueTasks}
                </div>
                <p className="text-slate-400 text-sm mt-1">Need Attention</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Tips - Only show if no data */}
        {analytics.totalTasks === 0 && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white text-center">Getting Started</CardTitle>
                <CardDescription className="text-slate-400 text-center">
                  Here's what you can do once your tasks are set up:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <QrCode className="h-6 w-6 text-blue-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">Scan Machine QR Codes</p>
                    <p className="text-slate-400 text-sm">Quickly access specific machine maintenance tasks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckSquare className="h-6 w-6 text-green-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">Complete Task Checklists</p>
                    <p className="text-slate-400 text-sm">Follow step-by-step maintenance procedures</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Activity className="h-6 w-6 text-purple-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">Track Your Progress</p>
                    <p className="text-slate-400 text-sm">Monitor daily task completion and performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
