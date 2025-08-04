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

        <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto mb-8">
          {/* Operator Login */}
          <Card
            className={`cursor-pointer transition-all duration-300 border-2 hover:scale-105 ${
              selectedRole === 'user'
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-400'
                : 'bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50'
            }`}
            onClick={() => setSelectedRole('user')}
          >
            <CardHeader className="text-center">
              <User className={`h-16 w-16 mx-auto mb-6 ${selectedRole === 'user' ? 'text-white' : 'text-blue-400'}`} />
              <CardTitle className={`text-2xl ${selectedRole === 'user' ? 'text-white' : 'text-white'}`}>
                Operator
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => handleRoleLogin('user')}
                className="w-full py-6 text-lg bg-white text-blue-700 hover:bg-blue-50"
              >
                Login as Operator
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
              <Shield className={`h-16 w-16 mx-auto mb-6 ${selectedRole === 'admin' ? 'text-white' : 'text-purple-400'}`} />
              <CardTitle className={`text-2xl ${selectedRole === 'admin' ? 'text-white' : 'text-white'}`}>
                Administrator
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => handleRoleLogin('admin')}
                className="w-full py-6 text-lg bg-white text-purple-700 hover:bg-purple-50"
              >
                Login as Admin
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Download Excel Template */}
        <div className="text-center">
          <Card className="bg-slate-800/50 border-slate-700/50 max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-white">Excel Template</CardTitle>
              <CardDescription className="text-slate-400">
                Download the maintenance spreadsheet template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleDownloadExcel}
                variant="outline"
                className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
              >
                Download Excel Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
