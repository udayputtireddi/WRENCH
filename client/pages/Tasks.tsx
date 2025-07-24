import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Filter, Clock, AlertTriangle, CheckCircle2, Activity } from "lucide-react";
import { mockMachines, getTaskStatusColor } from "@/lib/mockData";

export default function Tasks() {
  // Get all tasks from all machines
  const allTasks = mockMachines.flatMap(machine => 
    machine.tasks.map(task => ({
      ...task,
      machineId: machine.id,
      machineName: machine.name,
      machineLocation: machine.location
    }))
  );

  const pendingTasks = allTasks.filter(task => task.status === 'pending');
  const inProgressTasks = allTasks.filter(task => task.status === 'in-progress');
  const overdueTasks = allTasks.filter(task => task.status === 'overdue');
  const completedTasks = allTasks.filter(task => task.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">Active Tasks</h1>
                <p className="text-green-100">Monitor and manage all maintenance tasks</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white border-0">
                <Activity className="h-3 w-3 mr-1" />
                {allTasks.length} Total
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <Card className="mb-8 bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search tasks..." 
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Task Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-600 to-orange-700 border-0 text-white">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">{overdueTasks.length}</div>
              <div className="text-sm text-orange-100">Overdue</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 text-white">
            <CardContent className="p-6 text-center">
              <Activity className="h-8 w-8 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">{inProgressTasks.length}</div>
              <div className="text-sm text-blue-100">In Progress</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-slate-600 to-slate-700 border-0 text-white">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">{pendingTasks.length}</div>
              <div className="text-sm text-slate-100">Pending</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-600 to-green-700 border-0 text-white">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">{completedTasks.length}</div>
              <div className="text-sm text-green-100">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Task Sections */}
        <div className="space-y-8">
          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <h2 className="text-xl font-bold text-white">Overdue Tasks</h2>
                <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                  {overdueTasks.length}
                </Badge>
              </div>
              <div className="grid gap-4">
                {overdueTasks.map((task) => (
                  <Card key={`${task.machineId}-${task.id}`} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 border-l-4 border-l-red-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{task.name}</h3>
                            <Badge className={`${getTaskStatusColor(task.status)} capitalize`}>
                              {task.status.replace('-', ' ')}
                            </Badge>
                          </div>
                          <p className="text-slate-400 mb-2">{task.machineName} - {task.machineLocation}</p>
                          {task.description && <p className="text-slate-300 mb-3">{task.description}</p>}
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>Due: {task.nextDue.toLocaleDateString()}</span>
                            <span>~{task.estimatedTime} min</span>
                            <span className="capitalize">{task.frequency}</span>
                          </div>
                        </div>
                        <Link to={`/machine/${task.machineId}/task/${task.id}?from=tasks`}>
                          <Button className="bg-red-600 hover:bg-red-700">
                            Start Now
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* In Progress Tasks */}
          {inProgressTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-blue-400" />
                <h2 className="text-xl font-bold text-white">In Progress</h2>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  {inProgressTasks.length}
                </Badge>
              </div>
              <div className="grid gap-4">
                {inProgressTasks.map((task) => (
                  <Card key={`${task.machineId}-${task.id}`} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{task.name}</h3>
                            <Badge className={`${getTaskStatusColor(task.status)} capitalize`}>
                              {task.status.replace('-', ' ')}
                            </Badge>
                          </div>
                          <p className="text-slate-400 mb-2">{task.machineName} - {task.machineLocation}</p>
                          {task.description && <p className="text-slate-300 mb-3">{task.description}</p>}
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>Due: {task.nextDue.toLocaleDateString()}</span>
                            <span>~{task.estimatedTime} min</span>
                            <span className="capitalize">{task.frequency}</span>
                          </div>
                          <div className="mt-3">
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${(task.checklist.filter(item => item.completed).length / task.checklist.length) * 100}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              {task.checklist.filter(item => item.completed).length} of {task.checklist.length} items completed
                            </p>
                          </div>
                        </div>
                        <Link to={`/machine/${task.machineId}/task/${task.id}?from=tasks`}>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            Continue
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-slate-400" />
                <h2 className="text-xl font-bold text-white">Pending Tasks</h2>
                <Badge className="bg-slate-500/20 text-slate-300 border-slate-500/30">
                  {pendingTasks.length}
                </Badge>
              </div>
              <div className="grid gap-4">
                {pendingTasks.map((task) => (
                  <Card key={`${task.machineId}-${task.id}`} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{task.name}</h3>
                            <Badge className={`${getTaskStatusColor(task.status)} capitalize`}>
                              {task.status.replace('-', ' ')}
                            </Badge>
                          </div>
                          <p className="text-slate-400 mb-2">{task.machineName} - {task.machineLocation}</p>
                          {task.description && <p className="text-slate-300 mb-3">{task.description}</p>}
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>Due: {task.nextDue.toLocaleDateString()}</span>
                            <span>~{task.estimatedTime} min</span>
                            <span className="capitalize">{task.frequency}</span>
                          </div>
                        </div>
                        <Link to={`/machine/${task.machineId}/task/${task.id}?from=tasks`}>
                          <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600">
                            Start Task
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
