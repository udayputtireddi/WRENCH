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
  Zap,
  Clock,
  Activity,
  Upload,
  Users,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Target,
  Award,
  Shield,
  Wrench,
} from "lucide-react";
import { ProfessionalHeader } from "@/components/ProfessionalHeader";
import { WrenchTagline, WrenchBadge } from "@/components/WrenchLogo";
import Database from "@/lib/database";

export default function Home() {
  const analytics = Database.getAnalytics();

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
          {analytics.totalTasks === 0 ? (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-wrench-warning/10 to-wrench-error/10 rounded-full border border-wrench-warning/20 mb-6">
                  <AlertTriangle className="h-6 w-6 text-wrench-warning" />
                  <span className="text-wrench-navy-800 font-semibold">System Ready for Configuration</span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-black text-wrench-navy-900 mb-4">
                  Professional Equipment
                  <br />
                  <span className="bg-gradient-to-r from-wrench-accent to-wrench-success bg-clip-text text-transparent">
                    Maintenance Platform
                  </span>
                </h1>
                
                <p className="text-xl text-wrench-navy-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Upload your equipment maintenance schedules to begin optimizing your repair operations 
                  with our professional-grade management system.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/admin/database">
                    <Button className="bg-gradient-to-r from-wrench-navy-800 to-wrench-navy-700 hover:from-wrench-navy-900 hover:to-wrench-navy-800 text-white px-8 py-4 text-lg hover-lift shadow-lg">
                      <Upload className="h-5 w-5 mr-2" />
                      Upload Maintenance Data
                    </Button>
                  </Link>
                  <Link to="/scan">
                    <Button variant="outline" className="border-wrench-navy-300 text-wrench-navy-700 hover:bg-wrench-navy-50 px-8 py-4 text-lg hover-lift">
                      <QrCode className="h-5 w-5 mr-2" />
                      Scan Equipment
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <WrenchBadge className="mb-6" />
                
                <h1 className="text-4xl lg:text-5xl font-black text-wrench-navy-900 mb-4">
                  System Operational
                  <br />
                  <span className="bg-gradient-to-r from-wrench-success to-wrench-accent bg-clip-text text-transparent">
                    Ready for Service
                  </span>
                </h1>
                
                <p className="text-xl text-wrench-navy-600 mb-6 max-w-3xl mx-auto leading-relaxed">
                  <span className="font-semibold text-wrench-navy-800">{analytics.totalTasks} maintenance tasks</span> across{" "}
                  <span className="font-semibold text-wrench-navy-800">{analytics.totalMachines} equipment units</span>{" "}
                  are actively monitored and managed.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-wrench-success/10 rounded-full">
                    <CheckSquare className="h-4 w-4 text-wrench-success" />
                    <span className="text-wrench-navy-700 font-medium text-sm">
                      {analytics.completedToday} Completed Today
                    </span>
                  </div>
                  
                  {analytics.overdueTasks > 0 && (
                    <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-wrench-error/10 rounded-full">
                      <AlertTriangle className="h-4 w-4 text-wrench-error" />
                      <span className="text-wrench-navy-700 font-medium text-sm">
                        {analytics.overdueTasks} Overdue
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-wrench-accent/10 rounded-full">
                    <Calendar className="h-4 w-4 text-wrench-accent" />
                    <span className="text-wrench-navy-700 font-medium text-sm">
                      {analytics.upcomingTasks} Due Tomorrow
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="group bg-gradient-to-br from-wrench-accent to-wrench-accent-light border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-wrench-accent/25 animate-slideInUp">
            <CardHeader className="text-center">
              <div className="relative">
                <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <QrCode className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -inset-2 bg-white/10 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
              </div>
              <CardTitle className="text-lg text-white">
                Equipment Scanner
              </CardTitle>
              <CardDescription className="text-white/80 text-sm">
                Instant machine identification via QR codes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/scan">
                <Button className="w-full bg-white text-wrench-accent hover:bg-wrench-navy-50 font-semibold py-3 hover-lift shadow-md">
                  <Zap className="h-4 w-4 mr-2" />
                  Start Scanning
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group bg-gradient-to-br from-wrench-success to-wrench-success/80 border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-wrench-success/25 animate-slideInUp" style={{animationDelay: '0.1s'}}>
            <CardHeader className="text-center">
              <div className="relative">
                <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckSquare className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -inset-2 bg-white/10 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
              </div>
              <CardTitle className="text-lg text-white">
                Active Tasks
              </CardTitle>
              <CardDescription className="text-white/80 text-sm">
                View and manage maintenance tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/tasks">
                <Button className="w-full bg-white text-wrench-success hover:bg-green-50 font-semibold py-3 hover-lift shadow-md">
                  <Activity className="h-4 w-4 mr-2" />
                  View Tasks ({analytics.totalTasks})
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group bg-gradient-to-br from-wrench-navy-600 to-wrench-navy-700 border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-wrench-navy-600/25 animate-slideInUp" style={{animationDelay: '0.2s'}}>
            <CardHeader className="text-center">
              <div className="relative">
                <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -inset-2 bg-white/10 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
              </div>
              <CardTitle className="text-lg text-white">
                Analytics
              </CardTitle>
              <CardDescription className="text-white/80 text-sm">
                Performance metrics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/analytics">
                <Button className="w-full bg-white text-wrench-navy-700 hover:bg-slate-50 font-semibold py-3 hover-lift shadow-md">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group bg-gradient-to-br from-wrench-warning to-wrench-warning/80 border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-wrench-warning/25 animate-slideInUp" style={{animationDelay: '0.3s'}}>
            <CardHeader className="text-center">
              <div className="relative">
                <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -inset-2 bg-white/10 rounded-full blur group-hover:blur-md transition-all duration-300"></div>
              </div>
              <CardTitle className="text-lg text-white">
                System Settings
              </CardTitle>
              <CardDescription className="text-white/80 text-sm">
                Configure platform preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/settings">
                <Button className="w-full bg-white text-wrench-warning hover:bg-orange-50 font-semibold py-3 hover-lift shadow-md">
                  <Settings className="h-4 w-4 mr-2" />
                  Open Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* System Statistics */}
        {analytics.totalTasks > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-fadeInUp">
            <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-wrench-navy-700 text-sm font-semibold">
                    Equipment Units
                  </CardTitle>
                  <div className="h-8 w-8 bg-wrench-navy-600/10 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-wrench-navy-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl lg:text-3xl font-bold text-wrench-navy-800">
                  {analytics.totalMachines}
                </div>
                <p className="text-wrench-navy-500 text-xs">Active systems</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-wrench-navy-700 text-sm font-semibold">
                    Today's Progress
                  </CardTitle>
                  <div className="h-8 w-8 bg-wrench-success/10 rounded-full flex items-center justify-center">
                    <CheckSquare className="h-4 w-4 text-wrench-success" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl lg:text-3xl font-bold text-wrench-success">
                  {analytics.completedToday}
                </div>
                <p className="text-wrench-navy-500 text-xs">Tasks completed</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-wrench-navy-700 text-sm font-semibold">
                    Critical Items
                  </CardTitle>
                  <div className="h-8 w-8 bg-wrench-error/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-wrench-error" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl lg:text-3xl font-bold text-wrench-error">
                  {analytics.overdueTasks}
                </div>
                <p className="text-wrench-navy-500 text-xs">Overdue tasks</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-wrench-navy-700 text-sm font-semibold">
                    Scheduled
                  </CardTitle>
                  <div className="h-8 w-8 bg-wrench-warning/10 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-wrench-warning" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl lg:text-3xl font-bold text-wrench-warning">
                  {analytics.upcomingTasks}
                </div>
                <p className="text-wrench-navy-500 text-xs">Due tomorrow</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Professional Services Banner */}
        <Card className="bg-gradient-to-r from-wrench-navy-900 via-wrench-navy-800 to-wrench-navy-900 text-white border-0 shadow-2xl">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-wrench-accent to-wrench-success rounded-full flex items-center justify-center">
                    <Wrench className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">WRENCH Professional Services</h3>
                    <p className="text-white/80">Enterprise maintenance solutions</p>
                  </div>
                </div>
                
                <WrenchTagline variant="dark" size="md" className="text-left mb-6" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-wrench-success" />
                    <span className="text-sm">Certified Solutions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-wrench-accent" />
                    <span className="text-sm">Enterprise Security</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-wrench-warning" />
                    <span className="text-sm">Precision Tracking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-white" />
                    <span className="text-sm">24/7 Monitoring</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <div className="text-4xl font-black mb-2">
                  {analytics.totalTasks > 0 
                    ? Math.round(((analytics.totalTasks - analytics.overdueTasks) / analytics.totalTasks) * 100)
                    : 100}%
                </div>
                <p className="text-white/80 mb-4">System Efficiency</p>
                <div className="space-y-2">
                  <div className="text-lg font-semibold">{analytics.totalTasks}</div>
                  <p className="text-white/60 text-sm">Tasks Managed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
