import { useParams, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Settings,
  AlertCircle,
  Upload,
} from "lucide-react";
import {
  getTaskStatusColor,
  getMachineStatusColor,
} from "@/lib/mockData";
import Database from "@/lib/database";

export default function Machine() {
  const { machineId } = useParams<{ machineId: string }>();
  const [searchParams] = useSearchParams();
  
  const machine = machineId ? Database.getMachineById(machineId) : undefined;
  const allTasks = Database.getTasks();
  const hasData = allTasks.length > 0;

  // If no data in system, show empty state
  if (!hasData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-2xl">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">Machine Not Found</h1>
                <p className="text-blue-100">No machine data available</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
              <AlertCircle className="h-24 w-24 text-blue-400 mx-auto mb-6" />
              <h2 className="relative text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                No Machine Data Available
              </h2>
            </div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
              Machine information will be available once maintenance data is uploaded. Upload your equipment data to access machine details and tasks.
            </p>
            <Link to="/admin/database">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg">
                <Upload className="h-5 w-5 mr-2" />
                Upload Machine Data
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // If machine not found, show not found message
  if (!machine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-2xl">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">Machine Not Found</h1>
                <p className="text-blue-100">Machine ID: {machineId}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <AlertCircle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <CardTitle className="text-white text-2xl">Machine Not Found</CardTitle>
              <CardDescription className="text-slate-400">
                The machine with ID "{machineId}" was not found in the system.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-300 mb-6">
                This could mean the machine hasn't been registered yet or the QR code contains an incorrect ID.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/scan">
                  <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600">
                    Try Scanning Again
                  </Button>
                </Link>
                <Link to="/tasks">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    View All Tasks
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Convert database tasks to display format
  const displayTasks = machine.tasks.map(task => ({
    id: task.id,
    name: task.taskName,
    description: task.description,
    priority: task.category === 'inspection' ? 'Medium' : 
              task.category === 'cleaning' ? 'Low' : 'High',
    status: task.nextDueDate < new Date() ? 'Overdue' :
            task.lastCompletedDate && 
            task.lastCompletedDate.toDateString() === new Date().toDateString() ? 'Completed' :
            'Pending',
    nextDue: task.nextDueDate,
    lastCompleted: task.lastCompletedDate || new Date(0),
    estimatedTime: task.estimatedTimeMinutes,
    category: task.category,
    frequency: task.frequency
  }));

  const overdueTasks = displayTasks.filter((t) => t.status === "Overdue");
  const pendingTasks = displayTasks.filter((t) => t.status === "Pending");
  const completedTasks = displayTasks.filter((t) => t.status === "Completed");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <Link 
              to={searchParams.get('from') === 'scan' ? '/scan' : '/'}
              className="mr-4"
            >
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">{machine.name}</h1>
              <p className="text-blue-100">
                {machine.type} • {machine.location}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Machine Status Card */}
        <Card className="mb-8 bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Machine Status</span>
              <Badge className={getMachineStatusColor(machine.status)}>
                {machine.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-blue-400 mr-3" />
                <div>
                  <p className="text-slate-400 text-sm">Location</p>
                  <p className="text-white font-medium">{machine.location}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-green-400 mr-3" />
                <div>
                  <p className="text-slate-400 text-sm">Last Maintenance</p>
                  <p className="text-white font-medium">
                    {machine.lastMaintenance
                      ? machine.lastMaintenance.toLocaleDateString()
                      : "No records"}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-purple-400 mr-3" />
                <div>
                  <p className="text-slate-400 text-sm">Active Tasks</p>
                  <p className="text-white font-medium">{machine.tasks.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-red-600/20 to-red-700/20 border-red-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Overdue
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                {overdueTasks.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-700/20 border-yellow-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Pending
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">
                {pendingTasks.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/20 to-green-700/20 border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Completed
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {completedTasks.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        <div className="space-y-6">
          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Overdue Tasks
              </h2>
              <div className="grid gap-4">
                {overdueTasks.map((task) => (
                  <Card
                    key={task.id}
                    className="bg-slate-800/50 backdrop-blur-sm border-red-500/30 hover:border-red-400/50 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-white">{task.name}</h3>
                            <Badge className={getTaskStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                          </div>
                          <p className="text-slate-400 mb-2">{task.description}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-300">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span className="text-red-400">Due: {task.nextDue.toLocaleDateString()}</span>
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {task.estimatedTime} min
                            </span>
                          </div>
                        </div>
                        <Link to={`/machine/${machineId}/task/${task.id}`}>
                          <Button className="bg-red-600 hover:bg-red-700 text-white">
                            Start Now
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Scheduled Tasks
              </h2>
              <div className="grid gap-4">
                {pendingTasks.map((task) => (
                  <Card
                    key={task.id}
                    className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-white">{task.name}</h3>
                            <Badge className={getTaskStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                          </div>
                          <p className="text-slate-400 mb-2">{task.description}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-300">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>Due: {task.nextDue.toLocaleDateString()}</span>
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {task.estimatedTime} min
                            </span>
                            {task.lastCompleted > new Date(0) && (
                              <span className="flex items-center">
                                <CheckCircle className="h-4 w-4 mr-1 text-green-400" />
                                <div>
                                  Last: {task.lastCompleted.toLocaleDateString()}
                                </div>
                              </span>
                            )}
                          </div>
                        </div>
                        <Link to={`/machine/${machineId}/task/${task.id}`}>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            View Task
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Show empty state if no tasks */}
          {displayTasks.length === 0 && (
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardContent className="text-center py-12">
                <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No tasks assigned</h3>
                <p className="text-slate-400">This machine has no maintenance tasks configured yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
