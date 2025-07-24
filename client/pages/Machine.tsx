import { useParams, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Settings,
} from "lucide-react";
import {
  getMachine,
  getTaskStatusColor,
  getMachineStatusColor,
} from "@/lib/mockData";

export default function Machine() {
  const { machineId } = useParams<{ machineId: string }>();
  const [searchParams] = useSearchParams();
  const machine = machineId ? getMachine(machineId) : undefined;

  // Determine the back path based on referrer
  const backPath = searchParams.get('from') === 'scan' ? '/scan' : '/';
  const backLabel = searchParams.get('from') === 'scan' ? 'Back to Scanner' : 'Back to Home';

  if (!machine) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-red-700">Machine Not Found</CardTitle>
            <CardDescription>
              The machine ID "{machineId}" was not found in the system.
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

  const overdueTasks = machine.tasks.filter(
    (task) => task.status === "overdue",
  ).length;
  const inProgressTasks = machine.tasks.filter(
    (task) => task.status === "in-progress",
  ).length;
  const completedTasks = machine.tasks.filter(
    (task) => task.status === "completed",
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link to={backPath} className="mr-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backLabel}
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{machine.name}</h1>
            <p className="text-slate-300">{machine.type}</p>
          </div>
          <Badge
            className={`${getMachineStatusColor(machine.status)} capitalize`}
          >
            {machine.status}
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Machine Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Machine Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-slate-500 mt-1" />
                <div>
                  <p className="font-semibold text-slate-800">Location</p>
                  <p className="text-slate-600">{machine.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-slate-500 mt-1" />
                <div>
                  <p className="font-semibold text-slate-800">
                    Last Maintenance
                  </p>
                  <p className="text-slate-600">
                    {machine.lastMaintenance
                      ? machine.lastMaintenance.toLocaleDateString()
                      : "No records"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-slate-500 mt-1" />
                <div>
                  <p className="font-semibold text-slate-800">Task Status</p>
                  <p className="text-slate-600">
                    {completedTasks} completed, {inProgressTasks} in progress
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">
                {machine.tasks.length}
              </div>
              <div className="text-sm text-blue-600">Total Tasks</div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-700">
                {inProgressTasks}
              </div>
              <div className="text-sm text-orange-600">In Progress</div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-700">
                {overdueTasks}
              </div>
              <div className="text-sm text-red-600">Overdue</div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-700">
                {completedTasks}
              </div>
              <div className="text-sm text-green-600">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Maintenance Tasks
          </h2>

          {machine.tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">
                        {task.name}
                      </h3>
                      <Badge
                        className={`${getTaskStatusColor(task.status)} capitalize`}
                      >
                        {task.status.replace("-", " ")}
                      </Badge>
                      {task.status === "overdue" && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>

                    {task.description && (
                      <p className="text-slate-600 mb-3">{task.description}</p>
                    )}

                    <div className="flex items-center gap-6 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>~{task.estimatedTime} min</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {task.nextDue.toLocaleDateString()}</span>
                      </div>

                      <div className="capitalize">
                        Frequency: {task.frequency}
                      </div>

                      {task.lastCompleted && (
                        <div>
                          Last: {task.lastCompleted.toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>
                          {
                            task.checklist.filter((item) => item.completed)
                              .length
                          }{" "}
                          of {task.checklist.length} items completed
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(task.checklist.filter((item) => item.completed).length / task.checklist.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6">
                    <Link to={`/machine/${machine.id}/task/${task.id}`}>
                      <Button
                        className={`${
                          task.status === "overdue"
                            ? "bg-red-600 hover:bg-red-700"
                            : task.status === "in-progress"
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-slate-600 hover:bg-slate-700"
                        }`}
                      >
                        {task.status === "completed" ? "Review" : "Start Task"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
