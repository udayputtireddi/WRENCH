import { useSession } from "@/lib/session";
import { Link, useNavigate } from "react-router-dom";
import useNavigation from "@/hooks/use-navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  User,
  LogOut,
  Settings,
  Shield,
  BarChart3,
  Bell,
  Search,
  Menu,
  ChevronDown,
  Activity,
  Users,
  Zap,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { WrenchLogo, WrenchBadge } from "@/components/WrenchLogo";
import AuthService from "@/lib/auth";
import Database from "@/lib/database";

interface ProfessionalHeaderProps {
  title?: string;
  subtitle?: string;
  showStats?: boolean;
  variant?: "default" | "dark" | "gradient";
  showBackButton?: boolean;
}

export function ProfessionalHeader({
  title,
  subtitle,
  showStats = false,
  variant = "gradient",
  showBackButton = false,
}: ProfessionalHeaderProps) {
  const navigate = useNavigate();
  const { goBack, canGoBack } = useNavigation();
  useSession();
  const currentUser = AuthService.getCurrentUser();
  const analytics = Database.getAnalytics();

  const handleLogout = () => {
    void AuthService.logout();
    navigate("/login");
  };

  const headerClasses = {
    default: "bg-white border-b border-wrench-navy-200 shadow-sm",
    dark: "bg-wrench-navy-900 border-b border-wrench-navy-700",
    gradient:
      "bg-gradient-to-r from-wrench-navy-800 via-wrench-navy-700 to-wrench-navy-800 shadow-xl",
  };

  const textClasses = {
    default: "text-wrench-navy-800",
    dark: "text-white",
    gradient: "text-white",
  };

  const subtextClasses = {
    default: "text-wrench-navy-600",
    dark: "text-white/80",
    gradient: "text-white/90",
  };

  return (
    <header className={`relative ${headerClasses[variant]}`}>
      {/* Background Effects for Gradient Variant */}
      {variant === "gradient" && (
        <>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute top-4 left-4 text-wrench-navy-300 opacity-20">
            <Settings
              className="h-6 w-6 animate-spin"
              style={{ animationDuration: "20s" }}
            />
          </div>
          <div className="absolute bottom-4 right-4 text-wrench-navy-300 opacity-20">
            <Activity className="h-5 w-5" />
          </div>
        </>
      )}

      <div className="container mx-auto px-4 py-4 relative z-10">
        <div className="grid grid-cols-3 items-center">
          {/* Left Side - Logo and Navigation */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Back Button */}
            {showBackButton && canGoBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className={`${variant !== "default" ? "text-white hover:bg-white/10" : "text-wrench-navy-700 hover:bg-wrench-navy-50"} p-2`}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}

            <Link to="/" className="hover-lift">
              <WrenchLogo
                size="md"
                variant={variant === "default" ? "default" : "dark"}
                showText={true}
              />
            </Link>
          </div>

          {/* Center - Page Title */}
          {title && (
            <div className="text-center">
              <h1
                className={`text-xl lg:text-2xl xl:text-3xl font-bold ${textClasses[variant]}`}
              >
                {title}
              </h1>
              {subtitle && (
                <p className={`text-sm ${subtextClasses[variant]}`}>
                  {subtitle}
                </p>
              )}
            </div>
          )}


          {/* Right Side - User Menu */}
          <div className="flex items-center space-x-4 justify-end">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className={`relative ${variant !== "default" ? "text-white hover:bg-white/10" : "text-wrench-navy-700 hover:bg-wrench-navy-50"}`}
            >
              <Bell className="h-5 w-5" />
              {analytics.overdueTasks > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-wrench-error text-white text-xs">
                  {analytics.overdueTasks}
                </Badge>
              )}
            </Button>

            {/* Quick Search */}
            <Button
              variant="ghost"
              size="sm"
              className={`hidden sm:flex ${variant !== "default" ? "text-white hover:bg-white/10" : "text-wrench-navy-700 hover:bg-wrench-navy-50"}`}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center space-x-2 hover-lift ${variant !== "default" ? "text-white hover:bg-white/10" : "text-wrench-navy-700 hover:bg-wrench-navy-50"}`}
                >
                  <div className="h-8 w-8 bg-gradient-to-br from-wrench-accent to-wrench-navy-700 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{currentUser?.name}</p>
                    <p className="text-xs opacity-70 capitalize">
                      {currentUser?.role}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 bg-white border-wrench-navy-200 shadow-lg"
              >
                <div className="px-3 py-2 border-b border-wrench-navy-100">
                  <p className="font-medium text-wrench-navy-800">
                    {currentUser?.name}
                  </p>
                  <p className="text-sm text-wrench-navy-600 capitalize">
                    {currentUser?.role} • {currentUser?.department}
                  </p>
                </div>

                {/* Settings for all users */}
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>

                {/* Admin-only features */}
                {currentUser?.role === "admin" && (
                  <>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link to="/analytics" className="cursor-pointer">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics Dashboard
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/reports" className="cursor-pointer">
                        <FileText className="h-4 w-4 mr-2" />
                        Professional Reports
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <Shield className="h-4 w-4 mr-2" />
                        Administration
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-wrench-error cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="sm"
              className={`md:hidden ${variant !== "default" ? "text-white hover:bg-white/10" : "text-wrench-navy-700 hover:bg-wrench-navy-50"}`}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Title */}
        {title && (
          <div className="md:hidden mt-4 pb-2 text-center">
            <h1 className={`text-lg sm:text-xl font-bold ${textClasses[variant]}`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`text-sm ${subtextClasses[variant]}`}>{subtitle}</p>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

// Navigation Breadcrumbs Component
export function NavigationBreadcrumbs({
  items,
  variant = "default",
}: {
  items: { label: string; href?: string }[];
  variant?: "default" | "dark";
}) {
  const textClasses =
    variant === "dark" ? "text-white/80" : "text-wrench-navy-600";
  const linkClasses =
    variant === "dark"
      ? "text-white hover:text-white/80"
      : "text-wrench-accent hover:text-wrench-accent/80";

  return (
    <nav className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {item.href ? (
            <Link to={item.href} className={`${linkClasses} hover:underline`}>
              {item.label}
            </Link>
          ) : (
            <span
              className={
                index === items.length - 1 ? "font-medium" : textClasses
              }
            >
              {item.label}
            </span>
          )}
          {index < items.length - 1 && <span className={textClasses}>/</span>}
        </div>
      ))}
    </nav>
  );
}

