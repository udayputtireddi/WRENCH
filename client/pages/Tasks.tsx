import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Wrench,
  AlertCircle,
  Upload,
  Activity,
} from "lucide-react";
import Database from "@/lib/database";
import AuthService from "@/lib/auth";

export default function Tasks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const allTasks = Database.getTasks();
  const hasData = allTasks.length > 0;

  // Convert database tasks to display format
  const displayTasks = allTasks.map((task) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let status = "Pending";
    if (task.lastCompletedDate) {
      const completedDate = new Date(task.lastCompletedDate);
      completedDate.setHours(0, 0, 0, 0);

      if (completedDate.getTime() === today.getTime()) {
        status = "Completed";
      } else if (task.nextDueDate < new Date()) {
        status = "Overdue";
      }
    } else if (task.nextDueDate < new Date()) {
      status = "Overdue";
    }

    // Check for saved progress
    const currentUser = AuthService.getCurrentUser();
    const savedProgress = currentUser
      ? task.progressSaves?.find(p => p.userId === currentUser.id)
      : null;

    const progressInfo = savedProgress ? {
      completedItems: savedProgress.checklistItems.filter(item => item.completed).length,
      totalItems: savedProgress.checklistItems.length,
      hasProgress: true,
      savedDate: savedProgress.savedDate
    } : {
      completedItems: 0,
      totalItems: 0,
      hasProgress: false,
      savedDate: null
    };

    // Update status if there's saved progress but not completed
    if (progressInfo.hasProgress && status === "Pending") {
      status = "In Progress";
    }

    return {
      id: task.id,
      name: task.taskName,
      description: task.description,
      machine: task.machineName,
      priority:
        task.category === "inspection"
          ? "Medium"
          : task.category === "cleaning"
            ? "Low"
            : "High",
      status,
      dueDate: task.nextDueDate,
      nextDue: task.nextDueDate,
      lastCompleted: task.lastCompletedDate || new Date(0),
      estimatedTime: task.estimatedTimeMinutes,
      assignedTo: "Current User",
      category: task.category,
      frequency: task.frequency,
      progressInfo,
    };
  });

  // Filter tasks
  const filteredTasks = displayTasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.machine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "in progress" && task.status === "In Progress") ||
      task.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesPriority =
      filterPriority === "all" ||
      task.priority.toLowerCase() === filterPriority.toLowerCase();
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-600 bg-green-100";
      case "In Progress":
        return "text-blue-600 bg-blue-100";
      case "Overdue":
        return "text-red-600 bg-red-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "text-red-600 bg-red-100";
      case "High":
        return "text-orange-600 bg-orange-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      case "Low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Group tasks by status
  const pendingTasks = filteredTasks.filter((t) => t.status === "Pending");
  const inProgressTasks = filteredTasks.filter(
    (t) => t.status === "In Progress",
  );
  const overdueTasks = filteredTasks.filter((t) => t.status === "Overdue");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 shadow-2xl">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center">
            <Link to="/" className="mr-2 sm:mr-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 px-2 sm:px-3"
              >
                <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                Task Management
              </h1>
              <p className="text-green-100 text-sm sm:text-base">
                {hasData
                  ? `${allTasks.length} tasks across all machines`
                  : "No tasks available"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {!hasData ? (
          // Empty State
          <div className="text-center py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 blur-3xl rounded-full"></div>
              <AlertCircle className="h-24 w-24 text-green-400 mx-auto mb-6" />
              <h2 className="relative text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4 sm:mb-6">
                No Tasks Available
              </h2>
            </div>
            <p className="text-sm sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed px-4">
              Your maintenance tasks will appear here once they're uploaded.
              Contact your administrator to set up your maintenance schedule.
            </p>
          </div>
        ) : (
          // Tasks Dashboard with Data
          <div className="space-y-8">
            {/* Search and Filter Controls */}
            <div className="flex flex-col gap-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 sm:p-6">
              <div className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search tasks or machines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40 bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filterPriority}
                  onValueChange={setFilterPriority}
                >
                  <SelectTrigger className="w-full sm:w-40 bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Task Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card className="bg-gradient-to-br from-red-600/20 to-red-700/20 border-red-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Overdue Tasks
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">
                    {overdueTasks.length}
                  </div>
                  <p className="text-xs text-slate-400">
                    Require immediate attention
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-blue-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    In Progress
                  </CardTitle>
                  <Activity className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">
                    {inProgressTasks.length}
                  </div>
                  <p className="text-xs text-slate-400">
                    Tasks with saved progress
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-700/20 border-yellow-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Pending Tasks
                  </CardTitle>
                  <Clock className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">
                    {pendingTasks.length}
                  </div>
                  <p className="text-xs text-slate-400">
                    Scheduled for completion
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-600/20 to-green-700/20 border-green-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Completed Today
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">
                    {
                      filteredTasks.filter((t) => t.status === "Completed")
                        .length
                    }
                  </div>
                  <p className="text-xs text-slate-400">Tasks finished today</p>
                </CardContent>
              </Card>
            </div>

            {/* Tasks List */}
            {filteredTasks.length === 0 ? (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No matching tasks
                  </h3>
                  <p className="text-slate-400">
                    Try adjusting your search or filter criteria
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Overdue Tasks */}
                {overdueTasks.length > 0 && (
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-red-400 mb-3 sm:mb-4 flex items-center">
                      <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Overdue Tasks ({overdueTasks.length})
                    </h2>
                    <div className="grid gap-3 sm:gap-4">
                      {overdueTasks.map((task) => (
                        <Card
                          key={task.id}
                          className="bg-slate-800/50 backdrop-blur-sm border-red-500/30 hover:border-red-400/50 transition-colors"
                        >
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-white text-base sm:text-lg break-words">
                                    {task.name}
                                  </h3>
                                  <Badge
                                    className={getTaskStatusColor(task.status)}
                                  >
                                    {task.status}
                                  </Badge>
                                  <Badge
                                    className={getPriorityColor(task.priority)}
                                  >
                                    {task.priority}
                                  </Badge>
                                </div>
                                <p className="text-slate-400 mb-2 text-sm sm:text-base">
                                  {task.description}
                                </p>
                                {task.progressInfo?.hasProgress && (
                                  <div className="flex items-center gap-2 mb-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <div className="flex items-center text-blue-400 text-xs">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Progress Saved: {task.progressInfo.completedItems}/{task.progressInfo.totalItems} items
                                    </div>
                                    <div className="text-xs text-blue-300">
                                      {new Date(task.progressInfo.savedDate).toLocaleDateString()}
                                    </div>
                                  </div>
                                )}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-300">
                                  <span className="flex items-center">
                                    <Wrench className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    <span className="truncate">
                                      {task.machine}
                                    </span>
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    <span className="text-red-400">
                                      Overdue:{" "}
                                      {task.nextDue.toLocaleDateString()}
                                    </span>
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    {task.estimatedTime} min
                                  </span>
                                </div>
                              </div>
                              <Link
                                to={`/machine/${task.machine.replace(/\s+/g, "-")}/task/${task.id}`}
                                className="self-start sm:self-auto"
                              >
                                <Button className="bg-red-600 hover:bg-red-700 text-white text-sm w-full sm:w-auto">
                                  Start Task
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* In Progress Tasks */}
                {inProgressTasks.length > 0 && (
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-blue-400 mb-3 sm:mb-4 flex items-center">
                      <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      In Progress Tasks ({inProgressTasks.length})
                    </h2>
                    <div className="grid gap-3 sm:gap-4">
                      {inProgressTasks.map((task) => (
                        <Card
                          key={task.id}
                          className="bg-slate-800/50 backdrop-blur-sm border-blue-500/30 hover:border-blue-400/50 transition-colors"
                        >
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-white text-base sm:text-lg break-words">
                                    {task.name}
                                  </h3>
                                  <Badge
                                    className={getTaskStatusColor(task.status)}
                                  >
                                    {task.status}
                                  </Badge>
                                  <Badge
                                    className={getPriorityColor(task.priority)}
                                  >
                                    {task.priority}
                                  </Badge>
                                </div>
                                <p className="text-slate-400 mb-2 text-sm sm:text-base">
                                  {task.description}
                                </p>
                                {task.progressInfo?.hasProgress && (
                                  <div className="flex items-center gap-2 mb-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <div className="flex items-center text-blue-400 text-xs">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Progress Saved: {task.progressInfo.completedItems}/{task.progressInfo.totalItems} items
                                    </div>
                                    <div className="text-xs text-blue-300">
                                      {new Date(task.progressInfo.savedDate).toLocaleDateString()}
                                    </div>
                                  </div>
                                )}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-300">
                                  <span className="flex items-center">
                                    <Wrench className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    <span className="truncate">
                                      {task.machine}
                                    </span>
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    <span>
                                      Due: {task.nextDue.toLocaleDateString()}
                                    </span>
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    {task.estimatedTime} min
                                  </span>
                                </div>
                              </div>
                              <Link to={`/machine/${task.machine.replace(/\s+/g, '-')}/task/${task.id}`} className="self-start sm:self-auto">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm w-full sm:w-auto">
                                  Continue Task
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
                    <h2 className="text-lg sm:text-xl font-bold text-yellow-400 mb-3 sm:mb-4 flex items-center">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Pending Tasks ({pendingTasks.length})
                    </h2>
                    <div className="grid gap-3 sm:gap-4">
                      {pendingTasks.map((task) => (
                        <Card
                          key={task.id}
                          className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-colors"
                        >
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-white text-base sm:text-lg break-words">
                                    {task.name}
                                  </h3>
                                  <Badge
                                    className={getTaskStatusColor(task.status)}
                                  >
                                    {task.status}
                                  </Badge>
                                  <Badge
                                    className={getPriorityColor(task.priority)}
                                  >
                                    {task.priority}
                                  </Badge>
                                </div>
                                <p className="text-slate-400 mb-2 text-sm sm:text-base">
                                  {task.description}
                                </p>
                                {task.progressInfo?.hasProgress && (
                                  <div className="flex items-center gap-2 mb-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <div className="flex items-center text-blue-400 text-xs">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Progress Saved: {task.progressInfo.completedItems}/{task.progressInfo.totalItems} items
                                    </div>
                                    <div className="text-xs text-blue-300">
                                      {new Date(task.progressInfo.savedDate).toLocaleDateString()}
                                    </div>
                                  </div>
                                )}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-300">
                                  <span className="flex items-center">
                                    <Wrench className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    <span className="truncate">
                                      {task.machine}
                                    </span>
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    <span>
                                      Due: {task.nextDue.toLocaleDateString()}
                                    </span>
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    {task.estimatedTime} min
                                  </span>
                                </div>
                              </div>
                              <Link
                                to={`/machine/${task.machine.replace(/\s+/g, "-")}/task/${task.id}`}
                                className="self-start sm:self-auto"
                              >
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm w-full sm:w-auto">
                                  Start Task
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
