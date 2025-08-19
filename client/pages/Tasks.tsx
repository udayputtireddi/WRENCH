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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  AlertCircle,
  Upload,
  Activity,
  Target,
  Users,
  FileText,
  Download,
  DateRange,
  Zap,
  Settings,
} from "lucide-react";
import {
  ProfessionalHeader,
  NavigationBreadcrumbs,
} from "@/components/ProfessionalHeader";
import { WrenchBadge, WrenchTagline } from "@/components/WrenchLogo";
import Database from "@/lib/database";
import AuthService from "@/lib/auth";
import ExportSystem, { type ExportDateType } from "@/lib/exportSystem";

export default function Tasks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterMachine, setFilterMachine] = useState("all");
  const [exportConfig, setExportConfig] = useState({
    type: "all" as ExportDateType,
    startDate: "",
    endDate: "",
    format: "csv" as "csv" | "json",
    includePhotos: false,
  });

  const allTasks = Database.getTasks();
  const machines = Database.getMachines();
  const hasData = allTasks.length > 0;
  const currentUser = AuthService.getCurrentUser();

  // Convert database tasks to display format
  const displayTasks = allTasks.map((task) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.nextDueDate);
    dueDate.setHours(0, 0, 0, 0);

    let status = "Pending";
    let priority = "Medium";

    if (
      task.lastCompletedDate &&
      task.lastCompletedDate.toDateString() === new Date().toDateString()
    ) {
      status = "Completed";
    } else if (task.progressSaves && task.progressSaves.length > 0) {
      // Check if there's a recent progress save (within the last 24 hours)
      const recentProgress = task.progressSaves.find(progress => {
        const progressDate = new Date(progress.savedDate);
        const timeDiff = today.getTime() - progressDate.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);
        return daysDiff <= 1; // Within last 24 hours
      });

      if (recentProgress) {
        status = "In Progress";
        priority = "Medium";
      } else if (dueDate.getTime() < today.getTime()) {
        status = "Overdue";
        priority = "High";
      } else if (dueDate.getTime() === today.getTime()) {
        status = "Due Today";
        priority = "High";
      }
    } else if (dueDate.getTime() < today.getTime()) {
      status = "Overdue";
      priority = "High";
    } else if (dueDate.getTime() === today.getTime()) {
      status = "Due Today";
      priority = "High";
    }

    // Set priority based on category
    if (task.category === "safety") priority = "Critical";
    else if (task.category === "inspection") priority = "High";
    else if (task.category === "cleaning") priority = "Low";

    return {
      id: task.id,
      name: task.taskName,
      description: task.description,
      machineId: task.machineId,
      machineName:
        Database.getMachineById(task.machineId)?.name || "Unknown Machine",
      status,
      priority,
      dueDate: task.nextDueDate,
      lastCompleted: task.lastCompletedDate,
      estimatedTime: task.estimatedTimeMinutes || 30,
      frequency: task.frequency,
      category: task.category,
      assignedTo: task.assignedTo || "Unassigned",
      completedBy: task.completedBy || null,
      actualTimeSpent: task.actualTimeSpent || null,
      completionNotes: task.completionNotes || null,
      photos: task.photos || [],
    };
  });

  // Apply filters
  const filteredTasks = displayTasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.machineName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      task.status.toLowerCase().includes(filterStatus.toLowerCase());
    const matchesPriority =
      filterPriority === "all" ||
      task.priority.toLowerCase() === filterPriority.toLowerCase();
    const matchesMachine =
      filterMachine === "all" || task.machineId === filterMachine;

    return matchesSearch && matchesStatus && matchesPriority && matchesMachine;
  });

  // Task statistics
  const stats = {
    total: displayTasks.length,
    completed: displayTasks.filter((t) => t.status === "Completed").length,
    inProgress: displayTasks.filter((t) => t.status === "In Progress").length,
    overdue: displayTasks.filter((t) => t.status === "Overdue").length,
    dueToday: displayTasks.filter((t) => t.status === "Due Today").length,
    pending: displayTasks.filter((t) => t.status === "Pending").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-wrench-success text-white";
      case "Overdue":
        return "bg-wrench-error text-white";
      case "Due Today":
        return "bg-wrench-warning text-white";
      default:
        return "bg-wrench-navy-100 text-wrench-navy-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-wrench-error text-white";
      case "High":
        return "bg-wrench-warning text-white";
      case "Medium":
        return "bg-wrench-accent text-white";
      case "Low":
        return "bg-wrench-navy-100 text-wrench-navy-800";
      default:
        return "bg-wrench-navy-100 text-wrench-navy-800";
    }
  };

  const handleExportTasks = () => {
    try {
      if (exportConfig.type === "custom") {
        if (!exportConfig.startDate || !exportConfig.endDate) {
          alert("Please select both start and end dates for custom range export.");
          return;
        }
        ExportSystem.exportCustomRange(
          new Date(exportConfig.startDate),
          new Date(exportConfig.endDate),
          exportConfig.format
        );
      } else {
        const config = {
          type: exportConfig.type,
          format: exportConfig.format,
          includePhotos: exportConfig.includePhotos,
        };

        const content = ExportSystem.exportTaskCompletions(config);
        const filename = ExportSystem.getReportFilename(exportConfig.type, exportConfig.format);
        const mimeType = exportConfig.format === "json" ? "application/json" : "text/csv";
        ExportSystem.downloadFile(content, filename, mimeType);
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    }
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Task Management" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-wrench-navy-50 via-white to-wrench-navy-50">
      {/* Professional Header */}
      <ProfessionalHeader
        title="Task Management"
        subtitle="Professional maintenance task tracking and coordination"
        showStats={true}
        variant="gradient"
        showBackButton={true}
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
                  <span className="text-wrench-navy-800 font-semibold">
                    No Tasks Available
                  </span>
                </div>

                <h1 className="text-4xl lg:text-5xl font-black text-wrench-navy-900 mb-4">
                  Awaiting Task
                  <br />
                  <span className="bg-gradient-to-r from-wrench-warning to-wrench-error bg-clip-text text-transparent">
                    Assignment
                  </span>
                </h1>

                <p className="text-xl text-wrench-navy-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                  No maintenance tasks found. Upload your equipment maintenance
                  schedules to begin professional task management and tracking.
                </p>

                <Link to="/admin/database">
                  <Button className="bg-gradient-to-r from-wrench-navy-800 to-wrench-navy-700 hover:from-wrench-navy-900 hover:to-wrench-navy-800 text-white px-8 py-4 text-lg hover-lift shadow-lg">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Task Data
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center">
              <WrenchBadge className="mb-4" />
              <h1 className="text-3xl lg:text-4xl font-black text-wrench-navy-900 mb-4">
                Professional Task
                <br />
                <span className="bg-gradient-to-r from-wrench-accent to-wrench-success bg-clip-text text-transparent">
                  Management Center
                </span>
              </h1>
              <p className="text-lg text-wrench-navy-600 max-w-3xl mx-auto">
                Advanced task tracking, completion monitoring, and professional
                reporting system.
              </p>
            </div>

            {/* Task Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-wrench-navy-800">
                    {stats.total}
                  </div>
                  <p className="text-sm text-wrench-navy-600">Total Tasks</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-wrench-success">
                    {stats.completed}
                  </div>
                  <p className="text-sm text-wrench-navy-600">Completed</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-wrench-error">
                    {stats.overdue}
                  </div>
                  <p className="text-sm text-wrench-navy-600">Overdue</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-wrench-warning">
                    {stats.dueToday}
                  </div>
                  <p className="text-sm text-wrench-navy-600">Due Today</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-wrench-accent">
                    {stats.pending}
                  </div>
                  <p className="text-sm text-wrench-navy-600">Pending</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Export */}
            <Card className="bg-white border-wrench-navy-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-wrench-navy-800 flex items-center">
                  <Filter className="h-6 w-6 mr-2 text-wrench-accent" />
                  Task Filters & Export
                </CardTitle>
                <CardDescription className="text-wrench-navy-600">
                  Advanced filtering and professional export system with flexible date ranges (daily, weekly, monthly, yearly, custom)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search and Basic Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-wrench-navy-400" />
                      <Input
                        placeholder="Search tasks or machines..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-wrench-navy-200 focus:border-wrench-accent"
                      />
                    </div>

                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger className="border-wrench-navy-200 focus:border-wrench-accent">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="due today">Due Today</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={filterPriority}
                      onValueChange={setFilterPriority}
                    >
                      <SelectTrigger className="border-wrench-navy-200 focus:border-wrench-accent">
                        <SelectValue placeholder="Filter by priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={filterMachine}
                      onValueChange={setFilterMachine}
                    >
                      <SelectTrigger className="border-wrench-navy-200 focus:border-wrench-accent">
                        <SelectValue placeholder="Filter by machine" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Machines</SelectItem>
                        {machines.map((machine) => (
                          <SelectItem key={machine.id} value={machine.id}>
                            {machine.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Export Controls */}
                  <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium text-wrench-navy-700 mb-1 block">
                          Export Type
                        </label>
                        <Select
                          value={exportConfig.type}
                          onValueChange={(value: ExportDateType) =>
                            setExportConfig({
                              ...exportConfig,
                              type: value,
                            })
                          }
                        >
                          <SelectTrigger className="border-wrench-navy-200 focus:border-wrench-accent">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Tasks</SelectItem>
                            <SelectItem value="daily">Daily Report</SelectItem>
                            <SelectItem value="weekly">Weekly Report</SelectItem>
                            <SelectItem value="monthly">Monthly Report</SelectItem>
                            <SelectItem value="yearly">Yearly Report</SelectItem>
                            <SelectItem value="custom">Custom Range</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-wrench-navy-700 mb-1 block">
                          Format
                        </label>
                        <Select
                          value={exportConfig.format}
                          onValueChange={(value: "csv" | "json") =>
                            setExportConfig({
                              ...exportConfig,
                              format: value,
                            })
                          }
                        >
                          <SelectTrigger className="border-wrench-navy-200 focus:border-wrench-accent">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="csv">CSV (Excel)</SelectItem>
                            <SelectItem value="json">JSON (Advanced)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {exportConfig.type === "custom" && (
                        <>
                          <div>
                            <label className="text-sm font-medium text-wrench-navy-700 mb-1 block">
                              Start Date
                            </label>
                            <Input
                              type="date"
                              value={exportConfig.startDate}
                              onChange={(e) =>
                                setExportConfig({
                                  ...exportConfig,
                                  startDate: e.target.value,
                                })
                              }
                              className="border-wrench-navy-200 focus:border-wrench-accent"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-wrench-navy-700 mb-1 block">
                              End Date
                            </label>
                            <Input
                              type="date"
                              value={exportConfig.endDate}
                              onChange={(e) =>
                                setExportConfig({
                                  ...exportConfig,
                                  endDate: e.target.value,
                                })
                              }
                              className="border-wrench-navy-200 focus:border-wrench-accent"
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <Button
                      onClick={handleExportTasks}
                      className="bg-gradient-to-r from-wrench-accent to-wrench-accent-light hover:from-wrench-accent-light hover:to-wrench-accent text-white px-6 py-2"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tasks Grid */}
            <div className="grid gap-4">
              {filteredTasks.length === 0 ? (
                <Card className="bg-white border-wrench-navy-200 p-12 text-center">
                  <Target className="h-16 w-16 text-wrench-navy-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-wrench-navy-800 mb-2">
                    No tasks found
                  </h3>
                  <p className="text-wrench-navy-600">
                    Try adjusting your search criteria or filters.
                  </p>
                </Card>
              ) : (
                filteredTasks.map((task) => (
                  <Card
                    key={task.id}
                    className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-wrench-navy-800 mb-1">
                                {task.name}
                              </h3>
                              <p className="text-sm text-wrench-navy-600 mb-2">
                                {task.description}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Badge className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                              <Badge
                                className={getPriorityColor(task.priority)}
                              >
                                {task.priority}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Settings className="h-4 w-4 text-wrench-navy-400" />
                              <span className="text-wrench-navy-600">
                                {task.machineName}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-wrench-navy-400" />
                              <span className="text-wrench-navy-600">
                                Due: {task.dueDate.toLocaleDateString()}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-wrench-navy-400" />
                              <span className="text-wrench-navy-600">
                                {task.estimatedTime} min
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-wrench-navy-400" />
                              <span className="text-wrench-navy-600">
                                {task.assignedTo}
                              </span>
                            </div>
                          </div>

                          {/* Completion Details */}
                          {task.status === "Completed" && task.completedBy && (
                            <div className="p-3 bg-wrench-success/10 rounded-lg border border-wrench-success/20">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                <div>
                                  <span className="font-medium text-wrench-navy-700">
                                    Completed by:
                                  </span>
                                  <span className="ml-2 text-wrench-navy-600">
                                    {task.completedBy}
                                  </span>
                                </div>
                                {task.actualTimeSpent && (
                                  <div>
                                    <span className="font-medium text-wrench-navy-700">
                                      Time taken:
                                    </span>
                                    <span className="ml-2 text-wrench-navy-600">
                                      {task.actualTimeSpent} min
                                    </span>
                                  </div>
                                )}
                                {task.photos.length > 0 && (
                                  <div>
                                    <span className="font-medium text-wrench-navy-700">
                                      Photos:
                                    </span>
                                    <span className="ml-2 text-wrench-navy-600">
                                      {task.photos.length} uploaded
                                    </span>
                                  </div>
                                )}
                              </div>
                              {task.completionNotes && (
                                <div className="mt-2">
                                  <span className="font-medium text-wrench-navy-700">
                                    Notes:
                                  </span>
                                  <p className="text-wrench-navy-600 text-sm mt-1">
                                    {task.completionNotes}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:min-w-[120px]">
                          <Link
                            to={`/machine/${task.machineId}/task/${task.id}`}
                          >
                            <Button
                              className="w-full bg-gradient-to-r from-wrench-accent to-wrench-accent-light hover:from-wrench-accent-light hover:to-wrench-accent text-white hover-lift"
                              size="sm"
                            >
                              <Zap className="h-4 w-4 mr-2" />
                              {task.status === "Completed" ? "View" : "Start"}
                            </Button>
                          </Link>

                          <Link to={`/machine/${task.machineId}`}>
                            <Button
                              variant="outline"
                              className="w-full border-wrench-navy-300 text-wrench-navy-700 hover:bg-wrench-navy-50"
                              size="sm"
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Machine
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Professional Footer */}
        <div className="mt-12 pt-8 border-t border-wrench-navy-200 text-center">
          <WrenchTagline variant="default" size="md" />
        </div>
      </main>
    </div>
  );
}
