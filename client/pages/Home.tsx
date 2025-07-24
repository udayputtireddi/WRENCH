import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Settings, BarChart3, CheckSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Machine Task Checklist</h1>
          <p className="text-slate-300 mt-2">Industrial Maintenance Management System</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Streamline Your Machine Maintenance
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Replace manual spreadsheets with our digital solution. Scan QR codes, track tasks, 
            and manage maintenance checklists in real-time.
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-blue-50 border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <QrCode className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-blue-800">Scan Machine</CardTitle>
              <CardDescription>
                Use QR code scanner to identify machines instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/scan">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Start Scanning
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <CheckSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-green-800">Active Tasks</CardTitle>
              <CardDescription>
                View and manage ongoing maintenance tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-50">
                View Tasks
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <BarChart3 className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle className="text-orange-800">Analytics</CardTitle>
              <CardDescription>
                Track maintenance performance and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-orange-600 text-orange-700 hover:bg-orange-50">
                View Reports
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Settings className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-purple-800">Settings</CardTitle>
              <CardDescription>
                Configure machines, tasks, and schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-purple-600 text-purple-700 hover:bg-purple-50">
                Manage System
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Key Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <QrCode className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">QR Code Integration</h4>
              <p className="text-slate-600">
                Instantly identify machines by scanning QR codes attached to equipment
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <CheckSquare className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">Task Management</h4>
              <p className="text-slate-600">
                Structured task lists with customizable checklists and completion tracking
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">Real-time Updates</h4>
              <p className="text-slate-600">
                Instant synchronization across devices with live status updates
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white mt-16">
        <div className="container mx-auto px-4 py-6 text-center">
          <p>&copy; 2024 Machine Task Checklist. Streamlining industrial maintenance.</p>
        </div>
      </footer>
    </div>
  );
}
