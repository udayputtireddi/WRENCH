import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Shield, 
  Users, 
  Settings, 
  Database, 
  Activity, 
  Plus, 
  Edit, 
  Trash2, 
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react";
import { mockMachines } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { toast } = useToast();
  const [newMachine, setNewMachine] = useState({
    id: '',
    name: '',
    type: '',
    location: ''
  });

  const handleAddMachine = () => {
    if (newMachine.id && newMachine.name && newMachine.type && newMachine.location) {
      toast({
        title: "Machine Added",
        description: `${newMachine.name} has been added to the system.`,
        duration: 3000,
      });
      setNewMachine({ id: '', name: '', type: '', location: '' });
    }
  };

  const allTasks = mockMachines.flatMap(machine => 
    machine.tasks.map(task => ({
      ...task,
      machineId: machine.id,
      machineName: machine.name
    }))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-800 shadow-2xl">
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
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-purple-100">System management and configuration</p>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-0 px-3 py-1">
              <Shield className="h-3 w-3 mr-1" />
              Administrator
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 text-white">
            <CardContent className="p-6 text-center">
              <Database className="h-8 w-8 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">{mockMachines.length}</div>
              <div className="text-sm text-blue-100">Total Machines</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-600 to-green-700 border-0 text-white">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">{allTasks.filter(t => t.status === 'completed').length}</div>
              <div className="text-sm text-green-100">Completed Tasks</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-600 to-orange-700 border-0 text-white">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">{allTasks.filter(t => t.status === 'overdue').length}</div>
              <div className="text-sm text-orange-100">Overdue Tasks</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0 text-white">
            <CardContent className="p-6 text-center">
              <Activity className="h-8 w-8 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">{allTasks.filter(t => t.status === 'in-progress').length}</div>
              <div className="text-sm text-purple-100">Active Tasks</div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="machines" className="space-y-8">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="machines" className="data-[state=active]:bg-slate-600">
              <Database className="h-4 w-4 mr-2" />
              Machines
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-slate-600">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-slate-600">
              <Settings className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-slate-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Machines Tab */}
          <TabsContent value="machines" className="space-y-6">
            {/* Add New Machine */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Machine
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Register a new machine in the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="machineId" className="text-slate-300">Machine ID</Label>
                    <Input
                      id="machineId"
                      placeholder="e.g., CAR-002"
                      value={newMachine.id}
                      onChange={(e) => setNewMachine(prev => ({...prev, id: e.target.value}))}
                      className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="machineName" className="text-slate-300">Machine Name</Label>
                    <Input
                      id="machineName"
                      placeholder="e.g., Assembly Line Car B"
                      value={newMachine.name}
                      onChange={(e) => setNewMachine(prev => ({...prev, name: e.target.value}))}
                      className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="machineType" className="text-slate-300">Type</Label>
                    <Input
                      id="machineType"
                      placeholder="e.g., Automotive Assembly"
                      value={newMachine.type}
                      onChange={(e) => setNewMachine(prev => ({...prev, type: e.target.value}))}
                      className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="machineLocation" className="text-slate-300">Location</Label>
                    <Input
                      id="machineLocation"
                      placeholder="e.g., Factory Floor - Section B"
                      value={newMachine.location}
                      onChange={(e) => setNewMachine(prev => ({...prev, location: e.target.value}))}
                      className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <Button onClick={handleAddMachine} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Machine
                </Button>
              </CardContent>
            </Card>

            {/* Existing Machines */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Registered Machines</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage existing machines and their configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMachines.map((machine) => (
                    <div key={machine.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-semibold">{machine.name}</h3>
                          <Badge className={`${
                            machine.status === 'active' ? 'bg-green-500/20 text-green-300' :
                            machine.status === 'maintenance' ? 'bg-orange-500/20 text-orange-300' :
                            'bg-red-500/20 text-red-300'
                          } border-0 capitalize`}>
                            {machine.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-slate-400">
                          <span>ID: {machine.id}</span>
                          <span>Type: {machine.type}</span>
                          <span>Location: {machine.location}</span>
                          <span>Tasks: {machine.tasks.length}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="bg-slate-600/50 border-slate-500 text-white hover:bg-slate-500">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="bg-red-600/20 border-red-500/50 text-red-300 hover:bg-red-600/30">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'John Smith', email: 'john@company.com', role: 'Administrator', status: 'Active' },
                    { name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Supervisor', status: 'Active' },
                    { name: 'Mike Wilson', email: 'mike@company.com', role: 'Technician', status: 'Active' },
                    { name: 'Lisa Brown', email: 'lisa@company.com', role: 'Technician', status: 'Inactive' },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-white font-medium">{user.name}</h3>
                          <Badge className={`${
                            user.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                          } border-0`}>
                            {user.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>{user.email}</span>
                          <span>Role: {user.role}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="bg-slate-600/50 border-slate-500 text-white hover:bg-slate-500">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="bg-red-600/20 border-red-500/50 text-red-300 hover:bg-red-600/30">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New User
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    <Database className="h-4 w-4 mr-2" />
                    Backup Database
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Database</span>
                    <Badge className="bg-green-500/20 text-green-300 border-0">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">QR Scanner Service</span>
                    <Badge className="bg-green-500/20 text-green-300 border-0">Running</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Notification Service</span>
                    <Badge className="bg-green-500/20 text-green-300 border-0">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Last Backup</span>
                    <span className="text-slate-400 text-sm">2 hours ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  System Reports
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Generate and download system reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 h-20 flex-col">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    Task Performance Report
                  </Button>
                  <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 h-20 flex-col">
                    <Clock className="h-6 w-6 mb-2" />
                    Maintenance Schedule Report
                  </Button>
                  <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 h-20 flex-col">
                    <Activity className="h-6 w-6 mb-2" />
                    Machine Efficiency Report
                  </Button>
                  <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 h-20 flex-col">
                    <AlertTriangle className="h-6 w-6 mb-2" />
                    Issues & Alerts Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
