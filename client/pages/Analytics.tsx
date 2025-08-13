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
  Target,
  Users,
  Zap,
  Settings,
  Award,
  Shield,
  Wrench,
} from "lucide-react";
import { ProfessionalHeader, NavigationBreadcrumbs } from "@/components/ProfessionalHeader";
import { WrenchBadge, WrenchTagline } from "@/components/WrenchLogo";
import { Link } from "react-router-dom";
import Database from "@/lib/database";

export default function Analytics() {
  const analytics = Database.getAnalytics();
  const hasData = analytics.totalTasks > 0;

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Analytics" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-wrench-navy-50 via-white to-wrench-navy-50">
      {/* Professional Header */}
      <ProfessionalHeader 
        title="Analytics Dashboard"
        subtitle="Performance insights and maintenance intelligence"
        showStats={true}
        variant="gradient"
      />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <NavigationBreadcrumbs items={breadcrumbs} />
        </div>

        {!hasData ? (
          // Empty State
          <div className="text-center py-20">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-wrench-warning/10 to-wrench-error/10 rounded-full border border-wrench-warning/20 mb-6">
                  <AlertCircle className="h-6 w-6 text-wrench-warning" />
                  <span className="text-wrench-navy-800 font-semibold">No Analytics Data Available</span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-black text-wrench-navy-900 mb-4">
                  Waiting for
                  <br />
                  <span className="bg-gradient-to-r from-wrench-warning to-wrench-error bg-clip-text text-transparent">
                    Maintenance Data
                  </span>
                </h1>
                
                <p className="text-xl text-wrench-navy-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Analytics will be generated once maintenance tasks are uploaded and completed. 
                  Upload your maintenance data to start tracking performance metrics and insights.
                </p>
                
                <Link to="/admin/database">
                  <Button className="bg-gradient-to-r from-wrench-navy-800 to-wrench-navy-700 hover:from-wrench-navy-900 hover:to-wrench-navy-800 text-white px-8 py-4 text-lg hover-lift shadow-lg">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Maintenance Data
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Analytics Dashboard with Data
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <WrenchBadge className="mb-4" />
              <h1 className="text-3xl lg:text-4xl font-black text-wrench-navy-900 mb-4">
                Professional Analytics
                <br />
                <span className="bg-gradient-to-r from-wrench-accent to-wrench-success bg-clip-text text-transparent">
                  Intelligence Dashboard
                </span>
              </h1>
              <p className="text-lg text-wrench-navy-600 max-w-3xl mx-auto">
                Advanced performance metrics and maintenance intelligence for optimal equipment management.
              </p>
            </div>

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
                    Equipment Units
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
                    Critical Items
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
                    Scheduled Tasks
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
                    Overall system performance metrics and efficiency indicators
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
                    Intelligence Insights
                  </CardTitle>
                  <CardDescription className="text-wrench-navy-600">
                    AI-powered recommendations and system optimization insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-wrench-success/10 rounded-lg border border-wrench-success/20">
                      <CheckCircle className="h-5 w-5 text-wrench-success mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-wrench-navy-800">
                          Maintenance Coverage Complete
                        </p>
                        <p className="text-xs text-wrench-navy-600">
                          All equipment units have scheduled maintenance tasks
                        </p>
                      </div>
                    </div>

                    {analytics.overdueTasks > 0 && (
                      <div className="flex items-start space-x-3 p-4 bg-wrench-error/10 rounded-lg border border-wrench-error/20">
                        <AlertTriangle className="h-5 w-5 text-wrench-error mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-wrench-navy-800">
                            Critical Tasks Detected
                          </p>
                          <p className="text-xs text-wrench-navy-600">
                            {analytics.overdueTasks} tasks require immediate attention
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start space-x-3 p-4 bg-wrench-accent/10 rounded-lg border border-wrench-accent/20">
                      <Zap className="h-5 w-5 text-wrench-accent mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-wrench-navy-800">
                          System Operational
                        </p>
                        <p className="text-xs text-wrench-navy-600">
                          WRENCH platform is tracking {analytics.totalTasks} maintenance tasks
                        </p>
                      </div>
                    </div>

                    {analytics.upcomingTasks > 0 && (
                      <div className="flex items-start space-x-3 p-4 bg-wrench-warning/10 rounded-lg border border-wrench-warning/20">
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

            {/* Professional Analytics Banner */}
            <Card className="bg-gradient-to-r from-wrench-navy-900 via-wrench-navy-800 to-wrench-navy-900 text-white border-0 shadow-2xl">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-wrench-accent to-wrench-success rounded-full flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Professional Analytics</h3>
                        <p className="text-white/80">Advanced maintenance intelligence</p>
                      </div>
                    </div>
                    
                    <WrenchTagline variant="dark" size="md" className="text-left mb-6" />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Award className="h-5 w-5 text-wrench-success" />
                        <span className="text-sm">Certified Metrics</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-wrench-accent" />
                        <span className="text-sm">Secure Analytics</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-wrench-warning" />
                        <span className="text-sm">Precision Insights</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Wrench className="h-5 w-5 text-white" />
                        <span className="text-sm">Professional Grade</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center md:text-right">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">
                          {analytics.totalTasks}
                        </div>
                        <p className="text-white/70 text-xs">Tasks Managed</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">
                          {analytics.totalMachines}
                        </div>
                        <p className="text-white/70 text-xs">Equipment Units</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">
                          {analytics.totalTasks > 0
                            ? Math.round(
                                ((analytics.totalTasks - analytics.overdueTasks) / analytics.totalTasks) * 100,
                              )
                            : 100}%
                        </div>
                        <p className="text-white/70 text-xs">Efficiency</p>
                      </div>
                    </div>
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
