import { useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
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

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
                Advanced system settings and data management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-300">Automatic Backup</Label>
                  <p className="text-sm text-slate-400">
                    Daily backup of all task data
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
                    Data Retention (days)
                  </Label>
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
                    Default Task Duration (minutes)
                  </Label>
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
              <Button
                variant="outline"
                className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
              >
                Change Password
              </Button>
              <Button
                variant="outline"
                className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
              >
                Enable Two-Factor Authentication
              </Button>
              <Button
                variant="outline"
                className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
              >
                View Security Log
              </Button>
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
