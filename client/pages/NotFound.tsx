import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Wrench, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="app-container bg-gradient-to-br from-wrench-navy-50 via-white to-wrench-navy-50 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-wrench-accent/20 to-wrench-navy-700/20 blur-3xl rounded-full"></div>
          <div className="relative flex items-center justify-center mb-6">
            <AlertTriangle className="h-24 w-24 text-wrench-warning mr-6" />
            <h1 className="text-7xl sm:text-8xl font-black text-wrench-navy-800">
              404
            </h1>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Wrench className="h-8 w-8 text-wrench-accent" />
            <h2 className="text-2xl sm:text-3xl font-bold text-wrench-navy-800">
              Page Not Found
            </h2>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-wrench-accent to-wrench-navy-700 mx-auto rounded-full mb-4"></div>
        </div>
        
        <p className="text-wrench-navy-600 text-lg mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Our maintenance system is operational and ready to help.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="bg-gradient-to-r from-wrench-navy-800 to-wrench-navy-700 hover:from-wrench-navy-900 hover:to-wrench-navy-800 text-white hover-lift shadow-lg">
              <Home className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="border-wrench-navy-300 text-wrench-navy-700 hover:bg-wrench-navy-50 hover-lift"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* WRENCH tagline */}
        <div className="mt-12 pt-8 border-t border-wrench-navy-200">
          <p className="text-wrench-navy-600 text-sm font-medium">
            We Repair Everything Now – Checklists Help
          </p>
          <p className="text-wrench-navy-400 text-xs mt-1 italic">
            Because missed maintenance costs money.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
