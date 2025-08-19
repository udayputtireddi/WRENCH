import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Download,
  Calendar,
  FileText,
  BarChart3,
  Users,
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Target,
  Award,
  Zap,
  Filter,
  RefreshCw,
  Database as DatabaseIcon,
  Camera,
} from "lucide-react";
import {
  ProfessionalHeader,
  NavigationBreadcrumbs,
} from "@/components/ProfessionalHeader";
import { WrenchBadge, WrenchTagline } from "@/components/WrenchLogo";
import ExportSystem, { type ExportDateType } from "@/lib/exportSystem";
import { TaskCompletionTracker } from "@/lib/taskCompletionTracking";
import Database from "@/lib/database";
import AuthService from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface ReportFilters {
  period: ExportDateType;
  startDate: string;
  endDate: string;
  format: "csv" | "json";
  includePhotos: boolean;
}

export default function Reports() {
  const { toast } = useToast();
  const [filters, setFilters] = useState<ReportFilters>({
    period: "monthly",
    startDate: "",
    endDate: "",
    format: "csv",
    includePhotos: false,
  });

  const [reportData, setReportData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const machines = Database.getMachines();
  const users = AuthService.getAllUsers();
  const analytics = Database.getAnalytics();

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setIsGenerating(true);

    try {
      // Generate comprehensive report data
      const analytics = Database.getAnalytics();
      const completionData = TaskCompletionTracker.getAnalytics();
      const allTasks = Database.getTasks();
      
      // Calculate performance metrics
      const totalCompletions = allTasks.reduce((sum, task) => sum + task.completionHistory.length, 0);
      const averagePhotosPerCompletion = totalCompletions > 0 
        ? allTasks.reduce((sum, task) => 
            sum + task.completionHistory.reduce((photoSum, completion) => 
              photoSum + (completion.photos?.length || 0), 0), 0) / totalCompletions
        : 0;
      
      const recentCompletions = Database.getRecentCompletions(10);
      const machineEfficiency = Database.getMachineEfficiency();

      setReportData({
        analytics,
        completionData,
        totalCompletions,
        averagePhotosPerCompletion,
        recentCompletions,
        machineEfficiency,
        summary: {
          totalTasks: analytics.totalTasks,
          completedToday: analytics.completedToday,
          overdueTasks: analytics.overdueTasks,
          avgCompletionTime: analytics.averageTaskTime,
          mostActiveUser: analytics.mostActiveUser,
          totalMachines: analytics.totalMachines,
        }
      });

      toast({
        title: "Report Generated",
        description: "Professional maintenance report generated successfully.",
      });
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast({
        title: "Report Generation Failed",
        description: "Unable to generate report data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportReport = () => {
    try {
      if (filters.period === "custom") {
        if (!filters.startDate || !filters.endDate) {
          toast({
            title: "Missing Dates",
            description: "Please select both start and end dates for custom range.",
            variant: "destructive",
          });
          return;
        }
        ExportSystem.exportCustomRange(
          new Date(filters.startDate),
          new Date(filters.endDate),
          filters.format,
          filters.includePhotos
        );
      } else {
        const config = {
          type: filters.period,
          format: filters.format,
          includePhotos: filters.includePhotos,
        };
        
        const content = ExportSystem.exportTaskCompletions(config);
        const filename = ExportSystem.getReportFilename(filters.period, filters.format);
        const mimeType = filters.format === "json" ? "application/json" : "text/csv";
        ExportSystem.downloadFile(content, filename, mimeType);
      }
      
      toast({
        title: "Export Successful",
        description: `${filters.period} report downloaded in ${filters.format.toUpperCase()} format.`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed", 
        description: "Unable to export report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Professional Reports" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-wrench-navy-50 via-white to-wrench-navy-50">
      {/* Professional Header */}
      <ProfessionalHeader
        title="Professional Reports"
        subtitle="Advanced maintenance analytics and business intelligence"
        variant="gradient"
        showBackButton={true}
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
            Executive Reporting
            <br />
            <span className="bg-gradient-to-r from-wrench-accent to-wrench-success bg-clip-text text-transparent">
              & Business Intelligence
            </span>
          </h1>
          <p className="text-lg text-wrench-navy-600 max-w-3xl mx-auto">
            Comprehensive maintenance analytics with flexible export options: daily, weekly, monthly, yearly, and custom date ranges.
          </p>
        </div>

        {/* Export Controls */}
        <Card className="bg-white border-wrench-navy-200 shadow-lg mb-6 sm:mb-8">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-wrench-navy-800 flex items-center text-lg sm:text-xl">
              <Download className="h-5 sm:h-6 w-5 sm:w-6 mr-2 text-wrench-accent" />
              Professional Export System
            </CardTitle>
            <CardDescription className="text-wrench-navy-600 text-sm sm:text-base">
              Export maintenance data with intelligent frequency-based filtering showing tasks according to their schedule.<br />
              <span className="text-wrench-accent font-medium">Excel Format:</span> Task Name, Machine Name, Frequency, Date, Completed By, Time Taken, Notes, Photos.<br />
              <span className="text-wrench-success font-medium">Smart Display:</span> Weekly tasks appear once per week in weekly reports, daily tasks appear every day, monthly tasks on first of month.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {/* Period Selection */}
              <div className="space-y-2">
                <Label className="text-wrench-navy-700 font-medium text-sm sm:text-base">
                  Report Period
                </Label>
                <Select
                  value={filters.period}
                  onValueChange={(value: ExportDateType) =>
                    setFilters(prev => ({ ...prev, period: value }))
                  }
                >
                  <SelectTrigger className="border-wrench-navy-200 focus:border-wrench-accent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="daily">Daily Report</SelectItem>
                    <SelectItem value="weekly">Weekly Report</SelectItem>
                    <SelectItem value="monthly">Monthly Report</SelectItem>
                    <SelectItem value="yearly">Yearly Report</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Format Selection */}
              <div className="space-y-2">
                <Label className="text-wrench-navy-700 font-medium text-sm sm:text-base">
                  Export Format
                </Label>
                <Select
                  value={filters.format}
                  onValueChange={(value: "csv" | "json") =>
                    setFilters(prev => ({ ...prev, format: value }))
                  }
                >
                  <SelectTrigger className="border-wrench-navy-200 focus:border-wrench-accent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV (Excel Compatible)</SelectItem>
                    <SelectItem value="json">JSON (Advanced Data)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Date Range */}
              {filters.period === "custom" && (
                <>
                  <div className="space-y-2">
                    <Label className="text-wrench-navy-700 font-medium text-sm sm:text-base">
                      Start Date
                    </Label>
                    <Input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) =>
                        setFilters(prev => ({ ...prev, startDate: e.target.value }))
                      }
                      className="border-wrench-navy-200 focus:border-wrench-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-wrench-navy-700 font-medium text-sm sm:text-base">
                      End Date
                    </Label>
                    <Input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) =>
                        setFilters(prev => ({ ...prev, endDate: e.target.value }))
                      }
                      className="border-wrench-navy-200 focus:border-wrench-accent"
                    />
                  </div>
                </>
              )}
              
              {/* Photo Inclusion */}
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label className="text-wrench-navy-700 font-medium text-sm sm:text-base">
                  Include Photos
                </Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    checked={filters.includePhotos}
                    onCheckedChange={(checked) =>
                      setFilters(prev => ({ ...prev, includePhotos: checked }))
                    }
                  />
                  <span className="text-sm text-wrench-navy-600">
                    Export photo data
                  </span>
                </div>
              </div>
            </div>

            {/* Export Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                onClick={handleExportReport}
                className="bg-gradient-to-r from-wrench-accent to-wrench-accent-light hover:from-wrench-accent-light hover:to-wrench-accent text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
              >
                <Download className="h-4 w-4 mr-2" />
                Export {filters.period} Report
              </Button>

              <Button
                onClick={generateReport}
                variant="outline"
                className="border-wrench-navy-300 text-wrench-navy-700 hover:bg-wrench-navy-50 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
                disabled={isGenerating}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Export Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Button
            onClick={() => ExportSystem.exportDaily("csv", filters.includePhotos)}
            variant="outline"
            className="h-12 sm:h-16 border-wrench-navy-200 hover:bg-wrench-navy-50 p-2 sm:p-4"
          >
            <div className="text-center">
              <Calendar className="h-4 sm:h-5 w-4 sm:w-5 mx-auto mb-1 text-wrench-accent" />
              <div className="text-xs sm:text-sm font-medium">Daily</div>
            </div>
          </Button>
          
          <Button
            onClick={() => ExportSystem.exportWeekly("csv", filters.includePhotos)}
            variant="outline"
            className="h-12 sm:h-16 border-wrench-navy-200 hover:bg-wrench-navy-50 p-2 sm:p-4"
          >
            <div className="text-center">
              <BarChart3 className="h-4 sm:h-5 w-4 sm:w-5 mx-auto mb-1 text-wrench-success" />
              <div className="text-xs sm:text-sm font-medium">Weekly</div>
            </div>
          </Button>
          
          <Button
            onClick={() => ExportSystem.exportMonthly("csv", filters.includePhotos)}
            variant="outline"
            className="h-12 sm:h-16 border-wrench-navy-200 hover:bg-wrench-navy-50 p-2 sm:p-4"
          >
            <div className="text-center">
              <Target className="h-4 sm:h-5 w-4 sm:w-5 mx-auto mb-1 text-wrench-warning" />
              <div className="text-xs sm:text-sm font-medium">Monthly</div>
            </div>
          </Button>
          
          <Button
            onClick={() => ExportSystem.exportYearly("csv", filters.includePhotos)}
            variant="outline"
            className="h-12 sm:h-16 border-wrench-navy-200 hover:bg-wrench-navy-50 p-2 sm:p-4"
          >
            <div className="text-center">
              <Award className="h-4 sm:h-5 w-4 sm:w-5 mx-auto mb-1 text-wrench-navy-600" />
              <div className="text-xs sm:text-sm font-medium">Yearly</div>
            </div>
          </Button>
        </div>

        {/* Analytics Dashboard */}
        {reportData && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white border border-wrench-navy-200 p-1">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-wrench-accent data-[state=active]:text-white"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="performance"
                className="data-[state=active]:bg-wrench-accent data-[state=active]:text-white"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Performance
              </TabsTrigger>
              <TabsTrigger
                value="machines"
                className="data-[state=active]:bg-wrench-accent data-[state=active]:text-white"
              >
                <Settings className="h-4 w-4 mr-2" />
                Equipment
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="data-[state=active]:bg-wrench-accent data-[state=active]:text-white"
              >
                <Users className="h-4 w-4 mr-2" />
                Team
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white border-wrench-navy-200 shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-wrench-navy-700">
                        Total Tasks
                      </CardTitle>
                      <DatabaseIcon className="h-4 w-4 text-wrench-accent" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-wrench-navy-800">
                      {reportData.summary.totalTasks}
                    </div>
                    <p className="text-xs text-wrench-navy-500">
                      Active maintenance tasks
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-wrench-navy-200 shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-wrench-navy-700">
                        Completed Today
                      </CardTitle>
                      <CheckCircle className="h-4 w-4 text-wrench-success" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-wrench-success">
                      {reportData.summary.completedToday}
                    </div>
                    <p className="text-xs text-wrench-navy-500">
                      Tasks finished today
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-wrench-navy-200 shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-wrench-navy-700">
                        Overdue
                      </CardTitle>
                      <AlertTriangle className="h-4 w-4 text-wrench-error" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-wrench-error">
                      {reportData.summary.overdueTasks}
                    </div>
                    <p className="text-xs text-wrench-navy-500">
                      Tasks past due date
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-wrench-navy-200 shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-wrench-navy-700">
                        Avg Time
                      </CardTitle>
                      <Clock className="h-4 w-4 text-wrench-warning" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-wrench-navy-800">
                      {reportData.summary.avgCompletionTime}m
                    </div>
                    <p className="text-xs text-wrench-navy-500">
                      Average completion time
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white border-wrench-navy-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-wrench-navy-800">Total Completions</CardTitle>
                    <CardDescription className="text-wrench-navy-600">
                      Overall task completion metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-wrench-accent mb-2">
                      {reportData.totalCompletions}
                    </div>
                    <div className="text-sm text-wrench-navy-600">
                      Total task completions recorded
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-wrench-navy-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-wrench-navy-800">Photo Documentation</CardTitle>
                    <CardDescription className="text-wrench-navy-600">
                      Average photos per completion
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-wrench-success mb-2">
                      {reportData.averagePhotosPerCompletion.toFixed(1)}
                    </div>
                    <div className="text-sm text-wrench-navy-600 flex items-center">
                      <Camera className="h-4 w-4 mr-1" />
                      Photos per task completion
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Equipment Tab */}
            <TabsContent value="machines" className="space-y-6">
              <Card className="bg-white border-wrench-navy-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-wrench-navy-800">Equipment Efficiency</CardTitle>
                  <CardDescription className="text-wrench-navy-600">
                    Maintenance completion rates by equipment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(reportData.machineEfficiency).map(([machineId, efficiency]) => {
                      const machine = machines.find(m => m.id === machineId);
                      return (
                        <div key={machineId} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-wrench-navy-800">
                              {machine?.name || machineId}
                            </p>
                            <p className="text-sm text-wrench-navy-600">{machineId}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Progress value={efficiency as number} className="w-24" />
                            <span className="text-sm font-medium text-wrench-navy-700">
                              {efficiency}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="space-y-6">
              <Card className="bg-white border-wrench-navy-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-wrench-navy-800">Top Performer</CardTitle>
                  <CardDescription className="text-wrench-navy-600">
                    Most active team member
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-gradient-to-br from-wrench-accent to-wrench-navy-700 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {reportData.summary.mostActiveUser.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-wrench-navy-800 text-lg">
                        {reportData.summary.mostActiveUser.name}
                      </h3>
                      <p className="text-wrench-navy-600">
                        {reportData.summary.mostActiveUser.completions} completions
                      </p>
                      <Badge className="bg-wrench-accent text-white mt-1">
                        Top Performer
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Professional Footer */}
        <div className="mt-12 pt-8 border-t border-wrench-navy-200 text-center">
          <WrenchTagline variant="default" size="md" />
        </div>
      </main>
    </div>
  );
}
