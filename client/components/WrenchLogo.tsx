import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface WrenchLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "dark" | "light" | "gradient";
  showText?: boolean;
  className?: string;
}

export function WrenchLogo({ 
  size = "md", 
  variant = "default", 
  showText = true,
  className 
}: WrenchLogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl", 
    xl: "text-5xl"
  };

  const iconColorClasses = {
    default: "text-wrench-navy-800",
    dark: "text-white",
    light: "text-wrench-navy-600", 
    gradient: "text-white"
  };

  const textColorClasses = {
    default: "text-wrench-navy-800",
    dark: "text-white",
    light: "text-wrench-navy-700",
    gradient: "text-white"
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {/* Custom WRENCH Icon */}
      <div className={cn(
        "relative flex items-center justify-center rounded-full",
        variant === "gradient" && "bg-gradient-to-br from-wrench-accent to-wrench-navy-700 p-2"
      )}>
        <Wrench className={cn(
          sizeClasses[size],
          iconColorClasses[variant],
          "transition-transform duration-300 hover:rotate-12"
        )} />
        
        {/* Subtle glow effect for premium feel */}
        {variant === "gradient" && (
          <div className="absolute inset-0 bg-gradient-to-br from-wrench-accent/20 to-wrench-navy-700/20 rounded-full blur-md"></div>
        )}
      </div>

      {/* WRENCH Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            "font-black tracking-wider leading-none",
            textSizeClasses[size],
            textColorClasses[variant]
          )}>
            WRENCH
          </span>
          
          {size !== "sm" && (
            <span className={cn(
              "text-xs font-medium tracking-wide leading-none mt-1",
              variant === "dark" || variant === "gradient" 
                ? "text-white/80" 
                : "text-wrench-navy-500"
            )}>
              PROFESSIONAL SERVICES
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Company tagline component
export function WrenchTagline({ 
  variant = "default",
  size = "md",
  className 
}: {
  variant?: "default" | "dark" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const textColorClasses = {
    default: "text-wrench-navy-600",
    dark: "text-white/90",
    light: "text-wrench-navy-500"
  };

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm", 
    lg: "text-base"
  };

  return (
    <div className={cn("text-center space-y-1", className)}>
      <p className={cn(
        "font-semibold tracking-wide",
        sizeClasses[size],
        textColorClasses[variant]
      )}>
        We Repair Everything Now – Checklists Help
      </p>
      <div className="h-0.5 w-16 bg-gradient-to-r from-wrench-accent to-wrench-success mx-auto rounded-full"></div>
      <p className={cn(
        "italic font-light opacity-80",
        size === "sm" ? "text-xs" : "text-xs",
        textColorClasses[variant]
      )}>
        Because missed maintenance costs money.
      </p>
    </div>
  );
}

// Professional badge component for headers
export function WrenchBadge({ className }: { className?: string }) {
  return (
    <div className={cn(
      "inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-wrench-navy-800 to-wrench-navy-700 rounded-full shadow-lg",
      className
    )}>
      <Wrench className="h-4 w-4 text-white" />
      <span className="text-white text-sm font-semibold tracking-wide">
        PROFESSIONAL MAINTENANCE
      </span>
    </div>
  );
}
