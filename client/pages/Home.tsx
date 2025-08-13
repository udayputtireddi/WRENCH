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
  Wrench,
  Users,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Cog,
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
    <div className="app-container bg-gradient-to-br from-wrench-navy-50 via-white to-wrench-navy-50">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-wrench-navy-800 via-wrench-navy-700 to-wrench-navy-800 shadow-2xl">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Header Background Elements */}
        <div className="absolute top-4 left-4 text-wrench-navy-300 opacity-20">
          <Cog className="h-8 w-8 animate-spin" style={{animationDuration: '20s'}} />
        </div>
        <div className="absolute bottom-4 right-4 text-wrench-navy-300 opacity-20">
          <Wrench className="h-6 w-6 rotate-12" />
        </div>

        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 relative z-10">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            {/* User Info & Controls */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center text-white">
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-wrench-accent to-white/20 rounded-full flex items-center justify-center mr-3">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base truncate max-w-28 sm:max-w-none">
                    {currentUser?.name}
                  </p>
                  <p className="text-wrench-navy-200 text-xs sm:text-sm capitalize">
                    {currentUser?.role} • {currentUser?.department}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Link to="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs px-2 py-1 hover-lift"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs px-2 py-1 hover-lift"
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>

            {/* WRENCH Branding */}
            <div className="text-center">
              <div className="relative inline-block mb-2">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 blur-2xl rounded-full"></div>
                <div className="flex items-center justify-center space-x-3">
                  <Wrench className="h-8 w-8 sm:h-12 sm:w-12 text-white animate-pulse-glow" />
                  <h1 className="relative text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-wider">
                    WRENCH
                  </h1>
                </div>
              </div>
              <div className="relative">
                <div className="h-1 w-32 bg-gradient-to-r from-wrench-accent to-wrench-success mx-auto mb-2 rounded-full"></div>
                <p className="relative text-wrench-navy-100 text-xs sm:text-sm lg:text-lg font-medium tracking-wide">
                  Professional Maintenance Management System
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
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-wrench-warning/20 to-wrench-error/20 blur-3xl rounded-full"></div>
              <div className="relative flex items-center justify-center mb-4">
                <AlertTriangle className="h-16 w-16 sm:h-20 sm:w-20 text-wrench-warning mr-4" />
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-wrench-navy-800 mb-2">
                    System Ready for Setup
                  </h2>
                  <div className="h-1 w-48 bg-gradient-to-r from-wrench-warning to-wrench-error mx-auto rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="text-sm sm:text-lg lg:text-xl text-wrench-navy-600 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8">
              No maintenance data found. Upload your equipment maintenance schedules to begin optimizing your repair operations.
            </p>
            <Link to="/admin/database">
              <Button className="bg-gradient-to-r from-wrench-navy-800 to-wrench-navy-700 hover:from-wrench-navy-900 hover:to-wrench-navy-800 text-white px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base lg:text-lg hover-lift shadow-lg">
                <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Upload Maintenance Data
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center mb-8 sm:mb-16 px-4">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-wrench-success/20 to-wrench-accent/20 blur-3xl rounded-full"></div>
              <div className="relative flex items-center justify-center mb-4">
                <CheckSquare className="h-16 w-16 sm:h-20 sm:w-20 text-wrench-success mr-4" />
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-wrench-navy-800 mb-2">
                    System Operational
                  </h2>
                  <div className="h-1 w-56 bg-gradient-to-r from-wrench-success to-wrench-accent mx-auto rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="text-sm sm:text-lg lg:text-xl text-wrench-navy-600 max-w-3xl mx-auto leading-relaxed">
              <span className="font-semibold text-wrench-navy-800">{analytics.totalTasks} tasks</span> across{" "}
              <span className="font-semibold text-wrench-navy-800">{analytics.totalMachines} machines</span>{" "}
              ready for professional maintenance.
            </p>
          </div>
        )}

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-16">
          <Card
            className="group bg-gradient-to-br from-wrench-accent to-wrench-accent-light border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-wrench-accent/25 animate-slideInUp"
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
              <CardDescription className="text-white/80 text-xs sm:text-sm">
                Instant machine identification via QR codes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/scan">
                <Button className="w-full bg-white text-wrench-accent hover:bg-wrench-navy-50 font-semibold text-xs sm:text-sm py-3 hover-lift">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Start Scanning
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card
            className="group bg-gradient-to-br from-wrench-success to-wrench-success/80 border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-wrench-success/25 animate-slideInUp"
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
              <CardDescription className="text-white/80 text-xs sm:text-sm">
                View and manage your maintenance tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/tasks">
                <Button className="w-full bg-white text-wrench-success hover:bg-green-50 font-semibold text-xs sm:text-sm py-3 hover-lift">
                  <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  View Tasks ({analytics.totalTasks})
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card
            className="group bg-gradient-to-br from-wrench-navy-600 to-wrench-navy-700 border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-wrench-navy-600/25 animate-slideInUp"
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
              <CardDescription className="text-white/80 text-xs sm:text-sm">
                Performance metrics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/analytics">
                <Button className="w-full bg-white text-wrench-navy-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm py-3 hover-lift">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card
            className="group bg-gradient-to-br from-wrench-warning to-wrench-warning/80 border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-wrench-warning/25 animate-slideInUp"
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
              <CardDescription className="text-white/80 text-xs sm:text-sm">
                Configure system preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/settings">
                <Button className="w-full bg-white text-wrench-warning hover:bg-orange-50 font-semibold text-xs sm:text-sm py-3 hover-lift">
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
            <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-wrench-navy-600" />
                  <CardTitle className="text-wrench-navy-700 text-sm font-semibold">
                    Total Machines
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-wrench-navy-800">
                  {analytics.totalMachines}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <CheckSquare className="h-5 w-5 text-wrench-success" />
                  <CardTitle className="text-wrench-navy-700 text-sm font-semibold">
                    Completed Today
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-wrench-success">
                  {analytics.completedToday}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-wrench-error" />
                  <CardTitle className="text-wrench-navy-700 text-sm font-semibold">
                    Overdue Tasks
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-wrench-error">
                  {analytics.overdueTasks}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-wrench-warning" />
                  <CardTitle className="text-wrench-navy-700 text-sm font-semibold">
                    Due Tomorrow
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-wrench-warning">
                  {analytics.upcomingTasks}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer tagline */}
        <div className="text-center mt-12 pt-8 border-t border-wrench-navy-200">
          <p className="text-wrench-navy-600 text-sm font-medium">
            We Repair Everything Now – Checklists Help
          </p>
          <p className="text-wrench-navy-400 text-xs mt-1 italic">
            Because missed maintenance costs money.
          </p>
        </div>
      </main>
    </div>
  );
}
