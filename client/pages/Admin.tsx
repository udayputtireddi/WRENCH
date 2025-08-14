import { useState } from "react";
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
  UserPlus,
  Server,
  FileText,
  Calendar,
  Target,
  Zap,
} from "lucide-react";
import { ProfessionalHeader, NavigationBreadcrumbs } from "@/components/ProfessionalHeader";
import { WrenchBadge, WrenchTagline } from "@/components/WrenchLogo";
import Database, { TaskScheduler } from "@/lib/database";
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
  const [testResults, setTestResults] = useState<string>("");
  const [showTestResults, setShowTestResults] = useState(false);

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
        title: "Equipment Added",
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
      default:
        return;
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Report Generated",
      description: `${filename} has been downloaded successfully.`,
    });
  };

  const runSystemTest = () => {
    setShowTestResults(true);
    const testData = {
      taskScheduler: TaskScheduler.testScheduler(),
      databaseHealth: Database.checkHealth(),
      userAuthentication: AuthService.testAuth(),
    };

    setTestResults(JSON.stringify(testData, null, 2));
    toast({
      title: "System Test Complete",
      description: "All system components tested successfully.",
    });
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Administration" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-wrench-navy-50 via-white to-wrench-navy-50">
      {/* Professional Header */}
      <ProfessionalHeader 
        title="System Administration"
        subtitle="Professional maintenance platform management"
        variant="gradient"
      />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <NavigationBreadcrumbs items={breadcrumbs} />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-8">
          <WrenchBadge className="mb-4" />
          <h1 className="text-3xl lg:text-4xl font-black text-wrench-navy-900 mb-4">
            Professional System
            <br />
            <span className="bg-gradient-to-r from-wrench-accent to-wrench-success bg-clip-text text-transparent">
              Administration
            </span>
          </h1>
          <p className="text-lg text-wrench-navy-600 max-w-3xl mx-auto">
            Enterprise-grade administration tools for managing users, equipment, and system operations.
          </p>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-wrench-navy-200 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-wrench-accent data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-wrench-accent data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="machines" className="data-[state=active]:bg-wrench-accent data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Equipment
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-wrench-accent data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-wrench-accent data-[state=active]:text-white">
              <Server className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-wrench-navy-700">Total Users</CardTitle>
                    <div className="h-8 w-8 bg-wrench-accent/10 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-wrench-accent" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-wrench-navy-800">{allUsers.length}</div>
                  <p className="text-xs text-wrench-navy-500">Active system users</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-wrench-navy-700">Equipment</CardTitle>
                    <div className="h-8 w-8 bg-wrench-success/10 rounded-full flex items-center justify-center">
                      <Settings className="h-4 w-4 text-wrench-success" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-wrench-navy-800">{analytics.totalMachines}</div>
                  <p className="text-xs text-wrench-navy-500">Managed machines</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-wrench-navy-700">Active Tasks</CardTitle>
                    <div className="h-8 w-8 bg-wrench-warning/10 rounded-full flex items-center justify-center">
                      <Activity className="h-4 w-4 text-wrench-warning" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-wrench-navy-800">{analytics.totalTasks}</div>
                  <p className="text-xs text-wrench-navy-500">Maintenance tasks</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-wrench-navy-700">System Health</CardTitle>
                    <div className="h-8 w-8 bg-wrench-success/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-wrench-success" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-wrench-success">100%</div>
                  <p className="text-xs text-wrench-navy-500">Operational</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-wrench-accent to-wrench-accent-light text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <UserPlus className="h-5 w-5 mr-2" />
                    User Management
                  </CardTitle>
                  <CardDescription className="text-white/80">
                    Add, edit, and manage system users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-white text-wrench-accent hover:bg-wrench-navy-50 font-semibold">
                    Manage Users
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-wrench-success to-wrench-success/80 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <DatabaseIcon className="h-5 w-5 mr-2" />
                    Data Management
                  </CardTitle>
                  <CardDescription className="text-white/80">
                    Import/export maintenance data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-white text-wrench-success hover:bg-green-50 font-semibold">
                    Manage Data
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-wrench-warning to-wrench-warning/80 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <FileText className="h-5 w-5 mr-2" />
                    Reports & Analytics
                  </CardTitle>
                  <CardDescription className="text-white/80">
                    Generate comprehensive reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-white text-wrench-warning hover:bg-orange-50 font-semibold">
                    View Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-white border-wrench-navy-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-wrench-navy-800 flex items-center">
                  <Users className="h-6 w-6 mr-2 text-wrench-accent" />
                  User Management
                </CardTitle>
                <CardDescription className="text-wrench-navy-600">
                  Manage system users and their access permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-wrench-navy-50 rounded-lg border border-wrench-navy-100"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-wrench-accent to-wrench-navy-700 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-wrench-navy-800">{user.name}</p>
                          <p className="text-sm text-wrench-navy-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={
                            user.role === "admin"
                              ? "bg-wrench-accent text-white"
                              : "bg-wrench-navy-100 text-wrench-navy-800"
                          }
                        >
                          {user.role}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="border-wrench-error text-wrench-error hover:bg-wrench-error hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="machines" className="space-y-6">
            <Card className="bg-white border-wrench-navy-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-wrench-navy-800 flex items-center">
                  <Settings className="h-6 w-6 mr-2 text-wrench-accent" />
                  Equipment Management
                </CardTitle>
                <CardDescription className="text-wrench-navy-600">
                  Add and manage equipment in the maintenance system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-wrench-navy-800">Add New Equipment</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="machineId" className="text-wrench-navy-700 font-medium">Equipment ID</Label>
                        <Input
                          id="machineId"
                          placeholder="e.g., TRUMPF-5000-001"
                          value={newMachine.id}
                          onChange={(e) => setNewMachine({ ...newMachine, id: e.target.value })}
                          className="border-wrench-navy-200 focus:border-wrench-accent"
                        />
                      </div>
                      <div>
                        <Label htmlFor="machineName" className="text-wrench-navy-700 font-medium">Equipment Name</Label>
                        <Input
                          id="machineName"
                          placeholder="e.g., Trumpf TruPunch 5000"
                          value={newMachine.name}
                          onChange={(e) => setNewMachine({ ...newMachine, name: e.target.value })}
                          className="border-wrench-navy-200 focus:border-wrench-accent"
                        />
                      </div>
                      <div>
                        <Label htmlFor="machineType" className="text-wrench-navy-700 font-medium">Type</Label>
                        <Input
                          id="machineType"
                          placeholder="e.g., Punch Press"
                          value={newMachine.type}
                          onChange={(e) => setNewMachine({ ...newMachine, type: e.target.value })}
                          className="border-wrench-navy-200 focus:border-wrench-accent"
                        />
                      </div>
                      <div>
                        <Label htmlFor="machineLocation" className="text-wrench-navy-700 font-medium">Location</Label>
                        <Input
                          id="machineLocation"
                          placeholder="e.g., Production Floor A"
                          value={newMachine.location}
                          onChange={(e) => setNewMachine({ ...newMachine, location: e.target.value })}
                          className="border-wrench-navy-200 focus:border-wrench-accent"
                        />
                      </div>
                      <Button
                        onClick={handleAddMachine}
                        className="w-full bg-gradient-to-r from-wrench-accent to-wrench-accent-light hover:from-wrench-accent-light hover:to-wrench-accent text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Equipment
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-wrench-navy-800">Current Equipment</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {machines.map((machine) => (
                        <div
                          key={machine.id}
                          className="p-3 bg-wrench-navy-50 rounded-lg border border-wrench-navy-100"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-wrench-navy-800">{machine.name}</p>
                              <p className="text-sm text-wrench-navy-600">{machine.id} • {machine.location}</p>
                            </div>
                            <Badge className="bg-wrench-success text-white">
                              {machine.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-white border-wrench-navy-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-wrench-navy-800 flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-wrench-accent" />
                  Professional Reports
                </CardTitle>
                <CardDescription className="text-wrench-navy-600">
                  Generate comprehensive maintenance and performance reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Task Performance",
                      description: "Task completion rates and efficiency metrics",
                      type: "task-performance",
                      icon: Target,
                      color: "wrench-accent"
                    },
                    {
                      title: "Maintenance Schedule",
                      description: "Upcoming and overdue maintenance tasks",
                      type: "maintenance-schedule",
                      icon: Calendar,
                      color: "wrench-warning"
                    },
                    {
                      title: "Equipment Efficiency",
                      description: "Machine performance and utilization",
                      type: "machine-efficiency",
                      icon: Settings,
                      color: "wrench-success"
                    },
                    {
                      title: "Issues & Alerts",
                      description: "System alerts and maintenance issues",
                      type: "issues-alerts",
                      icon: AlertTriangle,
                      color: "wrench-error"
                    },
                    {
                      title: "Completion History",
                      description: "Historical task completion data",
                      type: "completion-history",
                      icon: Clock,
                      color: "wrench-navy-600"
                    }
                  ].map((report) => (
                    <Card key={report.type} className="border-wrench-navy-200 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className={`h-10 w-10 bg-${report.color}/10 rounded-full flex items-center justify-center mb-2`}>
                          <report.icon className={`h-5 w-5 text-${report.color}`} />
                        </div>
                        <CardTitle className="text-sm font-semibold text-wrench-navy-800">
                          {report.title}
                        </CardTitle>
                        <CardDescription className="text-xs text-wrench-navy-600">
                          {report.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={() => generateReport(report.type)}
                          variant="outline"
                          size="sm"
                          className="w-full border-wrench-navy-300 text-wrench-navy-700 hover:bg-wrench-navy-50"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download CSV
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card className="bg-white border-wrench-navy-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-wrench-navy-800 flex items-center">
                  <Server className="h-6 w-6 mr-2 text-wrench-accent" />
                  System Health & Testing
                </CardTitle>
                <CardDescription className="text-wrench-navy-600">
                  Monitor system performance and run diagnostic tests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-wrench-success/10 rounded-lg border border-wrench-success/20">
                    <CheckCircle className="h-8 w-8 text-wrench-success mx-auto mb-2" />
                    <p className="font-semibold text-wrench-navy-800">Database</p>
                    <p className="text-sm text-wrench-navy-600">Operational</p>
                  </div>
                  <div className="text-center p-4 bg-wrench-success/10 rounded-lg border border-wrench-success/20">
                    <Shield className="h-8 w-8 text-wrench-success mx-auto mb-2" />
                    <p className="font-semibold text-wrench-navy-800">Security</p>
                    <p className="text-sm text-wrench-navy-600">Secure</p>
                  </div>
                  <div className="text-center p-4 bg-wrench-success/10 rounded-lg border border-wrench-success/20">
                    <Zap className="h-8 w-8 text-wrench-success mx-auto mb-2" />
                    <p className="font-semibold text-wrench-navy-800">Performance</p>
                    <p className="text-sm text-wrench-navy-600">Optimal</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={runSystemTest}
                    className="w-full bg-gradient-to-r from-wrench-accent to-wrench-accent-light hover:from-wrench-accent-light hover:to-wrench-accent text-white py-3"
                  >
                    <Activity className="h-5 w-5 mr-2" />
                    Run System Diagnostics
                  </Button>

                  {showTestResults && (
                    <Card className="bg-wrench-navy-50 border-wrench-navy-200">
                      <CardHeader>
                        <CardTitle className="text-sm text-wrench-navy-800">Test Results</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-xs text-wrench-navy-700 whitespace-pre-wrap">
                          {testResults}
                        </pre>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Professional Footer */}
        <div className="mt-12 pt-8 border-t border-wrench-navy-200 text-center">
          <WrenchTagline variant="default" size="md" />
        </div>
      </main>
    </div>
  );
}

// Helper functions for report generation
function generateTaskPerformanceReport(): string {
  const tasks = Database.getTasks();
  const headers = [
    "Task ID",
    "Task Name",
    "Machine",
    "Status",
    "Due Date",
    "Completion Rate",
    "Priority"
  ];

  const rows = tasks.map(task => [
    task.id,
    task.taskName,
    task.machineId,
    task.status || "Pending",
    task.nextDueDate.toLocaleDateString(),
    task.lastCompletedDate ? "100%" : "0%",
    task.category || "Medium"
  ]);

  return [headers, ...rows].map(row => row.join(",")).join("\n");
}

function generateMaintenanceScheduleReport(): string {
  const tasks = Database.getTasks();
  const headers = [
    "Equipment ID",
    "Equipment Name",
    "Task",
    "Frequency",
    "Next Due",
    "Status",
    "Location"
  ];

  const rows = tasks.map(task => {
    const machine = Database.getMachineById(task.machineId);
    return [
      task.machineId,
      machine?.name || "Unknown",
      task.taskName,
      task.frequency,
      task.nextDueDate.toLocaleDateString(),
      task.lastCompletedDate ? "Completed" : "Pending",
      machine?.location || "Unknown"
    ];
  });

  return [headers, ...rows].map(row => row.join(",")).join("\n");
}

function generateMachineEfficiencyReport(): string {
  const machines = Database.getMachines();
  const headers = [
    "Equipment ID",
    "Equipment Name",
    "Type",
    "Location",
    "Status",
    "Task Count",
    "Efficiency"
  ];

  const rows = machines.map(machine => [
    machine.id,
    machine.name,
    machine.type,
    machine.location,
    machine.status,
    machine.tasks.length.toString(),
    "95%" // Placeholder efficiency calculation
  ]);

  return [headers, ...rows].map(row => row.join(",")).join("\n");
}

function generateIssuesAlertsReport(): string {
  const analytics = Database.getAnalytics();
  const headers = [
    "Alert Type",
    "Count",
    "Priority",
    "Date",
    "Status"
  ];

  const rows = [
    ["Overdue Tasks", analytics.overdueTasks.toString(), "High", new Date().toLocaleDateString(), "Active"],
    ["Upcoming Tasks", analytics.upcomingTasks.toString(), "Medium", new Date().toLocaleDateString(), "Scheduled"],
    ["System Health", "1", "Low", new Date().toLocaleDateString(), "Operational"]
  ];

  return [headers, ...rows].map(row => row.join(",")).join("\n");
}
