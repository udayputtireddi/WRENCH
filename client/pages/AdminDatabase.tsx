import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Database, Download, FileSpreadsheet, Calendar, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DatabaseTask, ExcelTaskData, ExcelParser, TaskScheduler, sampleTrumpfTasks } from "@/lib/database";
import { convertExcelToDatabase, downloadTrumpfExcelFile } from "@/lib/trumpfExcelData";

export default function AdminDatabase() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<DatabaseTask[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  // Load template data
  const loadSampleData = () => {
    const trumpfTasks = convertExcelToDatabase();
    setTasks(trumpfTasks as any);
    toast({
      title: "Trumpf Data Loaded",
      description: `Loaded ${trumpfTasks.length} tasks from Trumpf 5000 Punch maintenance sheet.`,
      duration: 3000,
    });
  };

  // Download the Excel template
  const downloadExcelTemplate = () => {
    downloadTrumpfExcelFile();
    toast({
      title: "Excel File Downloaded",
      description: "Trumpf 5000 Punch maintenance tasks downloaded as CSV file.",
      duration: 3000,
    });
  };

  // Handle Excel file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "File Selected",
        description: `Selected: ${file.name}`,
        duration: 2000,
      });
    }
  };

  // Simulate Excel parsing (in real app, would use a library like SheetJS)
  const importExcelData = async () => {
    if (!selectedFile) return;
    
    setImporting(true);
    
    // Simulate processing time
    setTimeout(() => {
      // In real implementation, you would parse the Excel file here
      // For demo, we'll use the sample data
      const importedTasks = ExcelParser.parseExcelToTasks(sampleTrumpfTasks);
      setTasks(importedTasks);
      
      toast({
        title: "Data Imported Successfully",
        description: `Imported ${importedTasks.length} tasks from ${selectedFile.name}`,
        duration: 3000,
      });
      
      setImporting(false);
      setSelectedFile(null);
    }, 2000);
  };

  // Export current data to Excel format
  const exportToExcel = () => {
    const csvContent = generateCSVContent(tasks);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checkmate-tasks-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Task data has been exported as CSV file.",
      duration: 3000,
    });
  };

  // Generate CSV content for export
  const generateCSVContent = (tasks: DatabaseTask[]): string => {
    const headers = [
      'Machine ID', 'Machine Name', 'Task Name', 'Description', 'Frequency',
      'Category', 'Estimated Time (min)', 'Next Due Date', 'Last Completed',
      'Last Completed By', 'Status', 'Total Completions'
    ];
    
    const rows = tasks.map(task => [
      task.machineId,
      task.machineName,
      task.taskName,
      task.description,
      task.frequency,
      task.category,
      task.estimatedTimeMinutes.toString(),
      task.nextDueDate.toISOString().split('T')[0],
      task.lastCompletedDate?.toISOString().split('T')[0] || 'Never',
      task.lastCompletedBy || 'N/A',
      TaskScheduler.isTaskOverdue(task) ? 'Overdue' : 
      TaskScheduler.isTaskDueToday(task) ? 'Due Today' : 'Scheduled',
      task.completionHistory.length.toString()
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  // Get task statistics
  const getTaskStats = () => {
    const { due, overdue, upcoming } = TaskScheduler.getTasksForToday(tasks);
    return {
      total: tasks.length,
      due: due.length,
      overdue: overdue.length,
      upcoming: upcoming.length,
      completed: tasks.filter(t => t.completionHistory.length > 0).length
    };
  };

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-800 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <Link to="/admin" className="mr-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Database Management</h1>
              <p className="text-purple-100">Import, manage, and export task data</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-blue-600 border-0 text-white">
            <CardContent className="p-4 text-center">
              <Database className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-blue-100">Total Tasks</div>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-600 border-0 text-white">
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.due}</div>
              <div className="text-xs text-orange-100">Due Today</div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-600 border-0 text-white">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.overdue}</div>
              <div className="text-xs text-red-100">Overdue</div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-600 border-0 text-white">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.completed}</div>
              <div className="text-xs text-green-100">With History</div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-600 border-0 text-white">
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.upcoming}</div>
              <div className="text-xs text-purple-100">Upcoming</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="import" className="space-y-8">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="import" className="data-[state=active]:bg-slate-600">
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </TabsTrigger>
            <TabsTrigger value="manage" className="data-[state=active]:bg-slate-600">
              <Database className="h-4 w-4 mr-2" />
              Manage Tasks
            </TabsTrigger>
            <TabsTrigger value="export" className="data-[state=active]:bg-slate-600">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </TabsTrigger>
          </TabsList>

          {/* Import Tab */}
          <TabsContent value="import" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Import Excel Data
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Upload your maintenance task spreadsheet to automatically create database entries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="excelFile" className="text-slate-300">Excel File (.xlsx, .xls, .csv)</Label>
                  <Input
                    id="excelFile"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    onClick={importExcelData}
                    disabled={!selectedFile || importing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {importing ? "Importing..." : "Import Excel File"}
                  </Button>
                  
                  <Button
                    onClick={loadSampleData}
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                  >
                    Load Trumpf Data
                  </Button>

                  <Button
                    onClick={downloadExcelTemplate}
                    variant="outline"
                    className="bg-green-700/50 border-green-600 text-white hover:bg-green-600"
                  >
                    Download Excel Template
                  </Button>
                </div>

                {/* Excel Format Guide */}
                <div className="mt-6 p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Expected Excel Format:</h4>
                  <div className="text-sm text-slate-300 space-y-1">
                    <p><strong>Required Columns:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Machine ID (e.g., TRUMPF-5000-001)</li>
                      <li>Machine Name (e.g., Trumpf 5000 Punch)</li>
                      <li>Task Name (e.g., Visual Inspection of Turret)</li>
                      <li>Frequency (Daily, Weekly, Monthly, etc.)</li>
                    </ul>
                    <p className="mt-2"><strong>Optional Columns:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Description, Category, Estimated Time, Weekly Day</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Tab */}
          <TabsContent value="manage" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Task Database</CardTitle>
                <CardDescription className="text-slate-400">
                  View and manage all tasks in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.length === 0 ? (
                    <div className="text-center py-8">
                      <Database className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400">No tasks in database. Import some data to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 border border-slate-600/50">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-white font-medium">{task.taskName}</h4>
                              <Badge className={`text-xs ${
                                task.frequency === 'daily' ? 'bg-blue-500/20 text-blue-300' :
                                task.frequency === 'weekly' ? 'bg-green-500/20 text-green-300' :
                                'bg-purple-500/20 text-purple-300'
                              }`}>
                                {task.frequency}
                              </Badge>
                            </div>
                            <div className="text-sm text-slate-400">
                              {task.machineName} • Due: {task.nextDueDate.toLocaleDateString()}
                              {task.lastCompletedDate && ` • Last: ${task.lastCompletedDate.toLocaleDateString()}`}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${
                              TaskScheduler.isTaskOverdue(task) ? 'bg-red-500/20 text-red-300' :
                              TaskScheduler.isTaskDueToday(task) ? 'bg-orange-500/20 text-orange-300' :
                              'bg-gray-500/20 text-gray-300'
                            }`}>
                              {TaskScheduler.isTaskOverdue(task) ? 'Overdue' :
                               TaskScheduler.isTaskDueToday(task) ? 'Due Today' : 'Scheduled'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Data
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Download current task data and completion history
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={exportToExcel}
                  disabled={tasks.length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
                
                <div className="text-sm text-slate-400">
                  <p>Export includes:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>All task definitions and scheduling data</li>
                    <li>Completion history and user tracking</li>
                    <li>Next due dates and status information</li>
                    <li>Performance statistics</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
