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
} from "lucide-react";

export default function Analytics() {
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
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-600 to-green-700 border-0 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Efficiency Rate</p>
                  <p className="text-3xl font-bold">96.2%</p>
                  <div className="flex items-center gap-1 text-green-200 text-sm mt-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>+2.5%</span>
                  </div>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Avg. Completion Time</p>
                  <p className="text-3xl font-bold">28m</p>
                  <div className="flex items-center gap-1 text-blue-200 text-sm mt-1">
                    <TrendingDown className="h-3 w-3" />
                    <span>-5m</span>
                  </div>
                </div>
                <Clock className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Tasks This Week</p>
                  <p className="text-3xl font-bold">47</p>
                  <div className="flex items-center gap-1 text-purple-200 text-sm mt-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>+12</span>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-600 to-red-700 border-0 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Overdue Tasks</p>
                  <p className="text-3xl font-bold">2</p>
                  <div className="flex items-center gap-1 text-red-200 text-sm mt-1">
                    <TrendingDown className="h-3 w-3" />
                    <span>-3</span>
                  </div>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Task Completion Trend */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Task Completion Trend
              </CardTitle>
              <CardDescription className="text-slate-400">
                Tasks completed over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { day: "Mon", completed: 8, total: 10 },
                  { day: "Tue", completed: 12, total: 12 },
                  { day: "Wed", completed: 6, total: 8 },
                  { day: "Thu", completed: 9, total: 11 },
                  { day: "Fri", completed: 7, total: 9 },
                  { day: "Sat", completed: 5, total: 6 },
                  { day: "Sun", completed: 4, total: 5 },
                ].map((data) => (
                  <div key={data.day} className="flex items-center gap-4">
                    <div className="w-8 text-slate-300 text-sm">{data.day}</div>
                    <div className="flex-1">
                      <Progress
                        value={(data.completed / data.total) * 100}
                        className="h-2"
                      />
                    </div>
                    <div className="text-slate-300 text-sm w-12 text-right">
                      {data.completed}/{data.total}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Machine Performance */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Machine Performance
              </CardTitle>
              <CardDescription className="text-slate-400">
                Efficiency by machine type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    name: "Assembly Line Cars",
                    efficiency: 98,
                    tasks: 15,
                    color: "bg-green-500",
                  },
                  {
                    name: "Hydraulic Pumps",
                    efficiency: 94,
                    tasks: 8,
                    color: "bg-blue-500",
                  },
                  {
                    name: "CNC Drill Presses",
                    efficiency: 92,
                    tasks: 12,
                    color: "bg-purple-500",
                  },
                  {
                    name: "Conveyor Systems",
                    efficiency: 89,
                    tasks: 6,
                    color: "bg-orange-500",
                  },
                ].map((machine) => (
                  <div key={machine.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-medium">{machine.name}</h4>
                      <span className="text-slate-400 text-sm">
                        {machine.efficiency}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-700 rounded-full h-2">
                        <div
                          className={`${machine.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${machine.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-slate-400 text-xs">
                        {machine.tasks} tasks
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Insights */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-slate-400">
                Latest maintenance actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    time: "2h ago",
                    action: "Engine Oil Check completed",
                    machine: "CAR-001",
                    type: "success",
                  },
                  {
                    time: "4h ago",
                    action: "Belt Tension Check started",
                    machine: "CAR-001",
                    type: "info",
                  },
                  {
                    time: "6h ago",
                    action: "Pressure Test overdue",
                    machine: "PUMP-05",
                    type: "warning",
                  },
                  {
                    time: "1d ago",
                    action: "Spindle Lubrication completed",
                    machine: "DRILL-12",
                    type: "success",
                  },
                  {
                    time: "2d ago",
                    action: "Air Filter Inspection completed",
                    machine: "CAR-001",
                    type: "success",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === "success"
                          ? "bg-green-500"
                          : activity.type === "warning"
                            ? "bg-orange-500"
                            : "bg-blue-500"
                      }`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm">{activity.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-slate-400 text-xs">
                          {activity.machine}
                        </span>
                        <span className="text-slate-500 text-xs">•</span>
                        <span className="text-slate-500 text-xs">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Insights & Recommendations */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Insights & Recommendations
              </CardTitle>
              <CardDescription className="text-slate-400">
                AI-powered maintenance suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <h4 className="text-green-300 font-medium mb-1">
                        Excellent Performance
                      </h4>
                      <p className="text-green-100 text-sm">
                        CAR-001 has maintained 100% task completion rate this
                        week.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-400 mt-0.5" />
                    <div>
                      <h4 className="text-orange-300 font-medium mb-1">
                        Attention Needed
                      </h4>
                      <p className="text-orange-100 text-sm">
                        PUMP-05 has 2 overdue tasks. Consider scheduling
                        immediate maintenance.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-blue-300 font-medium mb-1">
                        Optimization Opportunity
                      </h4>
                      <p className="text-blue-100 text-sm">
                        Weekly tasks could be batched to reduce machine downtime
                        by 15%.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-purple-400 mt-0.5" />
                    <div>
                      <h4 className="text-purple-300 font-medium mb-1">
                        Predictive Maintenance
                      </h4>
                      <p className="text-purple-100 text-sm">
                        DRILL-12 may require parts replacement in 2-3 weeks
                        based on usage patterns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
