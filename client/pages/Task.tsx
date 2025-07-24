import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, Calendar, CheckCircle2, AlertCircle, Camera, Save } from "lucide-react";
import { getTask, updateChecklistItem, getTaskStatusColor } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

export default function Task() {
  const { machineId, taskId } = useParams<{ machineId: string; taskId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [task, setTask] = useState(() =>
    machineId && taskId ? getTask(machineId, taskId) : undefined
  );

  // Determine the back path based on referrer
  const backPath = searchParams.get('from') === 'tasks' ? '/tasks' : `/machine/${machineId}`;
  const backLabel = searchParams.get('from') === 'tasks' ? 'Back to Tasks' : 'Back to Machine';

  if (!task || !machineId || !taskId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-red-700">Task Not Found</CardTitle>
            <CardDescription>
              The requested task could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to={backPath}>
              <Button className="w-full">{backLabel}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedItems = task.checklist.filter(item => item.completed).length;
  const totalItems = task.checklist.length;
  const requiredItems = task.checklist.filter(item => item.required);
  const completedRequired = requiredItems.filter(item => item.completed).length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  const canCompleteTask = completedRequired === requiredItems.length;

  const handleChecklistChange = (itemId: string, checked: boolean) => {
    updateChecklistItem(machineId, taskId, itemId, checked);
    
    // Update local state to trigger re-render
    const updatedTask = getTask(machineId, taskId);
    if (updatedTask) {
      setTask({ ...updatedTask });
      
      toast({
        title: checked ? "Item completed" : "Item unchecked",
        description: `Checklist item ${checked ? 'marked as complete' : 'unmarked'}`,
        duration: 2000,
      });
    }
  };

  const handleCompleteTask = () => {
    if (canCompleteTask) {
      toast({
        title: "Task Completed!",
        description: `${task.name} has been successfully completed.`,
        duration: 3000,
      });
      
      // Navigate back to previous page after a short delay
      setTimeout(() => {
        navigate(backPath);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link to={backPath} className="mr-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backLabel}
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{task.name}</h1>
            <p className="text-slate-300">Machine: {machineId}</p>
          </div>
          <Badge className={`${getTaskStatusColor(task.status)} capitalize`}>
            {task.status.replace('-', ' ')}
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Task Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Task Overview</CardTitle>
            {task.description && (
              <CardDescription className="text-base">{task.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="font-semibold text-slate-800">Estimated Time</p>
                  <p className="text-slate-600">~{task.estimatedTime} minutes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="font-semibold text-slate-800">Due Date</p>
                  <p className="text-slate-600">{task.nextDue.toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="font-semibold text-slate-800">Frequency</p>
                  <p className="text-slate-600 capitalize">{task.frequency}</p>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">
                  Progress: {completedItems} of {totalItems} items completed
                </span>
                <span className="text-sm text-slate-500">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              
              <div className="flex justify-between text-xs text-slate-500">
                <span>Required items: {completedRequired}/{requiredItems.length}</span>
                <span>Optional items: {completedItems - completedRequired}/{totalItems - requiredItems.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Task Checklist
            </CardTitle>
            <CardDescription>
              Complete all required items to finish this task. Optional items help ensure thorough maintenance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {task.checklist.map((item, index) => (
                <div key={item.id}>
                  <div className="flex items-start gap-4 p-4 rounded-lg border bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                    <Checkbox
                      id={item.id}
                      checked={item.completed}
                      onCheckedChange={(checked) => 
                        handleChecklistChange(item.id, checked as boolean)
                      }
                      className="mt-1"
                    />
                    
                    <div className="flex-1">
                      <label 
                        htmlFor={item.id}
                        className={`cursor-pointer block ${
                          item.completed 
                            ? 'text-slate-500 line-through' 
                            : 'text-slate-800'
                        }`}
                      >
                        <span className="font-medium">
                          Step {index + 1}: {item.text}
                        </span>
                        {item.required && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            Required
                          </Badge>
                        )}
                        {!item.required && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Optional
                          </Badge>
                        )}
                      </label>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-slate-600 hover:text-slate-800"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {index < task.checklist.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate(backPath)}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Progress
              </Button>
              
              <Button
                className={`flex-1 ${
                  canCompleteTask 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-slate-400 cursor-not-allowed'
                }`}
                disabled={!canCompleteTask}
                onClick={handleCompleteTask}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {canCompleteTask ? 'Complete Task' : `Complete ${requiredItems.length - completedRequired} more required items`}
              </Button>
            </div>
            
            {!canCompleteTask && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">
                    Complete all required items to finish this task
                  </span>
                </div>
                <p className="text-amber-700 text-sm mt-1">
                  {requiredItems.length - completedRequired} required item(s) remaining
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
