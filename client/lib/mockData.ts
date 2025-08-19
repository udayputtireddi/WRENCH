// Empty state data for CheckMate - Production Ready
// All data starts empty until populated via Excel imports

export interface Task {
  id: string;
  name: string;
  description: string;
  machine: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Pending" | "In Progress" | "Completed" | "Overdue";
  dueDate: Date;
  nextDue: Date;
  lastCompleted: Date;
  estimatedTime: number;
  assignedTo: string;
  category: "Preventive" | "Corrective" | "Inspection";
  frequency: "Daily" | "Weekly" | "Monthly" | "Quarterly";
  safetyNotes?: string[];
  requiredTools?: string[];
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  location: string;
  status: "Operational" | "Maintenance" | "Offline" | "Warning";
  lastMaintenance: Date | null;
  nextMaintenance: Date | null;
  tasks: Task[];
  efficiency: number;
  uptime: number;
}

// Empty initial state - will be populated when admin uploads data
export const mockMachines: Machine[] = [];

// Utility functions for when data exists
export const getTaskStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "text-green-600 bg-green-100";
    case "pending":
      return "text-yellow-600 bg-yellow-100";
    case "overdue":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const getMachineStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "operational":
      return "text-green-600 bg-green-100";
    case "warning":
      return "text-yellow-600 bg-yellow-100";
    case "maintenance":
      return "text-blue-600 bg-blue-100";
    case "offline":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "Critical":
      return "text-red-600 bg-red-100";
    case "High":
      return "text-orange-600 bg-orange-100";
    case "Medium":
      return "text-yellow-600 bg-yellow-100";
    case "Low":
      return "text-green-600 bg-green-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

// Empty state messages
export const emptyStateMessages = {
  noTasks: "No tasks available. Upload maintenance data to get started.",
  noMachines: "No machines registered. Import your equipment data first.",
  noAnalytics: "No analytics data available. Complete some tasks to see insights.",
  noHistory: "No completion history available yet."
};

// Helper function to check if system has data
export const hasData = () => mockMachines.length > 0;

export default {
  mockMachines,
  getTaskStatusColor,
  getMachineStatusColor,
  getPriorityColor,
  emptyStateMessages,
  hasData
};
