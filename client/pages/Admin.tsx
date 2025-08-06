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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Shield,
  Users,
  Settings,
  Database as DatabaseIcon,
  Activity,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Camera,
} from "lucide-react";
import Database from "@/lib/database";
import AuthService from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { toast } = useToast();
  const [newMachine, setNewMachine] = useState({
    id: "",
    name: "",
    type: "",
    location: "",
  });

  const analytics = Database.getAnalytics();
  const allUsers = AuthService.getAllUsers();
  const machines = Database.getMachines();
  const tasks = Database.getTasks();

  const handleAddMachine = () => {
    if (
      newMachine.id &&
      newMachine.name &&
      newMachine.type &&
      newMachine.location
    ) {
      toast({
        title: "Machine Added",
        description: `${newMachine.name} has been added to the system.`,
        duration: 3000,
      });
      setNewMachine({ id: "", name: "", type: "", location: "" });
    }
  };

  const handleDeleteUser = (userId: string) => {
    AuthService.deleteUser(userId);
    toast({
      title: "User Deleted",
      description: "User has been removed from the system.",
    });
  };

  const generateReport = (reportType: string) => {
    let csvContent = "";
    let filename = "";

    switch (reportType) {
      case "task-performance":
        csvContent = generateTaskPerformanceReport();
        filename = "task_performance_report.csv";
        break;
      case "maintenance-schedule":
        csvContent = generateMaintenanceScheduleReport();
        filename = "maintenance_schedule_report.csv";
        break;
      case "machine-efficiency":
        csvContent = generateMachineEfficiencyReport();
        filename = "machine_efficiency_report.csv";
        break;
      case "issues-alerts":
        csvContent = generateIssuesAlertsReport();
        filename = "issues_alerts_report.csv";
        break;
      case "completion-history":
        csvContent = Database.exportCompletionHistoryToCSV(tasks);
        filename = "completion_history_report.csv";
        break;
      case "photo-log":
        csvContent = generatePhotoLogReport();
        filename = "photo_log_report.csv";
        break;
      default:
        return;
    }

    // Download the CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast({
      title: "Report Generated",
      description: `${filename} has been downloaded.`,
    });
  };

  const generateTaskPerformanceReport = (): string => {
    const headers = [
      "Task Name",
      "Machine",
      "Frequency",
      "Total Completions",
      "Average Time (min)",
      "Last Completed",
      "Last Completed By",
      "On Time Percentage",
    ];

    const rows = tasks.map((task) => {
      const completions = task.completionHistory;
      const avgTime =
        completions.length > 0
          ? Math.round(
              completions.reduce(
                (sum, c) => sum + (c.timeSpentMinutes || 0),
                0,
              ) / completions.length,
            )
          : 0;
      const onTimeCount = completions.filter(
        (c) => c.completedDate <= task.nextDueDate,
      ).length;
      const onTimePercentage =
        completions.length > 0
          ? Math.round((onTimeCount / completions.length) * 100)
          : 0;
      const lastCompletion = completions[completions.length - 1];

      return [
        task.taskName,
        task.machineName,
        task.frequency,
        completions.length.toString(),
        avgTime.toString(),
        task.lastCompletedDate?.toLocaleDateString() || "Never",
        lastCompletion?.userName || "N/A",
        `${onTimePercentage}%`,
      ];
    });

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  };

  const generateMaintenanceScheduleReport = (): string => {
    const headers = [
      "Date",
      "Machine",
      "Task Name",
      "Category",
      "Estimated Time (min)",
      "Status",
    ];

    const rows: string[][] = [];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    tasks.forEach((task) => {
      if (task.nextDueDate <= nextWeek) {
        const status = task.nextDueDate < new Date() ? "Overdue" : "Scheduled";
        rows.push([
          task.nextDueDate.toLocaleDateString(),
          task.machineName,
          task.taskName,
          task.category,
          task.estimatedTimeMinutes.toString(),
          status,
        ]);
      }
    });

    // Sort by date
    rows.sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  };

  const generateMachineEfficiencyReport = (): string => {
    const headers = [
      "Machine ID",
      "Machine Name",
      "Total Tasks",
      "Completed Tasks",
      "Overdue Tasks",
      "Efficiency %",
      "Last Maintenance",
      "Average Task Time",
    ];

    const rows = machines.map((machine) => {
      const totalTasks = machine.tasks.length;
      const completedTasks = machine.tasks.filter(
        (t) => t.lastCompletedDate,
      ).length;
      const overdueTasks = machine.tasks.filter(
        (t) => t.nextDueDate < new Date(),
      ).length;
      const efficiency =
        totalTasks > 0
          ? Math.round(((totalTasks - overdueTasks) / totalTasks) * 100)
          : 0;

      const allCompletions = machine.tasks.flatMap((t) => t.completionHistory);
      const avgTime =
        allCompletions.length > 0
          ? Math.round(
              allCompletions.reduce(
                (sum, c) => sum + (c.timeSpentMinutes || 0),
                0,
              ) / allCompletions.length,
            )
          : 0;

      return [
        machine.id,
        machine.name,
        totalTasks.toString(),
        completedTasks.toString(),
        overdueTasks.toString(),
        `${efficiency}%`,
        machine.lastMaintenance?.toLocaleDateString() || "N/A",
        `${avgTime} min`,
      ];
    });

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  };

  const generateIssuesAlertsReport = (): string => {
    const headers = [
      "Date",
      "Type",
      "Machine",
      "Task",
      "Description",
      "Severity",
      "Days Overdue",
    ];

    const rows: string[][] = [];
    const today = new Date();

    tasks.forEach((task) => {
      if (task.nextDueDate < today) {
        const daysOverdue = Math.floor(
          (today.getTime() - task.nextDueDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        const severity =
          daysOverdue > 7 ? "Critical" : daysOverdue > 3 ? "High" : "Medium";

        rows.push([
          task.nextDueDate.toLocaleDateString(),
          "Overdue Task",
          task.machineName,
          task.taskName,
          `Task is ${daysOverdue} days overdue`,
          severity,
          daysOverdue.toString(),
        ]);
      }
    });

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  };

  const generatePhotoLogReport = (): string => {
    const headers = [
      "Completion Date",
      "Task Name",
      "Machine Name",
      "Completed By",
      "Photos Count",
      "Time Spent (min)",
      "Completion Notes",
      "Photo Available",
    ];

    const photoData = Database.getAllTaskPhotos();

    const rows = photoData.map((item) => [
      item.completedDate.toLocaleDateString(),
      item.taskName,
      item.machineName,
      item.completedBy,
      item.photos.length.toString(),
      item.timeSpent?.toString() || "N/A",
      item.notes || "No notes",
      "Yes",
    ]);

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-800 shadow-2xl">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
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
                  Admin Dashboard
                </h1>
                <p className="text-purple-100 text-sm sm:text-base">
                  System management and configuration
                </p>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-0 px-2 py-1 text-xs sm:text-sm self-start sm:self-auto">
              <Shield className="h-3 w-3 mr-1" />
              Administrator
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 text-white">
            <CardContent className="p-4 sm:p-6 text-center">
              <DatabaseIcon className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3" />
              <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">
                {analytics.totalMachines}
              </div>
              <div className="text-xs sm:text-sm text-blue-100">
                Total Machines
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-700 border-0 text-white">
            <CardContent className="p-4 sm:p-6 text-center">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3" />
              <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">
                {analytics.completedToday}
              </div>
              <div className="text-xs sm:text-sm text-green-100">
                Completed Today
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-orange-700 border-0 text-white">
            <CardContent className="p-4 sm:p-6 text-center">
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3" />
              <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">
                {analytics.overdueTasks}
              </div>
              <div className="text-xs sm:text-sm text-orange-100">
                Overdue Tasks
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0 text-white">
            <CardContent className="p-4 sm:p-6 text-center">
              <Activity className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3" />
              <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">
                {analytics.totalTasks}
              </div>
              <div className="text-xs sm:text-sm text-purple-100">
                Total Tasks
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="machines" className="space-y-6 sm:space-y-8">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="bg-slate-800/50 border-slate-700 flex sm:grid sm:grid-cols-5 gap-1 min-w-max w-full p-1">
              <TabsTrigger
                value="machines"
                className="data-[state=active]:bg-slate-600 text-xs sm:text-sm flex-shrink-0 px-3 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30"
              >
                <DatabaseIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-300" />
                <span className="text-blue-200">Machines</span>
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-slate-600 text-xs sm:text-sm flex-shrink-0 px-3 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30"
              >
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-300" />
                <span className="text-green-200">Users</span>
              </TabsTrigger>
              <TabsTrigger
                value="system"
                className="data-[state=active]:bg-slate-600 text-xs sm:text-sm flex-shrink-0 px-3 py-2 bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30"
              >
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-orange-300" />
                <span className="text-orange-200">System</span>
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="data-[state=active]:bg-slate-600 text-xs sm:text-sm flex-shrink-0 px-3 py-2 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30"
              >
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-teal-300" />
                <span className="text-teal-200">Reports</span>
              </TabsTrigger>
              <TabsTrigger
                value="photos"
                className="data-[state=active]:bg-slate-600 text-xs sm:text-sm flex-shrink-0 px-3 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30"
              >
                <Camera className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-purple-300" />
                <span className="text-purple-200">Photos</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Machines Tab */}
          <TabsContent value="machines" className="space-y-6">
            {/* Add New Machine */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  Add New Machine
                </CardTitle>
                <CardDescription className="text-slate-400 text-sm">
                  Register a new machine in the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="machineId" className="text-slate-300">
                      Machine ID
                    </Label>
                    <Input
                      id="machineId"
                      placeholder="e.g., CAR-002"
                      value={newMachine.id}
                      onChange={(e) =>
                        setNewMachine((prev) => ({
                          ...prev,
                          id: e.target.value,
                        }))
                      }
                      className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="machineName" className="text-slate-300">
                      Machine Name
                    </Label>
                    <Input
                      id="machineName"
                      placeholder="e.g., Assembly Line Car B"
                      value={newMachine.name}
                      onChange={(e) =>
                        setNewMachine((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="machineType" className="text-slate-300">
                      Type
                    </Label>
                    <Input
                      id="machineType"
                      placeholder="e.g., Automotive Assembly"
                      value={newMachine.type}
                      onChange={(e) =>
                        setNewMachine((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="machineLocation" className="text-slate-300">
                      Location
                    </Label>
                    <Input
                      id="machineLocation"
                      placeholder="e.g., Factory Floor - Section B"
                      value={newMachine.location}
                      onChange={(e) =>
                        setNewMachine((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddMachine}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Machine
                </Button>
              </CardContent>
            </Card>

            {/* Existing Machines */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">
                  Registered Machines ({machines.length})
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Manage existing machines and their configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {machines.length === 0 ? (
                  <div className="text-center py-8">
                    <DatabaseIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No Machines Found
                    </h3>
                    <p className="text-slate-400">
                      Import maintenance data to register machines.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {machines.map((machine) => (
                      <div
                        key={machine.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 border border-slate-600/50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-white font-semibold">
                              {machine.name}
                            </h3>
                            <Badge
                              className={`${
                                machine.status === "operational"
                                  ? "bg-green-500/20 text-green-300"
                                  : machine.status === "maintenance"
                                    ? "bg-orange-500/20 text-orange-300"
                                    : "bg-red-500/20 text-red-300"
                              } border-0 capitalize`}
                            >
                              {machine.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-slate-400">
                            <span>ID: {machine.id}</span>
                            <span>Type: {machine.type}</span>
                            <span>Location: {machine.location}</span>
                            <span>Tasks: {machine.tasks.length}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-slate-600/50 border-slate-500 text-white hover:bg-slate-500"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-600/20 border-red-500/50 text-red-300 hover:bg-red-600/30"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Registered Users ({allUsers.length})
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Users are automatically registered when they sign in for the
                  first time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No Users Yet
                    </h3>
                    <p className="text-slate-400">
                      Users will appear here when they sign in.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 rounded-lg bg-slate-700/30 border border-slate-600/50"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="text-white font-medium truncate">
                              {user.name}
                            </h3>
                            <Badge
                              className={`${
                                user.role === "admin"
                                  ? "bg-purple-500/20 text-purple-300"
                                  : "bg-blue-500/20 text-blue-300"
                              } border-0 capitalize text-xs`}
                            >
                              {user.role}
                            </Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-slate-400">
                            <span className="truncate break-all">{user.email}</span>
                            <span className="text-xs">Dept: {user.department}</span>
                            <span className="text-xs">
                              Joined:{" "}
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                            {user.lastLogin && (
                              <span className="text-xs">
                                Last login:{" "}
                                {new Date(user.lastLogin).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-slate-600/50 border-slate-500 text-white hover:bg-slate-500 h-8 px-2"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-600/20 border-red-500/50 text-red-300 hover:bg-red-600/30 h-8 px-2"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DatabaseIcon className="h-5 w-5" />
                    Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link to="/admin/database">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <DatabaseIcon className="h-4 w-4 mr-2" />
                      Manage Database
                    </Button>
                  </Link>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Excel
                  </Button>
                  <Button
                    onClick={() => generateReport("task-performance")}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    System Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Total Completions</span>
                    <span className="text-white font-medium">
                      {analytics.totalCompletions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Average Task Time</span>
                    <span className="text-white font-medium">
                      {analytics.averageTaskTime} min
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Most Active User</span>
                    <span className="text-white font-medium">
                      {analytics.mostActiveUser.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">System Status</span>
                    <Badge className="bg-green-500/20 text-green-300 border-0">
                      Operational
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  System Reports
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Generate and download detailed system reports based on real
                  data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button
                    onClick={() => generateReport("task-performance")}
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 h-20 flex-col"
                  >
                    <BarChart3 className="h-6 w-6 mb-2" />
                    Task Performance Report
                    <span className="text-xs text-slate-400">
                      Completion rates & timing
                    </span>
                  </Button>
                  <Button
                    onClick={() => generateReport("maintenance-schedule")}
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 h-20 flex-col"
                  >
                    <Clock className="h-6 w-6 mb-2" />
                    Maintenance Schedule Report
                    <span className="text-xs text-slate-400">
                      Upcoming & overdue tasks
                    </span>
                  </Button>
                  <Button
                    onClick={() => generateReport("machine-efficiency")}
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 h-20 flex-col"
                  >
                    <Activity className="h-6 w-6 mb-2" />
                    Machine Efficiency Report
                    <span className="text-xs text-slate-400">
                      Performance by machine
                    </span>
                  </Button>
                  <Button
                    onClick={() => generateReport("issues-alerts")}
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 h-20 flex-col"
                  >
                    <AlertTriangle className="h-6 w-6 mb-2" />
                    Issues & Alerts Report
                    <span className="text-xs text-slate-400">
                      Overdue tasks & problems
                    </span>
                  </Button>
                  <Button
                    onClick={() => generateReport("completion-history")}
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 h-20 flex-col"
                  >
                    <CheckCircle className="h-6 w-6 mb-2" />
                    Completion History Report
                    <span className="text-xs text-slate-400">
                      Detailed completion records
                    </span>
                  </Button>
                  <Button
                    onClick={() => generateReport("photo-log")}
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 h-20 flex-col"
                  >
                    <Camera className="h-6 w-6 mb-2" />
                    Photo Log Report
                    <span className="text-xs text-slate-400">
                      Tasks with photo attachments
                    </span>
                  </Button>
                </div>

                {analytics.totalTasks === 0 && (
                  <div className="text-center py-8 bg-slate-700/20 rounded-lg">
                    <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No Data for Reports
                    </h3>
                    <p className="text-slate-400">
                      Import maintenance data to generate meaningful reports.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Task Photos & Documentation
                </CardTitle>
                <CardDescription className="text-slate-400">
                  View photos attached to completed maintenance tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const photoData = Database.getAllTaskPhotos();

                  if (photoData.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <Camera className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">
                          No Photos Yet
                        </h3>
                        <p className="text-slate-400">
                          Photos will appear here when operators complete tasks
                          with photo documentation.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-6">
                      {photoData.slice(0, 10).map((item, index) => (
                        <Card
                          key={`${item.completionId}-${index}`}
                          className="bg-slate-700/30 border-slate-600/50"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <div className="flex-1">
                                <CardTitle className="text-white text-lg">
                                  {item.taskName}
                                </CardTitle>
                                <CardDescription className="text-slate-300">
                                  {item.machineName} • Completed by{" "}
                                  {item.completedBy}
                                </CardDescription>
                              </div>
                              <div className="flex flex-col sm:items-end gap-1">
                                <span className="text-sm text-slate-400">
                                  {item.completedDate.toLocaleDateString()}
                                </span>
                                <span className="text-xs text-blue-400">
                                  {item.photos.length} photo
                                  {item.photos.length !== 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {item.notes && (
                              <div className="mb-4 p-3 bg-slate-600/30 rounded-lg">
                                <p className="text-sm text-slate-300">
                                  <strong>Notes:</strong> {item.notes}
                                </p>
                              </div>
                            )}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                              {item.photos.map((photo, photoIndex) => (
                                <div
                                  key={photoIndex}
                                  className="relative group cursor-pointer"
                                  onClick={() => {
                                    // Create modal to view full size image
                                    const modal = document.createElement("div");
                                    modal.className =
                                      "fixed inset-0 bg-black/80 flex items-center justify-center z-50";
                                    modal.innerHTML = `
                                      <div class="relative max-w-4xl max-h-4xl p-4">
                                        <img src="${photo}" alt="Task photo" class="max-w-full max-h-full object-contain rounded-lg" />
                                        <button class="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700">
                                          ×
                                        </button>
                                      </div>
                                    `;
                                    modal.onclick = (e) => {
                                      if (
                                        e.target === modal ||
                                        e.target.tagName === "BUTTON"
                                      ) {
                                        document.body.removeChild(modal);
                                      }
                                    };
                                    document.body.appendChild(modal);
                                  }}
                                >
                                  <img
                                    src={photo}
                                    alt={`Task photo ${photoIndex + 1}`}
                                    className="w-full h-24 sm:h-32 object-cover rounded-lg border border-slate-600 group-hover:border-blue-400 transition-colors"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-lg flex items-center justify-center">
                                    <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                                      Click to view
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {item.timeSpent && (
                              <div className="mt-3 text-xs text-slate-400">
                                Time spent: {item.timeSpent} minutes
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}

                      {photoData.length > 10 && (
                        <div className="text-center py-4">
                          <p className="text-slate-400 text-sm">
                            Showing latest 10 photo sessions. Export photo log
                            report for complete history.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
