import { useState, useEffect, useRef } from "react";
import {
  useParams,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Camera,
  Save,
  Upload,
  Shield,
  X,
  Image as ImageIcon,
  User,
  MapPin,
  Settings,
  FileText,
  Timer,
  Play,
  Pause,
  Square,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
} from "lucide-react";
import {
  ProfessionalHeader,
  NavigationBreadcrumbs,
} from "@/components/ProfessionalHeader";
import { WrenchBadge, WrenchTagline } from "@/components/WrenchLogo";
import { getTaskStatusColor } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import Database, { TaskScheduler } from "@/lib/database";
import AuthService from "@/lib/auth";

export default function Task() {
  const { machineId, taskId } = useParams<{
    machineId: string;
    taskId: string;
  }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [checklist, setChecklist] = useState<
    { id: string; text: string; completed: boolean; timestamp?: Date }[]
  >([]);
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progressSaved, setProgressSaved] = useState(false);
  const [actualTimeSpent, setActualTimeSpent] = useState<number | null>(null);

  const task = taskId ? Database.getTaskById(taskId) : undefined;
  const machine = machineId ? Database.getMachineById(machineId) : undefined;
  const currentUser = AuthService.getCurrentUser();
  const hasData = Database.getTasks().length > 0;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, startTime]);

  useEffect(() => {
    if (task && currentUser) {
      // Load existing progress if any
      const savedProgress = TaskScheduler.getTaskProgress(
        task.id,
        currentUser.id,
      );

      if (savedProgress) {
        setChecklist(savedProgress.checklistItems || []);
        setNotes(savedProgress.notes || "");
        setPhotos(savedProgress.photos || []);
        setProgressSaved(true);
      } else {
        // Generate professional checklist based on task type
        const taskChecklist = [
          {
            id: "1",
            text: "Review safety protocols and requirements",
            completed: false,
          },
          {
            id: "2",
            text: "Gather and inspect required tools/equipment",
            completed: false,
          },
          {
            id: "3",
            text: "Verify machine is in safe shutdown state",
            completed: false,
          },
          { id: "4", text: task.description, completed: false },
          {
            id: "5",
            text: "Perform quality inspection of completed work",
            completed: false,
          },
          {
            id: "6",
            text: "Update maintenance logs and documentation",
            completed: false,
          },
          { id: "7", text: "Clean and organize work area", completed: false },
          {
            id: "8",
            text: "Return tools to designated storage",
            completed: false,
          },
        ];

        // Add safety-specific items
        if (task.safetyNotes?.length > 0) {
          task.safetyNotes.forEach((note, index) => {
            taskChecklist.splice(2, 0, {
              id: `safety-${index}`,
              text: `SAFETY: ${note}`,
              completed: false,
            });
          });
        }

        setChecklist(taskChecklist);
      }
    }
  }, [task, currentUser]);

  const handleStartTimer = () => {
    const now = new Date();
    setStartTime(now);
    setIsTimerRunning(true);
    setElapsedTime(0);

    toast({
      title: "Task Timer Started",
      description: "Time tracking has begun for this maintenance task.",
    });
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(!isTimerRunning);

    toast({
      title: isTimerRunning ? "Timer Paused" : "Timer Resumed",
      description: `Task timer has been ${isTimerRunning ? "paused" : "resumed"}.`,
    });
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
    setEndTime(new Date());
    setActualTimeSpent(Math.floor(elapsedTime / 60)); // Convert to minutes

    toast({
      title: "Timer Stopped",
      description: `Total time: ${Math.floor(elapsedTime / 60)} minutes`,
    });
  };

  const handleChecklistChange = (id: string, completed: boolean) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              completed,
              timestamp: completed ? new Date() : undefined,
            }
          : item,
      ),
    );
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setPhotos((prev) => [...prev, result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const saveProgress = () => {
    if (!task || !currentUser) return;

    const success = TaskScheduler.saveTaskProgress(
      task.id,
      currentUser.id,
      currentUser.name,
      checklist,
      notes,
      photos
    );

    if (success) {
      setProgressSaved(true);
      toast({
        title: "Progress Saved",
        description: "Task progress has been saved successfully.",
      });
      setTimeout(() => setProgressSaved(false), 2000);
    } else {
      toast({
        title: "Save Failed",
        description: "Unable to save progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const completeTask = () => {
    if (!task || !currentUser) return;

    const timeSpent = actualTimeSpent || Math.floor(elapsedTime / 60);

    const success = TaskScheduler.completeTask(
      task.id,
      currentUser.id,
      currentUser.name,
      checklist,
      notes,
      photos,
      new Date(),
      timeSpent
    );

    if (success) {
      setIsCompleted(true);
      setEndTime(new Date());

      toast({
        title: "Task Completed Successfully",
        description: `Maintenance task completed in ${timeSpent} minutes. Data saved to comprehensive tracking system.`,
      });

      // Navigate back after a short delay
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } else {
      toast({
        title: "Completion Failed",
        description: "Unable to complete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const completionPercentage =
    checklist.length > 0
      ? Math.round(
          (checklist.filter((item) => item.completed).length /
            checklist.length) *
            100,
        )
      : 0;

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Tasks", href: "/tasks" },
    { label: machine?.name || "Machine", href: `/machine/${machineId}` },
    { label: task?.taskName || "Task" },
  ];

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wrench-navy-50 via-white to-wrench-navy-50">
        <ProfessionalHeader
          title="Task Not Found"
          subtitle="No maintenance data available"
          variant="gradient"
        />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <AlertCircle className="h-24 w-24 text-wrench-warning mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-wrench-navy-800 mb-6">
              No Task Data Available
            </h2>
            <p className="text-xl text-wrench-navy-600 max-w-2xl mx-auto leading-relaxed mb-8">
              Task information will be available once maintenance data is
              uploaded.
            </p>
            <Link to="/admin/database">
              <Button className="bg-gradient-to-r from-wrench-navy-800 to-wrench-navy-700 hover:from-wrench-navy-900 hover:to-wrench-navy-800 text-white px-8 py-4 text-lg">
                <Upload className="h-5 w-5 mr-2" />
                Upload Task Data
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!task || !machine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wrench-navy-50 via-white to-wrench-navy-50">
        <ProfessionalHeader
          title="Task Not Found"
          subtitle="The specified task could not be found"
          variant="gradient"
        />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <AlertTriangle className="h-24 w-24 text-wrench-error mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-wrench-navy-800 mb-6">
              Task Not Found
            </h2>
            <p className="text-xl text-wrench-navy-600 max-w-2xl mx-auto leading-relaxed mb-8">
              The task with ID "{taskId}" was not found in the system.
            </p>
            <Link to="/tasks">
              <Button className="bg-gradient-to-r from-wrench-accent to-wrench-accent-light hover:from-wrench-accent-light hover:to-wrench-accent text-white px-8 py-4 text-lg">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Return to Tasks
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wrench-navy-50 via-white to-wrench-navy-50">
      {/* Professional Header */}
      <ProfessionalHeader
        title={task.taskName}
        subtitle={`${machine.name} • Professional maintenance task execution`}
        variant="gradient"
      />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <NavigationBreadcrumbs items={breadcrumbs} />
        </div>

        {/* Task Status Banner */}
        <Card className="bg-gradient-to-r from-wrench-navy-900 to-wrench-navy-800 text-white border-0 shadow-xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gradient-to-br from-wrench-accent to-wrench-success rounded-full flex items-center justify-center">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {task.taskName}
                  </h2>
                  <p className="text-white/80">{task.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span className="flex items-center">
                      <Settings className="h-4 w-4 mr-1" />
                      {machine.name}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {machine.location}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Due: {task.nextDueDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center lg:text-right">
                <div className="text-3xl font-bold mb-1">
                  {completionPercentage}%
                </div>
                <p className="text-white/80 mb-2">Complete</p>
                <Progress value={completionPercentage} className="w-32 h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Task Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timer Card */}
            <Card className="bg-white border-wrench-navy-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-wrench-navy-800 flex items-center">
                  <Timer className="h-6 w-6 mr-2 text-wrench-accent" />
                  Professional Time Tracking
                </CardTitle>
                <CardDescription className="text-wrench-navy-600">
                  Track actual time spent on this maintenance task
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-wrench-navy-800 mb-1">
                      {formatTime(elapsedTime)}
                    </div>
                    <p className="text-sm text-wrench-navy-600">
                      {isTimerRunning ? "Active Time" : "Elapsed Time"}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!startTime ? (
                      <Button
                        onClick={handleStartTimer}
                        className="bg-gradient-to-r from-wrench-success to-wrench-success/80 hover:from-wrench-success/90 hover:to-wrench-success text-white"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Task
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={handlePauseTimer}
                          variant="outline"
                          className="border-wrench-warning text-wrench-warning hover:bg-wrench-warning hover:text-white"
                        >
                          {isTimerRunning ? (
                            <Pause className="h-4 w-4 mr-2" />
                          ) : (
                            <Play className="h-4 w-4 mr-2" />
                          )}
                          {isTimerRunning ? "Pause" : "Resume"}
                        </Button>

                        <Button
                          onClick={handleStopTimer}
                          variant="outline"
                          className="border-wrench-error text-wrench-error hover:bg-wrench-error hover:text-white"
                        >
                          <Square className="h-4 w-4 mr-2" />
                          Stop
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {actualTimeSpent && (
                  <div className="p-3 bg-wrench-success/10 rounded-lg border border-wrench-success/20">
                    <p className="text-sm text-wrench-navy-700">
                      <span className="font-medium">Total Time:</span>{" "}
                      {actualTimeSpent} minutes
                      {task.estimatedTimeMinutes && (
                        <span className="ml-2 text-wrench-navy-500">
                          (Est: {task.estimatedTimeMinutes} min)
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Task Checklist */}
            <Card className="bg-white border-wrench-navy-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-wrench-navy-800 flex items-center">
                  <CheckCircle2 className="h-6 w-6 mr-2 text-wrench-accent" />
                  Professional Task Checklist
                </CardTitle>
                <CardDescription className="text-wrench-navy-600">
                  Complete each step to ensure professional maintenance
                  standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {checklist.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors ${
                        item.completed
                          ? "bg-wrench-success/10 border-wrench-success/20"
                          : "bg-wrench-navy-50 border-wrench-navy-200 hover:bg-wrench-navy-100"
                      }`}
                    >
                      <Checkbox
                        id={item.id}
                        checked={item.completed}
                        onCheckedChange={(checked) =>
                          handleChecklistChange(item.id, checked as boolean)
                        }
                        className="mt-1"
                        disabled={isCompleted}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={item.id}
                          className={`text-sm font-medium cursor-pointer ${
                            item.completed
                              ? "text-wrench-success line-through"
                              : "text-wrench-navy-800"
                          }`}
                        >
                          {index + 1}. {item.text}
                        </label>
                        {item.completed && item.timestamp && (
                          <p className="text-xs text-wrench-navy-500 mt-1">
                            Completed at {item.timestamp.toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes Section */}
            <Card className="bg-white border-wrench-navy-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-wrench-navy-800 flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-wrench-accent" />
                  Task Notes & Observations
                </CardTitle>
                <CardDescription className="text-wrench-navy-600">
                  Document findings, issues, or recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter detailed notes about the maintenance task, any issues encountered, parts replaced, or recommendations for future maintenance..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-32 border-wrench-navy-200 focus:border-wrench-accent"
                  disabled={isCompleted}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Task Info */}
            <Card className="bg-white border-wrench-navy-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-wrench-navy-800 text-lg">
                  Task Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-wrench-navy-700 font-medium">
                    Priority
                  </Label>
                  <Badge className="ml-2 bg-wrench-warning text-white">
                    {task.category === "safety" ? "Critical" : "High"}
                  </Badge>
                </div>

                <div>
                  <Label className="text-wrench-navy-700 font-medium">
                    Frequency
                  </Label>
                  <p className="text-wrench-navy-800 font-medium">
                    {task.frequency}
                  </p>
                </div>

                <div>
                  <Label className="text-wrench-navy-700 font-medium">
                    Estimated Time
                  </Label>
                  <p className="text-wrench-navy-800 font-medium">
                    {task.estimatedTimeMinutes || 30} minutes
                  </p>
                </div>

                <div>
                  <Label className="text-wrench-navy-700 font-medium">
                    Assigned To
                  </Label>
                  <p className="text-wrench-navy-800 font-medium">
                    {currentUser?.name || "Current User"}
                  </p>
                </div>

                {task.safetyNotes && task.safetyNotes.length > 0 && (
                  <div>
                    <Label className="text-wrench-navy-700 font-medium">
                      Safety Requirements
                    </Label>
                    <div className="mt-2 space-y-2">
                      {task.safetyNotes.map((note, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-2 p-2 bg-wrench-error/10 rounded border border-wrench-error/20"
                        >
                          <Shield className="h-4 w-4 text-wrench-error mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-wrench-navy-700">{note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Photo Upload */}
            <Card className="bg-white border-wrench-navy-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-wrench-navy-800 text-lg flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-wrench-accent" />
                  Documentation Photos
                </CardTitle>
                <CardDescription className="text-wrench-navy-600">
                  Upload photos of completed work
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                    disabled={isCompleted}
                  />

                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full border-wrench-accent text-wrench-accent hover:bg-wrench-accent hover:text-white"
                    disabled={isCompleted}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Add Photos
                  </Button>

                  {photos.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Task photo ${index + 1}`}
                            className="w-full h-20 object-cover rounded border border-wrench-navy-200"
                          />
                          {!isCompleted && (
                            <Button
                              onClick={() => removePhoto(index)}
                              variant="outline"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-white border-wrench-navy-200 shadow-lg">
              <CardContent className="p-6 space-y-4">
                {!isCompleted ? (
                  <>
                    <Button
                      onClick={saveProgress}
                      variant="outline"
                      className="w-full border-wrench-accent text-wrench-accent hover:bg-wrench-accent hover:text-white"
                      disabled={progressSaved}
                    >
                      {progressSaved ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Progress Saved
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Progress
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={completeTask}
                      className="w-full bg-gradient-to-r from-wrench-success to-wrench-success/80 hover:from-wrench-success/90 hover:to-wrench-success text-white"
                      disabled={completionPercentage < 100}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Complete Task
                    </Button>

                    {completionPercentage < 100 && (
                      <p className="text-xs text-wrench-navy-500 text-center">
                        Complete all checklist items to finish the task
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-center p-4 bg-wrench-success/10 rounded-lg border border-wrench-success/20">
                    <CheckCircle className="h-12 w-12 text-wrench-success mx-auto mb-2" />
                    <p className="font-semibold text-wrench-success">
                      Task Completed
                    </p>
                    <p className="text-sm text-wrench-navy-600">
                      Completed by {currentUser?.name}
                    </p>
                    {endTime && (
                      <p className="text-xs text-wrench-navy-500">
                        {endTime.toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                <Button
                  asChild
                  variant="outline"
                  className="w-full border-wrench-navy-300 text-wrench-navy-700 hover:bg-wrench-navy-50"
                >
                  <Link
                    to={
                      searchParams.get("from") === "scan" ? "/scan" : "/tasks"
                    }
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Tasks
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
