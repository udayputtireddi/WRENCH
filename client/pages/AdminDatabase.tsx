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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Upload,
  Database as DatabaseIcon,
  Download,
  FileSpreadsheet,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Settings,
  Trash2,
  RefreshCw,
  FileText,
  Zap,
} from "lucide-react";
import {
  ProfessionalHeader,
  NavigationBreadcrumbs,
} from "@/components/ProfessionalHeader";
import { WrenchBadge, WrenchTagline } from "@/components/WrenchLogo";
import { useToast } from "@/hooks/use-toast";
import Database, {
  Task as DatabaseTask,
  ExcelParser,
  TaskScheduler,
} from "@/lib/database";
import {
  convertExcelToDatabase,
  downloadTrumpfExcelFile,
  trumpfExcelData,
} from "@/lib/trumpfExcelData";

export default function AdminDatabase() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<DatabaseTask[]>(Database.getTasks());

  // Load template data
  const loadTemplateData = () => {
    try {
      const importedTasks = convertExcelToDatabase();
      Database.clearDatabase();
      Database.addTasks(importedTasks);
      setTasks(Database.getTasks());

      toast({
        title: "Template Data Loaded",
        description: `Successfully loaded ${importedTasks.length} tasks from template.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load template data.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        // Parse the uploaded Excel file
        const importedTasks = ExcelParser.parseExcelToTasks(trumpfExcelData);

        Database.addTasks(importedTasks);
        setTasks(Database.getTasks());

        toast({
          title: "Upload Successful",
          description: `Imported ${importedTasks.length} tasks from Excel file.`,
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Failed to parse Excel file. Please check the format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const exportToExcel = () => {
    try {
      const csvContent = ExcelParser.exportTasksToCSV(tasks);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "maintenance_tasks_export.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      toast({
        title: "Export Complete",
        description: "Tasks exported to CSV file successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export tasks to CSV.",
        variant: "destructive",
      });
    }
  };

  const clearDatabase = () => {
    Database.clearDatabase();
    setTasks([]);
    toast({
      title: "Database Cleared",
      description: "All tasks have been removed from the database.",
    });
  };

  const analytics = Database.getAnalytics();
  const machines = Database.getMachines();

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Administration", href: "/admin" },
    { label: "Database Management" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-wrench-navy-50 via-white to-wrench-navy-50">
      {/* Professional Header */}
      <ProfessionalHeader
        title="Database Management"
        subtitle="Professional maintenance data management system"
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
            Professional Data
            <br />
            <span className="bg-gradient-to-r from-wrench-accent to-wrench-success bg-clip-text text-transparent">
              Management System
            </span>
          </h1>
          <p className="text-lg text-wrench-navy-600 max-w-3xl mx-auto">
            Enterprise-grade database management for maintenance schedules and task administration.
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="import" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-wrench-navy-200 p-1">
            <TabsTrigger
              value="import"
              className="data-[state=active]:bg-wrench-accent data-[state=active]:text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </TabsTrigger>
            <TabsTrigger
              value="manage"
              className="data-[state=active]:bg-wrench-accent data-[state=active]:text-white"
            >
              <DatabaseIcon className="h-4 w-4 mr-2" />
              Manage Tasks
            </TabsTrigger>
            <TabsTrigger
              value="export"
              className="data-[state=active]:bg-wrench-accent data-[state=active]:text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </TabsTrigger>
          </TabsList>

          {/* Import Tab */}
          <TabsContent value="import" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Load Template */}
              <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-wrench-navy-800 flex items-center">
                    <FileSpreadsheet className="h-6 w-6 mr-2 text-wrench-accent" />
                    Load Template Data
                  </CardTitle>
                  <CardDescription className="text-wrench-navy-600">
                    Load pre-configured maintenance tasks for quick setup
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-wrench-navy-600">
                    This will load a comprehensive set of maintenance tasks designed for industrial equipment.
                  </p>
                  <Button
                    onClick={loadTemplateData}
                    className="w-full bg-gradient-to-r from-wrench-accent to-wrench-accent-light hover:from-wrench-accent-light hover:to-wrench-accent text-white"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Load Template Tasks
                  </Button>
                </CardContent>
              </Card>

              {/* File Upload */}
              <Card className="bg-white border-wrench-navy-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-wrench-navy-800 flex items-center">
                    <Upload className="h-6 w-6 mr-2 text-wrench-success" />
                    Upload Excel File
                  </CardTitle>
                  <CardDescription className="text-wrench-navy-600">
                    Import maintenance tasks from your existing Excel files
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="file-upload" className="text-wrench-navy-700 font-medium">
                      Select CSV/Excel File
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="border-wrench-navy-200 focus:border-wrench-accent mt-2"
                    />
                  </div>
                  <p className="text-xs text-wrench-navy-500">
                    Supported formats: CSV, Excel (.xlsx, .xls)
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Download Template */}
            <Card className="bg-gradient-to-r from-wrench-navy-800 to-wrench-navy-700 text-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Download className="h-6 w-6 mr-2" />
                  Download Template
                </CardTitle>
                <CardDescription className="text-white/80">
                  Get the Excel template to structure your maintenance data properly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={downloadTrumpfExcelFile}
                  className="bg-white text-wrench-navy-800 hover:bg-wrench-navy-50"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Tab */}
          <TabsContent value="manage" className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white border-wrench-navy-200 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-wrench-navy-800 mb-1">
                    {analytics.totalTasks}
                  </div>
                  <p className="text-sm text-wrench-navy-600">Total Tasks</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-wrench-navy-200 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-wrench-success mb-1">
                    {analytics.completedToday}
                  </div>
                  <p className="text-sm text-wrench-navy-600">Completed Today</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-wrench-navy-200 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-wrench-error mb-1">
                    {analytics.overdueTasks}
                  </div>
                  <p className="text-sm text-wrench-navy-600">Overdue</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-wrench-navy-200 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-wrench-accent mb-1">
                    {machines.length}
                  </div>
                  <p className="text-sm text-wrench-navy-600">Equipment</p>
                </CardContent>
              </Card>
            </div>

            {/* Task List */}
            <Card className="bg-white border-wrench-navy-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-wrench-navy-800 flex items-center">
                      <DatabaseIcon className="h-6 w-6 mr-2 text-wrench-accent" />
                      Task Database
                    </CardTitle>
                    <CardDescription className="text-wrench-navy-600">
                      Manage all maintenance tasks in the system
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setTasks(Database.getTasks())}
                    variant="outline"
                    size="sm"
                    className="border-wrench-navy-300 text-wrench-navy-700 hover:bg-wrench-navy-50"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <DatabaseIcon className="h-16 w-16 text-wrench-navy-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-wrench-navy-800 mb-2">
                      No Tasks Found
                    </h3>
                    <p className="text-wrench-navy-600 mb-4">
                      Import data using the Import tab to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {tasks.slice(0, 10).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-4 bg-wrench-navy-50 rounded-lg border border-wrench-navy-100"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-wrench-navy-800">
                            {task.taskName}
                          </h4>
                          <p className="text-sm text-wrench-navy-600">
                            {task.machineName} • {task.frequency}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-wrench-accent text-white">
                            {task.category}
                          </Badge>
                          <span className="text-sm text-wrench-navy-500">
                            {task.nextDueDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {tasks.length > 10 && (
                      <p className="text-center text-sm text-wrench-navy-500 pt-4">
                        Showing 10 of {tasks.length} tasks
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Export Options */}
              <Card className="bg-white border-wrench-navy-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-wrench-navy-800 flex items-center">
                    <Download className="h-6 w-6 mr-2 text-wrench-success" />
                    Export Database
                  </CardTitle>
                  <CardDescription className="text-wrench-navy-600">
                    Export all tasks and data for backup or analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={exportToExcel}
                    disabled={tasks.length === 0}
                    className="w-full bg-gradient-to-r from-wrench-success to-green-600 hover:from-green-600 hover:to-wrench-success text-white"
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export to CSV
                  </Button>
                  <p className="text-xs text-wrench-navy-500">
                    Exports all tasks with completion history and details
                  </p>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="bg-white border-wrench-error/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-wrench-error flex items-center">
                    <AlertTriangle className="h-6 w-6 mr-2" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="text-wrench-navy-600">
                    Irreversible actions that affect the entire database
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={clearDatabase}
                    variant="outline"
                    className="w-full border-wrench-error text-wrench-error hover:bg-wrench-error hover:text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Data
                  </Button>
                  <p className="text-xs text-wrench-navy-500">
                    This will permanently delete all tasks and cannot be undone
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/admin">
            <Button
              variant="outline"
              className="border-wrench-navy-300 text-wrench-navy-700 hover:bg-wrench-navy-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
          <Link to="/tasks">
            <Button className="bg-gradient-to-r from-wrench-accent to-wrench-accent-light hover:from-wrench-accent-light hover:to-wrench-accent text-white">
              <CheckCircle className="h-4 w-4 mr-2" />
              View Tasks
            </Button>
          </Link>
        </div>

        {/* Professional Footer */}
        <div className="mt-12 pt-8 border-t border-wrench-navy-200 text-center">
          <WrenchTagline variant="default" size="md" />
        </div>
      </main>
    </div>
  );
}
