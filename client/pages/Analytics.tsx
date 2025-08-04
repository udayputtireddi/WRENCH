import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  BarChart3,
  Upload,
  AlertCircle,
} from "lucide-react";
import Database from "@/lib/database";

export default function Analytics() {
  const analytics = Database.getAnalytics();
  const hasData = analytics.totalTasks > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 via-orange-700 to-amber-800 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Analytics Dashboard
              </h1>
              <p className="text-orange-100">
                Performance insights and maintenance trends
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!hasData ? (
          // Empty State
          <div className="text-center py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 blur-3xl rounded-full"></div>
              <AlertCircle className="h-24 w-24 text-orange-400 mx-auto mb-6" />
              <h2 className="relative text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-6">
                No Analytics Data Available
              </h2>
            </div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
              Analytics will be generated once maintenance tasks are uploaded and completed. Upload your maintenance data to start tracking performance.
            </p>
            <Link to="/admin/database">
              <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-8 py-4 text-lg">
                <Upload className="h-5 w-5 mr-2" />
                Upload Maintenance Data
              </Button>
            </Link>
          </div>
        ) : (
          // Analytics Dashboard with Data
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Task Completion Rate
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {analytics.totalTasks > 0 
                      ? Math.round((analytics.completedToday / analytics.totalTasks) * 100)
                      : 0}%
                  </div>
                  <p className="text-xs text-slate-400">
                    {analytics.completedToday} of {analytics.totalTasks} tasks completed today
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Active Machines
                  </CardTitle>
                  <Activity className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {analytics.totalMachines}
                  </div>
                  <p className="text-xs text-slate-400">
                    Machines with maintenance schedules
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Overdue Tasks
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">
                    {analytics.overdueTasks}
                  </div>
                  <p className="text-xs text-slate-400">
                    Tasks requiring immediate attention
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Upcoming Tasks
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">
                    {analytics.upcomingTasks}
                  </div>
                  <p className="text-xs text-slate-400">
                    Tasks due tomorrow
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Progress Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Daily Progress</CardTitle>
                  <CardDescription className="text-slate-400">
                    Task completion progress for today
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Completed</span>
                      <span className="text-sm text-green-400">{analytics.completedToday}</span>
                    </div>
                    <Progress 
                      value={analytics.totalTasks > 0 ? (analytics.completedToday / analytics.totalTasks) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Overdue</span>
                      <span className="text-sm text-red-400">{analytics.overdueTasks}</span>
                    </div>
                    <Progress 
                      value={analytics.totalTasks > 0 ? (analytics.overdueTasks / analytics.totalTasks) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">System Health</CardTitle>
                  <CardDescription className="text-slate-400">
                    Overall maintenance system performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">On-time Completion</span>
                    <span className="text-sm text-green-400">
                      {analytics.totalTasks > analytics.overdueTasks ? 'Good' : 'Needs Improvement'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Machine Coverage</span>
                    <span className="text-sm text-blue-400">
                      {analytics.totalMachines > 0 ? 'Active' : 'No Data'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Task Load</span>
                    <span className="text-sm text-yellow-400">
                      {analytics.totalTasks > 10 ? 'High' : analytics.totalTasks > 5 ? 'Medium' : 'Light'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Summary */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">System Overview</CardTitle>
                <CardDescription className="text-slate-400">
                  Current maintenance status summary
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-blue-400" />
                      <span className="text-white">System Status</span>
                    </div>
                    <span className="text-green-400 font-medium">
                      {analytics.overdueTasks === 0 ? 'All tasks current' : `${analytics.overdueTasks} overdue tasks`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-yellow-400" />
                      <span className="text-white">Next Maintenance</span>
                    </div>
                    <span className="text-yellow-400 font-medium">
                      {analytics.upcomingTasks > 0 ? `${analytics.upcomingTasks} tasks tomorrow` : 'No immediate tasks'}
                    </span>
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
