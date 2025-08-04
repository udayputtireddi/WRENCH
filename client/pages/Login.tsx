import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Shield, Eye } from 'lucide-react';
import AuthService, { UserRole } from '@/lib/auth';
import { downloadTrumpfExcelFile } from '@/lib/trumpfExcelData';

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleLogin = (role: UserRole) => {
    AuthService.quickLogin(role);
    navigate('/');
  };

  const handleDownloadExcel = () => {
    downloadTrumpfExcelFile();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-white mb-4 tracking-wider">
            Check<span className="text-green-400">Mate</span>
          </h1>
          <p className="text-slate-300 text-xl">Smart Maintenance Management System</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
          {/* User Login */}
          <Card 
            className={`cursor-pointer transition-all duration-300 border-2 hover:scale-105 ${
              selectedRole === 'user' 
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-400' 
                : 'bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50'
            }`}
            onClick={() => setSelectedRole('user')}
          >
            <CardHeader className="text-center">
              <User className={`h-12 w-12 mx-auto mb-4 ${selectedRole === 'user' ? 'text-white' : 'text-blue-400'}`} />
              <CardTitle className={selectedRole === 'user' ? 'text-white' : 'text-white'}>
                Machine Operator
              </CardTitle>
              <CardDescription className={selectedRole === 'user' ? 'text-blue-100' : 'text-slate-400'}>
                Access to QR scanning and task completion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className={`text-sm space-y-2 ${selectedRole === 'user' ? 'text-blue-100' : 'text-slate-300'}`}>
                <li>• Scan machine QR codes</li>
                <li>• View assigned tasks</li>
                <li>• Complete checklists</li>
                <li>• Track progress</li>
              </ul>
              <Button 
                onClick={() => handleRoleLogin('user')}
                className="w-full mt-4 bg-white text-blue-700 hover:bg-blue-50"
              >
                Login as Operator
              </Button>
            </CardContent>
          </Card>

          {/* Supervisor Login */}
          <Card 
            className={`cursor-pointer transition-all duration-300 border-2 hover:scale-105 ${
              selectedRole === 'supervisor' 
                ? 'bg-gradient-to-br from-green-600 to-green-700 border-green-400' 
                : 'bg-slate-800/50 border-slate-700/50 hover:border-green-500/50'
            }`}
            onClick={() => setSelectedRole('supervisor')}
          >
            <CardHeader className="text-center">
              <Eye className={`h-12 w-12 mx-auto mb-4 ${selectedRole === 'supervisor' ? 'text-white' : 'text-green-400'}`} />
              <CardTitle className={selectedRole === 'supervisor' ? 'text-white' : 'text-white'}>
                Supervisor
              </CardTitle>
              <CardDescription className={selectedRole === 'supervisor' ? 'text-green-100' : 'text-slate-400'}>
                Full access with analytics and reporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className={`text-sm space-y-2 ${selectedRole === 'supervisor' ? 'text-green-100' : 'text-slate-300'}`}>
                <li>• All operator features</li>
                <li>• View analytics</li>
                <li>• Manage settings</li>
                <li>• Generate reports</li>
              </ul>
              <Button 
                onClick={() => handleRoleLogin('supervisor')}
                className="w-full mt-4 bg-white text-green-700 hover:bg-green-50"
              >
                Login as Supervisor
              </Button>
            </CardContent>
          </Card>

          {/* Admin Login */}
          <Card 
            className={`cursor-pointer transition-all duration-300 border-2 hover:scale-105 ${
              selectedRole === 'admin' 
                ? 'bg-gradient-to-br from-purple-600 to-purple-700 border-purple-400' 
                : 'bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50'
            }`}
            onClick={() => setSelectedRole('admin')}
          >
            <CardHeader className="text-center">
              <Shield className={`h-12 w-12 mx-auto mb-4 ${selectedRole === 'admin' ? 'text-white' : 'text-purple-400'}`} />
              <CardTitle className={selectedRole === 'admin' ? 'text-white' : 'text-white'}>
                Administrator
              </CardTitle>
              <CardDescription className={selectedRole === 'admin' ? 'text-purple-100' : 'text-slate-400'}>
                Complete system access and management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className={`text-sm space-y-2 ${selectedRole === 'admin' ? 'text-purple-100' : 'text-slate-300'}`}>
                <li>• All supervisor features</li>
                <li>• System administration</li>
                <li>• User management</li>
                <li>• Database control</li>
              </ul>
              <Button 
                onClick={() => handleRoleLogin('admin')}
                className="w-full mt-4 bg-white text-purple-700 hover:bg-purple-50"
              >
                Login as Admin
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Download Excel Demo Data */}
        <div className="text-center">
          <Card className="bg-slate-800/50 border-slate-700/50 max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-white">Test Excel Data</CardTitle>
              <CardDescription className="text-slate-400">
                Download the Trumpf 5000 Punch maintenance spreadsheet to test Excel import
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleDownloadExcel}
                variant="outline"
                className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
              >
                Download Trumpf 5000 Excel File
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
