// Enhanced Task Completion Tracking System
// Designed for professional maintenance management with comprehensive data export

export interface TaskCompletionData {
  id: string;
  taskId: string;
  taskName: string;
  machineId: string;
  machineName: string;
  frequency: string;
  completionDate: Date;
  completedBy: string;
  userId: string;
  timeStarted: Date;
  timeCompleted: Date;
  actualTimeSpent: number; // in minutes
  estimatedTime: number; // in minutes
  notes: string;
  photos: string[]; // base64 or file paths
  checklistItems: {
    id: string;
    text: string;
    completed: boolean;
    timestamp?: Date;
  }[];
  priority: "Critical" | "High" | "Medium" | "Low";
  category: string;
  location: string;
  safetyCompliance: boolean;
  qualityCheck: boolean;
  issuesEncountered: string[];
  partsUsed: {
    partNumber: string;
    description: string;
    quantity: number;
    cost?: number;
  }[];
  nextDueDate: Date;
  status: "Completed" | "In Progress" | "Pending" | "Overdue";
}

export interface ExportFilters {
  dateRange: {
    start: Date;
    end: Date;
    type: "daily" | "weekly" | "monthly" | "yearly" | "custom";
  };
  machines?: string[];
  technicians?: string[];
  taskTypes?: string[];
  priorities?: string[];
  includePhotos?: boolean;
  format: "csv" | "excel" | "pdf";
}

export class TaskCompletionTracker {
  private static completedTasks: TaskCompletionData[] = [];

  // Save completed task data
  static saveTaskCompletion(data: Partial<TaskCompletionData> & { timeSpentMinutes?: number }): void {
    const now = new Date();
    const completion: TaskCompletionData = {
      id: data.id || this.generateId(),
      taskId: data.taskId!,
      taskName: data.taskName!,
      machineId: data.machineId!,
      machineName: data.machineName!,
      frequency: data.frequency!,
      completionDate: data.completionDate || now,
      completedBy: data.completedBy!,
      userId: data.userId || "system",
      timeStarted: data.timeStarted || new Date(now.getTime() - (data.timeSpentMinutes || data.actualTimeSpent || 30) * 60000),
      timeCompleted: data.timeCompleted || now,
      actualTimeSpent: data.actualTimeSpent || (data as any).timeSpentMinutes || 0,
      estimatedTime: data.estimatedTime || 30,
      notes: data.notes || "",
      photos: data.photos || [],
      checklistItems: data.checklistItems || [],
      priority: data.priority || "Medium",
      category: data.category || "maintenance",
      location: data.location || "",
      safetyCompliance: data.safetyCompliance || true,
      qualityCheck: data.qualityCheck || true,
      issuesEncountered: data.issuesEncountered || [],
      partsUsed: data.partsUsed || [],
      nextDueDate: data.nextDueDate || new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Default to next week
      status: "Completed",
    };

    this.completedTasks.push(completion);
    this.saveToStorage();
  }

  // Get completed tasks with filtering
  static getCompletedTasks(
    filters?: Partial<ExportFilters>,
  ): TaskCompletionData[] {
    let tasks = [...this.completedTasks];

    if (filters?.dateRange) {
      const { start, end } = filters.dateRange;
      tasks = tasks.filter((task) => {
        const taskDate = task.completionDate;
        return taskDate >= start && taskDate <= end;
      });
    }

    if (filters?.machines?.length) {
      tasks = tasks.filter((task) =>
        filters.machines!.includes(task.machineId),
      );
    }

    if (filters?.technicians?.length) {
      tasks = tasks.filter((task) =>
        filters.technicians!.includes(task.userId),
      );
    }

    if (filters?.taskTypes?.length) {
      tasks = tasks.filter((task) =>
        filters.taskTypes!.includes(task.category),
      );
    }

    if (filters?.priorities?.length) {
      tasks = tasks.filter((task) =>
        filters.priorities!.includes(task.priority),
      );
    }

    return tasks.sort(
      (a, b) => b.completionDate.getTime() - a.completionDate.getTime(),
    );
  }

