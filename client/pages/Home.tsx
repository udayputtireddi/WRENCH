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
  Settings,
  BarChart3,
  CheckSquare,
  Shield,
  Zap,
  Clock,
  Activity,
  LogOut,
  User,
  Upload,
} from "lucide-react";
import AuthService from "@/lib/auth";
import Database from "@/lib/database";

export default function Home() {
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
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 relative">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center text-white">
                <User className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                <div>
                  <p className="font-semibold text-sm sm:text-base truncate max-w-28 sm:max-w-none">
                    {currentUser?.name}
                  </p>
                  <p className="text-blue-200 text-xs sm:text-sm capitalize">
                    {currentUser?.role} • {currentUser?.department}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Link to="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs px-2 py-1"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                </Link>
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
                  Smart Maintenance Management
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
              <h2 className="relative text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-4 sm:mb-6">
                System Ready for Setup
              </h2>
            </div>
            <p className="text-sm sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8">
              No maintenance data found. Upload your equipment maintenance
              schedules to get started.
            </p>
            <Link to="/admin/database">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base lg:text-lg">
                <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Upload Maintenance Data
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center mb-8 sm:mb-16 px-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
              <h2 className="relative text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 sm:mb-6">
                System Operational
              </h2>
            </div>
            <p className="text-sm sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {analytics.totalTasks} tasks across {analytics.totalMachines}{" "}
              machines ready for maintenance.
            </p>
          </div>
        )}

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-16">
          <Card
            className="group bg-gradient-to-br from-blue-600 to-blue-700 border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 animate-slideInUp"
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader className="text-center">
              <div className="relative">
                <QrCode className="h-12 w-12 text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-2 bg-white/20 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
              </div>
              <CardTitle className="text-sm sm:text-base lg:text-lg text-white">
                Scan Machine
              </CardTitle>
              <CardDescription className="text-blue-100 text-xs sm:text-sm">
                Instant machine identification via QR codes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/scan">
                <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 font-semibold text-xs sm:text-sm py-3">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Start Scanning
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card
            className="group bg-gradient-to-br from-green-600 to-green-700 border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/25 animate-slideInUp"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader className="text-center">
              <div className="relative">
                <CheckSquare className="h-12 w-12 text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-2 bg-white/20 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
              </div>
              <CardTitle className="text-sm sm:text-base lg:text-lg text-white">
                Active Tasks
              </CardTitle>
              <CardDescription className="text-green-100 text-xs sm:text-sm">
                View and manage your maintenance tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/tasks">
                <Button className="w-full bg-white text-green-700 hover:bg-green-50 font-semibold text-xs sm:text-sm py-3">
                  <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  View Tasks ({analytics.totalTasks})
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card
            className="group bg-gradient-to-br from-purple-600 to-purple-700 border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 animate-slideInUp"
            style={{ animationDelay: "0.3s" }}
          >
            <CardHeader className="text-center">
              <div className="relative">
                <BarChart3 className="h-12 w-12 text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-2 bg-white/20 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
              </div>
              <CardTitle className="text-sm sm:text-base lg:text-lg text-white">
                Analytics
              </CardTitle>
              <CardDescription className="text-purple-100 text-xs sm:text-sm">
                Performance metrics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/analytics">
                <Button className="w-full bg-white text-purple-700 hover:bg-purple-50 font-semibold text-xs sm:text-sm py-3">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card
            className="group bg-gradient-to-br from-orange-600 to-orange-700 border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/25 animate-slideInUp"
            style={{ animationDelay: "0.4s" }}
          >
            <CardHeader className="text-center">
              <div className="relative">
                <Settings className="h-12 w-12 text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-2 bg-white/20 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
              </div>
              <CardTitle className="text-sm sm:text-base lg:text-lg text-white">
                Settings
              </CardTitle>
              <CardDescription className="text-orange-100 text-xs sm:text-sm">
                Configure system preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/settings">
                <Button className="w-full bg-white text-orange-700 hover:bg-orange-50 font-semibold text-xs sm:text-sm py-3">
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Open Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* System Statistics */}
        {analytics.totalTasks > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 animate-fadeInUp">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-300 text-sm font-medium">
                  Total Machines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  {analytics.totalMachines}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-300 text-sm font-medium">
                  Completed Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400">
                  {analytics.completedToday}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-300 text-sm font-medium">
                  Overdue Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-400">
                  {analytics.overdueTasks}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-300 text-sm font-medium">
                  Due Tomorrow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-400">
                  {analytics.upcomingTasks}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
