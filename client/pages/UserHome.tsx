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
  Activity,
  AlertCircle,
  Clock,
  Settings,
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
                  Ready to begin maintenance operations. Contact your supervisor to get started.
                </p>
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

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                  <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-wrench-success/10 rounded-full">
                    <CheckSquare className="h-4 w-4 text-wrench-success" />
                    <span className="text-wrench-navy-700 font-medium text-sm">
                      {analytics.completedToday} Completed
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-wrench-warning/10 rounded-full">
                    <Clock className="h-4 w-4 text-wrench-warning" />
                    <span className="text-wrench-navy-700 font-medium text-sm">
                      {analytics.overdueTasks} Overdue
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-wrench-accent/10 rounded-full">
                    <Activity className="h-4 w-4 text-wrench-accent" />
                    <span className="text-wrench-navy-700 font-medium text-sm">
                      {analytics.upcomingTasks} Upcoming
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Action Cards - Only operator-relevant features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
          {/* Equipment Scanner */}
          <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift group">
            <CardHeader className="text-center pb-6">
              <div className="h-20 w-20 bg-gradient-to-br from-wrench-accent to-wrench-accent-light rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <QrCode className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-xl text-wrench-navy-800">Scan Equipment</CardTitle>
              <CardDescription className="text-wrench-navy-600">
                Scan QR codes to access maintenance tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <Link to="/scan" className="block w-full">
                <Button className="w-full bg-gradient-to-r from-wrench-accent to-wrench-accent-light hover:from-wrench-accent-light hover:to-wrench-accent text-white py-3 text-lg font-medium">
                  <QrCode className="h-5 w-5 mr-2" />
                  Start Scanning
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* My Tasks */}
          <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift group">
            <CardHeader className="text-center pb-6">
              <div className="h-20 w-20 bg-gradient-to-br from-wrench-success to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <CheckSquare className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-xl text-wrench-navy-800">My Tasks</CardTitle>
              <CardDescription className="text-wrench-navy-600">
                View and complete your assigned tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <Link to="/tasks" className="block w-full">
                <Button className="w-full bg-gradient-to-r from-wrench-success to-green-600 hover:from-green-600 hover:to-wrench-success text-white py-3 text-lg font-medium">
                  <CheckSquare className="h-5 w-5 mr-2" />
                  View Tasks
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Settings Access */}
        <div className="max-w-md mx-auto mb-12">
          <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
            <CardHeader className="text-center pb-4">
              <Settings className="h-12 w-12 text-wrench-navy-600 mx-auto mb-3" />
              <CardTitle className="text-wrench-navy-800">Account Settings</CardTitle>
              <CardDescription className="text-wrench-navy-600">
                Manage your account preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/settings" className="block w-full">
                <Button 
                  variant="outline" 
                  className="w-full border-wrench-navy-300 text-wrench-navy-700 hover:bg-wrench-navy-50 py-2"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Open Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Status Information */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border-wrench-navy-200 shadow-md">
              <CardContent className="p-6 text-center">
                <Clock className="h-10 w-10 text-wrench-accent mx-auto mb-3" />
                <h3 className="font-semibold text-wrench-navy-800 mb-2">Today's Progress</h3>
                <p className="text-sm text-wrench-navy-600">
                  {analytics.completedToday} tasks completed
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-wrench-navy-200 shadow-md">
              <CardContent className="p-6 text-center">
                <Activity className="h-10 w-10 text-wrench-success mx-auto mb-3" />
                <h3 className="font-semibold text-wrench-navy-800 mb-2">System Status</h3>
                <p className="text-sm text-wrench-navy-600">
                  All systems operational
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-wrench-navy-200 shadow-md">
              <CardContent className="p-6 text-center">
                <Wrench className="h-10 w-10 text-wrench-warning mx-auto mb-3" />
                <h3 className="font-semibold text-wrench-navy-800 mb-2">Next Task</h3>
                <p className="text-sm text-wrench-navy-600">
                  {analytics.upcomingTasks > 0 ? "Tasks pending" : "No pending tasks"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Professional Footer */}
        <div className="mt-12 pt-8 border-t border-wrench-navy-200 text-center">
          <WrenchTagline variant="default" size="md" />
        </div>
      </main>
    </div>
  );
}
