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
  CheckSquare,
  Zap,
  Activity,
  AlertCircle,
  Target,
  Clock,
  Calendar,
  Award,
  Users,
  Wrench,
} from "lucide-react";
import { ProfessionalHeader } from "@/components/ProfessionalHeader";
import { WrenchTagline, WrenchBadge } from "@/components/WrenchLogo";
import Database from "@/lib/database";

export default function UserHome() {
  const analytics = Database.getAnalytics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-wrench-navy-50 via-white to-wrench-navy-50">
      {/* Professional Header */}
      <ProfessionalHeader 
        title="Operator Dashboard"
        subtitle="Your maintenance tasks and equipment access"
        showStats={false}
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
                  <AlertCircle className="h-6 w-6 text-wrench-warning" />
                  <span className="text-wrench-navy-800 font-semibold">No Tasks Available</span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-black text-wrench-navy-900 mb-4">
                  Awaiting Task
                  <br />
                  <span className="bg-gradient-to-r from-wrench-warning to-wrench-error bg-clip-text text-transparent">
                    Assignment
                  </span>
                </h1>
                
                <p className="text-xl text-wrench-navy-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Your maintenance schedule hasn't been uploaded yet. Contact your supervisor 
                  or administrator to set up your tasks and begin equipment maintenance.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" className="border-wrench-navy-300 text-wrench-navy-700 hover:bg-wrench-navy-50 px-8 py-4 text-lg hover-lift">
                    <Users className="h-5 w-5 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <WrenchBadge className="mb-6" />
                
                <h1 className="text-4xl lg:text-5xl font-black text-wrench-navy-900 mb-4">
                  Ready for
                  <br />
                  <span className="bg-gradient-to-r from-wrench-success to-wrench-accent bg-clip-text text-transparent">
                    Professional Service
                  </span>
                </h1>
                
                <p className="text-xl text-wrench-navy-600 mb-6 max-w-3xl mx-auto leading-relaxed">
                  You have <span className="font-semibold text-wrench-navy-800">{analytics.totalTasks} maintenance tasks</span> scheduled across{" "}
                  <span className="font-semibold text-wrench-navy-800">{analytics.totalMachines} equipment units</span>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-wrench-success/10 rounded-full">
                    <CheckSquare className="h-4 w-4 text-wrench-success" />
                    <span className="text-wrench-navy-700 font-medium text-sm">
                      {analytics.completedToday} Completed
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-wrench-warning/10 rounded-full">
                    <Clock className="h-4 w-4 text-wrench-warning" />
                    <span className="text-wrench-navy-700 font-medium text-sm">
                      {analytics.totalTasks - analytics.completedToday} Remaining
                    </span>
                  </div>
                  
                  {analytics.overdueTasks > 0 && (
                    <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-wrench-error/10 rounded-full">
                      <AlertCircle className="h-4 w-4 text-wrench-error" />
                      <span className="text-wrench-navy-700 font-medium text-sm">
                        {analytics.overdueTasks} Overdue
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Cards - Optimized for Operators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <Card className="group bg-gradient-to-br from-wrench-accent to-wrench-accent-light border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-wrench-accent/25 animate-slideInUp">
            <CardHeader className="text-center pb-6">
              <div className="relative">
                <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <QrCode className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -inset-4 bg-white/10 rounded-full blur group-hover:blur-lg transition-all duration-300"></div>
              </div>
              <CardTitle className="text-xl lg:text-2xl text-white">
                Scan Equipment
              </CardTitle>
              <CardDescription className="text-white/80 text-base lg:text-lg">
                Scan QR code to access machine maintenance tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/scan">
                <Button className="w-full bg-white text-wrench-accent hover:bg-wrench-navy-50 font-semibold py-4 sm:py-6 text-base lg:text-lg hover-lift shadow-lg">
                  <Zap className="h-5 w-5 mr-2" />
                  Start Scanning
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group bg-gradient-to-br from-wrench-success to-wrench-success/80 border-0 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-wrench-success/25 animate-slideInUp" style={{animationDelay: '0.1s'}}>
            <CardHeader className="text-center pb-6">
              <div className="relative">
                <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckSquare className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -inset-4 bg-white/10 rounded-full blur group-hover:blur-lg transition-all duration-300"></div>
              </div>
              <CardTitle className="text-xl lg:text-2xl text-white">
                My Tasks
              </CardTitle>
              <CardDescription className="text-white/80 text-base lg:text-lg">
                View your assigned maintenance tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/tasks">
                <Button className="w-full bg-white text-wrench-success hover:bg-green-50 font-semibold py-4 sm:py-6 text-base lg:text-lg hover-lift shadow-lg">
                  <Activity className="h-5 w-5 mr-2" />
                  View Tasks ({analytics.totalTasks})
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Personal Statistics - Only show if data exists */}
        {analytics.totalTasks > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto mb-12 animate-fadeInUp">
            <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-10 w-10 bg-wrench-success/10 rounded-full flex items-center justify-center">
                    <CheckSquare className="h-5 w-5 text-wrench-success" />
                  </div>
                  <CardTitle className="text-wrench-navy-700 text-sm font-semibold text-center">
                    Completed Today
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-wrench-success">
                  {analytics.completedToday}
                </div>
                <p className="text-wrench-navy-500 text-sm mt-1">Tasks Finished</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-10 w-10 bg-wrench-warning/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-wrench-warning" />
                  </div>
                  <CardTitle className="text-wrench-navy-700 text-sm font-semibold text-center">
                    Pending Tasks
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-wrench-warning">
                  {analytics.totalTasks - analytics.completedToday}
                </div>
                <p className="text-wrench-navy-500 text-sm mt-1">Remaining</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-10 w-10 bg-wrench-error/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-wrench-error" />
                  </div>
                  <CardTitle className="text-wrench-navy-700 text-sm font-semibold text-center">
                    Priority Items
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-wrench-error">
                  {analytics.overdueTasks}
                </div>
                <p className="text-wrench-navy-500 text-sm mt-1">Need Attention</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Operator Excellence Banner */}
        <Card className="bg-gradient-to-r from-wrench-navy-900 via-wrench-navy-800 to-wrench-navy-900 text-white border-0 shadow-2xl">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-wrench-accent to-wrench-success rounded-full flex items-center justify-center">
                    <Wrench className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Professional Operator</h3>
                    <p className="text-white/80">Certified maintenance technician</p>
                  </div>
                </div>
                
                <WrenchTagline variant="dark" size="md" className="text-left mb-6" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-wrench-success" />
                    <span className="text-sm">Quality Assured</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-wrench-accent" />
                    <span className="text-sm">Precision Work</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-wrench-warning" />
                    <span className="text-sm">On Schedule</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckSquare className="h-5 w-5 text-white" />
                    <span className="text-sm">Task Complete</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <div className="text-4xl font-black mb-2">
                  {analytics.totalTasks > 0 
                    ? Math.round((analytics.completedToday / analytics.totalTasks) * 100)
                    : 0}%
                </div>
                <p className="text-white/80 mb-4">Daily Progress</p>
                <div className="space-y-2">
                  <div className="text-lg font-semibold">{analytics.completedToday} / {analytics.totalTasks}</div>
                  <p className="text-white/60 text-sm">Tasks Completed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