  // Generate professional CSV export
  static exportToCSV(filters?: Partial<ExportFilters>): string {
    const tasks = this.getCompletedTasks(filters);

    const headers = [
      "Task Name",
      "Machine Name",
      "Machine ID",
      "Frequency",
      "Completion Date",
      "Completed By",
      "Start Time",
      "End Time",
      "Time Taken (min)",
      "Estimated Time (min)",
      "Efficiency %",
      "Priority",
      "Category",
      "Location",
      "Safety Compliance",
      "Quality Check",
      "Notes",
      "Issues Encountered",
      "Parts Used",
      "Photos Count",
      "Next Due Date",
      "Checklist Completion %",
    ];

    const rows = tasks.map((task) => {
      const efficiency =
        task.estimatedTime > 0
          ? Math.round((task.estimatedTime / task.actualTimeSpent) * 100)
          : 100;

      const checklistCompletion =
        task.checklistItems.length > 0
          ? Math.round(
              (task.checklistItems.filter((item) => item.completed).length /
                task.checklistItems.length) *
                100,
            )
          : 100;

      return [
        task.taskName,
        task.machineName,
        task.machineId,
        task.frequency,
        task.completionDate.toLocaleDateString(),
        task.completedBy,
        task.timeStarted.toLocaleTimeString(),
        task.timeCompleted.toLocaleTimeString(),
        task.actualTimeSpent.toString(),
        task.estimatedTime.toString(),
        `${efficiency}%`,
        task.priority,
        task.category,
        task.location,
        task.safetyCompliance ? "Yes" : "No",
        task.qualityCheck ? "Yes" : "No",
        `"${task.notes.replace(/"/g, '""')}"`, // Escape quotes for CSV
        `"${task.issuesEncountered.join("; ").replace(/"/g, '""')}"`,
        `"${task.partsUsed
          .map(
            (part) =>
              `${part.partNumber}: ${part.description} (${part.quantity})`,
          )
          .join("; ")
          .replace(/"/g, '""')}"`,
        task.photos.length.toString(),
        task.nextDueDate.toLocaleDateString(),
        `${checklistCompletion}%`,
      ];
    });

    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  }

  // Generate detailed task report with structured data
  static exportDetailedReport(filters?: Partial<ExportFilters>): any {
    const tasks = this.getCompletedTasks(filters);

    return {
      reportMetadata: {
        generatedDate: new Date().toISOString(),
        totalTasks: tasks.length,
        dateRange: filters?.dateRange || null,
        filters: filters || null,
      },
      summary: {
        totalTasksCompleted: tasks.length,
        totalTimeSpent: tasks.reduce(
          (sum, task) => sum + task.actualTimeSpent,
          0,
        ),
        averageTimePerTask:
          tasks.length > 0
            ? Math.round(
                tasks.reduce((sum, task) => sum + task.actualTimeSpent, 0) /
                  tasks.length,
              )
            : 0,
        efficiencyRate: this.calculateOverallEfficiency(tasks),
        safetyComplianceRate: this.calculateSafetyCompliance(tasks),
        qualityRate: this.calculateQualityRate(tasks),
      },
      tasksByMachine: this.groupTasksByMachine(tasks),
      tasksByTechnician: this.groupTasksByTechnician(tasks),
      tasksByPriority: this.groupTasksByPriority(tasks),
      performanceMetrics: this.calculatePerformanceMetrics(tasks),
      tasks: tasks,
    };
  }

