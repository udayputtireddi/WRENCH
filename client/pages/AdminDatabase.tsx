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
} from "lucide-react";
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
      }

      toast({
        title: "Export Successful",
        description: `Exported ${tasks.length} tasks to CSV file.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export tasks to Excel.",
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

  return (
    <div className="app-container bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-800 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <Link to="/admin" className="mr-4">
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
                Database Management
              </h1>
              <p className="text-indigo-100">
                Import, export, and manage maintenance task data
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="overview" className="text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="import" className="text-white">
              Import Data
            </TabsTrigger>
            <TabsTrigger value="export" className="text-white">
              Export Data
            </TabsTrigger>
            <TabsTrigger value="manage" className="text-white">
              Manage Tasks
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Total Tasks
                  </CardTitle>
                  <DatabaseIcon className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {analytics.totalTasks}
                  </div>
                  <p className="text-xs text-slate-400">
                    Across {analytics.totalMachines} machines
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Completed Today
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">
                    {analytics.completedToday}
                  </div>
                  <p className="text-xs text-slate-400">Tasks finished today</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Overdue Tasks
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">
                    {analytics.overdueTasks}
                  </div>
                  <p className="text-xs text-slate-400">
                    Need immediate attention
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Due Tomorrow
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">
                    {analytics.upcomingTasks}
                  </div>
                  <p className="text-xs text-slate-400">Upcoming tasks</p>
                </CardContent>
              </Card>
            </div>

            {tasks.length === 0 ? (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardContent className="text-center py-12">
                  <DatabaseIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Tasks in Database
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Import maintenance data to get started with task management.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={loadTemplateData}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Load Template Data
                    </Button>
                    <Button
                      onClick={downloadTrumpfExcelFile}
                      variant="outline"
                      className="border-slate-600 text-white hover:bg-slate-700"
                    >
                      Download Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Database Status</CardTitle>
                  <CardDescription className="text-slate-400">
                    Current system status and quick actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-white font-medium">
                        Database Active
                      </span>
                    </div>
                    <span className="text-green-400">
                      {tasks.length} tasks loaded
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={exportToExcel}
                      variant="outline"
                      className="border-slate-600 text-white hover:bg-slate-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button
                      onClick={clearDatabase}
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-600/10"
                    >
                      Clear Database
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Import Data Tab */}
          <TabsContent value="import" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">
                    Upload Excel File
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Import maintenance tasks from CSV/Excel spreadsheet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="file-upload" className="text-slate-300">
                      Select Excel/CSV File
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-400">
                      Supported formats: CSV, Excel (.xlsx, .xls)
                    </p>
                    <p className="text-sm text-slate-400">
                      Required columns: Machine ID, Machine Name, Task Name,
                      Description, Frequency, Category
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Quick Start</CardTitle>
                  <CardDescription className="text-slate-400">
                    Load sample data or download template
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={loadTemplateData}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Load Trumpf 5000 Template Data
                  </Button>
                  <Button
                    onClick={downloadTrumpfExcelFile}
                    variant="outline"
                    className="w-full border-slate-600 text-white hover:bg-slate-700"
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Download Excel Template
                  </Button>
                  <p className="text-xs text-slate-400">
                    Load 16 sample maintenance tasks for Trumpf 5000 Punch
                    machine
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Export Data Tab */}
          <TabsContent value="export" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Export Database</CardTitle>
                <CardDescription className="text-slate-400">
                  Download current task data as Excel/CSV file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasks.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          {analytics.totalTasks}
                        </div>
                        <div className="text-sm text-slate-400">
                          Total Tasks
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          {analytics.totalMachines}
                        </div>
                        <div className="text-sm text-slate-400">Machines</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          {
                            tasks.filter((t) => t.completionHistory.length > 0)
                              .length
                          }
                        </div>
                        <div className="text-sm text-slate-400">
                          With History
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={exportToExcel}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export to CSV
                    </Button>
                    <p className="text-sm text-slate-400">
                      Export includes task details, completion history, and next
                      due dates
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <DatabaseIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No Data to Export
                    </h3>
                    <p className="text-slate-400">
                      Import some tasks first to enable export functionality.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Tasks Tab */}
          <TabsContent value="manage" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Task Management</CardTitle>
                <CardDescription className="text-slate-400">
                  View and manage all tasks in the database
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tasks.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold text-white">
                              {task.taskName}
                            </h4>
                            <Badge
                              variant="outline"
                              className="border-slate-500 text-slate-300"
                            >
                              {task.frequency}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-slate-500 text-slate-300"
                            >
                              {task.category}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-400">
                            {task.machineName} • Due:{" "}
                            {task.nextDueDate.toLocaleDateString()}
                            {task.lastCompletedDate &&
                              ` • Last: ${task.lastCompletedDate.toLocaleDateString()}`}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={(() => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              const dueDate = new Date(task.nextDueDate);
                              dueDate.setHours(0, 0, 0, 0);
                              return dueDate.getTime() < today.getTime()
                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                : "bg-green-500/20 text-green-400 border-green-500/30";
                            })()}
                          >
                            {(() => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              const dueDate = new Date(task.nextDueDate);
                              dueDate.setHours(0, 0, 0, 0);
                              return dueDate.getTime() < today.getTime()
                                ? "Overdue"
                                : "Current";
                            })()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DatabaseIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No Tasks Found
                    </h3>
                    <p className="text-slate-400">
                      Import maintenance data to start managing tasks.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
