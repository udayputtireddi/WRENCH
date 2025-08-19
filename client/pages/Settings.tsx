import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Database as DatabaseIcon,
  Smartphone,
  Save,
  User,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff,
  Clock,
  Globe,
  Lock,
  Mail,
  Key,
  Zap,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  ProfessionalHeader,
  NavigationBreadcrumbs,
} from "@/components/ProfessionalHeader";
import { WrenchBadge, WrenchTagline } from "@/components/WrenchLogo";
import { useToast } from "@/hooks/use-toast";
import AuthService from "@/lib/auth";

export default function Settings() {
  const { toast } = useToast();
  const currentUser = AuthService.getCurrentUser();

  // Settings states
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "WRENCH Professional Services",
    timezone: "UTC-05:00",
    dateFormat: "MM/DD/YYYY",
    language: "en",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    overdueAlerts: true,
    weeklyReports: false,
    systemMaintenance: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    loginAttempts: "5",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveSettings = (settingType: string) => {
    toast({
      title: "Settings Updated",
      description: `${settingType} settings have been saved successfully.`,
      duration: 3000,
    });
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    setNewPassword("");
    setConfirmPassword("");
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "System Settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-wrench-navy-50 via-white to-wrench-navy-50">
      {/* Professional Header */}
      <ProfessionalHeader
        title="System Settings"
        subtitle="Configure platform preferences and security"
        variant="gradient"
        showBackButton={true}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <NavigationBreadcrumbs items={breadcrumbs} />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-8">
          <WrenchBadge className="mb-4" />
          <h1 className="text-3xl lg:text-4xl font-black text-wrench-navy-900 mb-4">
            Professional Platform
            <br />
            <span className="bg-gradient-to-r from-wrench-accent to-wrench-success bg-clip-text text-transparent">
              Configuration
            </span>
          </h1>
          <p className="text-lg text-wrench-navy-600 max-w-3xl mx-auto">
            Enterprise-grade settings and security configuration for optimal
            system performance.
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white border border-wrench-navy-200 p-1">
            <TabsTrigger
              value="general"
              className="data-[state=active]:bg-wrench-accent data-[state=active]:text-white text-xs sm:text-sm"
            >
              <SettingsIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">General</span>
              <span className="sm:hidden">Gen</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-wrench-accent data-[state=active]:text-white text-xs sm:text-sm"
            >
              <Bell className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Notify</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-wrench-accent data-[state=active]:text-white text-xs sm:text-sm"
            >
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Security</span>
              <span className="sm:hidden">Sec</span>
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="data-[state=active]:bg-wrench-accent data-[state=active]:text-white text-xs sm:text-sm"
            >
              <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Account</span>
              <span className="sm:hidden">Acc</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card className="bg-white border-wrench-navy-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-wrench-navy-800 flex items-center">
                  <Globe className="h-6 w-6 mr-2 text-wrench-accent" />
                  General Configuration
                </CardTitle>
                <CardDescription className="text-wrench-navy-600">
                  Basic system settings and regional preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="companyName"
                      className="text-wrench-navy-700 font-medium"
                    >
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      value={generalSettings.companyName}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          companyName: e.target.value,
                        })
                      }
                      className="border-wrench-navy-200 focus:border-wrench-accent"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="timezone"
                      className="text-wrench-navy-700 font-medium"
                    >
                      Timezone
                    </Label>
                    <Select
                      value={generalSettings.timezone}
                      onValueChange={(value) =>
                        setGeneralSettings({
                          ...generalSettings,
                          timezone: value,
                        })
                      }
                    >
                      <SelectTrigger className="border-wrench-navy-200 focus:border-wrench-accent">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-05:00">
                          Eastern Time (UTC-05:00)
                        </SelectItem>
                        <SelectItem value="UTC-06:00">
                          Central Time (UTC-06:00)
                        </SelectItem>
                        <SelectItem value="UTC-07:00">
                          Mountain Time (UTC-07:00)
                        </SelectItem>
                        <SelectItem value="UTC-08:00">
                          Pacific Time (UTC-08:00)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="dateFormat"
                      className="text-wrench-navy-700 font-medium"
                    >
                      Date Format
                    </Label>
                    <Select
                      value={generalSettings.dateFormat}
                      onValueChange={(value) =>
                        setGeneralSettings({
                          ...generalSettings,
                          dateFormat: value,
                        })
                      }
                    >
                      <SelectTrigger className="border-wrench-navy-200 focus:border-wrench-accent">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="language"
                      className="text-wrench-navy-700 font-medium"
                    >
                      Language
                    </Label>
                    <Select
                      value={generalSettings.language}
                      onValueChange={(value) =>
                        setGeneralSettings({
                          ...generalSettings,
                          language: value,
                        })
                      }
                    >
                      <SelectTrigger className="border-wrench-navy-200 focus:border-wrench-accent">
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

                <Button
                  onClick={() => handleSaveSettings("General")}
                  className="bg-gradient-to-r from-wrench-accent to-wrench-accent-light hover:from-wrench-accent-light hover:to-wrench-accent text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save General Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white border-wrench-navy-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-wrench-navy-800 flex items-center">
                  <Bell className="h-6 w-6 mr-2 text-wrench-accent" />
                  Notification Preferences
                </CardTitle>
                <CardDescription className="text-wrench-navy-600">
                  Configure how and when you receive system notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    key: "emailNotifications",
                    label: "Email Notifications",
                    description: "Receive notifications via email",
                  },
                  {
                    key: "pushNotifications",
                    label: "Push Notifications",
                    description: "Browser and mobile push notifications",
                  },
                  {
                    key: "taskReminders",
                    label: "Task Reminders",
                    description: "Reminders for upcoming tasks",
                  },
                  {
                    key: "overdueAlerts",
                    label: "Overdue Alerts",
                    description: "Alerts for overdue maintenance tasks",
                  },
                  {
                    key: "weeklyReports",
                    label: "Weekly Reports",
                    description: "Automated weekly performance reports",
                  },
                  {
                    key: "systemMaintenance",
                    label: "System Maintenance",
                    description: "Notifications about system updates",
                  },
                ].map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between p-4 bg-wrench-navy-50 rounded-lg border border-wrench-navy-100"
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-wrench-navy-800">
                        {setting.label}
                      </div>
                      <div className="text-sm text-wrench-navy-600">
                        {setting.description}
                      </div>
                    </div>
                    <Switch
                      checked={
                        notificationSettings[
                          setting.key as keyof typeof notificationSettings
                        ]
                      }
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          [setting.key]: checked,
                        }))
                      }
                    />
                  </div>
                ))}

                <Button
                  onClick={() => handleSaveSettings("Notification")}
                  className="bg-gradient-to-r from-wrench-accent to-wrench-accent-light hover:from-wrench-accent-light hover:to-wrench-accent text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-white border-wrench-navy-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-wrench-navy-800 flex items-center">
                  <Shield className="h-6 w-6 mr-2 text-wrench-accent" />
                  Security Configuration
                </CardTitle>
                <CardDescription className="text-wrench-navy-600">
                  Advanced security settings and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-wrench-navy-50 rounded-lg border border-wrench-navy-100">
                      <div>
                        <div className="font-medium text-wrench-navy-800">
                          Two-Factor Authentication
                        </div>
                        <div className="text-sm text-wrench-navy-600">
                          Add extra layer of security
                        </div>
                      </div>
                      <Switch
                        checked={securitySettings.twoFactorAuth}
                        onCheckedChange={(checked) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            twoFactorAuth: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-wrench-navy-700 font-medium">
                        Session Timeout (minutes)
                      </Label>
                      <Select
                        value={securitySettings.sessionTimeout}
                        onValueChange={(value) =>
                          setSecuritySettings({
                            ...securitySettings,
                            sessionTimeout: value,
                          })
                        }
                      >
                        <SelectTrigger className="border-wrench-navy-200 focus:border-wrench-accent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-wrench-navy-700 font-medium">
                        Password Expiry (days)
                      </Label>
                      <Select
                        value={securitySettings.passwordExpiry}
                        onValueChange={(value) =>
                          setSecuritySettings({
                            ...securitySettings,
                            passwordExpiry: value,
                          })
                        }
                      >
                        <SelectTrigger className="border-wrench-navy-200 focus:border-wrench-accent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-wrench-navy-700 font-medium">
                        Max Login Attempts
                      </Label>
                      <Select
                        value={securitySettings.loginAttempts}
                        onValueChange={(value) =>
                          setSecuritySettings({
                            ...securitySettings,
                            loginAttempts: value,
                          })
                        }
                      >
                        <SelectTrigger className="border-wrench-navy-200 focus:border-wrench-accent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 attempts</SelectItem>
                          <SelectItem value="5">5 attempts</SelectItem>
                          <SelectItem value="10">10 attempts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleSaveSettings("Security")}
                  className="bg-gradient-to-r from-wrench-accent to-wrench-accent-light hover:from-wrench-accent-light hover:to-wrench-accent text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card className="bg-white border-wrench-navy-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-wrench-navy-800 flex items-center">
                  <User className="h-6 w-6 mr-2 text-wrench-accent" />
                  Account Management
                </CardTitle>
                <CardDescription className="text-wrench-navy-600">
                  Manage your personal account settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* User Info */}
                <div className="flex items-center space-x-4 p-4 bg-wrench-navy-50 rounded-lg border border-wrench-navy-100">
                  <div className="h-16 w-16 bg-gradient-to-br from-wrench-accent to-wrench-navy-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {currentUser?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-wrench-navy-800 text-lg">
                      {currentUser?.name}
                    </h3>
                    <p className="text-wrench-navy-600">{currentUser?.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-2 py-1 bg-wrench-accent text-white text-xs rounded-full font-medium">
                        {currentUser?.role?.toUpperCase()}
                      </span>
                      <span className="text-sm text-wrench-navy-500">
                        {currentUser?.department}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Password Change */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-wrench-navy-800">
                    Change Password
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="newPassword"
                        className="text-wrench-navy-700 font-medium"
                      >
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="border-wrench-navy-200 focus:border-wrench-accent pr-10"
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-wrench-navy-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-wrench-navy-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-wrench-navy-700 font-medium"
                      >
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border-wrench-navy-200 focus:border-wrench-accent"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handlePasswordChange}
                    disabled={!newPassword || !confirmPassword}
                    className="bg-gradient-to-r from-wrench-accent to-wrench-accent-light hover:from-wrench-accent-light hover:to-wrench-accent text-white"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                </div>

                {/* Danger Zone */}
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-wrench-error">
                    Danger Zone
                  </h3>
                  <div className="p-4 border border-wrench-error/20 bg-wrench-error/5 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-wrench-navy-800">
                          Delete Account
                        </p>
                        <p className="text-sm text-wrench-navy-600">
                          Permanently delete your account and all associated
                          data
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="border-wrench-error text-wrench-error hover:bg-wrench-error hover:text-white"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your account and remove your
                              data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-wrench-error hover:bg-wrench-error/90">
                              Delete Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Professional Footer */}
        <div className="mt-12 pt-8 border-t border-wrench-navy-200 text-center">
          <WrenchTagline variant="default" size="md" />
        </div>
      </main>
    </div>
  );
}
