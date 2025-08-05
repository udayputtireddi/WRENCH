import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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

// Ensure root is only created once
const container = document.getElementById("root");
if (container && !container.hasAttribute("data-root-created")) {
  container.setAttribute("data-root-created", "true");
  createRoot(container).render(<App />);
}
