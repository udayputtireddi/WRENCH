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
    <div className="app-container bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-2xl">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 relative">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center text-white">
                <User className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                <div>
                  <p className="font-semibold text-sm sm:text-base truncate max-w-32 sm:max-w-none">
                    {currentUser?.name}
                  </p>
                  <p className="text-blue-200 text-xs sm:text-sm">
                    {currentUser?.department}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs px-2 py-1"
              >
                <LogOut className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
            <div className="text-center">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 blur-2xl rounded-full"></div>
                <h1 className="relative text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-1 sm:mb-2 tracking-wider">
                  Check<span className="text-green-400">Mate</span>
                </h1>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300/20 to-green-300/20 blur-lg rounded-full"></div>
                <p className="relative text-blue-100 text-xs sm:text-sm lg:text-lg font-medium tracking-wide uppercase">
                  Operator Dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-12">
        {/* System Status */}
        {analytics.totalTasks === 0 ? (
          <div className="text-center mb-8 sm:mb-16 px-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 blur-3xl rounded-full"></div>
              <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-orange-400 mx-auto mb-3 sm:mb-4" />
              <h2 className="relative text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-4 sm:mb-6">
                No Tasks Available
              </h2>
            </div>
            <p className="text-sm sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8">
              Your maintenance schedule hasn't been uploaded yet. Contact your
              supervisor or administrator to set up your tasks.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 text-sm px-4 py-2"
              >
                Contact Support
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center mb-8 sm:mb-16 px-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 blur-3xl rounded-full"></div>
              <h2 className="relative text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-4 sm:mb-6">
                Ready for Work
              </h2>
            </div>
            <p className="text-sm sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              You have {analytics.totalTasks} tasks scheduled across{" "}
              {analytics.totalMachines} machines.
            </p>
          </div>
        )}

        {/* Quick Action Cards - Only Scan and Tasks for Operators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 max-w-4xl mx-auto mb-8 sm:mb-16">
          <Card
            className="group bg-gradient-to-br from-blue-600 to-blue-700 border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 animate-slideInUp"
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader className="text-center pb-6">
              <div className="relative">
                <QrCode className="h-16 w-16 text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-2 bg-white/20 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
              </div>
              <CardTitle className="text-lg sm:text-xl lg:text-2xl text-white">
                Scan Machine
              </CardTitle>
              <CardDescription className="text-blue-100 text-sm sm:text-base lg:text-lg">
                Scan QR code to access machine tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/scan">
                <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 font-semibold py-4 sm:py-6 text-sm sm:text-base lg:text-lg">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
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
              <CardTitle className="text-lg sm:text-xl lg:text-2xl text-white">
                My Tasks
              </CardTitle>
              <CardDescription className="text-green-100 text-sm sm:text-base lg:text-lg">
                View your assigned maintenance tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/tasks">
                <Button className="w-full bg-white text-green-700 hover:bg-green-50 font-semibold py-4 sm:py-6 text-sm sm:text-base lg:text-lg">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  View Tasks ({analytics.totalTasks})
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Personal Statistics - Only show if data exists */}
        {analytics.totalTasks > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 max-w-4xl mx-auto animate-fadeInUp">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-300 text-sm font-medium text-center">
                  Completed Today
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-400">
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
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-400">
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
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-400">
                  {analytics.overdueTasks}
                </div>
                <p className="text-slate-400 text-sm mt-1">Need Attention</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
