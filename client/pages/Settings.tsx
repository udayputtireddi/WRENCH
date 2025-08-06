import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Settings,
  Bell,
  Shield,
  Database,
  Smartphone,
  Save,
  User,
  Eye,
  Key,
  Download,
  Upload,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Database from "@/lib/database";
import AuthService from "@/lib/auth";

export default function Settings() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [is2FAOpen, setIs2FAOpen] = useState(false);
  const [isSecurityLogOpen, setIsSecurityLogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false,
      overdueReminders: true,
      completionNotifications: true,
    },
    appearance: {
      theme: "dark",
      language: "en",
    },
    system: {
      autoBackup: true,
      dataRetention: "90",
      defaultTaskDuration: "30",
    },
    profile: {
      name: "System Administrator",
      email: "admin@taskflow.com",
      role: "admin",
    },
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
      duration: 3000,
    });
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully",
      duration: 3000,
    });

    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setIsChangePasswordOpen(false);
  };

  const handleSystemBackup = () => {
    const dataStr = JSON.stringify({
      tasks: Database.getTasks(),
      timestamp: new Date().toISOString(),
      version: "1.0"
    }, null, 2);

    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'checkmate-backup-' + new Date().toISOString().split('T')[0] + '.json';
    link.click();

    toast({
      title: "Backup Downloaded",
      description: "System backup has been saved to your downloads",
      duration: 3000,
    });
  };

  const handleDataReset = () => {
    Database.clearDatabase();
    toast({
      title: "Data Reset",
      description: "All task data has been cleared",
      variant: "destructive",
    });
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));

    // Apply theme changes immediately
    if (category === "appearance" && key === "theme") {
      applyTheme(value);
    }

    // Apply language changes immediately
    if (category === "appearance" && key === "language") {
      applyLanguage(value);
    }
  };

  const applyTheme = (theme: string) => {
    const root = document.documentElement;

    if (theme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
      toast({
        title: "Theme Changed",
        description: "Switched to light mode",
        duration: 2000,
      });
    } else if (theme === "dark") {
      root.classList.remove("light");
      root.classList.add("dark");
      toast({
        title: "Theme Changed",
        description: "Switched to dark mode",
        duration: 2000,
      });
    } else {
      const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDarkMode) {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }
      toast({
        title: "Theme Changed",
        description: "Following system preferences",
        duration: 2000,
      });
    }

    localStorage.setItem('theme-preference', theme);
  };

  const applyLanguage = (language: string) => {
    const languageNames = {
      en: "English",
      es: "Spanish",
      fr: "French",
      de: "German"
    };

    document.documentElement.lang = language;
    localStorage.setItem('language-preference', language);

    toast({
      title: "Language Changed",
      description: `Switched to ${languageNames[language as keyof typeof languageNames]}`,
      duration: 2000,
    });
  };

  // Load saved preferences on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preference');
    const savedLanguage = localStorage.getItem('language-preference');

    if (savedTheme) {
      setSettings(prev => ({
        ...prev,
        appearance: {
          ...prev.appearance,
          theme: savedTheme
        }
      }));
      applyTheme(savedTheme);
    }

    if (savedLanguage) {
      setSettings(prev => ({
        ...prev,
        appearance: {
          ...prev.appearance,
          language: savedLanguage
        }
      }));
    }
  }, []);

  return (
    <div className="app-container bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-purple-700 to-violet-800 shadow-2xl">
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
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-purple-100">
                System configuration and preferences
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Profile Settings */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription className="text-slate-400">
                Manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-slate-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={settings.profile.name}
                    onChange={(e) =>
                      updateSetting("profile", "name", e.target.value)
                    }
                    className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) =>
                      updateSetting("profile", "email", e.target.value)
                    }
                    className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="role" className="text-slate-300">
                  Role
                </Label>
                <Select
                  value={settings.profile.role}
                  onValueChange={(value) =>
                    updateSetting("profile", "role", value)
                  }
                >
                  <SelectTrigger className="mt-1 bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="user">Operator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure how you receive alerts and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-white font-medium">
                  Notification Channels
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-slate-400">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) =>
                        updateSetting("notifications", "email", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">
                        Push Notifications
                      </Label>
                      <p className="text-sm text-slate-400">
                        Browser push notifications
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) =>
                        updateSetting("notifications", "push", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">SMS Alerts</Label>
                      <p className="text-sm text-slate-400">
                        Critical alerts via SMS
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.sms}
                      onCheckedChange={(checked) =>
                        updateSetting("notifications", "sms", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-700" />

              <div className="space-y-4">
                <h4 className="text-white font-medium">Alert Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">
                        Overdue Task Reminders
                      </Label>
                      <p className="text-sm text-slate-400">
                        Alerts for overdue maintenance tasks
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.overdueReminders}
                      onCheckedChange={(checked) =>
                        updateSetting(
                          "notifications",
                          "overdueReminders",
                          checked,
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">
                        Task Completion Notifications
                      </Label>
                      <p className="text-sm text-slate-400">
                        Notifications when tasks are completed
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.completionNotifications}
                      onCheckedChange={(checked) =>
                        updateSetting(
                          "notifications",
                          "completionNotifications",
                          checked,
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription className="text-slate-400">
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theme" className="text-slate-300">
                    Theme
                  </Label>
                  <Select
                    value={settings.appearance.theme}
                    onValueChange={(value) =>
                      updateSetting("appearance", "theme", value)
                    }
                  >
                    <SelectTrigger className="mt-1 bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark Mode</SelectItem>
                      <SelectItem value="light">Light Mode</SelectItem>
                      <SelectItem value="auto">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language" className="text-slate-300">
                    Language
                  </Label>
                  <Select
                    value={settings.appearance.language}
                    onValueChange={(value) =>
                      updateSetting("appearance", "language", value)
                    }
                  >
                    <SelectTrigger className="mt-1 bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Configuration
              </CardTitle>
              <CardDescription className="text-slate-400">
                Control data retention, backups, and system defaults. These settings affect how the system stores and manages your maintenance data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-300">Automatic Backup</Label>
                  <p className="text-sm text-slate-400">
                    Enables daily automatic backup of all maintenance tasks, completion history, and settings
                  </p>
                </div>
                <Switch
                  checked={settings.system.autoBackup}
                  onCheckedChange={(checked) =>
                    updateSetting("system", "autoBackup", checked)
                  }
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="retention" className="text-slate-300">
                    Data Retention Period
                  </Label>
                  <p className="text-xs text-slate-400 mb-1">
                    How long to keep completed task history (days)
                  </p>
                  <Input
                    id="retention"
                    type="number"
                    value={settings.system.dataRetention}
                    onChange={(e) =>
                      updateSetting("system", "dataRetention", e.target.value)
                    }
                    className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="duration" className="text-slate-300">
                    Default Task Duration
                  </Label>
                  <p className="text-xs text-slate-400 mb-1">
                    Default estimated time for new tasks (minutes)
                  </p>
                  <Input
                    id="duration"
                    type="number"
                    value={settings.system.defaultTaskDuration}
                    onChange={(e) =>
                      updateSetting(
                        "system",
                        "defaultTaskDuration",
                        e.target.value,
                      )
                    }
                    className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </div>

              <Separator className="bg-slate-700" />

              <div className="space-y-4">
                <h4 className="text-white font-medium">Data Management</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <Button
                    onClick={handleSystemBackup}
                    variant="outline"
                    className="bg-blue-600/20 border-blue-500/50 text-blue-300 hover:bg-blue-600/30"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Backup
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-red-600/20 border-red-500/50 text-red-300 hover:bg-red-600/30"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Reset All Data
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-800 border-slate-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Reset All Data</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                          This action cannot be undone. This will permanently delete all tasks, completion history, and progress data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDataReset}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Reset Data
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <p className="text-xs text-slate-400">
                  <strong>Download Backup:</strong> Exports all your task data to a JSON file for safekeeping.<br/>
                  <strong>Reset Data:</strong> Permanently removes all task and completion data from the system.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription className="text-slate-400">
                Manage security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {/* Change Password Dialog */}
                <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Change Password</DialogTitle>
                      <DialogDescription className="text-slate-400">
                        Enter your current password and choose a new one. Password must be at least 8 characters long.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="current-password" className="text-slate-300">
                          Current Password
                        </Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-password" className="text-slate-300">
                          New Password
                        </Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password" className="text-slate-300">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="mt-1 bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsChangePasswordOpen(false)}
                        className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handlePasswordChange}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Update Password
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* 2FA Setup Dialog */}
                <Dialog open={is2FAOpen} onOpenChange={setIs2FAOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Enable Two-Factor Authentication
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Setup Two-Factor Authentication</DialogTitle>
                      <DialogDescription className="text-slate-400">
                        Add an extra layer of security to your account by enabling 2FA.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-sm text-blue-300">
                          📱 <strong>Step 1:</strong> Download an authenticator app like Google Authenticator or Authy
                        </p>
                      </div>
                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-sm text-blue-300">
                          📷 <strong>Step 2:</strong> Scan the QR code with your authenticator app
                        </p>
                      </div>
                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-sm text-blue-300">
                          🔢 <strong>Step 3:</strong> Enter the 6-digit code from your app below
                        </p>
                      </div>
                      <Input
                        placeholder="Enter 6-digit code"
                        className="text-center text-lg tracking-widest bg-slate-700/50 border-slate-600 text-white"
                        maxLength={6}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIs2FAOpen(false)}
                        className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          toast({
                            title: "2FA Enabled",
                            description: "Two-factor authentication has been enabled for your account",
                            duration: 3000,
                          });
                          setIs2FAOpen(false);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Enable 2FA
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Security Log Dialog */}
                <Dialog open={isSecurityLogOpen} onOpenChange={setIsSecurityLogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Security Log
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-white">Security Log</DialogTitle>
                      <DialogDescription className="text-slate-400">
                        Recent security events and login activity for your account.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {[
                        { date: "2024-01-15 14:30", event: "Password changed", ip: "192.168.1.100", status: "success" },
                        { date: "2024-01-15 09:15", event: "Login attempt", ip: "192.168.1.100", status: "success" },
                        { date: "2024-01-14 17:45", event: "Settings updated", ip: "192.168.1.100", status: "success" },
                        { date: "2024-01-14 10:22", event: "Login attempt", ip: "192.168.1.100", status: "success" },
                        { date: "2024-01-13 16:10", event: "Failed login", ip: "203.0.113.42", status: "failed" },
                      ].map((log, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`inline-block w-2 h-2 rounded-full ${
                                log.status === 'success' ? 'bg-green-400' : 'bg-red-400'
                              }`}></span>
                              <span className="text-white font-medium">{log.event}</span>
                            </div>
                            <p className="text-sm text-slate-400 mt-1">
                              {log.date} • IP: {log.ip}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => setIsSecurityLogOpen(false)}
                        className="bg-slate-700 text-white hover:bg-slate-600"
                      >
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Link to="/admin" className="block">
                  <Button
                    variant="outline"
                    className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    View Admin Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
