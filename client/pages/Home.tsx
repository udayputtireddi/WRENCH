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
  Activity,
  Shield,
  FileText,
  Database as DatabaseIcon,
} from "lucide-react";
import { ProfessionalHeader } from "@/components/ProfessionalHeader";
import { WrenchTagline, WrenchBadge } from "@/components/WrenchLogo";
import Database from "@/lib/database";
import AuthService from "@/lib/auth";

export default function Home() {
  const analytics = Database.getAnalytics();
  const currentUser = AuthService.getCurrentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-wrench-navy-50 via-white to-wrench-navy-50">
      {/* Professional Header */}
      <ProfessionalHeader
        title="Control Center"
        subtitle="Professional maintenance management dashboard"
        showStats={true}
        variant="gradient"
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="max-w-4xl mx-auto">
            <WrenchBadge className="mb-6" />

            <h1 className="text-4xl lg:text-5xl font-black text-wrench-navy-900 mb-4">
              Professional Equipment
              <br />
              <span className="bg-gradient-to-r from-wrench-accent to-wrench-success bg-clip-text text-transparent">
                Maintenance Platform
              </span>
            </h1>

            <p className="text-xl text-wrench-navy-600 mb-6 max-w-3xl mx-auto leading-relaxed">
              Advanced maintenance management system with professional task
              tracking and comprehensive reporting.
            </p>

            {/* Quick Stats */}
            {analytics.totalTasks > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-wrench-navy-200">
                  <div className="text-2xl font-bold text-wrench-navy-800">
                    {analytics.totalTasks}
                  </div>
                  <div className="text-sm text-wrench-navy-600">
                    Total Tasks
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-wrench-navy-200">
                  <div className="text-2xl font-bold text-wrench-success">
                    {analytics.completedToday}
                  </div>
                  <div className="text-sm text-wrench-navy-600">Completed</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-wrench-navy-200">
                  <div className="text-2xl font-bold text-wrench-error">
                    {analytics.overdueTasks}
                  </div>
                  <div className="text-sm text-wrench-navy-600">Overdue</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-wrench-navy-200">
                  <div className="text-2xl font-bold text-wrench-accent">
                    {analytics.totalMachines}
                  </div>
                  <div className="text-sm text-wrench-navy-600">Equipment</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Action Cards - Core functionality for all users */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {/* Equipment Scanner */}
          <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="text-center pb-3 sm:pb-4 p-4 sm:p-6">
              <div className="h-12 sm:h-16 w-12 sm:w-16 bg-gradient-to-br from-wrench-accent to-wrench-accent-light rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <QrCode className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
              </div>
              <CardTitle className="text-wrench-navy-800 text-sm sm:text-base">
                Equipment Scanner
              </CardTitle>
              <CardDescription className="text-wrench-navy-600 text-xs sm:text-sm">
                Scan QR codes to access equipment tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center p-4 sm:p-6">
              <Link to="/scan">
                <Button className="w-full bg-gradient-to-r from-wrench-accent to-wrench-accent-light hover:from-wrench-accent-light hover:to-wrench-accent text-white py-2 sm:py-3 text-sm sm:text-base">
                  <QrCode className="h-4 w-4 mr-2" />
                  Start Scanning
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Active Tasks */}
          <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="text-center pb-3 sm:pb-4 p-4 sm:p-6">
              <div className="h-12 sm:h-16 w-12 sm:w-16 bg-gradient-to-br from-wrench-success to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <CheckSquare className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
              </div>
              <CardTitle className="text-wrench-navy-800 text-sm sm:text-base">
                Active Tasks
              </CardTitle>
              <CardDescription className="text-wrench-navy-600 text-xs sm:text-sm">
                View and manage maintenance tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center p-4 sm:p-6">
              <Link to="/tasks">
                <Button className="w-full bg-gradient-to-r from-wrench-success to-green-600 hover:from-green-600 hover:to-wrench-success text-white py-2 sm:py-3 text-sm sm:text-base font-medium">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  View Tasks
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="text-center pb-3 sm:pb-4 p-4 sm:p-6">
              <div className="h-12 sm:h-16 w-12 sm:w-16 bg-gradient-to-br from-wrench-warning to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
              </div>
              <CardTitle className="text-wrench-navy-800 text-sm sm:text-base">
                Analytics
              </CardTitle>
              <CardDescription className="text-wrench-navy-600 text-xs sm:text-sm">
                Performance metrics and insights
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center p-4 sm:p-6">
              <Link to="/analytics">
                <Button className="w-full bg-gradient-to-r from-wrench-warning to-orange-500 hover:from-orange-500 hover:to-wrench-warning text-white py-2 sm:py-3 text-sm sm:text-base font-medium">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="text-center pb-3 sm:pb-4 p-4 sm:p-6">
              <div className="h-12 sm:h-16 w-12 sm:w-16 bg-gradient-to-br from-wrench-navy-600 to-wrench-navy-800 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Settings className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
              </div>
              <CardTitle className="text-wrench-navy-800 text-sm sm:text-base">
                System Settings
              </CardTitle>
              <CardDescription className="text-wrench-navy-600 text-xs sm:text-sm">
                Configure platform preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center p-4 sm:p-6">
              <Link to="/settings">
                <Button className="w-full bg-gradient-to-r from-wrench-navy-600 to-wrench-navy-800 hover:from-wrench-navy-800 hover:to-wrench-navy-600 text-white py-2 sm:py-3 text-sm sm:text-base font-medium">
                  <Settings className="h-4 w-4 mr-2" />
                  Open Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Admin-Only Features */}
        {currentUser?.role === "admin" && (
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-wrench-navy-900 mb-6 text-center">
              Administrative Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Database Management */}
              <Card className="bg-gradient-to-br from-wrench-accent to-wrench-accent-light text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center p-4 sm:p-6">
                  <DatabaseIcon className="h-10 sm:h-12 w-10 sm:w-12 mx-auto mb-3 sm:mb-4" />
                  <CardTitle className="text-white text-sm sm:text-base">
                    Database Management
                  </CardTitle>
                  <CardDescription className="text-white/80 text-xs sm:text-sm">
                    Import and manage maintenance data
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center p-4 sm:p-6">
                  <Link to="/admin/database">
                    <Button className="w-full bg-white text-wrench-accent hover:bg-wrench-navy-50 py-2 sm:py-3 text-sm sm:text-base font-medium">
                      <DatabaseIcon className="h-4 w-4 mr-2" />
                      Manage Data
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Professional Reports */}
              <Card className="bg-gradient-to-br from-wrench-success to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center p-4 sm:p-6">
                  <FileText className="h-10 sm:h-12 w-10 sm:w-12 mx-auto mb-3 sm:mb-4" />
                  <CardTitle className="text-white text-sm sm:text-base">
                    Professional Reports
                  </CardTitle>
                  <CardDescription className="text-white/80 text-xs sm:text-sm">
                    Generate comprehensive reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center p-4 sm:p-6">
                  <Link to="/reports">
                    <Button className="w-full bg-white text-wrench-success hover:bg-green-50 py-2 sm:py-3 text-sm sm:text-base font-medium">
                      <FileText className="h-4 w-4 mr-2" />
                      View Reports
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white border-wrench-navy-200 shadow-md">
            <CardContent className="p-6 text-center">
              <Activity className="h-10 w-10 text-wrench-accent mx-auto mb-3" />
              <h3 className="font-semibold text-wrench-navy-800 mb-2">
                Recent Activity
              </h3>
              <p className="text-sm text-wrench-navy-600">
                {analytics.completedToday} tasks completed today
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-wrench-navy-200 shadow-md">
            <CardContent className="p-6 text-center">
              <CheckSquare className="h-10 w-10 text-wrench-success mx-auto mb-3" />
              <h3 className="font-semibold text-wrench-navy-800 mb-2">
                System Status
              </h3>
              <p className="text-sm text-wrench-navy-600">
                All systems operational
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-wrench-navy-200 shadow-md">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-10 w-10 text-wrench-warning mx-auto mb-3" />
              <h3 className="font-semibold text-wrench-navy-800 mb-2">
                Performance
              </h3>
              <p className="text-sm text-wrench-navy-600">
                {analytics.averageTaskTime}min avg completion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Professional Footer */}
        <div className="mt-12 pt-8 border-t border-wrench-navy-200 text-center">
          <WrenchTagline variant="default" size="md" />
        </div>
      </main>
    </div>
  );
}
