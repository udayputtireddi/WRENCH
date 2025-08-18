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
  Wrench,
  Activity,
  Target,
  Info,
  Zap,
} from "lucide-react";
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
      <div className="app-container bg-gradient-to-br from-wrench-navy-50 via-white to-wrench-navy-50">
        <header className="bg-gradient-to-r from-wrench-navy-800 via-wrench-navy-700 to-wrench-navy-800 shadow-2xl relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          
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
                <AlertCircle className="h-8 w-8 text-white" />
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Machine Not Found
                  </h1>
                  <p className="text-wrench-navy-200">No machine data available</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-wrench-accent/20 to-wrench-navy-700/20 blur-3xl rounded-full"></div>
              <div className="relative flex items-center justify-center mb-6">
                <AlertCircle className="h-20 w-20 text-wrench-warning mr-4" />
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-wrench-navy-800 mb-2">
                    No Machine Data Available
                  </h2>
                  <div className="h-1 w-56 bg-gradient-to-r from-wrench-warning to-wrench-error mx-auto rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="text-xl text-wrench-navy-600 max-w-2xl mx-auto leading-relaxed mb-8">
              Machine information will be available once maintenance data is
              uploaded. Upload your equipment data to access machine details and
              tasks.
            </p>
            <Link to="/admin/database">
              <Button className="bg-gradient-to-r from-wrench-navy-800 to-wrench-navy-700 hover:from-wrench-navy-900 hover:to-wrench-navy-800 text-white px-8 py-4 text-lg hover-lift shadow-lg">
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
      <div className="app-container bg-gradient-to-br from-wrench-navy-50 via-white to-wrench-navy-50">
        <header className="bg-gradient-to-r from-wrench-navy-800 via-wrench-navy-700 to-wrench-navy-800 shadow-2xl relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          
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
                <AlertTriangle className="h-8 w-8 text-white" />
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Machine Not Found
                  </h1>
                  <p className="text-wrench-navy-200">Machine ID: {machineId}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="bg-white border-wrench-navy-200 shadow-lg max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="h-16 w-16 bg-gradient-to-br from-wrench-warning to-wrench-error rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-wrench-navy-800 text-2xl">
                Machine Not Found
              </CardTitle>
              <CardDescription className="text-wrench-navy-600">
                The machine with ID "{machineId}" was not found in the system.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-wrench-navy-600 mb-6">
                This could mean the machine hasn't been registered yet or the QR
                code contains an incorrect ID.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/scan">
                  <Button
                    variant="outline"
                    className="border-wrench-navy-300 text-wrench-navy-700 hover:bg-wrench-navy-50 hover-lift"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Try Scanning Again
                  </Button>
                </Link>
                <Link to="/tasks">
                  <Button className="bg-gradient-to-r from-wrench-accent to-wrench-accent-light hover:from-wrench-accent-light hover:to-wrench-accent text-white hover-lift">
                    <Activity className="h-4 w-4 mr-2" />
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
  const displayTasks = machine.tasks.map((task) => ({
    id: task.id,
    name: task.taskName,
    description: task.description,
    priority:
      task.category === "inspection"
        ? "Medium"
        : task.category === "cleaning"
          ? "Low"
          : "High",
    status: (() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(task.nextDueDate);
      dueDate.setHours(0, 0, 0, 0);

      if (
        task.lastCompletedDate &&
        task.lastCompletedDate.toDateString() === new Date().toDateString()
      ) {
        return "Completed";
      } else if (dueDate.getTime() < today.getTime()) {
        return "Overdue";
      } else {
        return "Pending";
      }
    })(),
    nextDue: task.nextDueDate,
    lastCompleted: task.lastCompletedDate || new Date(0),
    estimatedTime: task.estimatedTimeMinutes,
    category: task.category,
    frequency: task.frequency,
  }));

  const overdueTasks = displayTasks.filter((t) => t.status === "Overdue");
  const pendingTasks = displayTasks.filter((t) => t.status === "Pending");
  const completedTasks = displayTasks.filter((t) => t.status === "Completed");

  return (
    <div className="app-container bg-gradient-to-br from-wrench-navy-50 via-white to-wrench-navy-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-wrench-navy-800 via-wrench-navy-700 to-wrench-navy-800 shadow-2xl relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Header Background Elements */}
        <div className="absolute top-4 right-4 text-wrench-navy-300 opacity-20">
          <Settings className="h-6 w-6 animate-spin" style={{animationDuration: '20s'}} />
        </div>

        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex items-center">
            <Link
              to={searchParams.get("from") === "scan" ? "/scan" : "/"}
              className="mr-4"
            >
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
              <Wrench className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">{machine.name}</h1>
                <p className="text-wrench-navy-200">
                  {machine.type} • {machine.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Machine Status Card */}
        <Card className="mb-8 bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-wrench-navy-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Info className="h-6 w-6 text-wrench-accent" />
                <span>Machine Status</span>
              </div>
              <Badge className={getMachineStatusColor(machine.status)}>
                {machine.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-wrench-accent/10 rounded-full flex items-center justify-center mr-3">
                  <MapPin className="h-5 w-5 text-wrench-accent" />
                </div>
                <div>
                  <p className="text-wrench-navy-500 text-sm">Location</p>
                  <p className="text-wrench-navy-800 font-medium">{machine.location}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 bg-wrench-success/10 rounded-full flex items-center justify-center mr-3">
                  <Calendar className="h-5 w-5 text-wrench-success" />
                </div>
                <div>
                  <p className="text-wrench-navy-500 text-sm">Last Maintenance</p>
                  <p className="text-wrench-navy-800 font-medium">
                    {machine.lastMaintenance
                      ? machine.lastMaintenance.toLocaleDateString()
                      : "No records"}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 bg-wrench-warning/10 rounded-full flex items-center justify-center mr-3">
                  <Clock className="h-5 w-5 text-wrench-warning" />
                </div>
                <div>
                  <p className="text-wrench-navy-500 text-sm">Total Tasks</p>
                  <p className="text-wrench-navy-800 font-medium">{displayTasks.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-wrench-error/30 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-wrench-error flex items-center text-lg">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-wrench-error">
                {overdueTasks.length}
              </div>
              <p className="text-wrench-navy-500 text-sm">Needs immediate attention</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-wrench-warning/30 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-wrench-warning flex items-center text-lg">
                <Clock className="h-5 w-5 mr-2" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-wrench-warning">
                {pendingTasks.length}
              </div>
              <p className="text-wrench-navy-500 text-sm">Scheduled maintenance</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-wrench-success/30 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-wrench-success flex items-center text-lg">
                <CheckCircle className="h-5 w-5 mr-2" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-wrench-success">
                {completedTasks.length}
              </div>
              <p className="text-wrench-navy-500 text-sm">Finished today</p>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        <Card className="bg-white border-wrench-navy-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-wrench-navy-800 flex items-center">
              <Activity className="h-6 w-6 mr-2 text-wrench-accent" />
              Maintenance Tasks
            </CardTitle>
            <CardDescription className="text-wrench-navy-600">
              All scheduled maintenance tasks for this machine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayTasks.map((task) => (
                <Card
                  key={task.id}
                  className="border-wrench-navy-100 hover:shadow-md transition-shadow duration-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-wrench-navy-800">
                            {task.name}
                          </h3>
                          <Badge className={getTaskStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {task.category}
                          </Badge>
                        </div>
                        <p className="text-wrench-navy-600 text-sm mb-2">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-wrench-navy-500">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {task.estimatedTime} min
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Due: {task.nextDue.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Link to={`/machine/${machineId}/task/${task.id}`}>
                          <Button className="bg-gradient-to-r from-wrench-accent to-wrench-accent-light hover:from-wrench-accent-light hover:to-wrench-accent text-white hover-lift">
                            <Zap className="h-4 w-4 mr-2" />
                            {task.status === "Completed" ? "View" : "Start"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer tagline */}
        <div className="text-center mt-8 pt-6 border-t border-wrench-navy-200">
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
