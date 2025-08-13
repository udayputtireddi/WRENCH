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
  Wrench,
  Target,
  Users,
  Zap,
  Settings,
} from "lucide-react";
import Database from "@/lib/database";

export default function Analytics() {
  const analytics = Database.getAnalytics();
  const hasData = analytics.totalTasks > 0;

  return (
    <div className="app-container bg-gradient-to-br from-wrench-navy-50 via-white to-wrench-navy-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-wrench-navy-800 via-wrench-navy-700 to-wrench-navy-800 shadow-2xl relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Header Background Elements */}
        <div className="absolute top-4 left-4 text-wrench-navy-300 opacity-20">
          <BarChart3 className="h-6 w-6" />
        </div>
        <div className="absolute bottom-4 right-4 text-wrench-navy-300 opacity-20">
          <Settings className="h-5 w-5 animate-spin" style={{animationDuration: '25s'}} />
        </div>

        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 hover-lift"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-wrench-accent to-white/20 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Analytics Dashboard
                </h1>
                <p className="text-wrench-navy-200">
                  Performance insights and maintenance trends
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!hasData ? (
          // Empty State
          <div className="text-center py-20">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-wrench-warning/20 to-wrench-error/20 blur-3xl rounded-full"></div>
              <div className="relative flex items-center justify-center mb-6">
                <AlertCircle className="h-20 w-20 text-wrench-warning mr-4" />
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-wrench-navy-800 mb-2">
                    No Analytics Data Available
                  </h2>
                  <div className="h-1 w-64 bg-gradient-to-r from-wrench-warning to-wrench-error mx-auto rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="text-xl text-wrench-navy-600 max-w-2xl mx-auto leading-relaxed mb-8">
              Analytics will be generated once maintenance tasks are uploaded
              and completed. Upload your maintenance data to start tracking
              performance.
            </p>
            <Link to="/admin/database">
              <Button className="bg-gradient-to-r from-wrench-navy-800 to-wrench-navy-700 hover:from-wrench-navy-900 hover:to-wrench-navy-800 text-white px-8 py-4 text-lg hover-lift shadow-lg">
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
              <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-wrench-navy-700">
                    Task Completion Rate
                  </CardTitle>
                  <div className="h-8 w-8 bg-wrench-success/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-wrench-success" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-wrench-navy-800">
                    {analytics.totalTasks > 0
                      ? Math.round(
                          (analytics.completedToday / analytics.totalTasks) *
                            100,
                        )
                      : 0}
                    %
                  </div>
                  <p className="text-xs text-wrench-navy-500">
                    Tasks completed today
                  </p>
                  <Progress
                    value={
                      analytics.totalTasks > 0
                        ? (analytics.completedToday / analytics.totalTasks) * 100
                        : 0
                    }
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-wrench-navy-700">
                    Total Machines
                  </CardTitle>
                  <div className="h-8 w-8 bg-wrench-accent/10 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-wrench-accent" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-wrench-navy-800">
                    {analytics.totalMachines}
                  </div>
                  <p className="text-xs text-wrench-navy-500">
                    Active equipment units
                  </p>
                  <div className="flex items-center text-xs text-wrench-success mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Operational
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-wrench-navy-700">
                    Overdue Tasks
                  </CardTitle>
                  <div className="h-8 w-8 bg-wrench-error/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-wrench-error" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-wrench-error">
                    {analytics.overdueTasks}
                  </div>
                  <p className="text-xs text-wrench-navy-500">
                    Requiring immediate attention
                  </p>
                  {analytics.overdueTasks > 0 && (
                    <div className="flex items-center text-xs text-wrench-error mt-1">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      Critical
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-wrench-navy-700">
                    Upcoming Tasks
                  </CardTitle>
                  <div className="h-8 w-8 bg-wrench-warning/10 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-wrench-warning" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-wrench-warning">
                    {analytics.upcomingTasks}
                  </div>
                  <p className="text-xs text-wrench-navy-500">
                    Due within 24 hours
                  </p>
                  <div className="flex items-center text-xs text-wrench-warning mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    Scheduled
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white border-wrench-navy-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-wrench-navy-800 flex items-center">
                    <Activity className="h-6 w-6 mr-2 text-wrench-accent" />
                    Maintenance Performance
                  </CardTitle>
                  <CardDescription className="text-wrench-navy-600">
                    Overall system performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-wrench-navy-700 font-medium">Completion Rate</span>
                        <span className="text-wrench-navy-800 font-semibold">
                          {analytics.totalTasks > 0
                            ? Math.round(
                                (analytics.completedToday / analytics.totalTasks) * 100,
                              )
                            : 0}%
                        </span>
                      </div>
                      <Progress
                        value={
                          analytics.totalTasks > 0
                            ? (analytics.completedToday / analytics.totalTasks) * 100
                            : 0
                        }
                        className="h-3"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-wrench-navy-700 font-medium">On-Time Performance</span>
                        <span className="text-wrench-navy-800 font-semibold">
                          {analytics.totalTasks > 0
                            ? Math.round(
                                ((analytics.totalTasks - analytics.overdueTasks) / analytics.totalTasks) * 100,
                              )
                            : 100}%
                        </span>
                      </div>
                      <Progress
                        value={
                          analytics.totalTasks > 0
                            ? ((analytics.totalTasks - analytics.overdueTasks) / analytics.totalTasks) * 100
                            : 100
                        }
                        className="h-3"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-wrench-navy-700 font-medium">Equipment Coverage</span>
                        <span className="text-wrench-navy-800 font-semibold">100%</span>
                      </div>
                      <Progress value={100} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-wrench-navy-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-wrench-navy-800 flex items-center">
                    <Target className="h-6 w-6 mr-2 text-wrench-accent" />
                    Key Insights
                  </CardTitle>
                  <CardDescription className="text-wrench-navy-600">
                    System optimization recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 bg-wrench-success/10 rounded-lg border border-wrench-success/20">
                      <CheckCircle className="h-5 w-5 text-wrench-success mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-wrench-navy-800">
                          Maintenance Coverage Complete
                        </p>
                        <p className="text-xs text-wrench-navy-600">
                          All machines have scheduled maintenance tasks
                        </p>
                      </div>
                    </div>

                    {analytics.overdueTasks > 0 && (
                      <div className="flex items-start space-x-3 p-3 bg-wrench-error/10 rounded-lg border border-wrench-error/20">
                        <AlertTriangle className="h-5 w-5 text-wrench-error mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-wrench-navy-800">
                            Overdue Tasks Detected
                          </p>
                          <p className="text-xs text-wrench-navy-600">
                            {analytics.overdueTasks} tasks require immediate attention
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start space-x-3 p-3 bg-wrench-accent/10 rounded-lg border border-wrench-accent/20">
                      <Zap className="h-5 w-5 text-wrench-accent mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-wrench-navy-800">
                          System Operational
                        </p>
                        <p className="text-xs text-wrench-navy-600">
                          WRENCH maintenance system is tracking {analytics.totalTasks} tasks
                        </p>
                      </div>
                    </div>

                    {analytics.upcomingTasks > 0 && (
                      <div className="flex items-start space-x-3 p-3 bg-wrench-warning/10 rounded-lg border border-wrench-warning/20">
                        <Clock className="h-5 w-5 text-wrench-warning mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-wrench-navy-800">
                            Upcoming Maintenance
                          </p>
                          <p className="text-xs text-wrench-navy-600">
                            {analytics.upcomingTasks} tasks scheduled for tomorrow
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Items */}
            <Card className="bg-gradient-to-r from-wrench-navy-800 to-wrench-navy-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="h-6 w-6 mr-2" />
                  Professional Maintenance Analytics
                </CardTitle>
                <CardDescription className="text-wrench-navy-200">
                  Advanced insights for optimal equipment performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {analytics.totalTasks}
                    </div>
                    <p className="text-wrench-navy-200 text-sm">Total Tasks Managed</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {analytics.totalMachines}
                    </div>
                    <p className="text-wrench-navy-200 text-sm">Equipment Units</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {analytics.totalTasks > 0
                        ? Math.round(
                            ((analytics.totalTasks - analytics.overdueTasks) / analytics.totalTasks) * 100,
                          )
                        : 100}%
                    </div>
                    <p className="text-wrench-navy-200 text-sm">System Efficiency</p>
                  </div>
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