  // Date range helper functions
  static getDateRangeForPeriod(
    type: "daily" | "weekly" | "monthly" | "yearly",
    date: Date = new Date(),
  ): { start: Date; end: Date } {
    const start = new Date(date);
    const end = new Date(date);

    switch (type) {
      case "daily":
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;

      case "weekly":
        const dayOfWeek = start.getDay();
        start.setDate(start.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;

      case "monthly":
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(end.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;

      case "yearly":
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(11, 31);
        end.setHours(23, 59, 59, 999);
        break;
    }

    return { start, end };
  }

  // Analytics helper functions
  private static calculateOverallEfficiency(
    tasks: TaskCompletionData[],
  ): number {
    if (tasks.length === 0) return 100;

    const totalEfficiency = tasks.reduce((sum, task) => {
      return (
        sum +
        (task.estimatedTime > 0
          ? (task.estimatedTime / task.actualTimeSpent) * 100
          : 100)
      );
    }, 0);

    return Math.round(totalEfficiency / tasks.length);
  }

  private static calculateSafetyCompliance(
    tasks: TaskCompletionData[],
  ): number {
    if (tasks.length === 0) return 100;
    return Math.round(
      (tasks.filter((task) => task.safetyCompliance).length / tasks.length) *
        100,
    );
  }

  private static calculateQualityRate(tasks: TaskCompletionData[]): number {
    if (tasks.length === 0) return 100;
    return Math.round(
      (tasks.filter((task) => task.qualityCheck).length / tasks.length) * 100,
    );
  }

  private static groupTasksByMachine(
    tasks: TaskCompletionData[],
  ): Record<string, any> {
    const grouped = tasks.reduce(
      (acc, task) => {
        if (!acc[task.machineId]) {
          acc[task.machineId] = {
            machineName: task.machineName,
            location: task.location,
            tasks: [],
            totalTime: 0,
            taskCount: 0,
          };
        }
        acc[task.machineId].tasks.push(task);
        acc[task.machineId].totalTime += task.actualTimeSpent;
        acc[task.machineId].taskCount++;
        return acc;
      },
      {} as Record<string, any>,
    );

    return grouped;
  }

  private static groupTasksByTechnician(
    tasks: TaskCompletionData[],
  ): Record<string, any> {
    const grouped = tasks.reduce(
      (acc, task) => {
        if (!acc[task.userId]) {
          acc[task.userId] = {
            technicianName: task.completedBy,
            tasks: [],
            totalTime: 0,
            taskCount: 0,
          };
        }
        acc[task.userId].tasks.push(task);
        acc[task.userId].totalTime += task.actualTimeSpent;
        acc[task.userId].taskCount++;
        return acc;
      },
      {} as Record<string, any>,
    );

    return grouped;
  }

  private static groupTasksByPriority(
    tasks: TaskCompletionData[],
  ): Record<string, number> {
    return tasks.reduce(
      (acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  private static calculatePerformanceMetrics(tasks: TaskCompletionData[]): any {
    const totalTasks = tasks.length;
    if (totalTasks === 0) return {};

    const onTimeCompletion = tasks.filter(
      (task) => task.completionDate <= task.nextDueDate,
    ).length;

    const averageEfficiency = this.calculateOverallEfficiency(tasks);
    const safetyCompliance = this.calculateSafetyCompliance(tasks);

    return {
      onTimeCompletionRate: Math.round((onTimeCompletion / totalTasks) * 100),
      averageEfficiency,
      safetyComplianceRate: safetyCompliance,
      qualityRate: this.calculateQualityRate(tasks),
      averageTaskDuration: Math.round(
        tasks.reduce((sum, task) => sum + task.actualTimeSpent, 0) / totalTasks,
      ),
      tasksByCategory: tasks.reduce(
        (acc, task) => {
          acc[task.category] = (acc[task.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }

  // Storage management
  private static saveToStorage(): void {
    try {
      localStorage.setItem(
        "wrench_completed_tasks",
        JSON.stringify(this.completedTasks),
      );
    } catch (error) {
      console.error("Failed to save completed tasks to storage:", error);
    }
  }

  private static loadFromStorage(): void {
    try {
      const stored = localStorage.getItem("wrench_completed_tasks");
      if (stored) {
        const parsed = JSON.parse(stored);
        this.completedTasks = parsed.map((task: any) => ({
          ...task,
          completionDate: new Date(task.completionDate),
          timeStarted: new Date(task.timeStarted),
          timeCompleted: new Date(task.timeCompleted),
          nextDueDate: new Date(task.nextDueDate),
          checklistItems:
            task.checklistItems?.map((item: any) => ({
              ...item,
              timestamp: item.timestamp ? new Date(item.timestamp) : undefined,
            })) || [],
        }));
      }
    } catch (error) {
      console.error("Failed to load completed tasks from storage:", error);
      this.completedTasks = [];
    }
  }

  private static generateId(): string {
    return "task_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  // Get analytics data for reporting
  static getAnalytics(): any {
    const tasks = this.getCompletedTasks();

    if (tasks.length === 0) {
      return {
        totalCompletions: 0,
        averageTimePerTask: 0,
        efficiencyRate: 100,
        safetyComplianceRate: 100,
        qualityRate: 100,
        onTimeCompletionRate: 100,
        tasksByMachine: {},
        tasksByTechnician: {},
        tasksByPriority: {},
        tasksByCategory: {},
      };
    }

    return {
      totalCompletions: tasks.length,
      averageTimePerTask: Math.round(
        tasks.reduce((sum, task) => sum + task.actualTimeSpent, 0) / tasks.length,
      ),
      efficiencyRate: this.calculateOverallEfficiency(tasks),
      safetyComplianceRate: this.calculateSafetyCompliance(tasks),
      qualityRate: this.calculateQualityRate(tasks),
      onTimeCompletionRate: Math.round(
        (tasks.filter((task) => task.completionDate <= task.nextDueDate).length / tasks.length) * 100,
      ),
      tasksByMachine: this.groupTasksByMachine(tasks),
      tasksByTechnician: this.groupTasksByTechnician(tasks),
      tasksByPriority: this.groupTasksByPriority(tasks),
      tasksByCategory: tasks.reduce(
        (acc, task) => {
          acc[task.category] = (acc[task.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }

  // Initialize on module load
  static {
    this.loadFromStorage();
  }
}

// Export utility functions
export const ExportUtils = {
  downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  downloadJSON(data: any, filename: string): void {
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], {
      type: "application/json;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  formatDateForFilename(date: Date): string {
    return date.toISOString().split("T")[0];
  },

  generateReportFilename(
    type: string,
    dateRange?: { start: Date; end: Date },
  ): string {
    const today = this.formatDateForFilename(new Date());

    if (dateRange) {
      const start = this.formatDateForFilename(dateRange.start);
      const end = this.formatDateForFilename(dateRange.end);
      return `wrench_${type}_report_${start}_to_${end}.csv`;
    }

    return `wrench_${type}_report_${today}.csv`;
  },
};
