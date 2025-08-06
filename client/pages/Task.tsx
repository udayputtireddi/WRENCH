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
  Wrench,
  Shield,
  X,
  Image as ImageIcon,
} from "lucide-react";
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
    { id: string; text: string; completed: boolean }[]
  >([]);
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [progressSaved, setProgressSaved] = useState(false);

  const task = taskId ? Database.getTaskById(taskId) : undefined;
  const currentUser = AuthService.getCurrentUser();
  const hasData = Database.getTasks().length > 0;

  useEffect(() => {
    if (task && currentUser) {
      // Load existing progress if any
      const savedProgress = TaskScheduler.getTaskProgress(
        task.id,
        currentUser.id,
      );

      if (savedProgress) {
        setChecklist(savedProgress.checklistItems);
        setNotes(savedProgress.notes || "");
        setPhotos(savedProgress.photos || []);
      } else {
        // Generate checklist based on task type and requirements
        const taskChecklist = [
          { id: "1", text: "Review safety requirements", completed: false },
          { id: "2", text: "Gather required tools", completed: false },
          { id: "3", text: task.description, completed: false },
          { id: "4", text: "Inspect completed work", completed: false },
          { id: "5", text: "Clean work area", completed: false },
        ];

        // Add safety notes as checklist items
        task.safetyNotes.forEach((note, index) => {
          taskChecklist.splice(1, 0, {
            id: `safety-${index}`,
            text: `Safety: ${note}`,
            completed: false,
          });
        });

        setChecklist(taskChecklist);
      }

      setStartTime(new Date());
    }
  }, [task, currentUser]);

  // If no data in system, show empty state
  if (!hasData) {
    return (
      <div className="app-container bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 shadow-2xl">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
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
                  Task Not Available
                </h1>
                <p className="text-purple-100">No task data found</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur-3xl rounded-full"></div>
              <AlertCircle className="h-24 w-24 text-purple-400 mx-auto mb-6" />
              <h2 className="relative text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-6">
                No Task Data Available
              </h2>
            </div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
              Task information will be available once maintenance data is
              uploaded. Contact your administrator to set up tasks.
            </p>
            <Link to="/admin/database">
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 text-lg">
                <Upload className="h-5 w-5 mr-2" />
                Upload Task Data
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // If task not found, show not found message
  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 shadow-2xl">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Task Not Found
                </h1>
                <p className="text-purple-100">Task ID: {taskId}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <AlertCircle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <CardTitle className="text-white text-2xl">
                Task Not Found
              </CardTitle>
              <CardDescription className="text-slate-400">
                The requested task could not be found in the system.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-300 mb-6">
                This task may have been removed or the ID is incorrect.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/tasks">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
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

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  const completedItems = checklist.filter((item) => item.completed).length;
  const progress =
    checklist.length > 0 ? (completedItems / checklist.length) * 100 : 0;
  const isAllChecked = completedItems === checklist.length;

  const handleCompleteTask = () => {
    if (!currentUser || !startTime) return;

    const success = TaskScheduler.completeTask(
      task.id,
      currentUser.id,
      currentUser.name,
      checklist,
      notes,
      photos,
    );

    if (success) {
      setIsCompleted(true);

      // Navigate back after a short delay
      setTimeout(() => {
        // Try to navigate back to the machine page, fallback to tasks
        const machine = Database.getMachineById(task.machineId);
        if (machine) {
          navigate(`/machine/${task.machineId}`);
        } else {
          navigate("/tasks");
        }
      }, 1500);
    }
  };

  const handleSaveProgress = () => {
    if (!currentUser) return;

    const success = TaskScheduler.saveTaskProgress(
      task.id,
      currentUser.id,
      currentUser.name,
      checklist,
      notes,
      photos,
    );

    if (success) {
      setProgressSaved(true);
      // Hide the indicator after 3 seconds
      setTimeout(() => setProgressSaved(false), 3000);
    }
  };

  const handleTakePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhotos((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const taskStatus =
    task.nextDueDate < new Date()
      ? "Overdue"
      : task.lastCompletedDate &&
          task.lastCompletedDate.toDateString() === new Date().toDateString()
        ? "Completed"
        : "Pending";

  const elapsedTime = startTime
    ? Math.floor((new Date().getTime() - startTime.getTime()) / 60000)
    : 0;

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 max-w-md mx-auto">
          <CardHeader className="text-center">
            <CheckCircle2 className="h-20 w-20 text-green-400 mx-auto mb-4" />
            <CardTitle className="text-white text-2xl">
              Task Completed!
            </CardTitle>
            <CardDescription className="text-slate-400">
              Great job! The task has been marked as complete.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-300 mb-4">
              Time spent: {elapsedTime} minutes
            </p>
            <p className="text-slate-300 mb-6">
              Next due:{" "}
              {TaskScheduler.calculateNextDueDate(
                task.frequency,
                new Date(),
                task.weeklyDay,
              ).toLocaleDateString()}
            </p>
            <Button
              onClick={() => {
                const machine = Database.getMachineById(task.machineId);
                if (machine) {
                  navigate(`/machine/${task.machineId}`);
                } else {
                  navigate("/tasks");
                }
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 shadow-2xl">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
            <Link to="/tasks" className="self-start">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 px-2 sm:px-3"
              >
                <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back to Tasks</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white break-words">
                {task.taskName}
              </h1>
              <p className="text-purple-100 text-sm sm:text-base">
                {task.machineName} • {task.frequency} {task.category}
              </p>
            </div>
            <div className="self-start sm:self-auto">
              <Badge className={getTaskStatusColor(taskStatus)}>
                {taskStatus}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Task Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Information */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Task Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white mb-2">Description</h3>
                  <p className="text-slate-300">{task.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Task Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-slate-300">
                        <Clock className="h-4 w-4 mr-2" />
                        Estimated: {task.estimatedTimeMinutes} minutes
                      </div>
                      <div className="flex items-center text-slate-300">
                        <Calendar className="h-4 w-4 mr-2" />
                        Due: {task.nextDueDate.toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-slate-300">
                        <Wrench className="h-4 w-4 mr-2" />
                        Frequency: {task.frequency}
                      </div>
                    </div>
                  </div>

                  {task.requiredTools.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-white mb-2">
                        Required Tools
                      </h4>
                      <ul className="text-sm text-slate-300 space-y-1">
                        {task.requiredTools.map((tool, index) => (
                          <li key={index}>• {tool}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {task.safetyNotes.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-white mb-2 flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-yellow-400" />
                      Safety Notes
                    </h4>
                    <ul className="text-sm text-yellow-100 space-y-1">
                      {task.safetyNotes.map((note, index) => (
                        <li key={index} className="flex items-start">
                          <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-yellow-400 flex-shrink-0" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Task Checklist */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Task Checklist</CardTitle>
                  <div className="text-sm text-slate-300">
                    {completedItems} of {checklist.length} completed
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                {checklist.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={item.id}
                        checked={item.completed}
                        onCheckedChange={() => toggleChecklistItem(item.id)}
                        className="mt-1"
                      />
                      <label
                        htmlFor={item.id}
                        className={`text-sm font-medium leading-6 cursor-pointer flex-1 ${
                          item.completed
                            ? "line-through text-slate-400"
                            : "text-white"
                        }`}
                      >
                        {item.text}
                      </label>
                    </div>
                    {index < checklist.length - 1 && (
                      <Separator className="mt-4 bg-slate-700/50" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Photos */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Photos</CardTitle>
                <CardDescription className="text-slate-400">
                  Attach photos to document your work
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={handleTakePhoto}
                    variant="outline"
                    className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {photos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Task photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-slate-600"
                          />
                          <Button
                            onClick={() => removePhoto(index)}
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Completion Notes */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Completion Notes</CardTitle>
                <CardDescription className="text-slate-400">
                  Add any observations or notes about this task
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-slate-300">
                    Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any observations, issues, or notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Sidebar */}
          <div className="space-y-6">
            {/* Progress Summary */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {Math.round(progress)}%
                  </div>
                  <Progress value={progress} className="h-3" />
                  <p className="text-sm text-slate-400 mt-2">
                    {completedItems} of {checklist.length} steps completed
                  </p>
                </div>

                <Separator className="bg-slate-700/50" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Started:</span>
                    <span className="text-white">
                      {startTime?.toLocaleTimeString() || "Not started"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Elapsed:</span>
                    <span className="text-white">{elapsedTime} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Estimated:</span>
                    <span className="text-white">
                      {task.estimatedTimeMinutes} minutes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Photos:</span>
                    <span className="text-white">{photos.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleCompleteTask}
                  disabled={!isAllChecked}
                  className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Complete Task
                </Button>

                <Button
                  onClick={handleSaveProgress}
                  variant="outline"
                  className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Progress
                </Button>

                {progressSaved && (
                  <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                    <div className="text-center">
                      <CheckCircle2 className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                      <p className="text-sm text-blue-300 font-medium">
                        Progress Saved
                      </p>
                      <p className="text-xs text-blue-200">
                        {completedItems}/{checklist.length} items completed •
                        Not finished
                      </p>
                    </div>
                  </div>
                )}

                {!isAllChecked && !progressSaved && (
                  <p className="text-xs text-slate-400 text-center">
                    Complete all checklist items to finish the task
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
