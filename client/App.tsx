import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import UserHome from "./pages/UserHome";
import Login from "./pages/Login";
import Scanner from "./pages/Scanner";
import Machine from "./pages/Machine";
import Task from "./pages/Task";
import Tasks from "./pages/Tasks";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import AdminDatabase from "./pages/AdminDatabase";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import RoleBasedRoute from "./components/RoleBasedRoute";
import ScrollToTop from "./components/ScrollToTop";
import AuthService from "./lib/auth";

const queryClient = new QueryClient();

// Route component that checks authentication and redirects based on role
const HomeRoute = () => {
  const currentUser = AuthService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Users get simplified dashboard, admins get full dashboard
  if (currentUser.role === "user") {
    return <UserHome />;
  } else {
    return <Home />;
  }
};

const App = () => {
  // Handle mobile viewport height for consistent full-screen experience
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    // Set initial value
    setVH();

    // Update on resize (handles mobile address bar show/hide)
    window.addEventListener("resize", setVH);
    window.addEventListener("orientationchange", setVH);

    return () => {
      window.removeEventListener("resize", setVH);
      window.removeEventListener("orientationchange", setVH);
    };
  }, []);

  // Gentle overscroll prevention for mobile
  useEffect(() => {
    // Only prevent pull-to-refresh, allow normal interactions
    let startY = 0;
    const preventPullToRefresh = (e: TouchEvent) => {
      // Don't interfere with form elements and interactive elements
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "BUTTON" ||
        target.tagName === "SELECT"
      ) {
        return;
      }

      if (e.type === "touchstart") {
        startY = e.touches[0].clientY;
      } else if (e.type === "touchmove") {
        const scrollY = window.scrollY || window.pageYOffset;
        const deltaY = e.touches[0].clientY - startY;

        // Only prevent pull-to-refresh when at the very top of page
        if (scrollY === 0 && deltaY > 10) {
          e.preventDefault();
        }
      }
    };

    // Use passive listeners for better performance, only prevent specific cases
    document.addEventListener("touchstart", preventPullToRefresh, {
      passive: false,
    });
    document.addEventListener("touchmove", preventPullToRefresh, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchstart", preventPullToRefresh);
      document.removeEventListener("touchmove", preventPullToRefresh);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<HomeRoute />} />
            <Route path="/scan" element={<Scanner />} />
            <Route path="/machine/:machineId" element={<Machine />} />
            <Route path="/machine/:machineId/task/:taskId" element={<Task />} />
            <Route path="/tasks" element={<Tasks />} />

            {/* Admin only routes */}
            <Route
              path="/analytics"
              element={
                <RoleBasedRoute
                  allowedRoles={["admin"]}
                  fallback={<Navigate to="/" />}
                >
                  <Analytics />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <RoleBasedRoute
                  allowedRoles={["admin"]}
                  fallback={<Navigate to="/" />}
                >
                  <Settings />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <RoleBasedRoute
                  allowedRoles={["admin"]}
                  fallback={<Navigate to="/" />}
                >
                  <Reports />
                </RoleBasedRoute>
              }
            />

            {/* Admin only routes */}
            <Route
              path="/admin"
              element={
                <RoleBasedRoute
                  allowedRoles={["admin"]}
                  fallback={<Navigate to="/" />}
                >
                  <Admin />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/admin/database"
              element={
                <RoleBasedRoute
                  allowedRoles={["admin"]}
                  fallback={<Navigate to="/" />}
                >
                  <AdminDatabase />
                </RoleBasedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Ensure root is only created once
const container = document.getElementById("root");
if (container && !container.hasAttribute("data-root-created")) {
  container.setAttribute("data-root-created", "true");
  createRoot(container).render(<App />);
}
